class CreateRunners < ActiveRecord::Migration[7.1]
  def change
    create_table :runners do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :age, default: 20
      t.string :personality, default: "普通"
      t.integer :vo2_max, default: 40
      t.decimal :lt_value, precision: 4, scale: 2, default: 6.00
      t.integer :durability, default: 100
      t.integer :mental, default: 50
      t.integer :funds, default: 10000
      t.integer :days_to_race, default: 30

      t.timestamps
    end
  end
end