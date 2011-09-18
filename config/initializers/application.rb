# coding: utf-8

class GetBeer
  GOOD_WORDS = ["cool", "top", "good", "génial", "great", "amazing", "cheap", "not expensive",
    "not too expensive", "pas trop cher", "pas trop chère", "pas chère", "pas cher", "free", "perfect", "#getbeer"]
  BAD_WORDS = ["expensive", "cher", "chère", "tasteless", "dégeulasse", "nul"]
  SEARCH_TERMS = ["pinte", "pint", "beer", "bière", "Heineken", "Grimbergen", "#getbeer"]
end

String.class_eval do

  def tip_score
    counter = 0
    # add one point per good word
    GetBeer::GOOD_WORDS.each do |w|
      counter += 1 if self.index(w)
    end
    GetBeer::BAD_WORDS.each do |w|
      counter -= 1 if self.index(w)
    end
    # add 5 pts if contains digit
    counter += 5 if self =~ /\d/
    return counter
  end

end