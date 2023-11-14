const exec = require('child_process').exec
const fs = require('fs')

const restoreBackup = () => {
  if (fs.readdirSync('./backup').filter((f) => f.includes('gz')).length) {
    const restore = exec(
      'cd backup && bash file-restore.sh ',
      function (err, stdout, stderr) {
        if (err) {
          return console.log(err)
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
    })
  } else {
    console.log('No files to restore')
  }
}

module.exports = { restoreBackup }
