require 'csv'

puts "古いデータを削除中..."
Runner.destroy_all
User.destroy_all
Marathon.destroy_all if defined?(Marathon)

puts "テストユーザーとランナーを作成中..."
user = User.create!(
  email: "test@example.com",
  password: "password",
  nickname: "テストプレイヤー"
)

user.runners.create!(
  name: "韋駄天 太郎",
  prefecture: "石川県",
  city: "野々市市",
  team_type: "市民ランナー",
  background: "DIET",
  running_form: "ピッチ走法",
  foot_strike: "ミッドフット",
  height: 170.5,
  weight: 60.0,
  speed: 55,
  stamina: 60,
  vo2_max: 50,
  lt_value: 45,
  mental: 70,
  growth: 80,
  age: 21,
  funds: 150000,
  days_to_race: 14
)

puts "マラソン大会のデータを作成中..."

csv_path = Rails.root.join('db', 'marathons.csv')

if File.exist?(csv_path)
  CSV.foreach(csv_path, headers: true) do |row|
    Marathon.create!(
      name: row['name'],
      location: row['location'],
      region: row['region'], # ←★追加：CSVから地方データを読み込む！
      description: row['description'],
      elevation_gain: row['elevation_gain'].to_i,
      difficulty: row['difficulty'].to_i,
      characteristic: row['characteristic']
    )
  end
  puts "CSVから大会データを読み込みました！"
else
  # CSVがない場合のテスト用データ
  real_marathons = [
    { name: "金沢マラソン", location: "石川県金沢市", region: "中部", description: "城下町を巡る公認コース。全体的に平坦で走りやすく、記録が狙いやすい。", elevation_gain: 40, difficulty: 2, characteristic: "FLAT" },
    { name: "富山マラソン", location: "富山県高岡市〜富山市", region: "中部", description: "新湊大橋の急勾配が最大の難所。立山連峰を望む絶景コース。", elevation_gain: 85, difficulty: 4, characteristic: "HILLY" },
    { name: "北海道マラソン", location: "北海道札幌市", region: "北海道", description: "真夏の過酷なレース。広大な大地を走るが、暑さへの耐性が問われる。", elevation_gain: 30, difficulty: 5, characteristic: "HOT" }
  ]
  Marathon.create!(real_marathons)

  97.times do |i|
    Marathon.create!(
      name: "第#{i+4}回 架空シティマラソン",
      location: "テスト県テスト市",
      region: ["北海道", "東北", "関東", "中部", "近畿", "中国・四国", "九州・沖縄"].sample, # ←★追加：ランダムな地方を割り当てる
      description: "全国からランナーが集まるテスト用の大会です。様々な難所が待ち構えます。",
      elevation_gain: rand(10..150),
      difficulty: rand(1..5),
      characteristic: ["FLAT", "HILLY", "HOT"].sample
    )
  end
  puts "CSVが見つからなかったため、テスト用の大会を合計100個生成しました！"
end

puts "すべてのシードデータの作成が完了しました！"