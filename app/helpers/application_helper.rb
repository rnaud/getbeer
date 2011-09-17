module ApplicationHelper

  def see_more(link)
    "<h4>#{link_to("See More at Foursquare Documentation", link)}</h4>".html_safe
  end

  def contains_digit(s)
    s =~ /\d/
  end

end
