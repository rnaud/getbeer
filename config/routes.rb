Getbeer::Application.routes.draw do

  resource :session do
     collection do
       get :callback
       get :logout
     end
   end

   resources :beers do
     collection do
       get :search
       get 'user'
       get 'checkins'
       get 'friends'
       get 'venues_search'
       get 'venue_details'
     end
   end

   root :to => 'beers#index', :constraints => lambda {|r| !r.session[:access_token].blank?}
   root :to => 'sessions#new'

end
