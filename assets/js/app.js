(function () {
	'use strict';

	var app = {
		articles: '',
		elTeaserArticle: document.getElementById("one")
	};

	// events

	document.getElementById('contactBtn').addEventListener('click', function() {
		console.log("clicked");
		// https://prod-23.westeurope.logic.azure.com:443/workflows/a3c7a175f31a4beba595dc6d7b6ef684/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fdPU9jw5ZQ9LdGNCrI-EPnQa7jfOm04Ngi3wVyxYknc
	})


	// data loader

	app.XHR = function (url) {
		// Return a new promise.
		return new Promise(function (resolve, reject) {
			// Do the usual XHR stuff
			var req = new XMLHttpRequest();
			req.open('GET', url);

			req.onload = function () {
				// This is called even on 404 etc
				// so check the status
				if (req.status == 200) {
					// Resolve the promise with the response text
					resolve(req.response);
				}
				else {
					// Otherwise reject with the status text
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

	// parse a return result into a JSON object
	app.getJSON = function (url) {
		return app.XHR(url).then(JSON.parse);
	};

	// session store as promise
	app.Session = function (key, defaultVal) {
		return new Promise(function (resolve) {
			if (!sessionStorage.getItem(key)) {
				sessionStorage.setItem(key, defaultVal);
				console.log("Saving value of " + key);
			}
			resolve(sessionStorage.getItem(key));
		});
	}

	// Load articles text and set teaser text
	// console.log("Starting load articles async");
	app.getJSON("./data/articles.json")
		.then(function (articles) {
			app.articles = articles;
			app.Session("teaserIndex", Math.floor(Math.random() * articles.length))
				.then(function (teaserIndex) {
					app.elTeaserArticle.querySelector(".inner .box header h2").innerHTML = articles[teaserIndex].teaserTitle;
					app.elTeaserArticle.querySelector(".inner .box .content p").innerHTML = articles[teaserIndex].teaser;
				});
		})
		.catch(function (err) {
			app.elTeaserArticle.querySelector(".inner .box header h2").innerHTML = "Error loading articles";
			app.elTeaserArticle.querySelector(".inner .box .content p").innerHTML = err;
		});
})();