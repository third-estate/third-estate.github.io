/*
	Road Trip by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

		var $height = $('#header').height();

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Banner

			if ($banner.length > 0) {

				// IE: Height fix.
					if (skel.vars.browser == 'ie'
					&&	skel.vars.IEVersion > 9) {

						skel.on('-small !small', function() {
							$banner.css('height', '100vh');
						});

						skel.on('+small', function() {
							$banner.css('height', '');
						});

					}

				// More button.
					$banner.find('.more')
						.addClass('scrolly');

			}


		// Get BG Image

			if ( $( ".bg-img" ).length ) {

				$( ".bg-img" ).each(function() {

					var post 	= $(this),
						bg 		= post.data('bg');

					post.css( 'background-image', 'url(images/' + bg + ')' );

				});


			}

		// Posts

			$( ".post" ).each( function() {
				var p = $(this),
					i = p.find('.inner'),
					m = p.find('.more');

				m.addClass('scrolly');

				p.scrollex({
					top: '40vh',
					bottom: '40vh',
					terminate: 	function() { m.removeClass('current'); i.removeClass('current'); },
					enter: 		function() { m.addClass('current'); i.addClass('current'); },
					leave: 		function() { m.removeClass('current'); i.removeClass('current'); }
				});

			});

		// Scrolly.
			if ( $( ".scrolly" ).length ) {

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

(function() {
	'use strict';

	var app = {
		articles: '[{"teaserTitle": "Has digital got you out of balance",' +
			'"teaser": "Too often companies look at digital only from the perspective of the customer engagement layer. Done right this perspective can provide very useful insights in your go-to-market strategy. Done wrong it will create imbalance that will at best slow you down and at worst worsen customer experience and negatively impact both brand and sales.",' +
			'"articleTitle": "Digital Transformation and the problem of imbalance",' +
			'"article": "<p>Too often companies look at digital only from the perspective of the customer engagement layer. Done right this perspective can provide very useful insights in your go-to-market strategy. Done right it absolutely will be driven from the perspetive of the customer. Done right it will look at all channels of engagement. Done wrong it will create imbalance that will at best slow you down and at worst worsen customer experience and negatively impact both brand and sales.</p>' + 
				'<p>The allure of the online channel is its visual nature, its ready comparison with the competition and its resonance with feedback from customers. Even seasoned digital strategists can get sucked into this honey trap.</p>' +
				'<p>This imbalance can felt in a number of ways; here are three:</p>' +
				'<ul><li><strong>A focus on how work is entering your organisation</strong> at the expense of how work is managed and value is created and delivered. Process engineering 101 will teach you that simply shoving work into the pipeline won&apos;t result in faster or better output - most likely the opposites.</li>' +
				'<li><strong>A focus on the obviously digital channels</strong> at the expense of the traditional channels like phone and face-to-face. It&apos;s common to think about multi- or omni-channel. It&apos;s less common to consider how to digitise these traditional channels to improve customer experience.</li>' +
				'<li><strong>A focus on what works for the customer</strong> at the expense of what works for the organisation. Those that drink too much of the &apos;customer led&apos; kool-aid can often forget that a business is fundamentally self-serving; perhaps I should say stakeholder-serving. (Conversely, those that baulk at the mantra of customer centricity may have lost sight of the fact that without customers the business dies.) A channel strategy must map touchpoints to &apos;best channel for customer&apos; and &apos;best channel for business&apos;; it&apos;s great when these align and a decision is needed when mis-aligned.</li></ul>' +
				'<blockquote>Digital transformation is multi-faceted.</blockquote>' +
				'<p>Responding to the unique challenges of the digital age is a wicked problem. This makes making sense of it a real challenge. So it makes sense to use experienced people who understand its complexity to work with your staff who understand your business to create a winning strategy.</p>' +
			'"}]',
		teaserIndex: -1,
		elTeaserArticle: document.getElementById("one")
	};

	// debugger;

	// event listeners
	// window.addEventListener('loadend', function() {
	// 	console.log("Event fired");
	// 	// app.LoadTeaser();
	// });

	// data loader

	app.LoadTeaser = function() {
		// @todo: actually load the articles with fetch
		var jsonArticle = JSON.parse(app.articles); 
		// debugger;
		if (jsonArticle) {
			if ((app.teaserIndex < 0) || (app.teaserIndex >= jsonArticle.length)) {
				app.teaserIndex = Math.floor(Math.random() * jsonArticle.length);
			};
			app.elTeaserArticle.querySelector(".inner .box header h2").innerHTML = jsonArticle[app.teaserIndex].teaserTitle;
			app.elTeaserArticle.querySelector(".inner .box .content p").innerHTML = jsonArticle[app.teaserIndex].teaser;
		}
	};

	app.LoadTeaser();

})()