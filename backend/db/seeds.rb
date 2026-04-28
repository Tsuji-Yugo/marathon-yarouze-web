# 既存のデータを削除（やり直しやすくするため）
Runner.destroy_all
User.destroy_all

# テストユーザーの作成
user = User.create!(
  email: "test@example.com",
  password: "password" # 本来は暗号化が必要ですが、今はシンプルに
)

# そのユーザーに紐づく選手の作成
user.create_runner!(
  name: "最凶のランナー",
  age: 21,
  personality: "ガラスの脚",
  vo2_max: 65,
  lt_value: 4.15,
  durability: 30,
  mental: 80,
  funds: 150000,
  days_to_race: 14
)

puts "テストデータの作成が完了しました！"