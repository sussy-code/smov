const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
}

const allowedDomains = [
	'https://v2.sg.media-imdb.com',
	'https://gomo.to',
	'https://lookmovie.io',
	'https://gomoplayer.com',
	'https://api.opensubtitles.org'
];

async function handleRequest(request, destinationUrl, iteration = 0) {
	console.log(`PROXYING ${destinationUrl}${iteration ? ' ON ITERATION ' + iteration : ''}`);

	// Rewrite request to point to API url. This also makes the request mutable
	// so we can add the correct Origin header to make the API server think
	// that this request isn't cross-site.
	request = new Request(destinationUrl, request);
	request.headers.set("Origin", new URL(destinationUrl).origin);

	// Set PHPSESSID cookie
	if (request.headers.get('PHPSESSID')) {
		request.headers.set('Cookie', `PHPSESSID=${request.headers.get('PHPSESSID')};`);
	}

	// Set User Agent
	request.headers.set('User-Agent', ' Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0');

	let response = await fetch(request);

    if ((response.status === 302 || response.status === 301) && response.headers.get('location')) {
        if (iteration > 5) {
            event.respondWith(
				new Response('418 Too many redirects', {
					status: 418
				}),
			);
        }

        return await handleRequest(request, response.headers.get('location'), iteration + 1)
    }

	// Recreate the response so we can modify the headers
	response = new Response(response.body, response);

	// Set CORS headers
	response.headers.set("Access-Control-Allow-Origin", '*');
	response.headers.set('Access-Control-Expose-Headers', 'PHPSESSID');

	// Get and set PHPSESSID cookie
	const cookies = response.headers.get('Set-Cookie');
	if (cookies && cookies.includes('PHPSESSID') && cookies.includes(';')) {
		let phpsessid = cookies.slice(cookies.search('PHPSESSID') + 10);
		phpsessid = phpsessid.slice(0, phpsessid.search(';'));
		response.headers.set('PHPSESSID', phpsessid);
	}

	// Append to/Add Vary header so browser will cache response correctly
	response.headers.append("Vary", "Origin");

	return response;
}

function handleOptions(request) {
	// Make sure the necessary headers are present
	// for this to be a valid pre-flight request
	let headers = request.headers;

	if (headers.get("Origin") !== null &&  headers.get("Access-Control-Request-Method") !== null && headers.get("Access-Control-Request-Headers") !== null ) {
		return new Response(null, {
			headers: {
				...corsHeaders,
				// Allow all future content Request headers to go back to browser
				// such as Authorization (Bearer) or X-Client-Name-Version
				"Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
			},
		});
  	}
 	else {
		// Handle standard OPTIONS request
		return new Response(null, {
			headers: {
				Allow: "GET, HEAD, POST, OPTIONS",
			},
		})
  	}
}

addEventListener("fetch", event => {
	const request = event.request
	const url = new URL(request.url);
	const destinationUrl = url.searchParams.get("destination");

	console.log(`HTTP ${request.method} - ${request.url}` );


	if (request.method === "OPTIONS") {
		// Handle CORS preflight requests
		event.respondWith(handleOptions(request));
	}
	else if (!destinationUrl) {
		event.respondWith(
			new Response('200 OK', {
				status: 200,
				headers: {
					'Allow': "GET, HEAD, POST, OPTIONS",
					'Access-Control-Allow-Origin': '*'
				},
			}),
		);
	}
	else if (!allowedDomains.find(domain => destinationUrl.startsWith(domain))) {
		event.respondWith(
			new Response('404 Not Found', {
				status: 404,
			}),
		);
	}
	else if (request.method === "GET" || request.method === "HEAD" || request.method === "POST") {
		// Handle request
		event.respondWith(handleRequest(request, destinationUrl));
	}
	else {
		event.respondWith(
			new Response('404 Not Found', {
				status: 404,
			}),
		);
	}
});
