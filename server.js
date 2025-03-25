const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const db = require('./db');
const port = 5000;

app.use(express.json());
app.use(cors());

app.delete('/user/:id', (req, res)=>{
    const {id} = req.params;
    db.query('DELETE FROM users WHERE id=?', [id], (err, results)=>{
        if(err) {
            console.log('DB users 삭제 오류');
            res.status(500).json({error:"데이터 삭제하는 중 오류"})
        }
        else{
            res.send(results);
        }
    });
})

app.put('/user', (req, res)=>{
    const {id, name, birthdate} = req.body;
    db.query(`UPDATE users SET name=?, birthdate=? WHERE id=?`,[name, birthdate, id], (err, results)=>{
        if(err){
            console.log('DB users 수정하기 오류');
            res.status(500).json({error:"데이터 수정하는 중 오류"})
        }else{
            res.json(results);

        }
    });
})

app.post('/user', (req, res)=>{
    const {name, birthdate} = req.body;
    db.query(`INSERT INTO users (name, birthdate) VALUES (?,STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'))`,[name, birthdate], (err, results)=>{
        if(err){
            console.log('DB users 추가하기 오류');
            res.status(500).json({error:"데이터 가져오는 중 오류"})
        }else{
            res.json(results);

        }
    });
})

app.get('/user', (req, res)=>{
    db.query(`SELECT id, name, DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate FROM users`, (err, results)=>{
        if(err){
            console.log('DB users 불러오기 오류');
            res.status(500).json({error:"데이터 가져오는 중 오류"})
        }else{
            res.json(results);

        }
    });
})

app.listen(port, ()=>{
    console.log(`서버가 포트 ${port}번에서 돌아가고 있음`);
})