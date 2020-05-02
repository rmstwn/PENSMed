const hospital = require('../controller/hospital'),
      stock = require('../controller/hospital_data')

module.exports = app => {
    app.route('/api/v1/data/hospital')
       .get(hospital.list_all)
    app.route('/api/v1/data/hospital/:name')
       .get(hospital.hospital_data)
    app.route('/api/v1/add/data/hospital')
       .post(hospital.create_data)
    app.route('/api/v1/update/data/hospital')
       .put(stock.update_data)
    app.route('/api/v1/delete/data/hospital')
       .delete(hospital.remove_all)
   app.route('/api/v1/delete/data/hospital/:name')
       .delete(hospital.remove_one)
}