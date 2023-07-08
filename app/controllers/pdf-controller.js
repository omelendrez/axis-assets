/* eslint-disable no-unused-vars */
// Importing modules
const PDFDocument = require('pdfkit')
const fs = require('fs')
const bwipjs = require('bwip-js')

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

exports.welcomeLetterExists = async (req, res) => {
  const file = `${process.env.WELCOME_LETTER_FOLDER}/${req.params.fileName}`

  fs.access(file, fs.F_OK, (err) => {
    if (err) {
      return res.status(200).send({ exists: false })
    }

    res.status(200).send({ exists: true })
  })
}

exports.createCertificate = async (req, res) => {
  // Create a document
  try {
    const {
      badge,
      full_name,
      certificate,
      user,
      items,
      issued,
      expiry,
      course
    } = req.body

    const { cert_type, expiry_type, name: courseName } = course

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
      size: 'A4',
      font: 'Times-Roman'
    })

    doc.info.Title = 'Training Certificate'
    doc.info.Author = user.full_name
    doc.info.Subject = `${badge} - ${courseName}`
    doc.info.Producer = 'Axis v2.0'
    doc.info.CreationDate = new Date()

    await doc.pipe(fs.createWriteStream(fileName))

    doc.image(backgroundImage, 0, 0, {
      width: 595,
      height: 842
    })

    let row = 245
    let column = 60

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

    doc.fontSize(16)

    items.forEach((i) => {
      console.log(i.name)
      doc.text(i.name, column, row, { align: 'center' })
      row += 40
    })

    row = 585

    doc.text(`Issuance Date: ${issued}`, column, row, { align: 'center' })

    row += 110

    if (opitoLogo) {
      doc.image(opitoLogo, 230, 695, { scale: 0.8 })
    }

    // const barcode = await bwipjs.toBuffer({
    //   bcid: 'ean13',
    //   text: file,
    //   includetext: true,
    //   height: 10,
    //   textxalign: 'center' // Always good to set this
    // })

    // await doc.image(barcode, 190, 610)

    row += 10
    column += 270

    doc.fontSize(14)

    doc.text(`Cert. No: ${certificate}`, column, row)

    row += 20

    if (expiry_type !== 0) {
      doc.text(`Expiry Date: ${expiry}`, column, row)
    }

    const qr = await bwipjs.toBuffer({
      bcid: 'qrcode',
      text: `${full_name}\nCert.#: ${certificate}\nIssued: ${issued}\nExpiry Date: ${expiry}`,
      scale: 1,
      textxalign: 'center' // Always good to set this
    })

    // await doc.image(qr, 460, 730)
    await doc.image(qr, 240, 610)

    await doc.end()

    res.status(200).send({ ...doc.info })
  } catch (err) {
    console.log(err)
    log.error(err)
    res.status(500).send(err)
  }
}

exports.createIdCard = async (req, res) => {
  // Create a document
  try {
    const { badge, full_name, user, certificate, expiry, course } = req.body

    const { name: courseName, cert_type, id_card, front_id, back_id } = course

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

    res.status(200).send({ ...doc.info })
  } catch (err) {
    console.log(req.body)
    log.error(err)
    res.status(500).send(err)
  }
}

exports.createWelcomeLetter = async (req, res) => {
  // Create a document

  try {
    const { badge, full_name, start, user, course } = req.body

    const { name: courseName, id_card, validity } = course

    const id = req.params.id
    const file = documentNumber(id)

    const fileName = `${process.env.WELCOME_LETTER_FOLDER}/${file}.pdf`

    const doc = await new PDFDocument({
      size: 'A4',
      font: 'Helvetica'
    })

    doc.info.Title = 'Welcome Letter'
    doc.info.Author = user.full_name
    doc.info.Subject = `${badge} - ${courseName}`
    doc.info.Producer = 'Axis v2.0'
    doc.info.CreationDate = new Date()

    await doc.pipe(fs.createWriteStream(fileName))

    await doc.fontSize(9)

    const col = 48
    let row = 48

    const textWidth = 595 - col * 2

    await writeHeader(doc, col, row, textWidth)

    row = 176

    await doc.text('Dear Sir/Madam,', col, row, {
      align: 'left',
      width: textWidth
    })

    row += 32

    await doc.text(
      `Thank you for registering the under-listed personnel for the ${courseName} Course at Tolmann Allied Services Company Limited:`,
      col,
      row,
      {
        align: 'justify',
        width: textWidth
      }
    )

    row += 32

    doc.font('Helvetica-Bold')

    drawTableRow(doc, col, row, [
      'S/N',
      'Name',
      'Training',
      'Available Date(s)'
    ])

    row += 32

    doc.font('Helvetica')

    drawTableRow(doc, col, row, [1, full_name, courseName, start])

    row += 48

    doc
      .font('Helvetica-Bold')
      .text('Getting to Tolmann Allied Services Company Limited', col, row, {
        underline: true
      })

    doc
      .font('Helvetica')
      .text(
        'The Training Facility is located right at the heart of Trans Amadi Industrial Layout, at Plot 7b, Mother cat Junction (a well-known bus stop), adjacent to Schlumberger, along Total Road.',
        col,
        doc.y,
        { align: 'justify', width: textWidth }
      )

    doc.font('Helvetica-Bold').text('Accommodation', col, doc.y + 10, {
      underline: true
    })

    doc
      .font('Helvetica')
      .text(
        'Accommodation is available at Greenwood Court Hotel, which is located within the same premises as the Training Facility (at the right hand side as you enter from the gate). Kindly liaise with your Logistics department if reservation would be required, the hassle of traffic jams is completely eradicated if you avail yourself of this opportunity.  Our booking team will be happy to assist - 08096382000, 08096482000. \n Check out time is on or before 12:00 hours on the date/day of your departure.  Should you require luggage storage, the reception desk at the Hotel will be of assistance. ',
        col,
        doc.y,
        { align: 'justify', width: textWidth }
      )

    doc
      .font('Helvetica-Bold')
      .text('TRAINING REGISTRATION & SESSIONS', col, doc.y + 10)

    doc.text(
      'Registration commences at 8 am, therefore you should be at the training venue on or before this time.',
      col,
      doc.y + 10,
      { align: 'justify', width: textWidth, continued: true }
    )

    doc
      .font('Helvetica')
      .text(
        'The course is a mix of theory and practical sessions; you will be assessed based on your understanding of the class session and your participation during the practical.',
        doc.x,
        doc.y,
        { align: 'justify', width: textWidth }
      )

    doc.text(
      'The course is a mix of theory and practical sessions; you will be assessed based on your understanding of the class session and your participation during the practical.',
      doc.x,
      doc.y + 10,
      { align: 'justify', width: textWidth }
    )

    doc
      .font('Helvetica-Bold')
      .text('Training starts at exactly 8am prompt.', col, doc.y + 10, {
        underline: true
      })

    doc.text(
      'IMPORTANT:  Kindly come with a valid means of identification i.e. Driver’s license/Voters card/International Passport/National ID card.',
      col,
      doc.y + 10,
      {
        underline: true
      }
    )
    doc
      .font('Helvetica')
      .text(
        'Tea/Coffee breaks and lunch will be served in the canteen during the training.',
        doc.x,
        doc.y + 10,
        { align: 'justify', width: textWidth }
      )

    doc.addPage()

    row = 48

    await writeHeader(doc, col, row, textWidth)

    row = 176

    doc
      .text(
        'Useful Telephone Numbers before/during the training are:  08099901280 (Dorathy) and 08099901281(Mercy).  You can also email ',
        doc.x,
        row,
        { align: 'justify', width: textWidth, continued: true }
      )
      .fillColor('#0288d1')
      .text('admin@tolmann.com', {
        continued: true,
        link: 'mailto:admin@tolmann.com',
        underline: true
      })
      .fillColor('#000')
      .text(' and ', { continued: true, underline: false, link: null })
      .fillColor('#0288d1')
      .text('training@tolmann.com', {
        link: 'mailto:training@tolmann.com',
        underline: true
      })

    doc
      .fillColor('#000')
      .text(
        'For further details, please contact the phone numbers/email addresses stated above.',
        doc.x,
        doc.y + 10,
        { align: 'justify', width: textWidth }
      )

    doc
      .font('Helvetica-Bold')
      .text('After Your Training: ', doc.x, doc.y + 10, {
        align: 'justify',
        width: textWidth,
        continued: true
      })
      .font('Helvetica')
      .text('You shall receive a certificate ', { continued: true })

    if (parseInt(id_card, 10) > 0) {
      doc.text('and ID card ', { continued: true })
    }

    if (parseInt(validity, 10) > 0) {
      doc.text(`valid for Four (${validity}) years`, { continued: true })
    }

    doc.text('.')

    doc.text(
      'Should you find that you have misplaced any of your belongings when you arrive home, please contact your training coordinator (training@tolmann.com); if the item has been found, the school will contact you to arrange for its return/pick-up.',
      doc.x,
      doc.y + 10,
      { align: 'justify', width: textWidth }
    )

    doc.text(
      'Thank you very much, we wish you a pleasant stay and a rewarding course.',
      doc.x,
      doc.y + 10,
      { align: 'justify', width: textWidth }
    )

    doc.text('Management.', doc.x, doc.y + 30)

    doc.text('Tolmann Allied Services Company Ltd', { oblique: true })

    await doc.end()
    await res.status(200).send({ ...doc.info })
  } catch (err) {
    console.log(req.body)

    log.error(err)
    res.status(500).send(err)
  }
}

const writeHeader = async (doc, col, row, textWidth) => {
  const logo = './models/welcome_letter/logo.png'

  await doc.image(logo, col, row, {
    width: 48,
    height: 48
  })

  row += 32

  await doc
    .font('Helvetica-Bold')
    .text('TOLMANN ALLIED SERVICES COMPANY LIMITED', col, row, {
      align: 'center',
      width: textWidth
    })

  row += 32

  await doc.font('Helvetica').text('COURSE JOINING INSTRUCTIONS', col, row, {
    align: 'left',
    width: textWidth
  })

  await doc.text('Doc. No: TMS/CJI/1', col, doc.y, {
    align: 'left',
    width: textWidth
  })

  row += 32

  await doc.text('Rev. 0', col, row, {
    align: 'left',
    width: textWidth
  })
}

const drawTableRow = (doc, col, row, cols) => {
  let left = col

  let top = row

  let width = 32

  let height = 32

  doc.rect(left, top, width, height).stroke()

  doc.text(cols[0], left, top + 10, {
    align: 'center',
    width: width
  })

  left += width
  width = 200

  doc.rect(left, top, width, height).stroke()

  doc.text(cols[1], left, top + 10, {
    align: 'center',
    width: width
  })

  left += width
  width = 165

  doc.rect(left, top, width, height).stroke()

  doc.text(cols[2], left, top + 10, {
    align: 'center',
    width: width
  })

  left += width
  width = 100

  doc.rect(left, top, width, height).stroke()

  doc.text(cols[3], left, top + 10, {
    align: 'center',
    width: width
  })
}
