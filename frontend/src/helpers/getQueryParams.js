export function getQueryParams(queryParam = "utm_source") {
	if (!queryParam) return undefined;
	const urlParams = new URLSearchParams(window.location.search);
	const param = urlParams.get(queryParam);
	return param;
}
