class Beer

  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming


  attr_accessor :text, :price, :type, :qty, :score, :venue_id, :venue_icon, :venue_lat, :venue_lng, :venue_name

  def initialize(attributes = {})
    attributes.each do |name, value|
      send("#{name}=", value)
    end
  end

  def persisted?
    false
  end

  def self.tips_to_beers(json)
    beers = Array.new
    json["tips"].each do |t|
      begin icon = t["venue"]["categories"].first["icon"] rescue nil end
      puts t["venue"]
      b = Beer.new(
        :text => t["text"],
        :venue_id => t["venue"]["id"],
        :venue_name => t["venue"]["name"],
        :venue_icon => icon,
        :score => t["text"].tip_score,
        :venue_lat => t["venue"]["location"]["lat"],
        :venue_lng => t["venue"]["location"]["lng"])
      beers.push(b)
    end
    return beers
  end

end