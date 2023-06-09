require('dotenv').config()

const express = require('express')
const cors = require('cors')
// const path = require('path')
const { log } = require('./helpers/log')
const logger = require('morgan')
const { listEndpoints } = require('./helpers/routes')
const EmailService = require('./services/EmailService')

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
app.use(express.static('exports'))

require('./routes')(app)

const PORT = process.env.PORT || 3010

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}.`)
})

const emailService = new EmailService()

if (process.env.NODE_ENV !== 'production') {
  listEndpoints(app, '')
}

emailService.on('emailSent', (email) => {
  const { to, subject } = email
  console.log(`Email sent to ${to} with subject ${subject}`)
})
