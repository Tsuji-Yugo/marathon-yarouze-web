class Api::V1::RunnersController < ApplicationController
  def index
    # 本来はログイン中のユーザーの選手(current_user.runner)を探しますが
    # まずは動作確認のため最初の1件を返します
    runner = Runner.first
    render json: runner
  end
end