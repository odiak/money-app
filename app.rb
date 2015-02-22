require 'bundler/setup'
Bundler.require

require 'sinatra/namespace'
require 'sinatra/reloader'
require 'securerandom'
require 'digest/sha1'
require './settings'

ActiveModel::Serializer._root = false
Dir['./models/*.rb', './serializers/*.rb'].each(&method(:require))

ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: 'db/data.sqlite3'
)
Time.zone_default = Time.find_zone!('Tokyo')
Oj.default_options = { mode: :compat }

class MoneyApp < Sinatra::Base
  register Sinatra::Namespace

  configure do
    set :app_file, __FILE__

    set :show_exceptions, false

    disable :session
    use Rack::Session::Cookie,
      key: 'rack.session',
      expire_after: SESSION_EXPIRE_AFTER,
      secret: SESSION_SECRET

    use Rack::Parser
  end

  configure :development do
    register Sinatra::Reloader
    also_reload './models/*.rb', './serializers/*.rb'
  end

  STATUS_CODES = {
    ok:           200,
    created:      201,
    no_content:   204,
    unauthorized: 401,
    bad_request:  400,
    not_found:    404,
  }.freeze

  helpers do
    def current_user
      User.find_by_id(session[:user_id]) if session[:user_id]
    end

    def sign_in(user)
      session[:user_id] = user.id
    end

    def sign_out
      session.delete(:user_id)
    end

    def ensure_signed_in!
      unless current_user
        halt json_with_status(:unauthorized, error: 'Unauthorized')
      end
    end

    def status(code)
      code = STATUS_CODES[code] if STATUS_CODES.key?(code)
      super(code)
    end

    def json_with_status(code, hash)
      status(code)
      json(hash)
    end

    def json(object, **options)
      serializer ||= options.delete(:serializer)
      serializer ||= ActiveModel::Serializer.serializer_for(object)
      if options.key?(:each_serializer)
        options[:serializer] = options[:each_serializer]
      end

      target = serializer ? serializer.new(object, options).as_json : object
      content_type(:json)
      Oj.dump(target)
    end
  end

  namespace '/api' do
    namespace '/user' do
      get '/?' do
        if (user = current_user)
          json(user)
        else
          json_with_status(:not_found, error: 'Not found')
        end
      end

      post '/?' do
        if params['name'].present? && User.exists?(name: params['name'])
          halt json_with_status(:bad_request,
            error: 'This username has already been taken')
        end

        user = User.new(params.slice('name', 'password'))
        if user.save
          sign_in(user)
          json(user)
        else
          json_with_status(:bad_request, error: 'Invalid')
        end
      end

      post '/auth' do
        user = User.find_by(name: params['name'])
        if user && user.valid_password?(params['password'])
          sign_in(user)
          json(user)
        else
          sign_out
          json_with_status(:bad_request, error: 'Invalid username or password')
        end
      end
    end

    namespace '/expenses' do
      helpers do
        def expense_params
          params.slice('subject', 'date', 'amount', 'created_at', 'category_id')
        end
      end

      get '/:year-:month' do
        ensure_signed_in!

        today = Time.zone.today
        year = params.fetch('year', today.year).to_i
        month = params.fetch('month', today.month).to_i

        beginning = Date.new(year, month, 1)
        date_range = beginning..beginning.end_of_month

        expenses = current_user.expenses
          .where(date: date_range)
          .reorder(date: :desc, created_at: :desc)

        json(expenses, root: :expenses)
      end

      get '/:id' do
        ensure_signed_in!

        expense = current_user.expenses.find(params[:id])
        json(expense)
      end

      post '/?' do
        expense = current_user.expenses.new(expense_params)
        if expense.save
          json_with_status(:created, expense)
        else
          json_with_status(:bad_request, error: expense.errors.to_a.first)
        end
      end

      put '/:id' do
        expense = current_user.expenses.find(params[:id])
        if expense.update(expense_params)
          json(expense)
        else
          json_with_status(:bad_request, error: expense.errors.to_a.first)
        end
      end

      delete '/:id' do
        ensure_signed_in!

        expense = current_user.expenses.find(params[:id])
        expense.destroy
        status(:no_content)
      end
    end

    namespace '/categories' do
      def category_params
        params.slice('name')
      end

      get '/?' do
        ensure_signed_in!

        categories = current_user.categories.reorder(:name)
        json(categories, root: :categories)
      end

      post '/?' do
        ensure_signed_in!

        category = current_user.categories.new(category_params)
        if category.save
          json(category)
        else
          json_with_status(:bad_request, error: category.errors.to_a.first)
        end
      end
    end

    error ActiveRecord::RecordNotFound do
      json_with_status(:not_found, error: 'Not found')
    end

    get '/*' do
      json_with_status(:not_found, error: 'Not found')
    end
  end

  if ENV['RACK_ENV'] == 'development'
    get '/*' do
      send_file File.join('public', 'index.html')
    end
  end
end
