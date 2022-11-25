const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL)
.then(()=> console.log('MongoDB connected'))
.catch((error)=> console.log(`MongoDB erroe: ${error}`))

require('./middleware/passport')(passport)


const router = require('./routes/authRouter')


const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(passport.initialize())

app.use('/', router)

// app.get('/', (req, res) => {
//     res.status(200).json({
//         massage: 'getrequest'
//     })
// })


const start = () => {
    app.listen(PORT, () => console.log (`server runs on port: ${PORT}`))
}
start()