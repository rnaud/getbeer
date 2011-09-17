class Settings < Settingslogic
  source "#{Rails.root}/config/foursquare.yml"
  namespace Rails.env
end