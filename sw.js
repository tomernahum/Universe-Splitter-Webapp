//TODO: cache files for offline use



self.addEventListener("install", event => {
    console.log("service worker installed")
});


self.addEventListener("activate", event => {
    console.log("service worker activated")
})

