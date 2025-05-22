/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		// return new Response('Hello World!');

		const searchParams = new URLSearchParams(new URL(request.url).search)

		const numUniverses = searchParams.get('numUniverses');
		if (!numUniverses) {
			return new Response('Please provide a numUniverses parameter in the URL', {
				status: 400,
			});
		}

		const size = searchParams.get('size');
		const numResults = size || 1;

		// const fetchPromise = new Promise((resolve, reject) => {
		// 	fetch(`http://qrng.ethz.ch/api/randint?min=1&max=${numUniverses}&size=${numResults}&`)
		// 		.then((response) => {
		// 			if (!(response.ok)) {
		// 				reject("problem connecting to ETHZ quantum server")
		// 			}
		// 			return response.json()  // response.json() returns another promise
		// 		})
				
		// 		.then((jsonData) => {
		// 			resolve(jsonData)
		// 		})
		// 		.catch(error => {
		// 			reject(error)
		// 		})

		// })

		const fetchPromise = fetch(`https://qrandom.io/api/random/ints?min=1&max=${numUniverses}&n=${numResults}`)
			.then((response) => response.json())
			.then((jsonData) => {
				return {
					result: jsonData.numbers // convert to the api the client already expects
				};
			});
			
		

		//this follows cloudflare worker's json example
		const jsonResponse = JSON.stringify(await fetchPromise, null, 2)
		console.log(jsonResponse)
		return new Response(jsonResponse, {
			headers: {
				"content-type": "application/json;charset=UTF-8",
				'Access-Control-Allow-Origin': '*'
			},
		})
	},
};


