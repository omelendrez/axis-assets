const controller = require('../controllers/pdf-controller')
const uploadController = require('../controllers/upload-controller')
const middleware = require('../middleware/pdf-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')

module.exports = async (app) => {
  const router = require('express').Router()

  const pdf = middleware.pdf
  const upload = uploadMiddleware.upload

  // Certificate

  router.post(
    `${process.env.PDF_CERTIFICATE_ENDPOINT}/:id`,
    pdf.none(),
    controller.createCertificate
  )

  router.get(
    `${process.env.PDF_CERTIFICATE_ENDPOINT}/:fileName/exists`,
    controller.certificateExists
  )

  router.post(
    `${process.env.PDF_CERTIFICATE_ENDPOINT}/restore`,
    upload.single('file'),
    uploadController.uploadCertificate
  )

  // Id Card

  router.post(
    `${process.env.PDF_ID_CARD_ENDPOINT}/:id`,
    pdf.none(),
    controller.createIdCard
  )

  router.get(
    `${process.env.PDF_ID_CARD_ENDPOINT}/:fileName/exists`,
    controller.idCardExists
  )

  // Welcome Letter

  router.post(
    `${process.env.WELCOME_LETTER_ENDPOINT}/:id`,
    pdf.none(),
    controller.createWelcomeLetter
  )

  router.get(
    `${process.env.WELCOME_LETTER_ENDPOINT}/:fileName/exists`,
    controller.welcomeLetterExists
  )

  app.use('/', router)
}
