const controller = require('../controllers/upload-controller')
const middleware = require('../middleware/upload-middleware')

module.exports = async (app) => {
  const router = require('express').Router()

  const upload = middleware.upload

  router.get(
    `${process.env.PICTURE_ENDPOINT}/:fileName/exists`,
    controller.pictureExists
  )

  router.post(
    process.env.PICTURE_ENDPOINT,
    upload.single('file'),
    controller.uploadPicture
  )

  router.get(
    `${process.env.LEARNER_ID_ENDPOINT}/:fileName/exists`,
    controller.learnerIdCardExists
  )

  router.post(
    process.env.LEARNER_ID_ENDPOINT,
    upload.single('file'),
    controller.uploadLearnerIdCard
  )

  router.get(
    `${process.env.SIGNATURE_ENDPOINT}/:fileName/exists`,
    controller.signatureExists
  )

  router.post(
    process.env.SIGNATURE_ENDPOINT,
    upload.single('file'),
    controller.uploadSignature
  )

  router.get(
    `${process.env.FOET_ENDPOINT}/:fileName/exists`,
    controller.previouseFOETExists
  )

  router.post(
    process.env.FOET_ENDPOINT,
    upload.single('file'),
    controller.uploadPreviousFOET
  )

  app.use('/', router)
}
