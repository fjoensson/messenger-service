const express = require('express')
const app = express()

const port = 8088 //move to config

app.use(express.json());
// app.use(globalErrorHandler);

app.use('/api/v1', require('./routes/v1/routes'));

app.listen(port, () => {
  console.log(`messaging-service listening on port:${port}`)
})