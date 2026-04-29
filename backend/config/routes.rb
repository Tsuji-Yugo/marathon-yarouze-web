Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :runners, only: [:index, :create, :destroy]
      post 'auth/register', to: 'auth#register'
      post 'auth/verify', to: 'auth#verify'
      post 'auth/login', to: 'auth#login'
    end
  end
end