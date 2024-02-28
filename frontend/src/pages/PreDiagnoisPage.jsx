import React from 'react';
import "../assets/css/prediag.css";
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { documentActions } from '../redux/documentSlice';


function PreDiagnoisPage(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const startDiagnosis = () => {
        // store data into redux
        let therapists = [];
        let members = [];
        for(let i=0; i<userRoles.length; i++){
            if(userRoles[i].role === "patient"){
                userRoles[i].documentData = {};
                members.push(userRoles[i]);
            }else{
                therapists.push(userRoles[i]);
            }
        }
        dispatch(documentActions.initData({
            identifier:inputGroupName,
            dateOfSession: inputDate,
            timeOfSession: inputTime,
            location: inputLoc,
            therapist: therapists,
            members: members,
        }));

        //next page
        navigate("/diagnois");
    }

    // role part
    const [userRoles, setUserRoles] = useState([]);
    const [inputRole, setInputRole] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputAge, setInputAge] = useState("");
    const [inputSex, setInputSex] = useState("male");
    const [inputHistory, setInputHistory] = useState("");
    const [inputDate, setInputDate] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [inputLoc, setInputLoc] = useState("");
    const [inputGroupName, setInputGroupName] = useState("");
    const scrollRef = useRef(null);

    const removeKeyword = (name) => {
        setUserRoles(userRoles.filter(item => item.name !== name));
    }
    const addRole = () => {
        let name = inputName;
        let age = inputAge;
        let sex = inputSex;
        let role = inputRole;
        let history = inputHistory
        setUserRoles([...userRoles, {role:role, name:name, age:age, sex:sex, history: history}]);
        setInputName("");
        setInputAge("");
        setInputRole("patient");
        setInputSex("male");
        setInputHistory("");
    }

    const showHistory = (history) => {
        if (history.length > 20) {
          return history.substring(0, 17) + "......";
        } else {
          return history;
        }
      }

    return (
            <div className='prediag'>
                <div className='prediag-container'>
                    <div className='prediag-block1'>
                        <div className='prediag-title font-c2'>Pre-Session</div>
                        <div className='prediag-insert-time prediag-session header-font'>
                            <div className="prediag-subsession header-font">
                                <div><label>Date of Session</label></div>
                                <input className='prediag-text' value={inputDate} onChange={(e) => setInputDate(e.target.value)} type="text" id="date-of-session" placeholder="The specific date the session was held."/>
                            </div>
                            <div className="prediag-subsession header-font">
                                <div><label>Time of Session</label></div>
                                <input className='prediag-text' type="text" value={inputTime} onChange={(e) => setInputTime(e.target.value)} id="time-of-session" placeholder="Start and end times."/>
                            </div>
                        </div>
              
                        
                        <div className="prediag-session header-font">
                            <div><label>Location</label></div>
                            <input className='prediag-text' type="text" id="location" value={inputLoc} onChange={(e) => setInputLoc(e.target.value)} placeholder="Where the session took place, if relevant."/>
                        </div>

                        <div className="prediag-session header-font">
                            <div><label>Group Name/Identifier</label></div>
                            <input className='prediag-text' type="text" id="group-name" value={inputGroupName} onChange={(e) => setInputGroupName(e.target.value)} placeholder="If the group has a specific name or identification number."/>
                        </div>
                        <div className='prediag-rolebox-session'>
                            <div className='header-font'><label>Participants</label></div>

                            <div className="roles-container">
                                <div className="roles-table-header">
                                    <div className="roles-table-row">
                                        <span>role</span>
                                        <span>name</span>
                                        <span>age</span>
                                        <span>gender</span>
                                        <span>history</span>
                                    </div>
                                </div>
                                <div ref={scrollRef} className="roles-table-body scrobar-1">
                                    {userRoles.map((item, i) => {
                                        return (

                                            <div className="roles-table-row" key={i}>
                                                
                                                <span>{item.role}</span>
                                                <span>{item.name}</span>
                                                <span>{item.age}</span>
                                                <span>{item.sex}</span>
                                                <span className='table-history'>{showHistory(item.history)}</span>
                                           
                                                <div><span className="role-table-operation" onClick={() => removeKeyword(item.name)}>Delete</span></div>
                                            </div>
                                           
                                            
                                        )
                                    })}
                                </div>
                                
                                <div className="roles-table-input">
                                    <div>
                                        <div className='roles-table-input-top'>
                                            <div className='roles-table-session'>
                                                <span>name:</span>
                                                <input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} ></input>
                                            </div>
                                            <div className='roles-table-session'>
                                                <span>age:</span>
                                                <input type="text" value={inputAge} onChange={(e) => setInputAge(e.target.value)} ></input>
                                            </div>
                                            <div className='roles-table-session'>
                                                <span>role:</span>
                                                <select value={inputRole} onChange={(e) => setInputRole(e.target.value)}>
                                                    <option value="patient">patient</option>
                                                    <option value="therapist">therapist</option>
                                                </select>
                                            </div>
                                            <div className='roles-table-session'>
                                                <span>gender:</span>
                                                <select value={inputSex} onChange={(e) => setInputSex(e.target.value)}>
                                                    <option value="male">male</option>
                                                    <option value="female">female</option>
                                                    <option value="others">others</option>
                                                </select>
                                            </div>

                                        </div>
                                        <div className='roles-table-input-bot'>
                                            <div>history:</div>
                                            <div>
                                                <textarea className='history-text' value={inputHistory} onChange={(e) => setInputHistory(e.target.value)} name="" id="" cols="30" rows="10" ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button className="table-operation" onClick={addRole}>Add Role</button>
                                </div>
  

                            </div>
                        </div>
                        <div className='prediag-2'>
                            <button className='prediag-start-btn font-c2' onClick={startDiagnosis}>Start</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default PreDiagnoisPage;