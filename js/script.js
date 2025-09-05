const createElement = (array) => {
    const htmlElements = array.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
}
// Speak 
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// Spinner 
const manageSpinner = (status) => {
    if(status === true){
        document.getElementById("spinner").classList.remove("hidden")
        document.getElementById("word-container").classList.add("hidden")
    }else{
        document.getElementById("word-container").classList.remove("hidden")
        document.getElementById("spinner").classList.add("hidden")
    }
}

// 1st Lesson Load From API 
const loadLessons = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all"
    fetch(url)
    .then(response => response.json())
    .then(json => displayLesson(json.data))
}

//   Remove Active 
const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".active-remove-btn")
    lessonButtons.forEach(btn => btn.classList.remove("active"))
}


const loadLevelWord = (id) => {
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then(res => res.json())
    .then(value => {
        removeActive()
        const clickedBtn = document.getElementById(`lesson-btn-${id}`)
        clickedBtn.classList.add("active")
        displayLessonWord(value.data)
    })
} 


const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

// Modal Display 
const displayWordDetails = (word) => {
    console.log(word)
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
            <div>               
                <h2 class="text-3xl font-bold py-4 px-5">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
                </div>
                    <div class="px-5">
                    <h2 class="text-xl font-semibold">Meaning</h2>
                    <p class="font-semibold">${word.meaning}</p>
                    </div>
                    <div class="pt-4 px-5">
                    <h2 class="text-xl font-semibold">Example</h2>
                    <p class="text-lg">${word.sentence}</p>
                    </div>
                    <div class="pt-4 px-5">
                    <h2 class="text-lg font-semibold">সমার্থক শব্দ গুলো</h2></div>
                    <div class="mt-2 px-4">
                    ${createElement(word.synonyms)}
                    </div>                                 
                </div>              
            </div>
    `
    document.getElementById("my_modal_5").showModal()

}


// Display Word 
const displayLessonWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    if(words.length === 0){
        wordContainer.innerHTML = `
            <div class="text-center col-span-full space-y-6">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="font-semibold text-gray-500 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="text-4xl font-semibold font-bangla">নেক্সট Lesson এ যান</h1>
            </div>
        `
    }
    words.forEach(word => {
        const createDiv = document.createElement("div");
        createDiv.innerHTML = `
                <div class="bg-white text-center p-10 space-y-5 rounded-xl shadow-md h-full">
                <h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দ  পাওয়া জায়নি"}</h2>
                <p class="font-semibold">Meaning /Pronounciation</p>
                <h2 class="text-2xl font-bangla font-semibold text-gray-600">${word.meaning ? word.meaning : "অর্থ  পাওয়া জায়নি"} / ${word.pronunciation ? word.pronunciation : "Not found pronunciation"}</h2>
                <div class="flex justify-between items-center ">
                    <button onclick="loadWordDetails(${word.id})" class="bg-[#1a91ff1a] px-4 py-3 rounded-lg text-lg cursor-pointer hover:bg-[#1a90ff3d]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="bg-[#1a91ff1a] px-4 py-3 rounded-lg text-lg cursor-pointer hover:bg-[#1a90ff3d]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
                </div>
        `
        wordContainer.appendChild(createDiv);
    })
    manageSpinner(false)
}

//    Lesson Button Display 
const displayLesson = (values) => {
    const container = document.getElementById("container");
    container.innerHTML = "";
    for(let value of values){
        const buttonDiv = document.createElement("div");
        buttonDiv.innerHTML = `
                    <button id="lesson-btn-${value.level_no}" onclick="loadLevelWord(${value.level_no})" class="btn btn-outline btn-primary active-remove-btn"><i class="fa-solid fa-book-open"></i> Lesson - ${value.level_no}</button>
        `
        container.appendChild(buttonDiv)
    }
}


loadLessons()


//   Input - Search 
document.getElementById("search-btn").addEventListener("click", () => {
    removeActive();
    const inputValue = document.getElementById("search-input").value.trim().toLowerCase();
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(inputValue));
        displayLessonWord(filterWords)
        document.getElementById("search-input").value = "";
    })
})