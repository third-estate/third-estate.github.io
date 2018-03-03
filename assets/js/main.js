/*
	Road Trip by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function ($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	$(function () {

		var $window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

		var $height = $('#header').height();

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function () {
			window.setTimeout(function () {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function () {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Banner

		if ($banner.length > 0) {

			// IE: Height fix.
			if (skel.vars.browser == 'ie'
				&& skel.vars.IEVersion > 9) {

				skel.on('-small !small', function () {
					$banner.css('height', '100vh');
				});

				skel.on('+small', function () {
					$banner.css('height', '');
				});

			}

			// More button.
			$banner.find('.more')
				.addClass('scrolly');

		}


		// Get BG Image

		if ($(".bg-img").length) {

			$(".bg-img").each(function () {

				var post = $(this),
					bg = post.data('bg');

				post.css('background-image', 'url(images/' + bg + ')');

			});


		}

		// Posts

		$(".post").each(function () {
			var p = $(this),
				i = p.find('.inner'),
				m = p.find('.more');

			m.addClass('scrolly');

			p.scrollex({
				top: '40vh',
				bottom: '40vh',
				terminate: function () { m.removeClass('current'); i.removeClass('current'); },
				enter: function () { m.addClass('current'); i.addClass('current'); },
				leave: function () { m.removeClass('current'); i.removeClass('current'); }
			});

		});

		// Scrolly.
		if ($(".scrolly").length) {

			$('.scrolly').scrolly();
		}

		// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right'
			});

	});

})(jQuery);

(function () {
	'use strict';

	var app = {
		articles: '',
		teaserIndex: -1,
		elTeaserArticle: document.getElementById("one")
	};


	// data loader

	app.XHR = function (url) {
		// Return a new promise.
		console.log("XHR: getting URL " + url)
		return new Promise(function (resolve, reject) {
			// Do the usual XHR stuff
			var req = new XMLHttpRequest();
			req.open('GET', url);

			req.onload = function () {
				// This is called even on 404 etc
				// so check the status
				if (req.status == 200) {
					console.log("XHR: response received OK")
					// Resolve the promise with the response text
					resolve(req.response);
				}
				else {
					console.log("XHR: error in response: " + req.statusText);
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error(req.statusText));
				}
			};

			// Handle network errors
			req.onerror = function () {
				reject(Error("Network Error"));
			};

			// Make the request
			req.send();
		});
	};

	app.getJSON = function (url) {
		console.log("getJSON: getting JSON from " + url);
		return app.XHR(url).then(JSON.parse);
	};

	console.log("Starting load articles async");
	app.getJSON("/data/articles.json")
		.then(function (articles) {
			app.articles = articles;
			if ((app.teaserIndex < 0) || (app.teaserIndex >= articles.length)) {
				app.teaserIndex = Math.floor(Math.random() * articles.length);
				console.log("Selected article " + app.teaserIndex + " out of a possible " + (articles.length - 1));
			};
			app.elTeaserArticle.querySelector(".inner .box header h2").innerHTML = articles[app.teaserIndex].teaserTitle;
			app.elTeaserArticle.querySelector(".inner .box .content p").innerHTML = articles[app.teaserIndex].teaser;
		})
		.catch(function (err) {
			app.elTeaserArticle.querySelector(".inner .box header h2").innerHTML = "Error loading articles";
			app.elTeaserArticle.querySelector(".inner .box .content p").innerHTML = err;
		});
	console.log("Javascript done.")

})()