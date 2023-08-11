const documentNumber = (num) =>
  (parseInt(num, 10) + 1000000000000).toString().substring(1)

const toWord = (num) => {
  const numbers = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten'
  ]
  return numbers[num]
}

module.exports = { documentNumber, toWord }
