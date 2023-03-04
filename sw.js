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
            return cache.addAll(RESOURCES_TO_PRECACHE) //? does this cache from the previous service workers intercept aka from the old cache or from the real internet - I'd hope the later but I ran into bug that implies former. AKA does it ask for a fetch request and go through existing service worker
        })
    )
});


//_activate Event_
self.addEventListener("activate", e => {
    console.log("service worker activated", e)
})



//Intercept fetch requests
self.addEventListener("fetch", e => {
    console.log("fetch event", e)
    
    //TODO/BUG/Research: this is returning from the cache even if its old. if user is online it should prefer the online version - maybe should try fetch request first then if that fails return cacheresponse? or maybe theres way to check if user is offline quicker - should look up reccomended way to do this...
    //Or maybe can update the cache somewhere other than the install event since that isn't triggered if the html files change only if sw.js file changes
    //ok so switching it is bad ig because its slower which defeats part of the point of caching? Why not use the old cache install the next one for the next time they visit just like the install event
    //https://web.dev/learn/pwa/update/#update-patterns

    e.respondWith( //intercept the fetch request and handle it yourself
        caches.match(e.request) //query the cache for the thing being requested
        .then(cacheResponse => {
            console.log("cache response:", cacheResponse)
            return (cacheResponse || fetch(e.request))  //return cahceReponse, unless its falsy (eg null), then make the fetch request yourself and return that 
            //can do .then on fetch to update the cache dynamically if the files not in there
        })
    )
})
