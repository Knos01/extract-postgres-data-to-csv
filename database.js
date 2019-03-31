const pg = require('pg')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    { id: 'id', title: 'ID' },
    { id: 'text', title: 'Testo' },
    { id: 'complete', title: 'Completato' }
  ],
  fieldDelimiter: ','
})
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/postgres'

// const client = new pg.Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'admin',
//   port: 5432
// });

const client = new pg.Client(connectionString)

client.connect()

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`Insert email of the user:`, (email) => {
  console.log(`Hi ${email}!`)
  readline.close()

  client.query('SELECT * FROM public.items;', (err, res) => {
    if (err) {
      return console.log(err)
    }
    console.log(JSON.parse(JSON.stringify(res.rows)))
    const data = JSON.parse(JSON.stringify(res.rows))

    csvWriter.writeRecords(data)
      .then(() => {
        console.log('The CSV file was written successfully')

      })
      .catch(() => {
        console.log('Error in writing CSV file!')
        // client.end()
      })
  })
})
