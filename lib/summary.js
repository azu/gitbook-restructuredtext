var _ = require('lodash');
var cheerio = require('cheerio');

var convert = require('./utils/convert');


// parse a ul list and return list of chapters recursvely
function parseList($ul, $) {
	var articles = [];

	$ul.children("li").each(function() {
		var article = {};

		var $li = $(this);
		var $inner = $li.children("dl").children("dt");
		if ($inner.length == 0) $inner = $li.children("p");
		if ($inner.length == 0) $inner = $li;

		article.title = $inner.text();

		// Parse link
		var $a = $inner.children("a");
		if ($a.length > 0) {
			article.title = $a.first().text();
			article.path = $a.attr("href").replace(/\\/g, '/').replace(/^\/+/, '')
		}

		// Sub articles
		var $sub = $li.children("dl").children("dd").children("ul");
		article.articles = parseList($sub, $);

		articles.push(article);
	});

	return articles;
}

function parseSummary(src) {
    return parseEntries(src)
    .then(function(chapters) {
    	return {
	    	chapters: chapters
	    };
    });
}

function parseEntries (src) {
	return convert(src)
	.then(function(html) {
		var $ = cheerio.load(html);

	    var chapters = parseList($("ul").first(), $);
	    return chapters;
	});
}


// Exports
module.exports = parseSummary;
module.exports.entries = parseEntries;
