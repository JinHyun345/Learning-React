const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '#%gimco682GILgodarling',
        database: 'mybox'
    }
)

db.connect(err=>{
    if(err) {
        console.log('DB 연결 오류');
        return
    }
    console.log('DB 연결 성공');
});

module.exports = db;