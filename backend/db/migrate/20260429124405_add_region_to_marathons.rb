class AddRegionToMarathons < ActiveRecord::Migration[7.1]
  def change
    # もし marathons テーブル自体が存在しない場合は、一括で作成する（究極の安全網）
    unless table_exists?(:marathons)
      create_table :marathons do |t|
        t.string :name
        t.string :location
        t.string :region
        t.text :description
        t.integer :elevation_gain
        t.integer :difficulty
        t.string :characteristic

        t.timestamps
      end
    else
      # テーブルが既にある場合は、region カラムだけを追加する
      add_column :marathons, :region, :string unless column_exists?(:marathons, :region)
    end
  end
end