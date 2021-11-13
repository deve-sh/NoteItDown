export function getQueryParams(queryParam = "utm_source") {
	if (queryParam && window) {
		if (window.URLSearchParams) {
			// The newer method. Works on all modern browsers.
			const urlParams = new URLSearchParams(window.location.search);
			let param = urlParams.get(queryParam);
			return param;
		} else {
			// fallback to the original method
			// Because there's always going to be someone with an old browser.

			/*
				// Uncomment the following code sample to use a simpler yet tested version.
				let query = window.location.search.substring(1);
				let vars = query.split("&");
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					if (pair[0] == variable) {
						return pair[1];
					}
				}
				return false;
			*/

			let url = window.location.href;
			queryParam = queryParam.replace(/[\[\]]/g, "\\$&");
			let regex = new RegExp("[?&]" + queryParam + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return "";
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		}
	} else return undefined;
}
