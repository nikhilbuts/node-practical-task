const db = require('./db');

const config = function () {

	this.live_url = db.live_url;

	this.dbLocal = {
		'database' : 'node-practical-task-0102',
		'host' : '127.0.0.1',
		'port' : '27017'	
	}
	
	this.port = process.env.PORT || 3000;

	this.sessionSecret = 'topSecretSessionKey';
	this.pre = (this.port == 3000) ? 'http://' : 'https://';

	this.apiSecret = "gh^sahg$#sabghjq9&g7safg76";

};

module.exports = new config();
