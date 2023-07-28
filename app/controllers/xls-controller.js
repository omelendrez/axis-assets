const XLSX = require('xlsx')

exports.generateXLSX = async (req, res) => {
  const opitoSourceFile = 'OPITO TRANSFER LETTER.xlsx'
  const source = `${process.env.OPITO_TEMPLATES_PATH}/${opitoSourceFile}`
  const workbook = XLSX.readFile(source)

  const curDate = new Date()

  const dateString = curDate.toISOString().substring(0, 10)

  const opitoFileName = process.env.OPITO_FILENAME.replace('{id}', dateString)

  const destination = `${process.env.OPITO_FOLDER}/${opitoFileName}`

  const sheet = await workbook.Sheets[workbook.SheetNames[0]]

  const { records } = req.body

  const rows = []

  Object.entries(records).forEach(([, v]) => {
    const row = []
    Object.entries(v).forEach(([, value]) => {
      row.push(value)
    })
    rows.push(row)
  })

  await XLSX.utils.sheet_add_aoa(sheet, rows, {
    origin: 'A2'
  })

  await XLSX.writeFile(workbook, destination)

  res.status(200).send({
    message: 'Opito transfer letter generated successfully',
    file: `${process.env.OPITO_ENDPOINT}/${opitoFileName}`,
    opito_file: parseInt(dateString.replace(/-/g, '')).toString(16)
  })
}
