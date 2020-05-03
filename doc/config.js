module.exports = {
    servers: [
        {
          url: 'http://localhost:3000/',
          description: 'Local server'
        },
        {
          url: 'http://pensmed.com/',
          description: 'Development server'
        }
      ],
      security: [
        {
          ApiKeyAuth: []
        }
      ],
      tags: [
        {
          name: 'Logistic Service'
        },
        {
          name: 'User Service'
        }
      ],
}