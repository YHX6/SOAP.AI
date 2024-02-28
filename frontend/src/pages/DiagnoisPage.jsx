import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";
import { useEffect,useRef, useState } from "react";
import axios from "axios";
import { documentToolRouter } from "../config/routeConfig";
import { getCurrentTimeFormatted } from "../utils/util";
import { wrapBasicInformation} from "../utils/editorWraper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';


// avatars
import m1 from "../assets/imgs/sample-avatar/m1.png";
import m2 from "../assets/imgs/sample-avatar/m2.png";
import m3 from "../assets/imgs/sample-avatar/m3.png";
import f1 from "../assets/imgs/sample-avatar/f1.png";
import f2 from "../assets/imgs/sample-avatar/f2.png";
import f3 from "../assets/imgs/sample-avatar/f3.png";
import o1 from "../assets/imgs/sample-avatar/o1.png";
import o2 from "../assets/imgs/sample-avatar/o2.png";
import o3 from "../assets/imgs/sample-avatar/o3.png";
import df from "../assets/imgs/sample-avatar/default.png";
import documentSlice, { documentActions } from "../redux/documentSlice";




const avatarList = {male:[m1, m2, m3], female:[f1,f2,f3], other:[o1, o2, o3]};
function formatTime(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以+1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function DiagnosisPage() {
    const navigate = useNavigate();
    const sessionInfo = useSelector((state) => state.document.sessionInfo);
    const therapists = useSelector((state) => state.document.therapist);
    const members = useSelector((state) => state.document.members);
    const dispatch = useDispatch();
    // const [avatarList, setAvatarList] = useState();
    const [buttonGroups, setButtonGroups] = useState([]);


    const [messages, setMessages] = useState([]);
    const editorRef = useRef();
    const scrollRef = useRef(null);
    const [keywords, setKeywords] = useState([]);
    const [inputWord, setInputWord] = useState("");
    const [inputTag, setInputTag] = useState("");


    const documentData = useSelector((state) => state.document.documentData);
    const nextPage = () => {
        console.log(documentData);
        navigate("/individual-report");
    }




    useEffect(() => {
        let newButtonGroups = [];  // name, role, avatar
        let mCount = 0;
        let fCount = 0;
        let oCount = 0;
        for(let i=0; i<therapists.length; i++){
            if(therapists[i].sex === "male" && mCount < 3){
                newButtonGroups.push({role:therapists[i].role, name:therapists[i].name, avatar:avatarList.male[mCount]});
                mCount ++;
            }else if(therapists[i].sex === "female" && fCount < 3){
                newButtonGroups.push({role:therapists[i].role, name:therapists[i].name, avatar:avatarList.female[fCount]});
                fCount ++;
            }else if(therapists[i].sex === "other" && oCount < 3){
                newButtonGroups.push({role:therapists[i].role, name:therapists[i].name, avatar:avatarList.other[oCount]});
                oCount ++;
            }else{
                newButtonGroups.push({role:therapists[i].role, name:therapists[i].name, avatar:df});
            }
        }
        for(let i=0; i<members.length; i++){
            if(members[i].sex === "male" && mCount < 3){
                newButtonGroups.push({role:members[i].role, name:members[i].name, avatar:avatarList.male[mCount]});
                mCount ++;
            }else if(members[i].sex === "female" && fCount < 3){
                newButtonGroups.push({role:members[i].role, name:members[i].name, avatar:avatarList.female[fCount]});
                fCount ++;
            }else if(members[i].sex === "other" && oCount < 3){
                newButtonGroups.push({role:members[i].role, name:members[i].name, avatar:avatarList.other[oCount]});
                oCount ++;
            }else{
                newButtonGroups.push({role:members[i].role, name:members[i].name, avatar:df});
            }
        }
        setButtonGroups(newButtonGroups);
    }, [])




    // keyword part
    const removeKeyword = (kw) => {
        setKeywords(keywords.filter(item => item.word !== kw));
    }
    const addkeyword = () => {
        let w = inputWord;
        let t = inputTag;
        let currentTime = getCurrentTimeFormatted();
        setKeywords([...keywords, {word:w, tag:t, time:currentTime}])
        setInputWord("");
        setInputTag("");
    }

    useEffect(() => {
        // every time adding new messages, the Text Content will scroll down automatically
        if (scrollRef.current) {
        const { current } = scrollRef;
        current.scrollTop = current.scrollHeight;
        }
    }, [messages]); // depends on messages


    const handleTranscript = (role, name, text) => {
        let inputContent = {
            "role": role + " - " + name,
            "time": formatTime(new Date()),
            "conv": text
        }
        setMessages([...messages, inputContent]);
    };



    const storeDocumentData = (data, title) => {
        for(let i=0; i<data[title].length; i++){
            console.log(data[title][i]);
            console.log(data[title][i]["Patient Name"] in documentData)
            if(data[title][i]["Patient Name"] in documentData){
                dispatch(documentActions.addPatientData({
                    person:data[title][i]["Patient Name"], 
                    key:title,
                    value: data[title][i]
                }))
            }
        }
    }

    const addEditorSection = (selectedOption, customizedOption, AIprompt) => {


        if(selectedOption === "Basic Information"){
            if(editorRef.current){
                console.log(members[0])
                console.log(members[0].name)

                for(let i=0; i<members.length; i++){
                    dispatch(documentActions.addPatientData({
                        person:members[i]["name"],
                        key:"Individual Report",
                        value: {
                            "Name":members[i]["name"], 
                            "Group Identifier":sessionInfo.identifier,
                            "Date of Session":sessionInfo.dateOfSession,
                            "Time of Session":sessionInfo.timeOfSession,
                            "Location":sessionInfo.location,
                        }
                    }))
                }
                editorRef.current.setRawContent(wrapBasicInformation(sessionInfo, members, therapists));
            }
        }else if (selectedOption === "S (Subject)"){
            axios.post(documentToolRouter, {
                task: "ASK_SUBJECT",
                prompt:AIprompt,
                content: members,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){

                    storeDocumentData(resp.data.data, resp.data.title);
                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));
        }else if (selectedOption === "O (Object)"){
            axios.post(documentToolRouter, {
                task: "ASK_OBJECT",
                prompt:AIprompt,
                notes: keywords,
                transcript: messages,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){
                    storeDocumentData(resp.data.data, resp.data.title);
                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));

        }else if (selectedOption === "A (Assessment)"){
            axios.post(documentToolRouter, {
                task: "ASK_ASSESSMENT",
                prompt:AIprompt,
                notes: keywords,
                transcript: messages,
                description: members,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){
                    storeDocumentData(resp.data.data, resp.data.title);
                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));
        }else if (selectedOption === "P (Plan)"){
            axios.post(documentToolRouter, {
                task: "ASK_PLAN",
                prompt:AIprompt,
                notes: keywords,
                transcript: messages,
                description: members,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){
                    storeDocumentData(resp.data.data, resp.data.title);
                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));
        }else if (selectedOption === "Customize"){
            axios.post(documentToolRouter, {
                task: "ASK_CUSTOMIZE",
                prompt:AIprompt,
                notes: keywords,
                section_name:customizedOption,
                transcript:  messages,
                description: members,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){
                    storeDocumentData(resp.data.data, resp.data.title);
                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));
        }

        // console.log(selectedOption)
        // console.log(customizedOption)
        // console.log(AIpromp)

    }



    return ( 
        <div className="main">
            <div className="diagnois-page">
                <div className="diagnois-page-left">
                    {/*  key words  component*/}
                    <div className="diagnois-page-left-top">
                        <div className="keyword-container">
                            <div className="keyword-table-header">
                                <div className="keyword-table-row">
                                    <span>Notes</span>
                                    <span>Tag</span>
                                    <span>Time</span>
                                    <span></span>
                                </div>
                            </div>

                            <div className="keyword-table-body scrobar-1">
                                {keywords.map((item, i) => {
                                    return (
                                        <div className="keyword-table-row" key={i}>
                                            <span>{item.word}</span>
                                            <span>{item.tag}</span>
                                            <span>{item.time}</span>
                                            <span className="table-operation" onClick={() => removeKeyword(item.word)}>-</span>
                                        </div>

                                    )
                                })}
                            </div>
                            
                            <div className="keyword-table-input">
                                <input type="text" value={inputWord} onChange={(e) => setInputWord(e.target.value)}></input>
                                <input type="text" value={inputTag} onChange={(e) => setInputTag(e.target.value)}></input>
                                <div></div>
                                {/* <input type="text" value={inputFrom} onChange={(e) => setInputFrom(e.target.value)}></input> */}
                                <button className="table-operation" onClick={addkeyword}>+</button>
                            </div>

                        </div>
                    </div>


                    {/* transcription conponent */}
                    <div className="diagnois-page-left-bottom">
                        <div className="diagnois-page-title font-c2">Transcript</div>
                        {/* conversations */}
                        <div ref={scrollRef} className="diagnois-page-conversations">
                            {messages.map((message, index) => (
                                <div key={index} style={{ marginBottom: '7px' }}>
                                    <div style={{fontSize: '0.8em', marginTop: '2px'}}>{message.time}</div>
                                    <div><strong>{message.role}:</strong> {message.conv}</div>
                                </div>
                            ))}
                        </div>

                        <div className="audio-btns">
                            {buttonGroups.map((item, i) => {
                                return (
                                    <div className="audio-btn-box" key={i}>
                                        <SpeechButton onTranscript={(text) => handleTranscript(item.role, item.name, text)} avatar= {item.avatar}></SpeechButton>
                                        <div>{item.role}</div>
                                        <div>{item.name}</div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>

                </div>

                <div className="diagnois-page-right">
                    <MyEditor showTools={true} ref={editorRef} addEditorSection={addEditorSection}></MyEditor>
                    
                    <div className='button-container'>
                        <button className='script-creation-btn' onClick={nextPage}>Individual Report</button>
                    </div>
                </div>

            </div>
        </div>
     );
}

export default DiagnosisPage;