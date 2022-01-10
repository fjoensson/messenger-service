const express = require('express')
const app = express()

const port = 8088 //move to config

app.use(express.json());
// app.use(globalErrorHandler); TODO

app.use('/api/v1', require('./routes/v1/messenger'));

app.listen(port, () => {
  console.log(`messenger-service listening on port:${port}`)
})