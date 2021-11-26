// imports
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')

// setup
const PORT = process.env.PORT || 5000

const app = express()
mongoose.connect(process.env.CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`server connected to port ${PORT}`)))

app.use(express.json())
app.use(cors())