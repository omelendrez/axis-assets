const { log } = require('../helpers/log')
const { createFile } = require('../middleware/csv-middleware')

exports.createCSVFile = async (req, res) => {
  try {
    const { fileName } = await createFile(req.body)

    await res.status(200).send({ fileName })
  } catch (err) {
    log.error(err)
    res.status(500).send(err)
  }
}
