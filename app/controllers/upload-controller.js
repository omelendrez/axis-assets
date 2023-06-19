const sharp = require('sharp')
const fs = require('fs')

const { log } = require('../helpers/log')

exports.uploadPicture = async (req, res) => {
  try {
    const photo = await req.file
    if (!photo) {
      return res.status(400).send({
        message: 'No file is selected.'
      })
    }
    const file = photo.originalname
    const ext = file.split('.')[1]
    const fileName = `${req.body.name}.${ext}`

    const inputFile = `${process.env.COMPRESS_TEMP_FOLDER}/${fileName}`
    const outputFile = `${process.env.PICTURE_FOLDER}/${fileName}`

    sharp(inputFile)
      .withMetadata()
      .resize({
        width: parseInt(process.env.PICTURE_WIDTH, 10),
        height: parseInt(process.env.PICTURE_HEIGHT, 10)
      })
      .toFile(outputFile)
      .then(() => {
        fs.rmSync(inputFile, { force: true })
        res.send({
          message: 'File is uploaded.',
          data: {
            name: fileName,
            mimetype: photo.mimetype,
            size: photo.size
          }
        })
      })
      .catch((err) => {
        console.log(err)
        log.error(err)
        res.status(500).send(err)
      })
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }
}

exports.uploadLearnerIdCard = async (req, res) => {
  try {
    const idCard = await req.file
    if (!idCard) {
      return res.status(400).send({
        message: 'No file is selected.'
      })
    }
    const file = idCard.originalname
    const ext = file.split('.')[1]
    const fileName = `${req.body.name}.${ext}`

    const inputFile = `${process.env.COMPRESS_TEMP_FOLDER}/${fileName}`
    const outputFile = `${process.env.LEARNER_ID_FOLDER}/${fileName}`

    sharp(inputFile)
      .withMetadata()
      .resize({
        width: parseInt(process.env.LEARNER_ID_WIDTH, 10),
        height: parseInt(process.env.LEARNER_ID_HEIGHT, 10)
      })
      .toFile(outputFile)
      .then(() => {
        fs.rmSync(inputFile, { force: true })
        res.send({
          message: 'File is uploaded.',
          data: {
            name: fileName,
            mimetype: idCard.mimetype,
            size: idCard.size
          }
        })
      })
      .catch((err) => {
        console.log(err)
        log.error(err)
        res.status(500).send(err)
      })
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }
}
