const db_config = function () {
    
   
     this.live_url = "http://localhost:3000";

    // test database local
    this.localdatabase = 'node-practical-0102';
    this.localusername = null;
    this.localpassword = null;
    this.localhost = 'localhost';
    this.localport = '27017';
    this.localauthSource = 'node-practical-0102';
};

module.exports = new db_config();

