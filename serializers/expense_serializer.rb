class ExpenseSerializer < ActiveModel::Serializer
  attributes :id, :subject, :date, :amount, :created_at

  has_one :category
end
