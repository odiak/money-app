# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150103075154) do

  create_table "categories", force: :cascade do |t|
    t.string  "name",    default: "", null: false
    t.integer "user_id",              null: false
  end

  add_index "categories", ["user_id"], name: "index_categories_on_user_id"

  create_table "expenses", force: :cascade do |t|
    t.date     "date",                     null: false
    t.integer  "amount",      default: 0,  null: false
    t.string   "subject",     default: "", null: false
    t.integer  "user_id",                  null: false
    t.integer  "category_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",            default: "", null: false
    t.string   "password_digest", default: "", null: false
    t.string   "password_salt",   default: "", null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  add_index "users", ["name"], name: "index_users_on_name", unique: true

end
