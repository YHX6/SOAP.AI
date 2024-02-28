import React from 'react';
import "../assets/css/prediag.css";
import { useNavigate } from 'react-router-dom';
import { useEffect,useRef, useState } from "react";

function PreDiagnoisPage(props) {
    const navigate = useNavigate();
    const startDiagnosis = () => {
        // package json data to the next page
        // let preDiagData = {}
        navigate("/diagnois")
    }
    // role part
    const [userRoles, setUserRoles] = useState([]);
    const [inputRole, setInputRole] = useState("patient");
    const [inputName, setInputName] = useState("");
    const [inputAge, setInputAge] = useState("");
    const [inputSex, setInputSex] = useState("male");
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
        setUserRoles([...userRoles, {role:role, name:name, age:age, sex:sex}]);
        setInputName("");
        setInputAge("");
        setInputRole("patient");
        setInputSex("male");
    }

    return (
        <div className='main'>
            <div className='prediag'>
                <div className='prediag-container'>
                    <div className='prediag-block1'>
                        <div className='prediag-title font-c2'>Pre-Diagnois</div>
                        <div className='prediag-insert-time prediag-session header-font'>
                            <div class="prediag-subsession header-font">
                                <div><label for="date-of-session">Date of Session</label></div>
                                <input className='prediag-text' value={inputDate} onChange={(e) => setInputDate(e.target.value)} type="text" id="date-of-session" placeholder="The specific date the session was held."/>
                            </div>
                            <div class="prediag-subsession header-font">
                                <div><label for="time-of-session">Time of Session</label></div>
                                <input className='prediag-text' type="text" value={inputTime} onChange={(e) => setInputTime(e.target.value)} id="time-of-session" placeholder="Start and end times."/>
                            </div>
                        </div>
              
                        
                        <div class="prediag-session header-font">
                            <div><label for="location">Location</label></div>
                            <input className='prediag-text' type="text" id="location" value={inputLoc} onChange={(e) => setInputLoc(e.target.value)} placeholder="Where the session took place, if relevant."/>
                        </div>
                        <div class="prediag-session header-font">
                            <div><label for="group-name">Group Name/Identifier</label></div>
                            <input className='prediag-text' type="text" id="group-name" value={inputGroupName} onChange={(e) => setInputGroupName(e.target.value)} placeholder="If the group has a specific name or identification number."/>
                        </div>
                        <div className='prediag-rolebox-session'>
                            <div className='header-font'><label for="group-name">Participants</label></div>

                            <div className="roles-container">
                                <div className="roles-table-header">
                                    <div className="roles-table-row">
                                        <span>role</span>
                                        <span>name</span>
                                        <span>age</span>
                                        <span>gender</span>
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
                                                <span className="role-table-operation" onClick={() => removeKeyword(item.name)}>Delete</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                
                                <div className="roles-table-input">
                                    <select value={inputRole} onChange={(e) => setInputRole(e.target.value)}>
                                        <option value="patient">patient</option>
                                        <option value="therapist">therapist</option>
                                    </select>
                                    <input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}></input>
                                    <input type="text" value={inputAge} onChange={(e) => setInputAge(e.target.value)}></input>
                                    <select value={inputSex} onChange={(e) => setInputSex(e.target.value)}>
                                        <option value="male">male</option>
                                        <option value="female">female</option>
                                    </select>
                                    <div></div>
                                    <button className="table-operation" onClick={addRole}>Add Role</button>
                                </div>
                            </div>
                        </div>
                        <div className='prediag-2'>
                            <button className='prediag-start-btn font-c2' onClick={startDiagnosis}>start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreDiagnoisPage;