const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 5000;

app.use(express.json()); /*얘가 JSON 형식의 request를 해석해주어서 request.body를 쓸 수 있으므로
바디파서 안 깔아도 됨! */
app.use(cors());

app.post('/api/users', (request, response)=>{
    const {name} = request.body; /*Destructuring : request.body에서 name만 뽑아오는 문법
    const name = request.body.name;을 간결하게 쓴 거임. */
    db.query('INSERT INTO users (name) VALUES (?)', [name], (err, results)=>{
        if(err){
            console.log("사용자 추가 오류:", err);
            response.status(500).json({error:"데이터 추가하는중에 오류발생"})
        }else{
            response.json({id: results.insertId, name});
        }
    });
});
app.put('/api/users/:id', (request, response)=>{
    const {id} = request.params;
    const {name} = request.body;
    db.query('UPDATE users SET name=? WHERE id=?', [name, id], (err, results)=>{
        if(err){
            console.log("사용자 수정 오류:", err);
            response.status(500).json({error:"데이터 수정하는중에 오류발생"})
        }else{
            response.send("수정 완료");
        }
    });
});
app.delete('/api/users/:id', (request, response)=>{
    const {id} = request.params;
    db.query('DELETE FROM users where id=?', [id], (err, results)=>{
        if(err){
            console.log("사용자 삭제 오류:", err);
            response.status(500).json({error:"데이터 삭제하는중에 오류발생"})
        }else{
            response.json("삭제 완료");
        }
    });
});
app.get('/api/users', (request, response)=>{
    db.query('SELECT * FROM users', (err, results)=>{
        if(err){
            console.log("사용자 조회 오류:", err);
            response.status(500).json({error:"데이터 가져오는중에 오류발생"})
        }else{
            response.json(results);
        }
    });
});

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})