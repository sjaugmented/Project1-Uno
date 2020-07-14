console.log('uno!')

// global variables - hands, scores, piles
const cpuHandDom = document.querySelector('.cpu-hand')
const playerHandDom = document.querySelector('.player-hand')

const cpuScoreDom = document.querySelector('#cpu-score')
const playerScoreDom = document.querySelector('#player-score')

const playPileDom = document.querySelector('.play-pile')
const drawPileDom = document.querySelector('.draw-pile')

const cpuHand = []
const playerHand = []
let topOfPlayPile;

class Card {
    constructor(color, value, points, changeTurn, drawValue, imgSrc) {
        this.color = color
        this.value = value
        this.point = points
        this.changeTurn = changeTurn
        this.drawValue = drawValue
        this.src = imgSrc
    }
}

function createCard(color) {
    for (let n = 0; n <= 14; n++) {
        // number cards
        if (n === 0) {
            deck.push(new Card(color, n, n, true, 0, 'images/' + color + n + '.png'))
        }
        else if (n > 0 && n <= 9) {
            deck.push(new Card(color, n, n, true, 0, 'images/' + color + n + '.png'))
            deck.push(new Card(color, n, n, true, 0, 'images/' + color + n + '.png'))
        }
        // reverse/skip
        else if (n === 10 || n === 11) {
            deck.push(new Card(color, n, 20, false, 0, 'images/' + color + n + '.png'))
            deck.push(new Card(color, n, n, true, 0, 'images/' + color + n + '.png'))
        }
        // draw 2
        else if (n === 12) {
            deck.push(new Card(color, n, 20, true, 2, 'images/' + color + n + '.png'))
            deck.push(new Card(color, n, n, true, 0, 'images/' + color + n + '.png'))
        }
        else if (n === 13) {
            deck.push(new Card('any', n, 50, true, 0, 'images/wild' + n + '.png'))
        }
        else {
            deck.push(new Card('any', n, 50, true, 4, 'images/wild' + n + '.png'))
        }
    }
}


const deck = []

const createDeck = () => {
    // destroy previous deck
    deck.length = 0
    // create new deck
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

function shuffleDeck(){
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
}

function dealCards() {
    for (let i = 0; i < 7; i++) {
        // deal cards into cpu/player arrays
        cpuHand.push(deck.shift())       
        playerHand.push(deck.shift())

        // put cards on the DOM
        const cpuCard = document.createElement('img')
        cpuCard.setAttribute('src', '/images/back.png')
        cpuCard.setAttribute('class', i)
        cpuHandDom.appendChild(cpuCard)

        const playerCard = document.createElement('img')
        playerCard.setAttribute('src', playerHand[i].src)
        playerCard.setAttribute('class', i)
        playerHandDom.appendChild(playerCard)
    }
}

function startPlayPile() {
    // set first play card to first card in the deck that is a number card
    const playCard = document.createElement('img')
    for (let i = 0; i < deck.length; i++) {
        if (deck[i].value < 10) {
            playCard.setAttribute('src', deck[i].src)
            topOfPlayPile = deck.shift()
            break
        }
        else deck.push(deck.shift())
    }
    playPileDom.appendChild(playCard)
}


const newHand = () => {
    // clear hands and play pile
    cpuHandDom.innerHTML = ''
    cpuHand.length = 0
    playerHandDom.innerHTML = ''
    playerHand.length = 0
    playPileDom.innerHTML = ''

    // create new deck
    createDeck()
    // shuffle deck
    shuffleDeck()
    // deal cards and first play card
    dealCards()
    // set down first play card that isn't an action card
    startPlayPile()
}

const startGame = () => {
    newHand()

    // set event listeners on playerHandDom and drawPileDom
    playerHandDom.addEventListener('click', (event) => {
        // use target's class to find card object in array
        let index = parseInt(event.target.getAttribute('class'))
        // if value or color matches topOfPlayPile OR color = 'any'
        if (playerHand[index].value === topOfPlayPile.value || playerHand[index].color === topOfPlayPile.color || playerHand[index].color === 'any') {
            console.log("You can play that card!")
            event.target.remove()
            topOfPlayPile = playerHand.splice(index, 1)
            playPileDom.setAttribute('src', topOfPlayPile.src)
        }
        else {
            alert("Sorry, you can't play that card...")
        }
    })

    drawPileDom.addEventListener('click', () => {

    })
}

startGame()