window.addEventListener('load', init);

const colors = ['green', 'brown', 'gray'];
let playerColors = ['yellow', 'red', 'green', 'blue', 'black', 'pink'];
let backgroundColors = ['227, 182, 70', '201, 67, 36', '81, 196, 75', '89, 126, 194', '94, 93, 115', '189, 89, 145'];
let playerAmount = 0;
const container = document.getElementById("main");
const img = document.getElementById("img");
const boxScore = document.getElementById("boxScore");
const nextPlayer = document.getElementById("nextPlayer");
nextPlayer.addEventListener('click', nextPlayerFunction);
const prevPlayer = document.getElementById("prevPlayer");
prevPlayer.addEventListener('click', prevPlayerFunction);
let customUrl = "webservice/includes/actions.json";
let customData = [];
let cardCount = 0;
let boxCount = 0;
let playingPlayer = 0;
let playersScore = [];
let rotation = 0;
const angle = 90;
let roundOver = false;
let recentTile = 0;
let computerPlacing = false;
let cardCountSave = 0;
const save = document.getElementById("save");
function init() {


    //makeRows(32, 32);

    // if (localStorage.getItem('players') !== '0') {
    //     playerAmount = localStorage.getItem('players');
    getApi(customUrl, setCustomData);
    // } else {
    //     playerAmount = localStorage.getItem('playerAmount');
    //     getApi(customUrl, setCustomDataLocal);
    //     playersScore = JSON.parse(localStorage.getItem('playersScore'));
    //     playingPlayer = localStorage.getItem('playingPlayer');
    // }


    const cardImage = document.createElement('img');
    cardImage.id = 'image';
    img.appendChild(cardImage);

    const antiClock = document.getElementById("antiClock");
    antiClock.addEventListener('click', antiClockFunction);

    const Clock = document.getElementById("Clock");
    Clock.addEventListener('click', ClockFunction);


    //playerScoreBoard();

    //scrollToMiddle();
}

function getApi(url, nextFunction) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error (${response.status}): ${response.statusText}`);
            }
            return response.json();  // Parse response as JSON
        })
        .then((data) => {
            if (Array.isArray(data)) {
                nextFunction(data);  // Pass the parsed JSON array to nextFunction
            } else {
                throw new Error('The fetched data is not an array');
            }
        })
        .catch((error) => {
            console.error('Error fetching or processing the data:', error);
        });
}

function setCustomData(data) {

    customData = data;
    changeImage(customData[cardCount]);
}


function antiClockFunction(e) {
    if (!roundOver) {
        antiRotateImage();
        let numbersCopy = JSON.parse(JSON.stringify(customData[cardCount].numbers));
        numbersCopy.push(numbersCopy.shift());
        customData[cardCount].numbers = numbersCopy;
    }
}

function ClockFunction(e) {
    if (!roundOver) {
        rotateImage();
        let numbersCopy = JSON.parse(JSON.stringify(customData[cardCount].numbers));
        numbersCopy.unshift(numbersCopy.pop());
        customData[cardCount].numbers = numbersCopy;
    }
}

function antiRotateImage() {
    rotation = (rotation - angle) % 360;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateImage() {
    rotation = (rotation + angle) % 360;
    img.style.transform = `rotate(${rotation}deg)`;
}



function changeImage(list) {
    if (list) {

        let image = document.getElementById("image");
        image.srcset = `https:wikicarpedia.com/images/${list.img}`;

        img.style.transform = `rotate(${0}deg)`;
        rotation = 0;

        container.innerHTML = `https:wikicarpedia.com/images/${list.img} <br> ${list.properties}`


    } else {
        alert("The game is over");
    }

}

function nextPlayerFunction() {
    cardCount++
    changeImage(customData[cardCount]);
}

function prevPlayerFunction() {
    cardCount--
    changeImage(customData[cardCount]);
}