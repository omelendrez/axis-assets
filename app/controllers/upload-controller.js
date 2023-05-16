const { log } = require('../helpers/log')

exports.uploadFile = async (req, res) => {
  try {
    const photo = await req.file

    if (!photo) {
      res.status(400).send({
        message: 'No file is selected.'
      })
    } else {
      res.send({
        message: 'File is uploaded.',
        data: {
          name: photo.originalname,
          mimetype: photo.mimetype,
          size: photo.size
        }
      })
    }
  } catch (err) {
    log.error(err)
    res.status(500).send(err)
  }
}
