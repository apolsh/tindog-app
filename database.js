const mysql = require("mysql2");
const config = require('config');

const MYSQL_HOST = config.get('mysqlHost');
const MYSQL_USER = config.get('mysqlUser');
const MYSQL_DB = config.get('mysqlDB');
const MYSQL_PW = config.get('mysqlPW');

var db;

function connectDB() {
    if(!db){
        try {
            db = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                database: MYSQL_DB,
                password: MYSQL_PW
            }).promise();

            console.log('connected to database');
            return db;
        } catch (e) {
            console.log('database connection error', e.message);
            process.exit(1);
        }
    }
        return db;

}

module.exports = connectDB();


