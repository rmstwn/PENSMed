// Import controller file
const register = require('../controller/register'),
      login = require('../controller/login'),
      user = require('../controller/user'),
      hospital = require('../controller/hospital'),
      stock = require('../controller/hospital_data'),
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

    app.route('/edit')
       .get(user.edit_page)   

    app.route('/confirm/:token')
       .get(register.email_confirm)

    app.route('/api/v1/data/user')
       .get(user.list)
   
    app.route('/api/v1/update/data/user')
       .put(user.update_data)

    app.route('/api/v1/data/hospital')
       .get(hospital.list_all)

    app.route('/api/v1/map/hospital')
       .get(map.get_data)

    app.route('/api/v1/data/hospital/:name')
       .get(hospital.hospital_data)

    app.route('/api/v1/update/data/hospital')
       .put(stock.update_data)

    app.route('/api/v1/delete/data/hospital')
       .delete(hospital.remove_all)

    app.route('/api/v1/delete/data/hospital/:name')
       .delete(hospital.remove_one)       

}