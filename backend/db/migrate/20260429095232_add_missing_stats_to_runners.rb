class AddMissingStatsToRunners < ActiveRecord::Migration[7.1]
  def change
    # カラムが存在しない場合のみ追加するようにガードをかけます
    add_column :runners, :speed, :integer unless column_exists?(:runners, :speed)
    add_column :runners, :vo2_max, :integer unless column_exists?(:runners, :vo2_max)
    add_column :runners, :lt_value, :integer unless column_exists?(:runners, :lt_value)
    add_column :runners, :mental, :integer unless column_exists?(:runners, :mental)
    add_column :runners, :age, :integer unless column_exists?(:runners, :age)
    add_column :runners, :funds, :integer unless column_exists?(:runners, :funds)
    add_column :runners, :days_to_race, :integer unless column_exists?(:runners, :days_to_race)
  end
end