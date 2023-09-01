const fs = require('fs')
const PDFDocument = require('pdfkit')

const { documentNumber } = require('../helpers/converters')

const standardId = async (req) => {
  try {
    const {
      badge,
      full_name,
      certificate,
      expiry,
      user: { full_name: fullName },
      course: { name: courseName, front_id, back_id }
    } = req.body

    const profilePicture = `${process.env.PICTURE_FOLDER}/${badge}.jpg`

    const backgroundImage = './templates/id_cards/idcard_front.jpg'
    const signatureImage = './templates/id_cards/signature.jpg'

    const id = req.params.id
    const file = documentNumber(id)

    const fileName = `${process.env.PDF_ID_CARD_FOLDER}/${file}.pdf`

    const doc = await new PDFDocument({ size: [242, 153], font: 'Helvetica' })

    doc.info.Title = 'Id Card'
    doc.info.Author = fullName
    doc.info.Subject = `${badge} - ${courseName}`
    doc.info.Producer = 'Axis v2.0'
    doc.info.CreationDate = new Date()

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

    doc
      .fontSize(10)
      .fillColor('white')
      .text(full_name, 85, 110, { width: 242, height: 153 })

    doc.text(`EXP: ${expiry}`, { width: 242, height: 153 })

    doc.text(certificate, { width: 242, height: 153 })

    if (profilePicture && fs.existsSync(profilePicture)) {
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
  } catch (error) {
    console.log(error)
  }
}

module.exports = { standardId }
