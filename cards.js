window.addEventListener('load', init);

const colors = ['green', 'brown', 'gray'];
let playerColors = ['yellow', 'red', 'green', 'blue', 'black', 'pink'];
let backgroundColors = ['227, 182, 70', '201, 67, 36', '81, 196, 75', '89, 126, 194', '94, 93, 115', '189, 89, 145'];
let playerAmount = 0;
const container = document.getElementById("main");
const img = document.getElementById("img");
const imgColors = document.getElementById("imgColors");
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
        //image.srcset = `https:wikicarpedia.com/images/${list.img}`;
        image.srcset = `images/Tiles/${list.img}`;
        //image.srcset = `images/Tiles/Base_Game_C3_Tile_A.png`;
        //C:\xampp\htdocs\Games\images

        img.style.transform = `rotate(${0}deg)`;
        rotation = 0;

        container.innerHTML = `Img: ${image.srcset} <br> Properties: ${list.properties} <br> Numbers: ${list.numbers} <br> Amount: ${list.amount} <br> Version: ${list.version} <br> Items:${list.items} <br><br><br>
------------------<br>
Properties:<br>
Grass = 0 <br>
City = 1<br>
Path = 2<br>
Monastery = 3<br>
Wall = 4<br>
Water = 5<br>
<br>
Items:<br>
None = 0<br>
Monastery = 1<br>
Wapen = 2<br>
------------------<br>
<a href="https://wikicarpedia.com/car/Main_Page" target="_blank">Main Page</a>

<h2>Base Game</h2> 
<a href="https://wikicarpedia.com/car/Base_game" target="_blank">Rules</a>
The Abbot<br>
Connecting city's and roads points<br>
Changing imposible cards<br>
Meeple in grass<br>

<h2>The Abbot</h2> 
<a href="https://wikicarpedia.com/car/The_Abbot" target="_blank">Rules</a>
The Abbot<br>
Gardens<br>

<h2>The River</h2> 
<a href="https://wikicarpedia.com/car/River" target="_blank">Rules</a>
Prevent U turns<br>
Expansion water (with t spit)<br>

<h2>EXP 1. Inns and Cathedrals</h2> 
<a href="https://wikicarpedia.com/car/Inns_and_Cathedrals" target="_blank">Rules</a>
Large meeples<br>

<h2>Exp. 2 - Traders & Builders</h2>
New tiles<br>
Goods<br>
Builder<br>
Extra tile from builder<br>
Pig<br>

<h2>Exp. 3 - The Princess & the Dragon</h2>
New tiles<br>
Dragon<br>
Fairy<br>
Princes<br>
Portals<br>

Bugs:



<br><br><br><br><br><br><br><br><br><br>
`
        imgColors.innerHTML = ''
        let colors = ['green', 'brown', 'darkbrown', 'lightgray', 'gray', 'lightblue']
        for (let i = 0; i < 9; i++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item1');
            gridItem.style.background = colors[list.properties[i]]
            gridItem.innerHTML = list.properties[i]
            imgColors.appendChild(gridItem);
        }

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