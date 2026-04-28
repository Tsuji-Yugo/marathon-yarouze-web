class User < ApplicationRecord
  has_one :runner, dependent: :destroy
end