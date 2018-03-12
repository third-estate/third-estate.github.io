(function () {
	'use strict';

	var app = {
		articles: '',
		posting: false,
		postURI: 'https://prod-23.westeurope.logic.azure.com:443/workflows/a3c7a175f31a4beba595dc6d7b6ef684/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fdPU9jw5ZQ9LdGNCrI-EPnQa7jfOm04Ngi3wVyxYknc',
		elTeaserArticle: document.getElementById("one"),
		elContactButton: document.querySelector('#footer input[type="submit"]'),
		elContactResult: document.querySelector('#footer ul.actions > p'),
		elContactFormName: document.getElementById('name'),
		elContactFormEmail: document.getElementById('email'),
		elContactFormMessage: document.getElementById('message')
	};

	// events

	document.getElementById('contactForm').addEventListener('submit', function () {
		if (!app.posting) {
			app.posting = true;
			app.elContactButton.value = "Sending...";
			app.XHR(app.postURI, 'POST', JSON.stringify({ name: app.elContactFormName.value, email: app.elContactFormEmail.value, message: app.elContactFormMessage.value }))
				.then(function (response) {
					app.ResetForm("Thanks, you will receive a confirmation email and I'll be in touch soon.", true);
				})
				.catch(function (err) {
					app.ResetForm("Sorry, something went wrong.<br>Please try again or email <a href='mailto:info@derigo.consulting'>info@derigo.consulting</a>.", false);
				});
		}
	});

	// reset the form after posting
	app.ResetForm = function (message = '', success = true) {
		// if msg is blank get cached message and success result
		if (message == '') {
			// get the cached result if there is one
			app.getSessionValue('contactFormResult', JSON.stringify({ msg: message, result: success }), false)
				.then(JSON.parse)
				.then(app.ResetFormElements);
		}
		else {
			app.setSessionValue('contactFormResult', JSON.stringify({ msg: message, result: success }))
				.then(JSON.parse)
				.then(app.ResetFormElements);
		}
	}

	app.ResetFormElements = function (jsonFormResult) {
		if (jsonFormResult.result) {
			app.elContactFormName.value = '';
			app.elContactFormEmail.value = '';
			app.elContactFormMessage.value = '';
			app.elContactResult.classList.remove('error');
		}
		else {
			app.elContactResult.classList.add('error');
		}
		app.elContactResult.innerHTML = jsonFormResult.msg;
		app.elContactButton.value = 'Send Message';
		app.posting = false;
	}

	// data loader

	app.XHR = function (url, method = 'GET', msg = '') {
		// Return a new promise.
		return new Promise(function (resolve, reject) {
			// Do the usual XHR stuff
			var req = new XMLHttpRequest();
			req.open(method, url);

			req.onload = function () {
				// This is called even on 404 etc
				// so check the status
				if ((req.status >= 200) && (req.status <= 202)) {
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
			req.send(msg);
		});
	};

	// parse a return result into a JSON object
	app.getJSON = function (url) {
		return app.XHR(url).then(JSON.parse);
	};

	// session store as promise
	// get a value, return default value if it doesn't exist and (optionally) save the value
	app.getSessionValue = function (key, defaultVal, setVal = false) {
		return new Promise(function (resolve) {
			var storedVal = sessionStorage.getItem(key);
			if (!storedVal) {
				if (setVal) {
					sessionStorage.setItem(key, defaultVal);
				}
				resolve(defaultVal);
			}
			else {
				resolve(storedVal);
			}
		});
	}

	app.setSessionValue = function (key, newVal) {
		return new Promise(function (resolve) {
			sessionStorage.setItem(key, newVal);
			resolve(newVal);
		});
	}

	// Load articles text and set teaser text
	app.getJSON("./data/articles.json")
		.then(function (articles) {
			app.articles = articles;
			app.getSessionValue("teaserIndex", Math.floor(Math.random() * articles.length), true)
				.then(function (teaserIndex) {
					app.elTeaserArticle.querySelector(".inner .box header h2").innerHTML = articles[teaserIndex].teaserTitle;
					app.elTeaserArticle.querySelector(".inner .box .content p").innerHTML = articles[teaserIndex].teaser;
				});
		})
		.catch(function (err) {
			app.elTeaserArticle.querySelector(".inner .box header h2").innerHTML = "Error loading articles";
			app.elTeaserArticle.querySelector(".inner .box .content p").innerHTML = err;
		});
	// reload form submission messages from session store or just clear it	
	app.ResetForm();
})();