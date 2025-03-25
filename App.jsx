import { useState, useEffect } from 'react'
import '../style/App.css'
import axios from "axios";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [newUserDate, setNewUserDate] = useState(null);
  const [addButton, setAddButton] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/user')
      .then(response => {setUsers(response.data); })
      .catch(error => console.log('User read error:', error))
  };

  const addUser = ()=>{
    if(!newUser || !newUserDate){
      alert("이름과 생년월일을 입력하세용");
      return;
    }
    else{
      axios.post('http://localhost:5000/user',{
        name: newUser,
        birthdate: newUserDate
      }).then(()=>{
        setNewUser("");
        setNewUserDate(null);
        fetchUsers();
        setAddButton(false);
      }).catch(error=>console.log('사용자 추가 오류:', error));  
    }
  }
  const editUser = (id) => {
    axios.put('http://localhost:5000/user', {
      id: id,
      name: editName,
      birthdate: editDate ? editDate.format("YYYY-MM-DD") : null, // 문자열 변환
    }).then(() => {
      setEditId(null);
      setEditName("");
      setEditDate(null);
      fetchUsers();
    }).catch(error => console.log('사용자 수정 오류:', error));
  };
  const deleteUser = (id) =>{
    axios.delete(`http://localhost:5000/user/${id}`)
    .then(()=>{
      console.log('삭제성공띠!')
      fetchUsers();
    }).catch(error=>console.log('사용자 삭제 오류:', error));
  };

  return (
    <div>
      <h1>user list</h1>

        {addButton ? 
        <div>
          <input
        type='text'
        value={newUser}
        onChange={(e) => { setNewUser(e.target.value) }}
        placeholder='이름'
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="생년월일"
          value={newUserDate}
          onChange={(date) => { setNewUserDate(date) }}
          minDate={dayjs('1970-01-01')}
          maxDate={dayjs('2008-12-31')} />
      </LocalizationProvider>
      <button onClick={addUser}>추가</button>
        </div> :
        <button onClick={()=>{setAddButton(true)}}>add user</button>
        }
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {editId===user.id ?
            <>
              <input value={editName}
              onChange={(e)=>{setEditName(e.target.value)}}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="생년월일"
                  value={editDate}
                  onChange={(date) => { setEditDate(date) }}
                  minDate={dayjs('1970-01-01')}
                  maxDate={dayjs('2008-12-31')} />
              </LocalizationProvider>
              <button onClick={()=>{editUser(user.id)}}>완료</button>
              <button onClick={()=>{setEditId(null)}}>취소</button>
            </> :
            <>
            {user.name} : {user.birthdate}
            <button onClick={()=> {
              setEditId(user.id);
              setEditName(user.name);
              setEditDate(dayjs(user.birthdate));
              }}>edit</button>
              <button onClick={()=>{deleteUser(user.id)}}>삭제</button>
            </>
            }
            </li>
        ))}
      </ul>
    </div>
  )
}

export default App
