window.addEventListener('load', init);

function init () {
    const two = document.getElementById("two");
    two.addEventListener('click', twoPlayers)

    const three = document.getElementById("three");
    three.addEventListener('click', threePlayers)

    const four = document.getElementById("four");
    four.addEventListener('click', fourPlayers)

    const five = document.getElementById("five");
    five.addEventListener('click', fivePlayers)

    const six = document.getElementById("six");
    six.addEventListener('click', sixPlayers)
}

function twoPlayers(e) {
    e.preventDefault()
    localStorage.setItem('players', '2');
    window.location.href = 'game.html';
}

function threePlayers(e) {
    e.preventDefault()
    localStorage.setItem('players', '3');
    window.location.href = 'game.html';
}

function fourPlayers(e) {
    e.preventDefault()
    localStorage.setItem('players', '4');
    window.location.href = 'game.html';
}

function fivePlayers(e) {
    e.preventDefault()
    localStorage.setItem('players', '5');
    window.location.href = 'game.html';
}

function sixPlayers(e) {
    e.preventDefault()
    localStorage.setItem('players', '6');
    window.location.href = 'game.html';
}