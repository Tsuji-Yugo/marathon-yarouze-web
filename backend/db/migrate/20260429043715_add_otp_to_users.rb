class AddOtpToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :nickname, :string
    add_column :users, :otp_code, :string
    add_column :users, :otp_expires_at, :datetime
    add_column :users, :verified_at, :datetime
  end
end
