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
let playPile;

let cpuScore = 0;
let playerScore = 0;

let playerTurn = true

class Card {
    constructor(color, value, points, changeTurn, drawValue, imgSrc) {
        this.color = color
        this.value = value
        this.points = points
        this.changeTurn = changeTurn
        this.drawValue = drawValue
        this.src = imgSrc
        this.playedByPlayer = false
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
            deck.push(new Card(color, n, 20, false, 0, 'images/' + color + n + '.png'))
        }
        // draw 2
        else if (n === 12) {
            deck.push(new Card(color, n, 20, false, 2, 'images/' + color + n + '.png'))
            deck.push(new Card(color, n, 20, false, 2, 'images/' + color + n + '.png'))
        }
        else if (n === 13) {
            deck.push(new Card('any', n, 50, true, 0, 'images/wild' + n + '.png'))
        }
        else {
            deck.push(new Card('any', n, 50, false, 4, 'images/wild' + n + '.png'))
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

function shuffleDeck(deck){
    console.log('shuffling', deck)  // TODO: remove
    for (let i = deck.length - 1; i > 0; i--) {
        deck[i].playedByPlayer = false
        let j = Math.floor(Math.random() * (i + 1))
        let temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
    console.log(deck, 'shuffled') // TODO: remove
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
            playPile = deck.splice(i, 1)
            break
        }
    }
    // play card to the playPile
    playCard.setAttribute('src', playPile[0].src)
    playPileDom.appendChild(playCard)
}


const newHand = () => {
    console.log('new hand')
    // clear hands and play pile
    cpuHandDom.innerHTML = ''
    cpuHand.length = 0
    playerHandDom.innerHTML = ''
    playerHand.length = 0
    playPileDom.innerHTML = ''

    // create new deck
    createDeck()
    // shuffle deck
    shuffleDeck(deck)
    // deal cards and first play card
    dealCards()
    // set down first play card that isn't an action card
    startPlayPile()
}

function updateHand(handToUpdate) {
    let domToUpdate, src, cardClass;

    if (handToUpdate === cpuHand) {
        domToUpdate = cpuHandDom
        cardClass = 'cpu'
    }
    else {
        domToUpdate = playerHandDom
        cardClass = 'player'
    }
    
    domToUpdate.innerHTML = ''

    for (let i = 0; i < handToUpdate.length; i++) {
        let src

        if (domToUpdate === cpuHandDom) {
            src = 'images/back.png'
        } 
        else {
            src = handToUpdate[i].src
        } 

        const updatedCard = document.createElement('img')
        updatedCard.setAttribute('src', src)
        updatedCard.setAttribute('class', cardClass)
        // update ID's to match playerHand indexes
        updatedCard.setAttribute('id', i)
        domToUpdate.appendChild(updatedCard)
    }
}

function drawCard(handGetsCard) {
    if (deck.length > 0) {
        const newCard = deck.shift()
        handGetsCard.push(newCard)
        console.log(handGetsCard, 'drew one card') // TODO: remove
    }
    else {
        // shuffle playPile
        deck = shuffleDeck(playPile)
        playPile.length = 0
    }
    
    updateHand(handGetsCard)
}

function tallyPoints(loserHand) {
    let points = 0

    for (const card of loserHand) {
        points += card.points
    }

    if (loserHand == cpuHand) {
        cpuScore += points
    }
    else {
        playerScore += points
    }
}

function updateScores() {
    // update cpuScoreDom
    cpuScoreDom.innerHTML = cpuScore
    if (cpuScore < 250) cpuScoreDom.style.color = 'rgb(0, 140, 0)'
    else cpuScoreDom.style.color = 'rgb(121, 2, 2)'

    // update playerScoreDom
    playerScoreDom.innerHTML = playerScore
    if (playerScore < 250) playerScoreDom.style.color = 'rgb(0, 140, 0)'
    else playerScoreDom.style.color = 'rgb(121, 2, 2)'
}

// TODO: maybe come back to this?
// function changeTurn() {
//     playerTurn = !playerTurn
//     if (playerTurn) {

//     }
//     else {

//     }
// }

function checkForWinner() {
    if (playerScore < 500 && cpuScore < 500) {
        newHand()
        playerTurn = !playerTurn

        // if (playerTurn) alert('You begin the next round.') // TODO: remove
        // else alert('CPU begins the next round.')
    }
        
    else {
        // game over
        if (playerScore > 500)
            alert('You lost the game.') // TODO: make an element rather than alert
        if (cpuScore > 500)
            alert('You won the game!')
    }
}

function showPlayerTurnOnDom() {
    if (playerTurn) {
        document.querySelector('.player-score-title').style.color = 'rgb(100, 150, 150)'
        document.querySelector('.cpu-score-title').style.color = 'rgb(6, 37, 62)'
        // document.querySelector('.player-score-title').style.textDecorationLine = 'underline'
        // document.querySelector('.player-score-title').style.textDecorationThickness = '2px'
        // document.querySelector('.cpu-score-title').style.textDecorationLine = ''
        // document.querySelector('.cpu-score-title').style.textDecorationThickness = ''
    }
    else {
        document.querySelector('.player-score-title').style.color = 'rgb(6, 37, 62)'
        document.querySelector('.cpu-score-title').style.color = 'rgb(100, 150, 150)'
        // document.querySelector('.player-score-title').style.textDecorationLine = ''
        // document.querySelector('.player-score-title').style.textDecorationThickness = ''
        // document.querySelector('.cpu-score-title').style.textDecorationLine = 'underline'
        // document.querySelector('.cpu-score-title').style.textDecorationThickness = '2px'
    }
}

function cpuTurn() {
    // first check if top of playPile is drawCard
    if (playPile[playPile.length - 1].playedByPlayer === true && playPile[playPile.length - 1].drawValue > 0) {
        // add however many cards
        for (let i = 0; i < playPile[playPile.length - 1].drawValue; i++) {
            drawCard(cpuHand)
        }
    }
    
    if (!playerTurn) {
        // create temp array of playable cards based on last card played
        let chosenCard

        console.log('cpu beginning turn with the following hand') // TODO: remove
        console.log(cpuHand) // TODO: remove
        
        
        
        const playable = determinePlayableCards()

        // if no playable cards
        if (playable.length === 0) {
            console.log('no cards to play') // TODO: remove
            // draw card
            drawCard(cpuHand)
            // end turn
            console.log('cpu ending turn') // TODO: remove
            playerTurn = true
        }
        //if one playable card
        else if (playable.length === 1) {
            chosenCard = playable
            playCPUCard(chosenCard[0])
        }
        // if more than one playable cards
        else if (playable.length > 1) {
            console.log('cpu has', playable.length, 'playable cards')
            let highCardIndex
            let lowCardIndex
            let strategist = Math.random()
            console.log('strategist:', strategist) // TODO: remove
            
            // run strategist to determine strategy
            // if strategist > 0.5 || playerHand <= 3
            if (strategist > 0.7 || playerHand.length < 3 || cpuHand.length > playerHand.length * 2) {
                // prioritize action/high point cards
                let highestValue = 0

                for (let i = 0; i < playable.length; i++){
                    if (playable[i].value > highestValue) {
                        highestValue = playable[i].value
                        highCardIndex = i
                    }
                }

                // play card determined by strategist
                // remove card from playable
                chosenCard = playable.splice(highCardIndex, 1)

                // return playable to cpuHand
                if (playable.length > 0) {
                    for (const card of playable) {
                        cpuHand.push(card)
                    }
                }

                console.log('cpu chose high card') // TODO: remove
                console.log(chosenCard[0])  // TODO: remove

                playCPUCard(chosenCard[0])   

            }

            else {
                // else prioritize color || number cards
                let lowestValue = 9

                for (let i = 0; i < playable.length; i++){
                    if (playable[i].value < lowestValue) {
                        lowestValue = playable[i].value
                        lowCardIndex = i
                    }
                }

                // play card determined by strategist
                // remove card from playable
                chosenCard = playable.splice(lowCardIndex, 1)

                // return playable to cpuHand
                if (playable.length > 0) {
                    for (const card of playable) {
                        cpuHand.push(card)
                    }
                }

                console.log('cpu chose low card') // TODO: remove
                console.log(chosenCard[0])  // TODO: remove

                playCPUCard(chosenCard[0])   
            }            
        }
    }

    function playCPUCard(chosenCard) {
        // make topOfPlayPile removed card
        console.log('playing card:') // TODO: remove
        console.log(chosenCard)
        playPile.push(chosenCard)
        // update playPileDom
        playPileDom.innerHTML = ''
        const newCardImg = document.createElement('img')
        const imgSrc = playPile[playPile.length - 1].src

        newCardImg.setAttribute('src', imgSrc)
        playPileDom.appendChild(newCardImg)

        // check if cpu played wild
        if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0) {
            console.log('cpu played a wild') // TODO: remove
            chooseColorAfterWild()
        }

        // check cpuHand length and update cpuHandDom
        if (cpuHand.length > 1) {
            updateHand(cpuHand)
        }
        // determine uno
        else if (cpuHand.length === 1) {
            updateHand(cpuHand)
            showUno(cpuHand)
        }
        // if end of round
        else {
            // tally points & update scores
            tallyPoints(playerHand)
            updateScores()
            alert("CPU won the round!") // TODO: make element rather than alert

            // next hand if both scores < 500
            checkForWinner()
        }

        // if cpu played a draw card
        if (chosenCard.drawValue > 0) {
            // alert('cpu played a +' + chosenCard.drawValue + ' card!')
            hitWithDrawCard()
            console.log('cpu played a +' + chosenCard.drawValue + ' card!')
            for (let i = 0; i < chosenCard.drawValue; i++) {
                drawCard(playerHand)
            }
        }

        // determine changeTurn based on played card
        if (chosenCard.changeTurn) {
            // if changeTurn, playerTurn = true
            console.log('cpu has finished its turn') // TODO: remove
            playerTurn = true
        }
        else {
            // else cpuTurn() again
            console.log('cpu goes again') // TODO: remove
            setTimeout(cpuTurn, 1500)

        }
    }

    function determinePlayableCards() {
        const playableCards = []
        
        // check if playPile is wild
        if (playPile[playPile.length - 1].color === 'any') {
            // all cards playable
            console.log('last played card is wild') // TODO: remove
            
            // OF array not IN object!
            for (const card of cpuHand) {
                playableCards.push(card)
            }

            cpuHand.length = 0

            console.log('playable cards')
            console.log(playableCards) // TODO: remove
        }
        // if not wild, compare cpuHand to top of play pile
        else {
            console.log('last card played:') // TODO: remove
            console.log(playPile[playPile.length - 1])
            for (let i = 0; i < cpuHand.length; i++) {
                if (cpuHand[i].color === playPile[playPile.length - 1].color || cpuHand[i].value === playPile[playPile.length - 1].value || cpuHand[i].color === 'any') {
                    let validCard = cpuHand.splice(i, 1)
                    playableCards.push(validCard[0])
                }
            }
            console.log('playable cards:')
            console.log(playableCards) // TODO: remove
        }
        return playableCards
    }

    function chooseColorAfterWild() {
        console.log('cpu picking new color') // TODO: remove
        const colors = ['red', 'green', 'blue', 'yellow']
        const colorsInHand = [0, 0, 0, 0]

        // cpu checks how many of each color it has
        for (const card of cpuHand) {
            if (card.color === 'red') colorsInHand[0]++
            if (card.color === 'green') colorsInHand[1]++
            if (card.color === 'blue') colorsInHand[2]++
            if (card.color === 'yellow') colorsInHand[3]++
        }

        // find the index of the max value
        let indexOfMax
        let colorCount = 0
        for (let i = 0; i < colorsInHand.length; i++) {
            if (colorsInHand[i] > colorCount) {
                colorCount = colorsInHand[i]
                indexOfMax = i
            } 
        }

        console.log('cpu picked', colors[indexOfMax]) // TODO: remove

        // style the wild card and it's color
        const wildCardDom = playPileDom.childNodes[0]
        wildCardDom.style.border = '5px solid ' + colors[indexOfMax]
        wildCardDom.style.width = '105px'
        playPile[playPile.length - 1].color = colors[indexOfMax]

        console.log('cpu added border to wild card') // TODO: remove

        
        // let selection = Math.ceil(Math.Random * 4)
        // let color;

        // if (selection === 1) {
        //     playPile.style.border = '5px solid red'
        // } 
        // else if (selection === 2) playPile.style.border = '5px solid green'
        // else if (selection === 3) playPile.style.border = '5px solid blue'
        // else if (selection === 4) playPile.style.border = '5px solid red'
    }
}

function showUno(unoHand) {
    if (unoHand === playerHand) {
        const playerUno = document.querySelector('.player-animation')

        // write logic to remove hidden class from player-uno div
        playerUno.classList.remove('hidden')
        console.log('removed HIDDEN from', playerUno)

        // add shout class
        playerUno.classList.add('shout')
        console.log('added SHOUT to', playerUno)
        //setTimeout = after x seconds remove shout
        setTimeout(() => {
            playerUno.classList.remove('shout')
            console.log('removed SHOUT from', playerUno)
        }, 1000)
        // setTimeout = after x seconds re-add hidden
        setTimeout(() => {
            playerUno.classList.add('hidden')
            console.log('added HIDDEN to', playerUno)
        }, 1000)
    }
    else {
        const cpuUno = document.querySelector('.cpu-animation')

        // write logic to remove hidden class from player-uno div
        cpuUno.classList.remove('hidden')

        // add shout class
        cpuUno.classList.add('shout')
        // setTimeout = after x seconds remove shout
        setTimeout(() => {
            cpuUno.classList.remove('shout')
        }, 500)
        // setTimeout = after x seconds re-add hidden
        setTimeout(() => {
            cpuUno.classList.add('hidden')
        }, 500)
    }
}

function hitWithDrawCard() {
    playPileDom.classList.add('shout')
    setTimeout(() => {
        playPileDom.classList.remove('shout')
    }, 1000)
}

function showColorPicker() {
    // show the color picker
    const colorPicker = document.querySelector('.color-picker')
    colorPicker.style.opacity = 1

    //assign eventHandler's to buttons
    document.querySelector('.red').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor(e.target.className)
    })
    document.querySelector('.green').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor(e.target.className)
    })
    document.querySelector('.blue').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor(e.target.className)
    })
    document.querySelector('.yellow').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor(e.target.className)
    })
}

function chooseColor(className) {
    //assign the color to the wild on top of the play pile
    playPile[playPile.length - 1].color = className

    // hide the color picker
    const colorPicker = document.querySelector('.color-picker')
    colorPicker.style.opacity = 0

    skipOrEndTurn()
}

function skipOrEndTurn() {
    // check if changeTurn or skip
    if (playPile[playPile.length - 1].changeTurn) {
        playerTurn = false

        // cpu's turn
        setTimeout(cpuTurn, 1500)
    }
}

///////START GAME////////
const startGame = () => {
    listenForDevMode()
    setInterval(showPlayerTurnOnDom, 100)
    newHand()
    updateScores()


    // set event listeners on playerHandDom and drawPileDom
    // playerHandDom
    playerHandDom.addEventListener('click', (event) => {
        if (playerTurn && event.target.getAttribute('id')) {

            const lastCardDom = playPileDom.childNodes[0]
            lastCardDom.style.border = 'none'
            lastCardDom.style.width = '100px'

            // use target's ID to find card object in array
            let index = parseInt(event.target.getAttribute('id'))
            
            // if value or color matches topOfPlayPile OR color = 'any'
            if (playerHand[index].value === playPile[playPile.length - 1].value || playerHand[index].color === playPile[playPile.length - 1].color || playerHand[index].color === 'any' || playPile[playPile.length - 1].color === 'any') {            
                // set topOfPlayPile to target.src
                //topOfPlayPile.length = 0
                let cardToPlay = playPlayerCard(index)

                // invoke cpuTurn to add cards if there are any to add
                cpuTurn()

                // check playerHand length and update DOM
                if (playerHand.length > 1) {
                    updateHand(playerHand)
                }
                else if (playerHand.length === 1) {
                    updateHand(playerHand)
                    // TODO: showUno()
                    showUno(playerHand)
                }
                else {
                    // tally points
                    tallyPoints(cpuHand)
                    updateScores()
                    alert("You won the round!")

                    // next hand if both scores < 500
                    checkForWinner()
                }

                //check if wild
                if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0) {
                    // set new color
                    showColorPicker()
                    return
                }

                skipOrEndTurn();
                
                
            }
            else {
                // alert("Can't play that card, bro.")
                // TODO: do you want to do anything here?
            }
        }
    })
    
    let areYouSure = false

    drawPileDom.addEventListener('click', () => {
        if (playerTurn) {
            let anythingPlayable;

            // check if anything is playable in playerHand
            for (let i = 0; i < playerHand.length; i++) {
                if (playerHand[i].color === playPile[playPile.length - 1].color || playerHand[i].value === playPile[playPile.length - 1].value || playerHand[i].color === 'any' || playPile[playPile.length - 1].color === 'any') {
                    anythingPlayable = true;
                    break
                }
                else anythingPlayable = false // TODO: remove - probably don't need this
            }

            if (!anythingPlayable) {
                // draw card
                drawCard(playerHand)
                playerTurn = false;
                setTimeout(cpuTurn, 1500)
            }
            else {
                if (!areYouSure) {
                    // alert("You sure, bro?")
                    // TODO: wiggle a playable card or something
                    areYouSure = true
                }
                else {
                    // draw card
                    drawCard(playerHand)
                    areYouSure = false;
                    playerTurn = false
                    setTimeout(cpuTurn, 1500)
                }
            }
        }
    })
}

function playPlayerCard(index) {
    let cardToPlay = playerHand.splice(index, 1)
    cardToPlay[0].playedByPlayer = true
    playPile.push(cardToPlay[0])

    // clear the playPile
    playPileDom.innerHTML = ''

    // add played card to playPile
    const newCard = document.createElement('img')
    const imgSrc = playPile[playPile.length - 1].src
    newCard.setAttribute('src', imgSrc)
    playPileDom.appendChild(newCard)
    return cardToPlay
}

function listenForDevMode() {
    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase()

        if (key === 'p') {
            playerTurn = true;
            console.log('forced playerTurn', playerTurn)
        }
    })
}

startGame()






