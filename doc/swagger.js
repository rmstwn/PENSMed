const config = require('./config'),
      logistic = require('./api/logistic'),
      user_management = require('./api/user'),
      hospital = require('./model/hospital'),
      user = require('./model/user')
module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'PENSMed',
    description: 'PENSMed API',
    termsOfService: '#',
    contact: {
      name: 'TEKKOMGAAPATIS',
      email: 'pensmed@pens.ac.id',
      url: 'https://www.pensmed.com/'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  ...config,
  paths: {...logistic,...user_management},
  components: {
    schemas: {
    ...hospital,...user
    }
  }
};