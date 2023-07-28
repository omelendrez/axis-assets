module.exports = (app) => {
  require('./pdf-routes')(app)
  require('./upload-routes')(app)
  require('./xls-routes')(app)
  require('./email-routes')(app)
  require('./template-routes')(app)
}
