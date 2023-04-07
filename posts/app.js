const express = require('express'),
        cors = require('cors'),
        axios = require('axios'),
        bodyParser = require('body-parser'),
        {randomBytes} = require('crypto')


const app = express(),
        port = 4000;


//temporarily storing in memory, will update to DB after basic implimentation
const posts = {};


app.use(cors());
app.use(bodyParser.json())


app.get('/posts', (req, res) =>{
    res.status(201).send(posts)
})

app.post('/posts', async (req, res) =>{
    const {title, body} = req.body

    const id = randomBytes(4).toString('hex')
    posts[id] = {
        id, title, body
    }
    await axios.post("http://localhost:4005/events", {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    })
    res.status(201).json({sucess: true, post: posts[id]})
})

app.post('/events', (req, res) =>{
    console.log("Receved Event", req.body.type)
    res.end()
})

app.listen(port, () =>{
    console.log(`Server is lisening on port: ${port}`)
})