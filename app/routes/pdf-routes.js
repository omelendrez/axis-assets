const controller = require('../controllers/pdf-controller')
const middleware = require('../middleware/pdf-middleware')

module.exports = async (app) => {
  const router = require('express').Router()

  const pdf = middleware.pdf

  // Certificate

  router.post(
    `${process.env.PDF_CERTIFICATE_ROUTE}/:id`,
    pdf.none(),
    controller.createCertificate
  )

  router.get(
    `${process.env.PDF_CERTIFICATE_ROUTE}/:fileName/exists`,
    controller.certificateExists
  )

  // Id Card

  router.post(
    `${process.env.PDF_ID_CARD_ROUTE}/:id`,
    pdf.none(),
    controller.createIdCard
  )

  router.get(
    `${process.env.PDF_ID_CARD_ROUTE}/:fileName/exists`,
    controller.idCardExists
  )

  app.use('/', router)
}
