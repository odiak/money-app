class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.date :date, null: false
      t.integer :amount, null: false, default: 0
      t.string :subject, null: false, default: ''
      t.references :user, null: false
      t.references :category

      t.timestamps null: false
    end
  end
end
