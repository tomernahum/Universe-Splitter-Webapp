"use strict"

//TODO: organize this stuff better
const body = document.querySelector("body")
const themeButton = document.querySelector("#theme-toggle")

const mainDiv = document.querySelector("#main-div")
const buttonContainerForm = document.querySelector(".button-and-slider-container")
const outputArea = mainDiv.querySelector(".output-area")
const mainButton = mainDiv.querySelector(".main-button")
const loadingImg = mainDiv.querySelector(".loading-image")

const slider = mainDiv.querySelector(".slider-container .slider")
const sliderDisplay = mainDiv.querySelector(".slider-container .num-universes-display")

window.onload = () => {
//     const mainDiv = document.querySelector("#main-div")
//     const outputArea = mainDiv.querySelector(".output-area")
//     const mainButton = mainDiv.querySelector(".main-button")
    themeButton.addEventListener("click", onThemeButtonClick)
    slider.addEventListener("input", onSliderChange)

    //mainButton.addEventListener("click", onButtonClick)
    buttonContainerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        onButtonClick();
    })



    window.numUniverses = slider.value
}



//---- Main button and output ----
function output(s)  {
    //alert(s)
    //outputArea.innerText = s

    //outputArea.innerText += s + "\n"

    const element = document.createElement("li")
    element.innerText = s
    outputArea.appendChild(element)
    element.scrollIntoView({behavior:"smooth"})

}

function toggleLoading(on) {
    if (on) {
        loadingImg.style.display = "block"
    }
    else {
        loadingImg.style.display = "none"
    }
}

//TODO: will refactor this part
async function onButtonClick(e) {

    async function splitUniverse() {
        return await splitUniverseANUOldApi()
    }

    toggleLoading(true)
    
    try {
        const universeNumber = await splitUniverse()
        // output(`You are in Universe ${universeNumber}`)
        output(`You are in Universe ${universeNumber}/${window.numUniverses}`)
    }
    catch (error) {
        output(`error splitting the universe: ${error}`)
    }
    
    toggleLoading(false)
    
    
}   


//

// ---- Slider ----
// TODO: pick which way is better
function onSliderChange(e){
    const slider = e.currentTarget
    const value = slider.value
    
    // console.log(value)
    sliderDisplay.innerText = value;

    window.numUniverses = value; //global
    //console.log(window.numUniverses)
    
}

// alternate organization (probably better)
const slider2 = mainDiv.querySelector(".slider-container .slider")
const sliderDisplay2 = mainDiv.querySelector(".slider-container .num-universes-display")

sliderDisplay2.innerText = slider2.value;


slider2.addEventListener("input", (e)=> {
    const slider = e.currentTarget
    const value = slider2.value
    
    // console.log(value)
    sliderDisplay2.innerText = value;
})

//


//  --- Theme Button ----
function onThemeButtonClick(){
    toggleTheme()
}

function toggleTheme(){
    if (body.classList.contains("light")) {
        body.classList.replace('light', 'dark')
    }
    else {
        body.classList.replace('dark', 'light')
    }
}
//


// 
function logToDoList(){
    fetch("./todo.txt")
    .then((response)=> response.text())
    .then((response) => {
        console.info(response)
    })
    .catch((error) => {})//do nothing
}
//


// -- Splitting Universe Functions ---
function splitUniverseFake() {
    return Math.floor((Math.random() * window.numUniverses)) + 1;
}

async function splitUniverseANUOldApi() {  //its called old cause there gonna deprecate the api and start charging for it
    const fetchAnuJsonPromise = new Promise((resolve, reject) => {
        fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8')
        .then((response) => {
            if (!(response.ok)) {
                reject("problem connecting to ANU quantum server")
            } 

            return response.json()  // response.json() returns a nother promise

        })
        .then((jsonData) => {
            resolve(jsonData)
        })
        .catch( error => {
            reject(error)
        })
        
    })

    const getUniverseNumberPromise = new Promise((resolve, reject) => {
        fetchAnuJsonPromise.then( data => {
            const number = data.data[0]
            const universeNumber = (number % window.numUniverses) + 1
            resolve(universeNumber)
            //reject("testting")
        })
        .catch( error => {  //wip
            reject(error)
        })
    })

    return getUniverseNumberPromise
    
    
    
    
}



