module ApplicationHelper
  def sitemap(text)
    "<h2>#{link_to('Examples', beers_path)} > #{text}</h2>".html_safe
  end

  def see_more(link)
    "<h4>#{link_to("See More at Foursquare Documentation", link)}</h4>".html_safe
  end
end
