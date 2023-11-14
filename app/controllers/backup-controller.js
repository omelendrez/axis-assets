const exec = require('child_process').exec
const fs = require('fs')

const createBackup = async (req, res) => {
  const backup = exec(
    'cd backup && bash file-backup.sh ',
    function (err, stdout, stderr) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      if (stderr) {
        console.log(stderr)
      }
      if (stdout) {
        console.log(stdout)
      }
    }
  )

  backup.on('exit', function (code) {
    console.log(`Exit with code ${code}`)
    res.status(200).send({ message: 'Backup completed successfuly!' })
  })
}

const restoreBackup = async (req, res) => {
  if (fs.readdirSync('./backup').filter((f) => f.includes('gz')).length) {
    const restore = exec(
      'cd backup && bash file-restore.sh ',
      function (err, stdout, stderr) {
        if (err) {
          console.log(err)
          return res.status(500).send(err)
        }
        if (stderr) {
          console.log(stderr)
        }
        if (stdout) {
          console.log(stdout)
        }
      }
    )

    restore.on('exit', function (code) {
      console.log(`Exit with code ${code}`)
      res.status(200).send({ message: 'Restore completed successfuly!' })
    })
  } else {
    console.log('No files to restore')
    res.status(400).send({ message: 'No files to restore!' })
  }
}

module.exports = { createBackup, restoreBackup }
