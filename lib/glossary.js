var _ = require('lodash');
var cheerio = require('cheerio');

var convert = require('./utils/convert');

function parseGlossary(src) {
    return convert(src)
    .then(function(html) {
        var $ = cheerio.load(html);

        var entries = [];

        $("div.section").each(function() {
            var $section = $(this);
        	var $title = $section.find("h1");
            var $p = $section.find("p");

        	var entry = {};

        	entry.name = $title.text();
            entry.description = $p.text();

        	entries.push(entry);
        });

        return entries;
    });
}

module.exports = parseGlossary;
