const express = require('express')
const cors = require('cors')
// const path = require('path')
const { log } = require('./helpers/log.js')
const logger = require('morgan')

require('dotenv').config()

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(
  logger('dev', {
    // skip: (req, res) => res.statusCode < 400
  })
)

app.use(express.static('uploads'))

// app.use((req, res, next) => {
//   if (req.method === 'POST') {
//     return next()
//   }
//   const options = {
//     root: path.join(__dirname, 'images')
//   }

//   const fileName = 'no-image-icon.png'
//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       next(err)
//     }
//   })
// })

require('./routes/upload-routes.js')(app)
require('./routes/pdf-routes.js')(app)

const PORT = process.env.PORT || 3010

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}.`)
})
