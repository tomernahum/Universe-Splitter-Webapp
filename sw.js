//TODO: cache files for offline use



self.addEventListener("install", event => {
    console.log("service worker installed", event)
});


self.addEventListener("activate", event => {
    console.log("service worker activated", event)
})

self.addEventListener("fetch", event => {
    console.log("fetch event", event)
})
