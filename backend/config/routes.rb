Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :runners, only: [:index]
      post 'auth/register', to: 'auth#register'
      post 'auth/verify', to: 'auth#verify'
    end
  end
end