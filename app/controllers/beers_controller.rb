# encoding: utf-8
class BeersController < ApplicationController

  before_filter :require_user, :get_coords

  def get_coords
    if params[:address]
      @coords = Geocoder.coordinates(params[:address])
    end
    if params[:lat] && params[:lng]
      @coords = [params[:lat], params[:lng]]
    end
  end

  def index
    # list all the examples
  end

  def user
  end

  def checkins
  end

  def friends
  end

  def new
    if @coords
      @venues = foursquare.venues.search(:ll => "#{@coords.first}, #{@coords.last}")
    end

    respond_to do |format|
      format.html # index.html.erb
      format.js
    end
  end

  def create
  end

  def search
    if @coords
      search = GetBeer::SEARCH_TERMS.join(" OR ")
      json = foursquare.get("/tips/search", {:ll => "#{@coords.first}, #{@coords.last}", :query => search })
      @beers = Beer.tips_to_beers(json)
    end

    respond_to do |format|
      format.html # index.html.erb
      format.js
      format.json  { render :json => @beers }
    end

  end

  def venues
    if @coords
      @venues = foursquare.venues.search(:ll => "#{@coords.first}, #{@coords.last}")
    end

    respond_to do |format|
      format.html # index.html.erb
      format.js
      format.json  { render :json => @venues }
    end
  end

  def venue_details
    # default venue is the "Tour Eiffel"
    @venue_id = params[:venue_id] || "185194"
    @venue = foursquare.venues.find(@venue_id)
    @tips = foursquare.get("venues/#{@venue_id}/tips")
  end

end