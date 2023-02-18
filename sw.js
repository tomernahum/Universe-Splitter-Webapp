//TODO: cache files for offline use

//ts-check

const CACHE_NAME = "cache-v1";
const RESOURCES_TO_PRECACHE = [
    "/",
    "/index.html",
    "/script.js",
    "/style.css",
    "/explanation.html",
    "/Spinner-1s-200px.gif",
    "/manifest.json",

    //temp fix attempt for cloudflare redirect
    "/explanation",
     
    //I think favicons etc dont need to be included but im not sure
    "/images/icons/favicon.ico",
    "/images/icons/favicon-16x16.png",
    "/images/icons/favicon-32x32.png",

];



self.addEventListener("install", e => {
    console.log("service worker installed", e)

    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(chache => {
            return chache.addAll(RESOURCES_TO_PRECACHE)
        })
    )
});


self.addEventListener("activate", e => {
    console.log("service worker activated", e)
})

self.addEventListener("fetch", e => {
    console.log("fetch event", e)
    
    e.respondWith( //intercept the fetch request and handle it yourself
        caches.match(e.request) //query the cache for the thing being requested
        .then(chacheResponse => {
            console.log("cache response:", chacheResponse)
            return (chacheResponse || fetch(e.request))  //return cahceReponse, unless its falsy (eg null), then make the fetch request yourself and return that 
        })
    )
})
