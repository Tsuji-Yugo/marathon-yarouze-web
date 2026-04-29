class AddProfileToRunners < ActiveRecord::Migration[7.1]
  def change
    add_column :runners, :prefecture, :string
    add_column :runners, :city, :string
    add_column :runners, :team_type, :string
    add_column :runners, :background, :string
    add_column :runners, :running_form, :string
    add_column :runners, :foot_strike, :string
    add_column :runners, :height, :float
    add_column :runners, :weight, :float
    add_column :runners, :growth, :integer
    add_column :runners, :stamina, :integer
  end
end
