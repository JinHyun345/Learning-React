const mysql = require("mysql2");

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "#%gimco682GILgodarling",
    database : "mybox"
})

db.connect(err => {
    if(err){
        console.log("MySQL 연결오류:", err)
        return
    }
    console.log("MySQL 연결 성공");
});

module.exports = db;