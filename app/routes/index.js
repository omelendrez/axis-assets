module.exports = (app) => {
  require('./pdf-routes')(app)
  require('./upload-routes')(app)
}
