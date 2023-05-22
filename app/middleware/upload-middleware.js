const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.COMPRESS_TEMP_FOLDER)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const ext = originalname.split('.')[1]
    cb(null, `${req.body.name}.${ext}`)
  }
})

const upload = multer({ storage })

exports.upload = upload
