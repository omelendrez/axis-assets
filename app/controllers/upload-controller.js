const sharp = require('sharp')
const fs = require('fs')

const { log } = require('../helpers/log')

exports.uploadFile = async (req, res) => {
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
    const outputFile = `${process.env.COMPRESS_DEST_FOLDER}/${fileName}`
    sharp(inputFile)
      .withMetadata()
      .resize({
        width: parseInt(process.env.PHOTO_WIDTH, 10),
        height: parseInt(process.env.PHOTO_HEIGHT, 10)
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
      .catch((e) => console.log('errorisimo', e))
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }
}
