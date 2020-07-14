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

    console.log(deck) // TODO: remove
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
        cpuCard.setAttribute('class', 'cpu')
        cpuHandDom.appendChild(cpuCard)

        const playerCard = document.createElement('img')
        playerCard.setAttribute('src', playerHand[i].src)
        playerCard.setAttribute('class', 'player')
        playerCard.setAttribute('id', i)
        playerHandDom.appendChild(playerCard)
    }
}

function startPlayPile() {
    // find first card that isn't an action card
    const playCard = document.createElement('img')
    
    for (let i = 0; i < deck.length; i++) {
        if (deck[i].color !== "any" && deck[i].value <= 9) {
            console.log(deck[i]) // TODO: remove
            topOfPlayPile = deck.splice(i, 1)
            break
        }
    }
    // play card to the playPile
    playCard.setAttribute('src', topOfPlayPile[0].src)
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

function updateHand(handToUpdate, domToUpdate) {
    for (let i = 0; i < handToUpdate.length; i++) {
        const updatedCard = document.createElement('img')
        updatedCard.setAttribute('src', handToUpdate[i].src)
        updatedCard.setAttribute('class', 'player')
        // update ID's to match playerHand indexes
        updatedCard.setAttribute('id', i)
        domToUpdate.appendChild(updatedCard)
    }
}

const startGame = () => {
    newHand()

    // set event listeners on playerHandDom and drawPileDom
    playerHandDom.addEventListener('click', (event) => {
        console.log(event.target) // TODO: remove
        // use target's class to find card object in array
        let index = parseInt(event.target.getAttribute('id'))
        // if value or color matches topOfPlayPile OR color = 'any'
        if (playerHand[index].value === topOfPlayPile[0].value || playerHand[index].color === topOfPlayPile[0].color || playerHand[index].color === 'any' || topOfPlayPile[0].color === 'any') {
            console.log("You can play that card!")
            // set topOfPlayPile to target.src
            topOfPlayPile.length = 0
            let chosenCard = playerHand.splice(index, 1)
            topOfPlayPile.push(chosenCard[0])

            // clear the playPile
            playPileDom.innerHTML = ''

            // add played card to playPile
            const newCard = document.createElement('img')
            const imgSrc = topOfPlayPile[0].src
            console.log(imgSrc) // TODO:: remove
            newCard.setAttribute('src', imgSrc)
            playPileDom.appendChild(newCard)

            // check playerHand length and update DOM
            playerHandDom.innerHTML = ''
            if (playerHand.length > 1) {
                updateHand(playerHand, playerHandDom)
            } else if (playerHand.length === 1) {
                alert("You declare UNO!")
                updateHand(playerHand, playerHandDom)
            }
            else {
                alert("You won the round!")
            }
            
        }
        else {
            alert("Sorry, you can't play that card...")
        }
    })
    
    let areYouSure = false

    drawPileDom.addEventListener('click', () => {
        let anythingPlayable = false
        // check if anything is playable in playerHand
        for (let card in playerHand) {
            if (card.color === topOfPlayPile[0].color && card.value === topOfPlayPile[0].value && card.color === 'any' || topOfPlayPile[0].color === 'any') {
                anythingPlayable = true;
            }
            else anythingPlayable = false // TODO: remove - probably don't need thise
        }

        if (anythingPlayable) {
            if (!areYouSure) {
                alert("Are you sure?")
                areYouSure = true
            }
            else {
                // draw card
            }
        }
    })
}

startGame()


