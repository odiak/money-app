require 'bundler'
Bundler.require

require 'sinatra/json'
require 'SecureRandom'
require 'digest/sha1'
require './settings'

Dir['./models/*.rb'].each(&method(:require))

configure do
  set :app_file, __FILE__
  set :database, adapter: 'sqlite3', database: 'db/data.sqlite3'

  disable :sessions
  use Rack::Session::Cookie,
    key: 'rack.session',
    expire_after: SESSION_EXPIRE_AFTER,
    secret: SESSION_SECRET

  use Rack::Parser
end


helpers do
  def current_user
    User.find_by_id(sessions[:user_id]) if sessions[:user_id]
  end

  def sign_in(user)
    sessions[:user_id] = user.id
  end

  def sign_out
    delete sessions[:user_id]
  end
end

