const { readFileSync } = require('fs')
const { query, mutate, dropAll, alter } = require('./client')

const start = async () => {
  console.log('drop all')
  await dropAll()
  
  console.log('create schema')
  await alter(readFileSync('./schema').toString())
  
  console.log('add data')
  await mutate(readFileSync('./seed').toString())

  console.log('query data')
  const { everyone } = await query(`{
    everyone(func: anyofterms(name, "Michael Amit")) {
      name
      friend {
        name@ru:ko:en
        friend { expand(_all_) { expand(_all_) } }
      }
    }
  }`)

  console.log(everyone)
}

start()