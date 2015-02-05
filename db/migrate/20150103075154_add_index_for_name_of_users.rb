class AddIndexForNameOfUsers < ActiveRecord::Migration
  def change
    add_index :users, :name, unique: true
  end
end
