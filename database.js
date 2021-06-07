const mysql = require("mysql2");
const config = require('config');

const MYSQL_HOST = config.get('mysqlHost');
const MYSQL_USER = config.get('mysqlUser');
const MYSQL_DB = config.get('mysqlDB');
const MYSQL_PW = config.get('mysqlPW');

var db;

// function connectDB() {
//     if(!db){
//         try {
//             db = mysql.createPool({
//                 connectionLimit: 30,
//                 waitForConnections: true,
//                 queueLimit: 0,
//                 host: MYSQL_HOST,
//                 user: MYSQL_USER,
//                 database: MYSQL_DB,
//                 password: MYSQL_PW
//             }).promise();
//
//             console.log('connected to database');
//             return db;
//         } catch (e) {
//             console.log('database connection error', e.message);
//             process.exit(1);
//         }
//     }
//         return db;
// }
//
// module.exports = connectDB();
function createPool() {
    try {
        const mysql = require('mysql2');

        const pool = mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                database: MYSQL_DB,
                password: MYSQL_PW,
            connectionLimit: 20,
            waitForConnections: true,
            queueLimit: 0
        });

        const promisePool = pool.promise();

        return promisePool;
    } catch (error) {
        return console.log(`Could not connect - ${error}`);
    }
}

const pool = createPool();

module.exports = {
    connection: async () => pool.getConnection(),
    execute: (...params) => pool.execute(...params)
};


