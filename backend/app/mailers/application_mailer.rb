class ApplicationMailer < ActionMailer::Base
  # ここは Rails がメールを送るための基本クラスです
  default from: ENV['GMAIL_USER']
  layout "mailer"
end