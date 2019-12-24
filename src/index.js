import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
app.use(morgan('combine'))
app.use(bodyParser.json())
app.use(cors())

app.post('/api/register', (req, res) => {
    res.send({
        message: 'You were registered.'
    })
})

app.post('/api/login', (req, res) => {
    return res.status(403).json({
        error: 'The login information was incorrect'
    })
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(process.env.PORT || 8081, () => console.log('running on localhost:8081'))