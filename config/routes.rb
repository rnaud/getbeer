Getbeer::Application.routes.draw do

  resource :session do
     collection do
       get 'callback'
     end
   end

   resources :beers do
     collection do
       get 'user'
       get 'checkins'
       get 'friends'
       get 'venues_search'
       get 'venue_details'
     end
   end

   root :to => "sessions#new"

end
