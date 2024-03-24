window.addEventListener('load', init);

const colors = ['green', 'brown', 'gray'];
let playerColors = ['yellow', 'red', 'green', 'blue', 'black', 'pink'];
let backgroundColors = ['227, 182, 70', '201, 67, 36', '81, 196, 75', '89, 126, 194', '94, 93, 115', '189, 89, 145'];
let playerAmount = localStorage.getItem('players');
const container = document.getElementById("main");
const img = document.getElementById("img");
const boxScore = document.getElementById("boxScore");
const nextPlayer = document.getElementById("nextPlayer");
nextPlayer.addEventListener('click', nextPlayerFunction);
let customUrl = "webservice/index.php";
let customData = [];
let cardCount = 0;
let boxCount = 0;
let playingPlayer = 0;
let playersScore = [];
let rotation = 0;
const angle = 90;
let roundOver = false

function init() {

    getApi(customUrl, setCustomData);

    makeRows(32, 32);

    const cardImage = document.createElement('img');
    cardImage.id = 'image';
    img.appendChild(cardImage);

    const antiClock = document.getElementById("antiClock");
    antiClock.addEventListener('click', antiClockFunction);

    const Clock = document.getElementById("Clock");
    Clock.addEventListener('click', ClockFunction);

    playerScoreBoard();

    scrollToMiddle();
}

function getApi(url, nextFunction) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error (${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(nextFunction)
        .catch(errorMessage);
}

function setCustomData(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].amount; j++) {
            customData.push(data[i]);
        }
    }

    for (let i = 0; i < customData.length; i++) {
        let itemWithoutAmount = {
            ...customData[i]
        };
        delete itemWithoutAmount.amount;
        itemWithoutAmount.id = i;
        customData[i] = itemWithoutAmount;
    }

    customData = shuffleArray(customData);
    changeImage(customData[cardCount]);
}

function playerScoreBoard() {
    for (let i = 0; i < playerAmount; i++) {
        const playerScoreBoard = document.createElement('div');
        playerScoreBoard.id = 'playerScoreBoard';
        playerScoreBoard.style.background = `rgba(${backgroundColors[i]}, 0.5)`; // Change 0.5 to your desired opacity value

        playerScoreBoard.dataset.cardNumber = i;

        let playingIndicator = document.createElement('div');
        playingIndicator.id = 'playingIndicator';
        if (i != playingPlayer) {
            playingIndicator.style.opacity = 0;
        }
        playerScoreBoard.appendChild(playingIndicator);

        let playerScore = document.createElement('p');
        playerScore.id = 'playerScore';
        playerScore.innerHTML = `Points: 0`;
        playerScoreBoard.appendChild(playerScore);

        let scoreUp = document.createElement('button');
        scoreUp.innerHTML = 'Up';
        scoreUp.addEventListener('click', scoreUpFunction);
        scoreUp.dataset.index = i;
        playerScoreBoard.appendChild(scoreUp);

        let scoreDown = document.createElement('button');
        scoreDown.innerHTML = 'Down';
        scoreDown.addEventListener('click', scoreDownFunction);
        scoreDown.dataset.index = i;
        playerScoreBoard.appendChild(scoreDown);


        boxScore.appendChild(playerScoreBoard);

        playersScore.push(0);
    }
}

function scoreUpFunction(e) {
    playersScore[e.target.dataset.index]++;
    updateScores();
}

function scoreDownFunction(e) {
    if (playersScore[e.target.dataset.index] > 0) {
        playersScore[e.target.dataset.index]--;
        updateScores();
    }
}

function updateScores() {
    const playerScoreBoards = document.querySelectorAll('#playerScoreBoard');  // Select all playerScoreBoard elements

    playerScoreBoards.forEach((scoreBoard, index) => {
        const scoreElement = scoreBoard.querySelector('#playerScore');  // Select the playerScore element inside the current playerScoreBoard
        if (scoreElement) {
            scoreElement.innerHTML = `Points: ${playersScore[index]}`;  // Update the innerHTML of the score element with the corresponding player's score
        }
    });
};

function antiClockFunction(e) {
    antiRotateImage();
    let numbersCopy = JSON.parse(JSON.stringify(customData[cardCount].numbers));
    numbersCopy.push(numbersCopy.shift());
    customData[cardCount].numbers = numbersCopy;
}

function ClockFunction(e) {
    rotateImage();
    let numbersCopy = JSON.parse(JSON.stringify(customData[cardCount].numbers));
    numbersCopy.unshift(numbersCopy.pop());
    customData[cardCount].numbers = numbersCopy;
}

function antiRotateImage() {
    rotation = (rotation - angle) % 360;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateImage() {
    rotation = (rotation + angle) % 360;
    img.style.transform = `rotate(${rotation}deg)`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function errorMessage(data) {
    console.log(data);
    alert(data)
}

function makeRows(rows, cols) {
    boxCount = rows * cols;
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    for (c = 0; c < (rows * cols); c++) {
        let cell = document.createElement("div");

        cell.addEventListener('click', clickCell);
        cell.dataset.index = (c + 1);
        cell.style.border = '1px solid green';

        if (Math.ceil((boxCount - rows) / 2) == c + 1) {
            cell.dataset.colorValues = [1, 2, 0, 2];

            let cardImage = document.createElement('img');
            cardImage.srcset = "https://wikicarpedia.com/images/3/36/Base_Game_C3_Tile_D.png";
            cardImage.id = 'cardImage';

            cell.appendChild(cardImage);
        } else {
            cell.innerText = (c + 1);
        }
        container.appendChild(cell).className = "grid-item";
    }
}

function clickCell(e) {
    if (roundOver !== false) {
        console.log('Round is over');
        alert('Round is over')
    } else if (e.target.dataset.colorValues) {
        console.log(e.target.dataset.colorValues);
    } else if (e.target.id == 'meeple') {
        e.target.parentNode.innerHTML = '';
    } else if (e.target.id == 'Grid') {
        let meeple = document.createElement('img');
        meeple.srcset = `images/${playerColors[playingPlayer]}-meeple.png`;
        meeple.id = 'meeple';
        e.target.appendChild(meeple);
    } else {
        const clickedIndex = parseInt(e.target.dataset.index);
        const gridWidth = 32;

        const row = Math.floor((clickedIndex - 1) / gridWidth) + 1;
        const column = (clickedIndex - 1) % gridWidth + 1;

        const oppositeTopIndex = row > 1 ? (row - 2) * gridWidth + column : 0;
        const oppositeRightIndex = column < gridWidth ? (row - 1) * gridWidth + column + 1 : 0;
        const oppositeBottomIndex = row < gridWidth ? row * gridWidth + column : 0;
        const oppositeLeftIndex = column > 1 ? (row - 1) * gridWidth + column - 1 : 0;

        const oppositeTopCell = document.querySelector(`[data-index="${oppositeTopIndex}"]`);
        const oppositeRightCell = document.querySelector(`[data-index="${oppositeRightIndex}"]`);
        const oppositeBottomCell = document.querySelector(`[data-index="${oppositeBottomIndex}"]`);
        const oppositeLeftCell = document.querySelector(`[data-index="${oppositeLeftIndex}"]`);

        let error = '';
        let nextCheck = false;

        if (oppositeTopCell && oppositeTopCell.dataset.colorValues) {
            const oppositeTopColors = oppositeTopCell.dataset.colorValues.split(',').map(Number);
            if (oppositeTopColors[2] !== customData[cardCount].numbers[0]) {
                error += `Top color does not match<br>`;
            }
            nextCheck = true;
        }

        if (oppositeRightCell && oppositeRightCell.dataset.colorValues) {
            const oppositeRightColors = oppositeRightCell.dataset.colorValues.split(',').map(Number);
            if (oppositeRightColors[3] !== customData[cardCount].numbers[1]) {
                error += `Right color does not match<br>`;
            }
            nextCheck = true;
        }

        if (oppositeBottomCell && oppositeBottomCell.dataset.colorValues) {
            const oppositeBottomColors = oppositeBottomCell.dataset.colorValues.split(',').map(Number);
            if (oppositeBottomColors[0] !== customData[cardCount].numbers[2]) {
                error += `Bottom color does not match<br>`;
            }
            nextCheck = true;
        }

        if (oppositeLeftCell && oppositeLeftCell.dataset.colorValues) {
            const oppositeLeftColors = oppositeLeftCell.dataset.colorValues.split(',').map(Number);
            if (oppositeLeftColors[1] !== customData[cardCount].numbers[3]) {
                error += `Left color does not match<br>`;
            }
            nextCheck = true;
        }

        if (nextCheck == false) {
            console.log('Not next other tile');
            alert('Not next other tile')
        } else if (error === '') {
            e.target.dataset.colorValues = customData[cardCount].numbers.join(',');
            e.target.innerHTML = '';
            let cardImage = document.createElement('div');
            cardImage.id = 'cardImage';
            cardImage.style.backgroundImage = `url(${customData[cardCount].img})`; // Set background image
            cardImage.style.transform = `rotate(${rotation}deg)`;
            cardImage.dataset.cardNumber = cardCount;

            const rows = 3;
            const cols = 3;
            const cellSize = 36; // Adjust as needed

            const gridContainer = document.createElement('div');
            gridContainer.style.display = 'grid';
            gridContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
            gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
            gridContainer.style.position = 'relative';

            // Add cells to the grid
            for (let i = 0; i < rows * cols; i++) {
                const cell = document.createElement('div');
                cell.dataset.index = i + 1;
                //cell.addEventListener('click', clickCell);
                //cell.style.border = '1px solid black';
                cell.id = 'Grid';
                gridContainer.appendChild(cell);
            }

            cardImage.appendChild(gridContainer);

            const rect = e.target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            e.target.appendChild(cardImage);

            cardCount++;
            changeImage(customData[cardCount]);
            roundOver = true

        } else {
            console.log(error);
            alert(error)
        }
    }
}

function changeImage(list) {
    if (list) {

        let image = document.getElementById("image");
        image.srcset = list.img;

        img.style.transform = `rotate(${0}deg)`;
        rotation = 0;
    } else {
        alert("The game is over");
    }

}

function scrollToMiddle() {
    const middlePositionY = (document.documentElement.scrollHeight - window.innerHeight) / 2;
    const middlePositionX = (document.documentElement.scrollWidth - window.innerWidth) / 2;

    window.scrollTo({
        top: middlePositionY,
        left: middlePositionX,
        behavior: 'smooth'
    });
}

function nextPlayerFunction() {
    if (playingPlayer + 1 == playerAmount) {
        playingPlayer = 0;
    } else {
        playingPlayer++;
    }
    const elements = document.querySelectorAll('#playerScoreBoard');

    elements.forEach(element => {
        if (element.dataset.cardNumber == playingPlayer) {
            element.querySelector('#playingIndicator').style.opacity = 1;
        } else {
            element.querySelector('#playingIndicator').style.opacity = 0;
        }
    });
    updateScores();
    roundOver = false
}