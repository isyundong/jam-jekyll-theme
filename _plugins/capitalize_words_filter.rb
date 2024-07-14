module Jekyll
  module CapitalizeWords
    def capitalize_words(input)
      input.split(' ').map(&:capitalize).join(' ')
    end
  end
end

Liquid::Template.register_filter(Jekyll::CapitalizeWords)
