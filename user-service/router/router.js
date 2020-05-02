// Import controller file
const register = require('../controller/register'),
      login = require('../controller/login'),
      user = require('../controller/user'),
      map = require('../controller/map')

// Export code inside curly brace
module.exports = app => {
    app.route('/')
       .get((req,res) => {
         if (req.cookies.logged_in == undefined || req.cookies.logged_in != 'yes')
            res.cookie('logged_in','no',{maxAge:360000})
         res.send('Welcome to Index Page!')
         }
       )
    app.route('/register')
       .get(register.register_page)
       .post(register.register_data)

    app.route('/login')
       .get(login.login_page)
       .post(login.authentication)

    app.route('/confirm/:token')
       .get(register.email_confirm)

    app.route('/api/v1/data/user')
       .get(user.list)
   
    app.route('/api/v1/update/data/user')
       .put(user.update_data)

    app.route('/api/v1/map/hospital')
       .get(map.get_data)

}