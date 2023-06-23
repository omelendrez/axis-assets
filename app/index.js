const express = require('express')
const cors = require('cors')
// const path = require('path')
const { log } = require('./helpers/log.js')
const logger = require('morgan')
const { listEndpoints } = require('./helpers/routes.js')

require('dotenv').config()

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(
  logger('dev', {
    skip: (req, res) => res.statusCode < 400
  })
)

app.use(express.static('uploads'))

require('./routes')(app)

const PORT = process.env.PORT || 3010

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}.`)
})

if (process.env.NODE_ENV !== 'production') {
  listEndpoints(app, '')
}
