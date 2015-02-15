class Expense < ActiveRecord::Base
  belongs_to :user
  belongs_to :category

  validates :date, presence: true
  validates :amount, presence: true, numericality: {greater_than: 0}
end
