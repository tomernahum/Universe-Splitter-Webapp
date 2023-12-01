
//Put this in head to run before the html/css is loaded
/* 
<script>
    function getInitialPreferredThemeAndUpdateLocalStorage(){
        const systemPreferredThemeIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPreferredThemeIsDark){
            localStorage.setItem("preferred_theme", "dark")
            return "dark"
        }
        localStorage.setItem("preferred_theme", "light")
        return "light"
    }

    const preferredTheme = localStorage.getItem("preferred_theme")
                            || getInitialPreferredThemeAndUpdateLocalStorage()
    
    console.log("HI1", preferredTheme)
    document.documentElement.dataset.theme = preferredTheme

    //need to load with no transition to load right 100% of time on firefox (only tested on chromium & firefox)
    window.addEventListener("load", () => {
        document.body.classList.remove("no-transition")
    })
</script>
*/
/*
and on body put class="no-transition", and include the css  
.no-transition *, .no-transition {
    transition: none !important;
}
(already included in style.css)
I am starting to buy the argument that in practice separation of concerns makes more sense as separating vertical slices of html, css, and js, as component libraries do, vs separating content(html)/presentation(css)/functionality(js) from each other, when we are making a webapp as opposed to an information document, because html/css/js overlaps in practice
*/



// Can include this with script tag 
window.addEventListener("load", () => {
    function onThemeButtonClick(){
        toggleTheme()
        localStorage.setItem("preferred_theme", getCurrentTheme())
    }
    function toggleTheme(){
        if (getCurrentTheme() === "light") {
            setTheme("dark")
        }
        else {
            setTheme("light")
        }
    }
    /**
    * @param {string} theme should be dark or light
    */
    function setTheme(theme){
        document.documentElement.dataset.theme = theme
    }
    function getCurrentTheme(){
        return document.documentElement.dataset.theme
    }


    const themeButton = document.querySelector("#theme-toggle")
    themeButton.addEventListener("click", onThemeButtonClick)
})

