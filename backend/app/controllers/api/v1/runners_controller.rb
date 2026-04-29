class Api::V1::RunnersController < ApplicationController
  # 修正：ログインユーザーのランナーを返すように変更
  def index
  user = User.find_by(email: params[:email])
  if user
    # 修正：そのユーザーの全ランナーを配列で返す
    runners = user.runners.order(created_at: :desc)
    render json: runners
  else
    render json: { error: "ユーザーが見つかりません" }, status: :not_found
  end
  end

  def create
    # 1. 送られてきたメールアドレスからユーザーを探す
    user = User.find_by(email: params[:email])
    
    if user.nil?
      render json: { error: "ユーザーが見つかりません" }, status: :not_found
      return
    end

    # 2. ユーザーに紐づくランナーを作成する
    runner = user.runners.new(runner_params)

    # 3. 初期ステータスの補完
    runner.age ||= 20
    runner.funds ||= 50000        # 初期資金
    runner.days_to_race ||= 100   # 大会までの日数
    
    # 以前の durability カラムを使っている場合は stamina を代入
    runner.durability = params[:runner][:stamina] if runner.has_attribute?(:durability)

    # 4. 保存
    if runner.save
      render json: runner, status: :created
    else
      render json: { errors: runner.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    runner = Runner.find(params[:id])
  
    if runner.destroy
      render json: { message: "ランナーを削除しました" }, status: :ok
    else
      render json: { error: "削除に失敗しました" }, status: :unprocessable_entity
    end
  end

  private

  # セキュリティ対策：許可したデータだけを受け取る
  def runner_params
    params.require(:runner).permit(
      :name, :prefecture, :city, :team_type, :background, 
      :running_form, :foot_strike, :height, :weight, 
      :speed, :vo2_max, :lt_value, :mental, :growth, :stamina
    )
  end
end