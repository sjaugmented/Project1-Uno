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

let cpuScore = 0;
let playerScore = 0;

class Card {
    constructor(color, value, points, changeTurn, drawValue, imgSrc) {
        this.color = color
        this.value = value
        this.points = points
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
            deck.push(new Card(color, n, n, false, 0, 'images/' + color + n + '.png'))
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
    domToUpdate.innerHTML = ''
    for (let i = 0; i < handToUpdate.length; i++) {
        const updatedCard = document.createElement('img')
        updatedCard.setAttribute('src', handToUpdate[i].src)
        updatedCard.setAttribute('class', 'player')
        // update ID's to match playerHand indexes
        updatedCard.setAttribute('id', i)
        domToUpdate.appendChild(updatedCard)
    }
}

function drawCard(handGetsCard) {
    if (deck.length > 0) {
        const newCard = deck.shift()
        handGetsCard.push(newCard)
    }
    else {
        // shuffle playPile
    }
    
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
    if (cpuScore < 100) cpuScoreDom.style.color = 'rgb(0, 140, 0)'
    else cpuScoreDom.style.color = 'rgb(121, 2, 2)'

    // update playerScoreDom
    playerScoreDom.innerHTML = playerScore
    if (playerScore < 100) playerScoreDom.style.color = 'rgb(0, 140, 0)'
    else playerScoreDom.style.color = 'rgb(121, 2, 2)'
}

function checkForWinner() {
    if (playerScore < 200 && cpuScore < 200)
        newHand()
    else {
        // game over
        if (playerScore > 200)
            alert('You lost the game.')
        if (cpuScore > 200)
            alert('You won the game!')
    }
}

function cpuTurn() {
    if (!playerTurn) {
        // create temp array of playable cards based on last card played
        // check if playPile is drawCard
        if (topOfPlayPile[topOfPlayPile.length - 1].drawValue > 0) {
            for (let i = 0; i < topOfPlayPile[topOfPlayPile.length - 1].value; i++) {
                drawCard()
            }
        }
            // add however many cards
        
        // check if playPile is wild
            // all cards playable
        
        //
        

        // if playableCards exist
            // run strategist to determine strategy

        
            // if strategist > 0.5 || playerHand <= 3
                
                // prioritize action/high point cards
            
        
            // else prioritize color || number cards

        
            // choose card from playable array based on strategy


            // play card
                // remove card from cpuHand
                
                // make topOfPlayPile removed card
        
                // update playPileDom
            
                // update cpuHandDom
            
            
            // check cpuHand
                // determine uno
        
                // determine end of round, aka cpuHand.length == 0
                    // if end of round
                        
                        // tally points
                        
                        // update scores
        
                        // newHand()
                    
                    // else
                        // determine changeTurn based on played card
                            
                            // if changeTurn, playerTurn = true
                            
                            // else cpuTurn()
        
        // else if no playable cards
            // draw card
        
            // update hand
        
            // playerTurn = true
        









        // if value or color matches topOfPlayPile OR color = 'any'
        for (const card of cpuHand) {
            if (card.value === topOfPlayPile[0].value || card.color === topOfPlayPile[0].color || card.color === 'any' || topOfPlayPile[0].color === 'any') {
            
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
                if (playerHand.length > 1) {
                    updateHand(playerHand, playerHandDom)
                } else if (playerHand.length === 1) {
                    updateHand(playerHand, playerHandDom)
                    alert("You declare UNO!")
                }
                else {
                    // tally points
                    tallyPoints(cpuHand)
                    updateScores()
                    alert("You won the round!")
    
                    // next hand if both scores < 200
                    checkForWinner()
                }
    
                if (chosenCard[0].changeTurn) {
                    playerTurn = !playerTurn
    
                    // cpu's turn
                    cpuTurn()
                }
            }
        }

        
    }
}

let playerTurn = true


///////START GAME////////
const startGame = () => {
    forcePlayerTurn()
    newHand()
    updateScores()


    // set event listeners on playerHandDom and drawPileDom
    playerHandDom.addEventListener('click', (event) => {
        if (playerTurn) {
            console.log(event.target) // TODO: remove

            // use target's class to find card object in array
            let index = parseInt(event.target.getAttribute('id'))
            
            // if value or color matches topOfPlayPile OR color = 'any'
            if (playerHand[index].value === topOfPlayPile[topOfPlayPile.length - 1].value || playerHand[index].color === topOfPlayPile[topOfPlayPile.length - 1].color || playerHand[index].color === 'any' || topOfPlayPile[topOfPlayPile.length - 1].color === 'any') {
                console.log("You can play that card!")
            
                // set topOfPlayPile to target.src
                //topOfPlayPile.length = 0
                let chosenCard = playerHand.splice(index, 1)
                topOfPlayPile.push(chosenCard[0])

                // clear the playPile
                playPileDom.innerHTML = ''

                // add played card to playPile
                const newCard = document.createElement('img')
                const imgSrc = topOfPlayPile[topOfPlayPile.length - 1].src
                console.log(imgSrc) // TODO:: remove
                newCard.setAttribute('src', imgSrc)
                playPileDom.appendChild(newCard)

                // check playerHand length and update DOM
                if (playerHand.length > 1) {
                    updateHand(playerHand, playerHandDom)
                } else if (playerHand.length === 1) {
                    updateHand(playerHand, playerHandDom)
                    alert("You declare UNO!")
                }
                else {
                    // tally points
                    tallyPoints(cpuHand)
                    updateScores()
                    alert("You won the round!")

                    // next hand if both scores < 200
                    checkForWinner()
                }

                if (chosenCard[0].changeTurn) {
                    playerTurn = !playerTurn

                    // cpu's turn
                    //cpuTurn() // TODO: uncomment!
                }
            }
            else {
                alert("Sorry, you can't play that card...")
            }
        }
        
    })
    
    let areYouSure = false

    drawPileDom.addEventListener('click', () => {
        if (playerTurn) {
            let anythingPlayable;

            // check if anything is playable in playerHand
            for (let i = 0; i < playerHand.length; i++) {
                if (playerHand[i].color === topOfPlayPile[topOfPlayPile.length - 1].color || playerHand[i].value === topOfPlayPile[topOfPlayPile.length - 1].value || playerHand[i].color === 'any' || topOfPlayPile[topOfPlayPile.length - 1].color === 'any') {
                    anythingPlayable = true;
                    break
                }
                else anythingPlayable = false // TODO: remove - probably don't need this
                console.log('anything playable?', anythingPlayable )
            }

            if (!anythingPlayable) {
                // draw card
                drawCard(playerHand)
                updateHand(playerHand, playerHandDom)
            }
            else {
                if (!areYouSure) {
                    alert("You sure, bro?")
                    areYouSure = true
                }
                else {
                    // draw card
                    drawCard(playerHand)
                    updateHand(playerHand, playerHandDom)
                    areYouSure = false;
                    playerTurn = !playerTurn
                }
            }
        }
        
    })
}

function forcePlayerTurn() {
    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase()
        console.log(key) //TODO: remove

        if (key === 'p') {
            playerTurn = true;
            console.log('playerTurn:', playerTurn)
        }
    })
}

startGame()






