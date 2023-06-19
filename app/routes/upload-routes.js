const controller = require('../controllers/upload-controller')
const middleware = require('../middleware/upload-middleware')

module.exports = async (app) => {
  const router = require('express').Router()

  const upload = middleware.upload

  router.post(
    process.env.PICTURE_ENDPOINT,
    upload.single('file'),
    controller.uploadPicture
  )

  router.post(
    process.env.LEARNER_ID_ENDPOINT,
    upload.single('file'),
    controller.uploadLearnerIdCard
  )

  app.use('/', router)
}
