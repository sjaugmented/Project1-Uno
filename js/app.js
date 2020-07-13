console.log('uno!')

// global variables - hands, scores, piles
const cpuHandDom = document.querySelector('.cpu-hand')
const playerHandDom = document.querySelector('.player-hand')

const cpuScoreDom = document.querySelector('#cpu-score')
const playerScoreDom = document.querySelector('#player-score')

const playPileDom = document.querySelector('.play-pile')
const drawPileDom = document.querySelector('.draw-pile')

class Card {
    constructor(color, value, points, changeTurn, drawValue, instance, imgSrc) {
        this.color = color
        this.value = value
        this.point = points
        this.changeTurn = changeTurn
        this.drawValue = drawValue
        this.instances = instance
        this.src = imgSrc
    }
    circulateCard() {
        if (instances > 0) instances--
        else console.log(`There are no more ${this.color} ${this.value}.`)
    }
}

function createCard(color) {
    for (let n = 0; n <= 14; n++) {
        // number cards
        if (n === 0) {
            deck.push(new Card(color, n, n, true, 0, 1, 'images/' + color + n + '.png'))
        }
        else if (n > 0 && n <= 9) {
            deck.push(new Card(color, n, n, true, 0, 2, 'images/' + color + n + '.png'))
        }
        // reverse/skip
        else if (n === 10 || n === 11) {
            deck.push(new Card(color, n, 20, false, 0, 2, 'images/' + color + n + '.png'))
        }
        // draw 2
        else if (n === 12) {
            deck.push(new Card(color, n, 20, true, 2, 2, 'images/' + color + n + '.png'))
        }
        else if (n === 13) {
            deck.push(new Card('any', n, 50, true, 0, 1, 'images/wild' + n + '.png'))
        }
        else {
            deck.push(new Card('any', n, 50, true, 4, 1, 'images/wild' + n + '.png'))
        }
    }
}


const deck = []

const createDeck = () => {
    // create everything except wild
    for (let i = 0; i <= 3; i++){
        if (i === 0) {
            createCard('red')
        }
        else if (i === 1) {
            createCard('green')
        }
        else if (i === 2) {
            createCard('blue')
        }
        else {
            createCard('yellow')
        }
    }

    console.log(deck)
}


const newHand = () => {
    cpuHandDom.innerHTML = ''
    playerHandDom.innerHTML = ''
}



