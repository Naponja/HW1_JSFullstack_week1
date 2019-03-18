const express = require('express')
const bodyParser = require('body-parser')
//const logger = require('./logger')
const morgan = require('morgan')
const sampleSize = require('lodash.samplesize')
const app = express()

app.use(express.static('public'))
const urlencodedParser = bodyParser.urlencoded({ extended: true })

const loveScoreMatrix = {
    flower: [-2, 0, 4],
    ring: [3, -3, 0],
    necklace: [1, 3, -2],
    tea: [2, 1, -1]
}
const limitLove = 15
let dayLeft = 15
let loveScore = 0
let pathImage 
const loveScores = function () {
    return (`
        <div>
            <label> Love Score: </lable> ${loveScore}
        </div>
    `)
}
const dayLefts = function () {
    return (`
        <div>
            <label> Day Left: </lable> ${dayLeft}
        </div>
    `)
}
let giveProduct = []
const form = function () {
    return (`
        <form action="/give" method="POST">
            <input type="submit" name="love" value="${giveProduct[0]}"/>
            <input type="submit" name="love" value="${giveProduct[1]}"/>
            <input type="submit" name="love" value="${giveProduct[2]}"/>
        </form>
    `)
}
const image = function () {
    return (`
                <div>
                    <img src="${pathImage}" alt="Image" width="500" />
                </div>
            `)
}
let restartGame = `
    <form action="/playagain" method="POST"> 
        <input type="submit" value="Play Again"/>
    </form>
`
const sucess = `
    <div>
        <h1 style="color:green"> Sucess </h1>
    </div>
`
const fail = `
    <div>
        <h1 style="color:red"> Fail </h1>
    </div>
`
app.get('/', function (req, res) {
    giveProduct = sampleSize(Object.keys(loveScoreMatrix), 3)
    console.log("giveProduct: ", giveProduct)
    if (loveScore > limitLove) {
        //sucess
        pathImage = "/sucess.jpg"
        res.send(`<h1>Dating Simulator</h1>${image()} ${loveScores()}${dayLefts()}${sucess}${restartGame}`)
    } else if (dayLeft <= 0) {
        //fail
        pathImage = "/fail.jpg"
        res.send(`<h1>Dating Simulator</h1>${image()} ${loveScores()}${dayLefts()}${fail}${restartGame}`)
    } else {
        //normal
        pathImage = "/normal.jpg"
        res.send(`<h1>Dating Simulator</h1>${image()} ${loveScores()}${dayLefts()}${form()}`)
    }
})

app.post('/give', urlencodedParser, function (req, res) {
    const { love } = req.body
    let modDate = dayLeft % 3
    dayLeft -= 1
    console.log('Befor_loveScore: ', loveScore)
    console.log('score: ',loveScoreMatrix[love.toLowerCase() || 0][modDate])
    loveScore += loveScoreMatrix[love.toLowerCase() || 0][modDate]
    console.log('After_loveScore: ', loveScore)
    res.redirect('/')
})
app.post('/playagain', function (req, res) {
    dayLeft = 15
    loveScore = 0
    res.redirect('/')
})

app.listen(3000)