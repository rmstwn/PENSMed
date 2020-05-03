const express = require('express'),
      app = express(),
      swaggerUi = require('swagger-ui-express'),
      swagger = require('./swagger')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger));
app.listen(8888, () => {console.log('Listenting to 8888')})