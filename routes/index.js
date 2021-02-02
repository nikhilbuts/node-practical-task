const config = require('../config');

module.exports = function (router) {
	router.get('*',function (req, res) {
        console.log("404 Hit");
        res.render('404', {
            'title': 'E-Stores | 404',
            host: config.pre + req.headers.host,
		});
  });    
}