# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_04_29_124405) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "marathons", force: :cascade do |t|
    t.string "name"
    t.string "location"
    t.string "region"
    t.text "description"
    t.integer "elevation_gain"
    t.integer "difficulty"
    t.string "characteristic"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "runners", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.integer "age", default: 20
    t.string "personality", default: "普通"
    t.integer "vo2_max", default: 40
    t.decimal "lt_value", precision: 4, scale: 2, default: "6.0"
    t.integer "durability", default: 100
    t.integer "mental", default: 50
    t.integer "funds", default: 10000
    t.integer "days_to_race", default: 30
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "prefecture"
    t.string "city"
    t.string "team_type"
    t.string "background"
    t.string "running_form"
    t.string "foot_strike"
    t.float "height"
    t.float "weight"
    t.integer "growth"
    t.integer "stamina"
    t.integer "speed"
    t.index ["user_id"], name: "index_runners_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "nickname"
    t.string "otp_code"
    t.datetime "otp_expires_at"
    t.datetime "verified_at"
  end

  add_foreign_key "runners", "users"
end
