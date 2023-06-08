const documentNumber = (num) =>
  (parseInt(num, 10) + 1000000000000).toString().substring(1)

module.exports = { documentNumber }
