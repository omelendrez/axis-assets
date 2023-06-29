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

exports.idCardExists = async (req, res) => {
  const file = `${process.env.PDF_ID_CARD_FOLDER}/${req.params.fileName}`

  fs.access(file, fs.F_OK, (err) => {
    if (err) {
      return res.status(200).send({ exists: false })
    }

    res.status(200).send({ exists: true })
  })
}

exports.createCertificate = async (req, res) => {
  // Create a document

  const {
    cert_type,
    full_name,
    certificate,
    user,
    items,
    issued,
    expiry,
    expiry_type
  } = req.body

  const backgroundImage =
    parseInt(cert_type, 10) === 4
      ? './models/certificates/certificate_opito.jpg'
      : './models/certificates/certificate.jpg'

  const opitoLogo =
    parseInt(cert_type, 10) === 4 ? './models/common/OPITO.jpg' : ''

  const id = req.params.id
  const file = documentNumber(id)

  const fileName = `${process.env.PDF_CERTIFICATE_FOLDER}/${file}.pdf`

  const doc = await new PDFDocument({
    size: [595.28, 841.89],
    font: 'Times-Roman'
  })

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

    row += 40
    doc.fontSize(22)
    doc.text(full_name, column, row, { align: 'center' })

    row += 40

    doc.fontSize(12)
    doc.text(
      'having been assessed against and met the learning outcomes for the training requirements on',
      column,
      row,
      { align: 'center' }
    )

    row += 60

    console.log(row)

    doc.fontSize(16)

    items.forEach((i) => {
      console.log(i.name)
      doc.text(i.name, column, row, { align: 'center' })
      row += 40
    })

    row = 585

    doc.text(`Issuance Date: ${issued}`, column, row, { align: 'center' })

    row += 110
    column += 260

    if (opitoLogo) {
      doc.image(opitoLogo, 230, row, { scale: 0.8 })
    }

    row += 10

    doc.fontSize(14)

    doc.text(`Cert. No: ${certificate}`, column, row)

    row += 20

    if (expiry_type !== 0) {
      doc.text(`Expiry Date: ${expiry}`, column, row)
    }

    await doc.end()
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }

  res.status(200).send({ ...doc.info })
}

exports.createIdCard = async (req, res) => {
  // Create a document

  const {
    badge,
    full_name,
    user,
    cert_type,
    id_card,
    front_id,
    back_id,
    certificate,
    expiry
  } = req.body

  const profilePicture = id_card
    ? `${process.env.COMPRESS_DEST_FOLDER}/${badge}.jpg`
    : ''

  if (!fs.existsSync(profilePicture)) {
    return res.status(404).send({
      message: 'Learner picture is required'
    })
  }

  const backgroundImage = './models/id_cards/idcard_front.jpg'
  const signatureImage = './models/id_cards/signature.jpg'

  const opitoLogo =
    parseInt(cert_type, 10) === 4 ? './models/common/OPITO.jpg' : ''

  const id = req.params.id
  const file = documentNumber(id)

  const fileName = `${process.env.PDF_ID_CARD_FOLDER}/${file}.pdf`

  const doc = await new PDFDocument({ size: [242, 153], font: 'Helvetica' })

  doc.info.Title = 'Id Card'
  doc.info.Author = user.full_name
  doc.info.Subject = `${req.body.badge} - ${req.body.course}`
  doc.info.Producer = 'Axis v2.0'
  doc.info.CreationDate = new Date()

  try {
    await doc.pipe(fs.createWriteStream(fileName))

    doc.image(backgroundImage, 0, 0, {
      width: 242,
      height: 153
    })

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('yellow')
      .text(front_id, 175, 32)

    if (opitoLogo) {
      doc.image(opitoLogo, 198, 48, { width: 38 })
    }

    doc
      .fontSize(10)
      .fillColor('white')
      .text(full_name, 85, 110, { width: 242, height: 153 })

    doc.text(`EXP: ${expiry}`, { width: 242, height: 153 })

    doc.text(certificate, { width: 242, height: 153 })

    if (profilePicture) {
      doc.image(profilePicture, 2, 94, { width: 76 })
    }

    doc.addPage()

    doc
      .font('Helvetica')
      .fillColor('black')
      .fontSize(7)
      .text(
        'This is to certify that the bearer whose name and passport photograph',
        10,
        50,
        { width: 242 }
      )

    doc.text('appear overleaf has undergone ', { width: 242, continued: true })

    doc.font('Helvetica-Bold').text(`${back_id}.`).moveDown(0.5)

    doc
      .font('Helvetica')
      .text('This card remains the property of TOLMANN.')
      .moveDown(0.5)

    doc
      .text(
        'If found, please return to 7B Trans Amadi Industrial Layout, Port Harcourt.',
        { width: 242, height: 153 }
      )
      .moveDown(0.5)

    doc.text('Tel: +234 802 335 0014', { width: 242, height: 153 })

    doc.text('Signature:', 10, 135, {
      width: 242,
      height: 153,
      continued: true
    })

    doc.image(signatureImage, 40, 115, { width: 48 })

    await doc.end()
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }

  res.status(200).send({ ...doc.info })
}
