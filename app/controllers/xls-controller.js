const XLSX = require('xlsx')

exports.generateXLSX = async (req, res) => {
  const opitoSourceFile = 'OPITO TRANSFER LETTER.xlsx'
  const source = `${process.env.OPITO_MODELS_PATH}/${opitoSourceFile}`
  const workbook = XLSX.readFile(source)

  const opitoFileName = `Opito Transfer Letter - ${req.params.id}.xlsx`
  const destination = `${process.env.OPITO_FOLDER}/${opitoFileName}`

  const sheet = await workbook.Sheets[workbook.SheetNames[0]]

  const data = req.body

  const rows = []

  Object.entries(data).forEach(([, v]) => {
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
    file: `${process.env.OPITO_ENDPOINT}/${opitoFileName}`
  })
}
