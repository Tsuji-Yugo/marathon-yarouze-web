class User < ApplicationRecord
  has_one :runner, dependent: :destroy
  has_many :runners, dependent: :destroy
end