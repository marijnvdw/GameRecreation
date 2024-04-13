window.addEventListener('load', init);

const colors = ['green', 'brown', 'gray'];
let playerColors = ['yellow', 'red', 'green', 'blue', 'black', 'pink'];
let backgroundColors = ['227, 182, 70', '201, 67, 36', '81, 196, 75', '89, 126, 194', '94, 93, 115', '189, 89, 145'];
let playerAmount = 0;
const container = document.getElementById("main");
const previewImg = document.getElementById("previewImg");
const boxScore = document.getElementById("boxScore");
const nextPlayer = document.getElementById("nextPlayer");
const save = document.getElementById("save");
nextPlayer.addEventListener('click', nextPlayerFunction);
const debugButton = document.getElementById("debugButton");
debugButton.addEventListener('click', debugFunction);
let customUrl = "webservice/includes/actions.json";
let customData = [];
let cardCount = 0;
let boxCount = 0;
let playingPlayer = 0;
let playersScore = [];
let playersMeeples = [];
let rotation = 0;
const angle = 90;
let roundOver = false;
let recentTile = 0;
let computerPlacing = false;
let cardCountSave = 0;
let stage = 0; //tells in what stage it is
let placeThisRound = false;

function init() {

    if (localStorage.getItem('loadedFromRedirect') == 'true') {
        console.log("Page loaded from a redirect.");
        localStorage.setItem('loadedFromRedirect', false);
    } else {
        console.log("Page was refreshed.");
        window.location.href = 'index.html';
    }


    if (localStorage.getItem('players') !== '0') {
        playerAmount = localStorage.getItem('players');
        getApi(customUrl, setCustomData);
    } else {
        playerAmount = localStorage.getItem('playerAmount');
        getApi(customUrl, setCustomDataLocal);
        playersScore = JSON.parse(localStorage.getItem('playersScore'));
        playingPlayer = localStorage.getItem('playingPlayer');
    }

    makeRows(32, 32);

    const cardImage = document.createElement('img');
    cardImage.id = 'image';
    previewImg.appendChild(cardImage);

    const antiClock = document.getElementById("antiClock");
    antiClock.addEventListener('click', antiClockFunction);

    const Clock = document.getElementById("Clock");
    Clock.addEventListener('click', ClockFunction);

    //save.addEventListener('click', saveFunction);

    playerScoreBoard();

    scrollToMiddle();
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
    let versions = JSON.parse(localStorage.getItem('versions'))
    let waterTiles = []
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].amount; j++) {
            if (data[i].id === 24 || data[i].id === 35) {

            } else if (versions[1] === true && data[i].version === 1) {
                waterTiles.push(data[i]);
            } else if (versions[data[i].version] === true) {
                customData.push(data[i]);
            }
        }
    }
    console.log(waterTiles)
    console.log(customData)

    customData = shuffleArray(customData);

    if (versions[1] === true) {
        waterTiles = shuffleArray(waterTiles);
        waterTiles.push(data[35])

        for (let i = 0; i < waterTiles.length; i++) {
            let itemWithoutAmount = {
                ...waterTiles[i]
            };
            delete itemWithoutAmount.amount;
            itemWithoutAmount.id = i;
            itemWithoutAmount.tile = null;
            itemWithoutAmount.rotation = null;
            waterTiles[i] = itemWithoutAmount;
        }

        customData = waterTiles.concat(customData);
    }

    for (let i = 0; i < customData.length; i++) {
        let itemWithoutAmount = {
            ...customData[i]
        };
        delete itemWithoutAmount.amount;
        itemWithoutAmount.id = i;
        itemWithoutAmount.tile = null;
        itemWithoutAmount.rotation = null;
        customData[i] = itemWithoutAmount;
    }


    changeImage(customData[cardCount]);
    console.log(`Amount of cards is ${customData.length}`)
    console.log(customData)
    console.log(waterTiles)


}

function setCustomDataLocal(data) {
    console.log(data);
    customData = JSON.parse(localStorage.getItem('customData'));
    cardCountSave = localStorage.getItem('cardCount');
    playingPlayer = localStorage.getItem('playingPlayer');
    playersAmount = localStorage.getItem('playerAmount');
    playersScore = JSON.parse(localStorage.getItem('playersScore'));

    changeImage(customData[cardCountSave]);
    roundOver = false;
    var divElements = document.querySelectorAll('.grid-item');
    computerPlacing = true;
    //clickCell()
    for (let i = 0; i < cardCountSave; i++) {

        var event = new Event('click', {
            'bubbles': true,
            'cancelable': true
        });

        // Trigger the click event on the corresponding .grid-item element
        divElements[customData[i].tile - 1].dispatchEvent(event);
        roundOver = false;
    }
    computerPlacing = false;
}

function playerScoreBoard() {
    let storedNames = localStorage.getItem('names');
    let names = JSON.parse(storedNames);

    for (let j = 0; j < names.length; j++) {
        if (names[j] === "") {
            names.splice(j, 1);
            playerColors.splice(j, 1);
            backgroundColors.splice(j, 1);
            j--;
        }
    }
    console.log(playerColors)

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


        let playerName = document.createElement('p');
        playerName.id = 'playerName';
        playerName.innerHTML = `name: ${names[i]}`;

        playerScoreBoard.appendChild(playerName);


        let playerScore = document.createElement('p');
        playerScore.id = 'playerScore';
        if (playersScore[i] != undefined) {
            playerScore.innerHTML = `Points: ${playersScore[i]}`;
        } else {
            playersScore.push(0);
            playerScore.innerHTML = `Points: 0`;
        }
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

        playersMeeples.push([7]);

        let playerMeeples = document.createElement('p');
        playerMeeples.innerHTML = playersMeeples[i];
        playerMeeples.id = 'playerMeeples';
        playerScoreBoard.appendChild(playerMeeples);

        boxScore.appendChild(playerScoreBoard);
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

function updateMeeples() {
    const playerScoreBoards = document.querySelectorAll('#playerScoreBoard');  // Select all playerScoreBoard elements

    playerScoreBoards.forEach((scoreBoard, index) => {
        const scoreElement = scoreBoard.querySelector('#playerMeeples');  // Select the playerScore element inside the current playerScoreBoard
        if (scoreElement) {
            scoreElement.innerHTML = `${playersMeeples[index]}`;  // Update the innerHTML of the score element with the corresponding player's score
        }
    });
};

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
    previewImg.style.transform = `rotate(${rotation}deg)`;
}

function rotateImage() {
    rotation = (rotation + angle) % 360;
    previewImg.style.transform = `rotate(${rotation}deg)`;
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
    alert(data);
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
        cell.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            alert(`success! ${e.target.dataset.index}`);

            return false;
        }, false);

        if (Math.ceil((boxCount - rows) / 2) == c + 1) {

            let versions = JSON.parse(localStorage.getItem('versions'))
            let cardImage = document.createElement('img');
            if (versions[1] === false) {
                cell.dataset.colorValues = [1, 2, 0, 2];
                cardImage.srcset = "images/Tiles/Base_Game/Base_Game_C3_Tile_D.png";
                cardImage.id = 'cardImage';
            } else {
                cell.dataset.colorValues = [0, 0, 5, 0];
                cardImage.srcset = "images/Tiles/River/River_I_C2_Tile_A.jpg";
                cardImage.id = 'cardImage';
            }
            cell.appendChild(cardImage);
        } else {
            cell.innerText = (c + 1);
        }
        container.appendChild(cell).className = "grid-item";
    }
}

function clickCell(e) {

    if (e.target.id === 'meeple') {
        e.target.parentNode.innerHTML = '';
        playersMeeples[e.target.dataset.index]++;
        if (parseInt(e.target.dataset.number) === cardCount) {
            placeThisRound = false;
        }
        updateMeeples();
    } else if (e.target.id === 'Grid') {
        if (recentTile === e.target.parentElement.parentElement.parentElement.dataset.index) {
            if (e.target.className === 'available') {
                if (playersMeeples[playingPlayer] != 0) {
                    if (!placeThisRound) {
                        playersMeeples[playingPlayer]--;
                        updateMeeples();
                        let meeple = document.createElement('img');
                        meeple.srcset = `images/meeples/${playerColors[playingPlayer]}-meeple.png`;
                        meeple.id = 'meeple';
                        meeple.dataset.index = playingPlayer;
                        meeple.dataset.number = cardCount;
                        placeThisRound = true;

                        let div = e.target.parentElement.parentElement;
                        let currentRotation = getRotationAngle(div);
                        let oppositeRotation = (360 - currentRotation) % 360;
                        meeple.style.transform = `rotate(${oppositeRotation}deg)`;

                        e.target.appendChild(meeple);
                    } else {
                        alert('There is already a meeple placed this round');
                    }
                } else {
                    alert('You don\'t have enough meeples');
                }
            } else {
                alert('This place is not available');
            }
        } else {
            alert('This is not the recent laid tile');
        }
    } else if (roundOver !== false) {
        console.log('Round is over');
        alert('Round is over');
    } else {
        let error = '';
        nextCheck = true;
        if (!computerPlacing) {
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

            nextCheck = false;

            if (oppositeTopCell && oppositeTopCell.dataset.colorValues) {
                const oppositeTopColors = oppositeTopCell.dataset.colorValues.split(',').map(Number);
                if (oppositeTopColors[2] !== customData[cardCount].numbers[0]) {
                    error += `Top color does not match`;
                }
                nextCheck = true;
            }

            if (oppositeRightCell && oppositeRightCell.dataset.colorValues) {
                const oppositeRightColors = oppositeRightCell.dataset.colorValues.split(',').map(Number);
                if (oppositeRightColors[3] !== customData[cardCount].numbers[1]) {
                    error += `Right color does not match`;
                }
                nextCheck = true;
            }

            if (oppositeBottomCell && oppositeBottomCell.dataset.colorValues) {
                const oppositeBottomColors = oppositeBottomCell.dataset.colorValues.split(',').map(Number);
                if (oppositeBottomColors[0] !== customData[cardCount].numbers[2]) {
                    error += `Bottom color does not match`;
                }
                nextCheck = true;
            }

            if (oppositeLeftCell && oppositeLeftCell.dataset.colorValues) {
                const oppositeLeftColors = oppositeLeftCell.dataset.colorValues.split(',').map(Number);
                if (oppositeLeftColors[1] !== customData[cardCount].numbers[3]) {
                    error += `Left color does not match`;
                }
                nextCheck = true;
            }
        }
        if (nextCheck == false) {
            console.log('Not next other tile');
            alert('Not next other tile');
        } else if (error === '') {
            if (!computerPlacing) {
                recentTile = e.target.dataset.index;
                customData[cardCount].tile = recentTile;
                customData[cardCount].rotation = rotation;
            } else {
                rotation = customData[cardCount].rotation;
            }

            e.target.dataset.colorValues = customData[cardCount].numbers.join(',');
            e.target.innerHTML = '';
            let cardImage = document.createElement('div');
            cardImage.id = 'cardImage';
            cardImage.style.backgroundImage = `url(images/Tiles/${customData[cardCount].img})`; // Set background image
            cardImage.style.transform = `rotate(${rotation}deg)`;
            cardImage.dataset.cardNumber = cardCount;

            const rows = 3;
            const cols = 3;
            const cellSize = 36; // Adjust as needed
            const properties = customData[cardCount].properties;
            const gridContainer = document.createElement('div');
            gridContainer.style.display = 'grid';
            gridContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
            gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
            gridContainer.style.position = 'relative';

            // Add cells to the grid
            for (let i = 0; i < rows * cols; i++) {
                const cell = document.createElement('div');
                cell.dataset.index = i + 1;
                cell.id = 'Grid';
                if (properties[i] === 1 || properties[i] === 2 || properties[i] === 3) {
                    cell.className = 'available';
                }
                gridContainer.appendChild(cell);
            }

            cardImage.appendChild(gridContainer);

            const rect = e.target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            e.target.appendChild(cardImage);
            //if (!computerPlacing) {
            cardCount++;
            //}
            let image = document.getElementById("image");
            image.srcset = 'https://wikicarpedia.com/images/6/67/New_rules_regular_back.png';
            image.style.height = '110px';
            image.style.width = '110px';

            previewImg.style.transform = `rotate(${0}deg)`;
            rotation = 0;
            roundOver = true;
            stage = 1;

            reverseButtons();
        } else {
            console.log(error);
            alert(error);
        }
    }
}

function reverseButtons() {
    let antiClock = document.getElementById("antiClock");
    antiClock.disabled = !antiClock.disabled;

    let Clock = document.getElementById("Clock");
    Clock.disabled = !Clock.disabled;

    let nextPlayer = document.getElementById("nextPlayer");
    nextPlayer.disabled = !nextPlayer.disabled;

}

function saveFunction() {
    console.log('save');
    console.log(customData);
    console.log(cardCount);
    console.log(playingPlayer);
    console.log(playerAmount);

    localStorage.setItem('customData', JSON.stringify(customData));
    localStorage.setItem('cardCount', cardCount.toString());
    localStorage.setItem('playingPlayer', playingPlayer.toString());
    localStorage.setItem('playerAmount', playerAmount.toString());
    localStorage.setItem('playersScore', JSON.stringify(playersScore));
}


function getRotationAngle(element) {
    let style = window.getComputedStyle(element);
    let transform = style.transform || style.webkitTransform || style.mozTransform;
    let matrix = new DOMMatrixReadOnly(transform);

    // Extract the rotation angle from the matrix
    let angle = Math.atan2(matrix.b, matrix.a);
    let deg = angle * (180 / Math.PI);

    // Ensure angle is positive
    if (deg < 0) {
        deg += 360;
    }

    return deg;
}


function changeImage(list) {
    if (list) {

        let image = document.getElementById("image");
        //image.srcset = `https:wikicarpedia.com/images/${list.img}`;

        image.srcset = `images/Tiles/${list.img}`;

        previewImg.style.transform = `rotate(${0}deg)`;
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
    if (stage !== 0) {
        stage = 0;
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
        roundOver = false;
        removeAvailableClass();
        reverseButtons();
        placeThisRound = false;
        changeImage(customData[cardCount]);
    }
}

function removeAvailableClass() {
    // Get all elements with the class 'available'
    var elements = document.querySelectorAll('.available');

    // Loop through each element and remove the class 'available'
    elements.forEach(function (element) {
        element.classList.remove('available');
    });
}

function debugFunction() { // ${}
    console.log(`${playerAmount} ${playingPlayer}`)
}