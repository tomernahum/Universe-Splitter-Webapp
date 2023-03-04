//TODO: cache files for offline use

//ts-check

const CACHE_NAME = "cache-v2"; //have to change version number to update the cache. I feel there has to be a better way / a way to do this automatically but it was too hard to find and I dont want to use workbox. Seems to me you could do this essentially with 2 caches automatically or update the 1 cache for next time right after you return from it so its speedy return but updated if the user is online
const RESOURCES_TO_PRECACHE = [
    "/",
    "/index.html",
    "/script.js",
    "/style.css",
    //"/explanation.html",
    "/Spinner-1s-200px.gif",
    "/manifest.json",

    //cloudflare gets rid of .html so caching breaks if you cache it so you have to run with cloudflare local server now to test it
    "/explanation",
    
    //I think favicons etc dont need to be included but im not sure
    "/images/icons/favicon.ico",
    "/images/icons/favicon-16x16.png",
    "/images/icons/favicon-32x32.png",
];
//can also cache other resources as they are requested, this would be useful for a large website like a blog or something


//_install Event_
// Only fires after the page is reloaded and sw.js is different from whats already installed
// TODO/BUG: need to update the cache if the html files change though...
// install does not mean the service worker is in use, that only happens when you close all instances of the app and reload the page, then it becomes activated/in use and fires the activate event
self.addEventListener("install", e => {   
    console.log("service worker installedd", e)
    
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(RESOURCES_TO_PRECACHE) //? does this cache from the previous service workers intercept aka from the old cache or from the real internet, since it runs fetch. probably latter.
        })
    )
});


//_activate Event_
self.addEventListener("activate", event => {
    console.log("service worker activatedd", event)

    //delete any old caches besides the allowed one ^^ CACHE_NAME
    event.waitUntil(
        caches.keys().then(keys_of_caches => {
            return Promise.all(
                keys_of_caches
                .filter(key => key !== CACHE_NAME) //get list of keys besides cach name
                .map(key => caches.delete(key)) //returns array of promises...
            )
        })
    )
})



//Intercept fetch requests
self.addEventListener("fetch", e => {
    //console.log("fetch event", e)

    e.respondWith( //intercept the fetch request and handle it yourself
        caches.match(e.request) //query the cache for the thing being requested
        .then(cacheResponse => {
            //console.log("cache response:", cacheResponse)
            return (cacheResponse || fetch(e.request))  //return cahceReponse, unless its falsy (eg null), then make the fetch request yourself and return that 
            //can do .then on fetch to update the cache dynamically if the files not in there
        })
    )
})


//Intercept fetch requests, wrote it myself, not in use, no idea if it works
/*self.addEventListener("fetch", e => {
    console.log("fetch event", e)

    e.respondWith( //intercept the fetch request and handle it yourself
        
        caches.match(e.request) //query the cache for the thing being requested
        .then(cacheResponse => {
            //console.log("cache response:", cacheResponse)

            const it_was_not_in_the_cache = cacheResponse == undefined;

            if (it_was_not_in_the_cache){
                return fetch(e.request) .then(fetchResponse => {
                    updateCacheAsset(e.request.url, fetchResponse.clone())
                })
            }
            else //if it was in the cache
            {
                setTimeout(()=>updateCacheAsset(e.request.url)) //runs it asyncronously
                return cacheResponse
            }

            return (cacheResponse || fetch(e.request))
        }) 
    )
})
*/

/** 
 * @param {string} url
 * @param {Response} [response] optional
*/
function updateCacheAsset(url, response="Default", cacheName=CACHE_NAME)
{
    caches.open(cacheName).then(cache => {
        if (response === "Default")
            cache.add(url)
        else {
            cache.put(url, response)
            //no error checking probably bad
        }
    })
}
