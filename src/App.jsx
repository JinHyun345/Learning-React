import { useState, useEffect} from 'react'
import axios from "axios";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style/App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hello from "./components/Hello"

const API_URL = "http://localhost:5000/api/users";

function Memo(){
  return <h1>memo</h1>
}

function Appp() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [editId, setEditId] = useState(null); /*수정할 사용자 ID를 editId에 저장 */
  const [newName, setNewName] = useState(""); /*수정할 이름을 newName에 저장 */

 /*사용자 목록 불러오기 */
  useEffect(()=>{
    fetchUsers();
  }, []); /*얘는 렌더링 시 한 번만 실행됨 */

const fetchUsers = ()=>{
  axios.get(API_URL)
  .then(response=>setUsers(response.data))
  .catch(error => console.log("데이터 불러오기 오류:", error))
};
 /*사용자 추가하기 */
 const addUser = ()=>{
  if(!newUser) return;
  axios.post(API_URL, {name : newUser}) /*데이터를 post 방식으로 서버로 전송, 
  이때 {name : newUser} 객체가 HTTP request의 body에 담겨서 서버로 전달됨*/
  .then(()=>{
    setNewUser(""); /*목록 한 번 비우고 다시 불러와서 업데이트한다 */
    fetchUsers();
  })
  .catch(error=>console.log("사용자 추가 오류:", error));
 };
 /*사용자 수정하기 (put 요청)*/
 const updateUser = (id) => {
  axios.put(`http://localhost:5000/api/users/${id}`, {name: newName}) 
  /*put요청, 수정 서버로 id는 params형태로 보내고 name에는 newName 담아서 post 방식으로 보냄 */
  .then(()=>{
    setUsers(users.map(user=> /*map은 배열을 순회한다 */
      user.id === id ? {...user, name: newName} : user
      /*...user는 기존 객체를 그대로 복사해왔음을 의미, 다른 키값 고대로 놔두고 name값만 newName으로 변경한 새로운 객체를 반환하는거임 */
    ));
    setEditId(null);
    setNewName("");
    /*수정에 쓰인 그릇과도 같은 editId와 newName을 초기화 */
  })
  .catch(error=>console.error("유저 수정 오류:", error));
 };
 const deleteUser = (id) => {
  axios.delete(`http://localhost:5000/api/users/${id}`) 
  .then(()=>{
    setUsers(users.filter(user => user.id !== id));
    })
  .catch(error=>console.error("유저 삭제 오류:", error));
 };

  return (
    <Router>
      <nav>
        <h1><Link to="/">LIT</Link></h1>
        <h1><Link to ="/memo">memo</Link></h1>
      </nav>
      <input value={newUser} 
      onChange= {(e)=> setNewUser(e.target.value)} placeholder='이름 입력'/>
      <button onClick={addUser}>+</button>
      <h3>사용자 목록</h3>
      <ul>
        {users.map(user=>(
          <li key={user.id}>
            {editId === user.id ? (
              <>
              <input
              value={newName}
              onChange={(e)=>setNewName(e.target.value)}
              /*입력필드에 값이 바뀔 때마다 newName 값을 그 값으로 업데이트 */
              />
              <button onClick={()=>updateUser(user.id)}>저장</button>
              {/* 수정누르면 user.id를 updateUser 함수로 전달하고 실행 */}
              <button onClick={()=>setEditId(null)}>취소</button>
               {/* 취소누르면 editId가 다시 초기값인 null로 바뀌면서 삼항연산자 False에 해당하는 렌더링으로 바뀜 */}
              </>
            ) : (
              <>
              {user.name}
              <button onClick={()=>{setEditId(user.id); setNewName(user.name);}}>수정</button>
              {/* 수정버튼 누르면 editId에 user.id가 저장되고 newName에 user.name이 저장됨으로써
              null이었던 editId값이 user.id가 되어 삼항연산자가 true로 바뀜. 따라서
              user.name과 수정버튼이 있던 자리에 input text 입력 필드와 저장버튼, 취소 버튼이 생김*/}
              <button onClick={()=>{deleteUser(user.id)}}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <Routes>
        <Route path="/memo" element={<Memo/>}/>
      </Routes>
    </Router>
  );
}

export default Appp
