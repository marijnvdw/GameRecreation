window.addEventListener('load', init);

function init() {
    // const two = document.getElementById("two");
    // two.dataset.index = 2
    // two.addEventListener('click', SendToGame)
    //
    // const three = document.getElementById("three");
    // three.dataset.index = 3
    // three.addEventListener('click', SendToGame)
    //
    // const four = document.getElementById("four");
    // four.dataset.index = 4
    // four.addEventListener('click', SendToGame)
    //
    // const five = document.getElementById("five");
    // five.dataset.index = 5
    // five.addEventListener('click', SendToGame)
    //
    // const six = document.getElementById("six");
    // six.dataset.index = 6
    // six.addEventListener('click', SendToGame)

    // const save = document.getElementById("save");
    // save.dataset.index = 0
    // save.addEventListener('click', loadSave)

    const submit = document.getElementById("submit");
    submit.addEventListener('click', SendToGame)

    const cards = document.getElementById("cards");
    cards.addEventListener('click', loadCards)

    const elements3 = document.getElementsByName('names');
    let storedNames = localStorage.getItem('names');
    let names = JSON.parse(storedNames);

    [...elements3].forEach((element, index) => {
        if (names[index] !== "") {
            element.value = names[index];
        }
    });
}

function SendToGame(e) {
    e.preventDefault()

    const elements1 = document.getElementsByName('names');
    let names = [];
    let amount = 0;

    [...elements1].forEach(element => {
        names.push(element.value);
        if (element.value !== "") {
            amount++;
        }
    });

    localStorage.setItem('players', amount);
    localStorage.setItem('loadedFromRedirect', true);

    const elements = document.getElementsByName('radio');
    let versions = [];

    [...elements].forEach(element => {
        versions.push(element.checked);
    });

    localStorage.setItem('versions', JSON.stringify(versions));

    // const elements1 = document.getElementsByName('names');
    // let names = [];
    //
    // [...elements1].forEach(element => {
    //     names.push(element.value);
    // });

    localStorage.setItem('names', JSON.stringify(names));
    window.location.href = 'game.html';
}

function loadCards(e) {
    e.preventDefault()
    localStorage.setItem('loadedFromRedirect', true);
    window.location.href = 'cards.html';
}