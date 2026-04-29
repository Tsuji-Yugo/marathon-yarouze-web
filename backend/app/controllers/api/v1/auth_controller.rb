# backend/app/controllers/api/v1/auth_controller.rb

class Api::V1::AuthController < ApplicationController
  # 1. アカウント仮登録 ＆ OTP送信
  def register
    user = User.find_or_initialize_by(email: params[:email])
    user.password = params[:password] if user.new_record?
    user.nickname = params[:nickname]
    
    # 6桁のコードを生成
    user.otp_code = rand(100000..999999).to_s
    user.otp_expires_at = 10.minutes.from_now
    
    if user.save
      begin
        ::UserMailer.with(user: user).otp_email.deliver_now
        render json: { message: "認証メールを送信しました" }, status: :ok
      rescue => e
        # メール送信エラーが起きた場合に原因を特定できるようにする
        render json: { errors: ["メール送信に失敗しました: #{e.message}"] }, status: :internal_server_error
      end
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 2. OTP検証 ＆ 登録完了
  def verify
    user = User.find_by(email: params[:email])
    
    if user && user.otp_code == params[:otp] && user.otp_expires_at > Time.current
      user.update(verified_at: Time.current, otp_code: nil)
      
      unless user.runner
        user.create_runner!(
          name: user.nickname, age: 18, personality: "熱血", 
          vo2_max: 45, lt_value: 4.0, durability: 30, 
          mental: 50, funds: 50000, days_to_race: 90
        )
      end
      
      render json: { message: "認証に成功しました", user: user }, status: :ok
    else
      render json: { error: "認証コードが間違っているか、有効期限が切れています" }, status: :unauthorized
    end
  end
end