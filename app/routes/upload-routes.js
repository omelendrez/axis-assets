const controller = require('../controllers/upload-controller')
const middleware = require('../middleware/upload-middleware')

module.exports = async (app) => {
  const router = require('express').Router()

  const upload = middleware.upload

  router.post(
    process.env.PHOTO_ENDPOINT_ROUTE,
    upload.single('file'),
    controller.uploadFile
  )

  app.use('/', router)
}
