class Api::V1::MarathonsController < ApplicationController
  def index
    # データベースにあるすべての大会データを取得
    marathons = Marathon.all
    # JSON形式でNext.jsに送信
    render json: marathons
  end
end