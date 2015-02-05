class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, null: false, default: ''
      t.string :password_digest, null: false, default: ''
      t.string :password_salt, null: false, default: ''
      t.timestamps null: false
    end
  end
end
