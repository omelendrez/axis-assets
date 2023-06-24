const controller = require('../controllers/xls-controller')
const middleware = require('../middleware/pdf-middleware')

module.exports = async (app) => {
  const router = require('express').Router()

  // Opito certificate

  const pdf = middleware.pdf

  router.post(
    `${process.env.OPITO_ENDPOINT}/:id`,
    pdf.none(),

    controller.generateXLSX
  )

  app.use('/', router)
}
