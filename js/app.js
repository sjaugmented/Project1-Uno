console.log('uno!')

// global variables - hands, scores, piles
const cpuHandDom = document.querySelector('.cpu-hand')
const playerHandDom = document.querySelector('.player-hand')

const cpuScoreDom = document.querySelector('#cpu-score')
const playerScoreDom = document.querySelector('#player-score')

const playPileDom = document.querySelector('.play-pile')
const drawPileDom = document.querySelector('.draw-pile')

const playerUno = document.querySelector('.player-animation')
const cpuUno = document.querySelector('.cpu-animation')

const cpuHand = []
const playerHand = []
let playPile;

let cpuScore = 0;
let playerScore = 0;

let playerTurn = true

let cpuDelay = Math.floor((Math.random() * cpuHand.length * 200) + 1500)

let gameOver = 100

// audio objects
const shuffleFX = new Audio('audio/shuffle.wav')
const playCardFX = new Audio('audio/playCardNew.wav')
const drawCardFX = new Audio('audio/drawCard.wav')
const winRoundFX = new Audio('audio/winRound.wav')
const winGameFX = new Audio('audio/winGame.wav')
const loseFX = new Audio('audio/lose.wav')
const plusCardFX = new Audio('audio/plusCard.wav')
const unoFX = new Audio('audio/uno.wav')

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
    shuffleFX.play()
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
        shuffleDeck(playPile)
        for (let i = 0; i <= playPile.length - 1; i++) {
            deck.push(playPile[i])
        }
        playPile.length = 1

        const newCard = deck.shift()
        handGetsCard.push(newCard)
        console.log(handGetsCard, 'drew one card') // TODO: remove
    }
    drawCardFX.play()
    updateHand(handGetsCard)

    // const drawnCard = document.createElement('img')
    // drawnCard.setAttribute('src', 'images/back.png')
    // drawPileDom.appendChild(drawnCard)

    // if (handGetsCard === playerHand) {
    //     drawnCard.setAttribute('class', 'cpu-play-card')
    // }
    // else {
    //     drawnCard.setAttribute('class', 'play-card')
    // }
    // drawCardFX.play()
    
    // setTimeout(() => {
    //     drawnCard.remove()
    //     updateHand(handGetsCard)
    // }, 350)
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
    if (cpuScore < gameOver / 2) cpuScoreDom.style.color = 'rgb(0, 140, 0)'
    else cpuScoreDom.style.color = 'rgb(121, 2, 2)'

    // update playerScoreDom
    playerScoreDom.innerHTML = playerScore
    if (playerScore < gameOver / 2) playerScoreDom.style.color = 'rgb(0, 140, 0)'
    else playerScoreDom.style.color = 'rgb(121, 2, 2)'
}

function checkForWinner() {
    if (playerScore < gameOver && cpuScore < gameOver) {
        if (playerHand.length === 0) {
            winRoundFX.play()
            endRound('You')
        }
        else {
            loseFX.play()
            endRound('CPU')
        }

        newHand()
        playerTurn = !playerTurn

        // if (playerTurn) alert('You begin the next round.') // TODO: remove
        // else alert('CPU begins the next round.')
    }
        
    else {
        // game over
        if (playerScore > gameOver)
            //alert('You lost the game.') // TODO: make an element rather than alert
            loseFX.play()
            endGame('CPU')
        if (cpuScore > gameOver)
            //alert('You won the game!')
            winGameFX.play()
            endGame('You')
    }
}

function showTurnOnDom() {
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
        
        //animate random card from cpuHandDom
        const cpuDomCards = cpuHandDom.childNodes
        cpuDomCards[Math.floor(Math.random() * cpuDomCards.length)].classList.add('cpu-play-card')
        console.log('animating CPU card')
        playCardFX.play()
        
        setTimeout(() => {
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
                showUno(cpuUno)
            }
            // if end of round
            else {
                // tally points & update scores
                tallyPoints(playerHand)
                updateScores()
                //alert("CPU won the round!") // TODO: make element rather than alert
                // loseFX.play()
                // endRound('CPU')

                // next hand if both scores < gameOver
                checkForWinner()
            }

            // if cpu played a draw card
            if (chosenCard.drawValue > 0) {
                // alert('cpu played a +' + chosenCard.drawValue + ' card!')
                console.log('cpu played a +' + chosenCard.drawValue + ' card!')
                hitWithDrawCard()
                setTimeout(() => {
                    for (let i = 0; i < chosenCard.drawValue; i++) {
                        drawCard(playerHand)
                    }
                    if (chosenCard.changeTurn) {
                        // if changeTurn, playerTurn = true
                        console.log('cpu has finished its turn') // TODO: remove
                        playerTurn = true
                    }
                    else {
                        // else cpuTurn() again
                        console.log('cpu goes again') // TODO: remove
                        setTimeout(cpuTurn, cpuDelay)
                    }
                },1000)
            }

            // determine changeTurn based on played card
            else if (chosenCard.changeTurn) {
                // if changeTurn, playerTurn = true
                console.log('cpu has finished its turn') // TODO: remove
                playerTurn = true
            }
            else {
                // else cpuTurn() again
                console.log('cpu goes again') // TODO: remove
                setTimeout(cpuTurn, cpuDelay)

            }
        }, 200)
        
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
    }
}

function showUno(unoHand) {
    // remove hidden class from player-uno div
    unoHand.classList.remove('hidden')
    unoFX.play()
    console.log('removed HIDDEN from', unoHand)

    // add shout class
    setTimeout(() => {
        unoHand.classList.add('shout')
        console.log('added SHOUT to', unoHand)
        //setTimeout = after x seconds remove shout
        setTimeout(() => {
            unoHand.classList.remove('shout')
            console.log('removed SHOUT from', unoHand)

            setTimeout(() => {
                unoHand.classList.add('hidden')
                console.log('added HIDDEN to', unoHand)
            }, 1000)
        }, 1000)
    }, 10) 
}

function hitWithDrawCard() {
    plusCardFX.play()
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
        setTimeout(cpuTurn, cpuDelay)
    }
}

function endRound(winner) {
    console.log('round over')
    const endOfroundDom = document.querySelector('.end-of-round')
    const roundDom = document.querySelector('.round')
    endOfroundDom.classList.remove('hidden')
    if (winner === 'You') roundDom.textContent = winner + ' won the round!'
    else roundDom.textContent = winner + ' won the round...'
    
    setInterval(() => {
        endOfroundDom.classList.add('hidden')
    }, 2000)
}

function endGame(winner) {
    console.log('game over')
    const endOfGameDom = document.querySelector('.end-of-game')
    const gameDom = document.querySelector('.game')
    endOfGameDom.classList.remove('hidden')
    if (winner === 'You') gameDom.textContent = 'You won the game! Play again?'
    else gameDom.textContent = 'CPU won the game... Try again?'

    document.querySelector('.play-again').addEventListener('click', () => {
        endOfGameDom.classList.add('hidden')
        startGame()
    })
}

///////START GAME////////
const startGame = () => {
    playerScore = 0
    cpuScore = 0

    listenForDevMode()
    setInterval(showTurnOnDom, 100)
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
                
                // animate clicked card
                event.target.classList.add('play-card')
                console.log(event.target)
                playCardFX.play()

                setTimeout(() => {
                    // set topOfPlayPile to target.src
                    //topOfPlayPile.length = 0
                    playPlayerCard(index)


                    // invoke cpuTurn to add cards if there are any to add
                    cpuTurn()
                    
                    // check playerHand length and update DOM
                    if (playerHand.length > 1) {
                        updateHand(playerHand)
                    }
                    else if (playerHand.length === 1) {
                        updateHand(playerHand)
                        // TODO: showUno()
                        showUno(playerUno)
                    }
                    else {
                        // tally points
                        tallyPoints(cpuHand)
                        updateScores()
                        //alert("You won the round!")
                        // winRoundFX.play()
                        // endRound('You')

                        // next hand if both scores < gameOver
                        checkForWinner()
                    }

                    //check if wild
                    if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0) {
                        // set new color
                        showColorPicker()
                        return
                    }

                    skipOrEndTurn();
                }, 350)
                
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
                setTimeout(cpuTurn, cpuDelay)
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
                    setTimeout(cpuTurn, cpuDelay)
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