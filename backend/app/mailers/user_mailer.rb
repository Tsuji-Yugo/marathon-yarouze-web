class UserMailer < ApplicationMailer
  def otp_email
    @user = params[:user]
    mail(to: @user.email, subject: '【マラソンやろうぜ！】認証コードのご案内')
  end
end