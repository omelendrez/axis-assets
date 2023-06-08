// Importing modules
const PDFDocument = require('pdfkit')
const fs = require('fs')

const { log } = require('../helpers/log')
const { documentNumber } = require('../helpers/converters')

exports.certificateExists = async (req, res) => {
  const file = `${process.env.PDF_CERTIFICATE_FOLDER}/${req.params.fileName}`

  fs.access(file, fs.F_OK, (err) => {
    if (err) {
      return res.status(200).send({ exists: false })
    }

    res.status(200).send({ exists: true })
  })
}

exports.createCertificate = async (req, res) => {
  // Create a document

  console.log(req.body)

  const { cert_type, full_name, certificate, user } = req.body

  const backgroundImage =
    parseInt(cert_type, 10) === 4
      ? './models/certificates/certificate_opito.jpg'
      : './models/certificates/certificate.jpg'

  const opitoLogo =
    parseInt(cert_type, 10) === 4 ? './models/certificates/OPITO.jpg' : ''

  console.log(cert_type)

  const id = req.params.id
  const file = documentNumber(id)

  const fileName = `${process.env.PDF_CERTIFICATE_FOLDER}/${file}.pdf`
  console.log(fileName)
  const doc = await new PDFDocument({ size: 'A4', font: 'Times-Roman' })

  doc.info.Title = 'Training Certificate'
  doc.info.Author = user.full_name
  doc.info.Subject = `${req.body.badge} - ${req.body.course}`
  doc.info.Producer = 'Axis v2.0'
  doc.info.CreationDate = new Date()

  try {
    await doc.pipe(fs.createWriteStream(fileName))

    doc.image(backgroundImage, 0, 0, {
      width: 595.28,
      height: 841.89
    })

    let row = 245
    let column = 70

    doc.fontSize(12)
    doc.text(
      'In honor of your outstanding performance and dedication, we gladly present this to',
      column,
      row,
      { align: 'center' }
    )

    row += 20
    doc.fontSize(22)
    doc.text(full_name, column, row, { align: 'center' })

    row += 25

    doc.fontSize(12)
    doc.text(
      'having been assessed against and met the learning outcomes for the training requirements on',
      column,
      row,
      { align: 'center' }
    )

    row += 400
    column += 260

    if (opitoLogo) {
      doc.image(opitoLogo, 230, row, { scale: 0.8 })
    }

    row += 20
    doc.fontSize(14)
    doc.text(`Cert. No: ${certificate}`, column, row)

    row += 20

    doc.text(`Expiry Date: ${'TBD'}`, column, row)

    await doc.end()
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }

  res
    .status(200)
    .send({ message: 'Certificate generate successfully', ...doc.info })
}

exports.createIdCard = async (req, res) => {
  // Create a document

  const id = req.params.id
  const fileName = `${process.env.PDF_ID_CARD_FOLDER}/${parseInt(
    id,
    10
  ).toString(16)}.pdf`
  const doc = await new PDFDocument({ size: 'LETTER' })

  doc.info.Title = 'Certificate'
  doc.info.Author = 'User that created the document'
  doc.info.Subject = 'This is a certificate'

  doc.info.Producer = 'Axis v2.0'
  doc.info.CreationDate = new Date()

  try {
    // Saving the pdf file in root directory.
    await doc.pipe(fs.createWriteStream(fileName))

    // Adding functionality
    await doc.text(new Date(), 100, 100)

    // Adding an image in the pdf.

    // doc.image('download3.jpg', {
    //   fit: [300, 300],
    //   align: 'center',
    //   valign: 'center'
    // })

    await doc
      .addPage()
      .fontSize(15)
      .text('Generating PDF with the help of pdfkit', 100, 100)

    // Apply some transforms and render an SVG path with the
    // 'even-odd' fill rule
    await doc
      .scale(0.6)
      .translate(470, -380)
      .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
      .fill('red', 'even-odd')
      .restore()

    // Add some text with annotations
    await doc
      .addPage()
      .fillColor('blue')
      .text('The link for GeeksforGeeks website', 100, 100)

      .link(100, 100, 160, 27, 'https://www.geeksforgeeks.org/')

    // Finalize PDF file
    await doc.end()
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }

  res
    .status(200)
    .send({ message: 'ID Card generated successfully', ...doc.info })
}
