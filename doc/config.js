module.exports = {
    servers: [
        {
          url: 'https://pensmed.com:3333',
          description: 'Logistic Service'
        },
        {
          url: 'https://pensmed.com:3000',
          description: 'User Service'
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