const express = require('express')
const app = express()
const port = 8088

app.get('/', (req, res) => {
  res.send('Hello from messaging-service!')
})

app.listen(port, () => {
  console.log(`messaging-service listening on port:${port}`)
})