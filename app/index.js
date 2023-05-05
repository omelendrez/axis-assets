const express = require('express')
const cors = require('cors')
const { log } = require('./helpers/log.js')
const logger = require('morgan')
const multer = require('multer')
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

const FILE_PATH = 'uploads'

const upload = multer({
  dest: `${FILE_PATH}/`,
  limits: {
    files: 5, // allow up to 5 files per request,
    fileSize: 2 * 1024 * 1024 // 2 MB (max file size)
  },
  fileFilter: (req, file, cb) => {
    // allow images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image are allowed.'), false)
    }
    cb(null, true)
  }
})

app.post('/upload-photo', upload.single(upload), async (req, res) => {
  try {
    const photo = req.file

    // make sure the file is available
    if (!photo) {
      res.status(400).send({
        status: false,
        data: 'No file is selected.'
      })
    } else {
      // send response
      res.send({
        status: true,
        message: 'File is uploaded.',
        data: {
          name: photo.originalname,
          mimetype: photo.mimetype,
          size: photo.size
        }
      })
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

app.use(express.static('uploads'))

const PORT = process.env.PORT || 3010

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}.`)
})
