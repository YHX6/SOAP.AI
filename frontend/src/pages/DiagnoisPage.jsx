import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";
import { useEffect,useRef, useState } from "react";
import axios from "axios";
import { documentToolRouter } from "../config/routeConfig";
import { getCurrentTimeFormatted } from "../utils/util";
import { wrapBasicInformation} from "../utils/editorWraper";
import { useDispatch, useSelector } from "react-redux";


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




const defaultKeywordList = [
    // {word:"HADD", tag:"Ideation", time:"John"},
    // {word:"Asd", tag:"testtag", time:"Amy"},
]

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
    const sessionInfo = useSelector((state) => state.document.sessionInfo);
    const therapists = useSelector((state) => state.document.therapist);
    const members = useSelector((state) => state.document.members);
    const dispatch = useDispatch();
    // const [avatarList, setAvatarList] = useState();
    const [buttonGroups, setButtonGroups] = useState([]);


    const [messages, setMessages] = useState([]);
    const editorRef = useRef();
    const scrollRef = useRef(null);
    const [keywords, setKeywords] = useState(defaultKeywordList);
    const [inputWord, setInputWord] = useState("");
    const [inputTag, setInputTag] = useState("");


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
            }else if(therapists[i].sex === "female" && fCount < 3){
                newButtonGroups.push({role:members[i].role, name:members[i].name, avatar:avatarList.female[fCount]});
                fCount ++;
            }else if(therapists[i].sex === "other" && oCount < 3){
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



    const addEditorSection = (selectedOption, customizedOption, AIprompt) => {
        if(selectedOption === "Basic Information"){
            if(editorRef.current){
                editorRef.current.setRawContent(wrapBasicInformation(sessionInfo, members, therapists));
            }
        }else if (selectedOption === "S (Subject)"){
            axios.post(documentToolRouter, {
                task: "ASK_SUBJECT",
                prompt:AIprompt,
                content: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){

                    // console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));
        }else if (selectedOption === "O (Object)"){
            axios.post(documentToolRouter, {
                task: "ASK_OBJECT",
                prompt:AIprompt,
                notes: "",
                transcript: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){

                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));

        }else if (selectedOption === "A (Assessment)"){
            axios.post(documentToolRouter, {
                task: "ASK_ASSESSMENT",
                prompt:AIprompt,
                notes: "",
                transcript: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
                description: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){

                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));
        }else if (selectedOption === "P (Plan)"){
            axios.post(documentToolRouter, {
                task: "ASK_PLAN",
                prompt:AIprompt,
                notes: "",
                transcript: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
                description: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){

                    console.log(resp.data)
                    editorRef.current.insertMultipleTexts(resp.data.data, resp.data.title);
    
                }
            })
            .catch((e) => alert(e));
        }else if (selectedOption === "Customize"){
            axios.post(documentToolRouter, {
                task: "ASK_CUSTOMIZE",
                prompt:AIprompt,
                notes: "",
                section_name:customizedOption,
                transcript: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
                description: `Patient 1: Alice Johnson
                Medical and Mental History: Alice is a 34-year-old marketing professional with a history of Generalized Anxiety Disorder (GAD) diagnosed five years ago. She has been on selective serotonin reuptake inhibitors (SSRIs) for the past four years, with moderate success. Her medical history includes asthma, which is well-managed with medication. Alice has no history of substance abuse or significant physical health issues. She has been in individual therapy for three years before transitioning to group therapy to enhance her coping skills and expand her support network.
                
                Complaints and Problems: Alice reports experiencing heightened anxiety levels in the past six months, attributed to increased work pressure and looming deadlines. She struggles with constant worry, difficulty concentrating, and sleep disturbances, averaging about 4-5 hours of sleep per night. Alice also mentions feeling overwhelmed by daily tasks and has noticed a decline in her work performance and satisfaction. Socially, she feels withdrawn and has been avoiding gatherings, fearing she might be judged or not perform well in social settings.
                
                Patient 2: Bob Miller
                Medical and Mental History: Bob is a 28-year-old freelance graphic designer who has struggled with episodic Major Depressive Disorder (MDD) and anxiety since his late teens. He experienced his first depressive episode at 19, which was treated with a combination of cognitive-behavioral therapy (CBT) and antidepressants. Bob has had three major episodes of depression in the past nine years, with the most recent episode starting about six months ago. His medical history is unremarkable, though he mentions occasional insomnia and stress-related gastrointestinal issues.
                
                Complaints and Problems: Bob's current complaints revolve around persistent low mood, lack of motivation, and anhedonia, particularly concerning his work and hobbies, which he used to find fulfilling. He reports significant anxiety about financial stability and finding consistent work, exacerbating his depressive symptoms. Bob struggles with self-esteem issues, often feeling worthless and criticizing himself harshly for not meeting his own expectations or those he perceives from others. He has difficulty initiating and maintaining social interactions, leading to isolation and increased reliance on social media for connection, which he finds unsatisfactory and sometimes harmful.
                
                `,
            })
            .then((resp) => {
                // receive the response and add it to right editor
                if(editorRef.current){

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
                </div>

            </div>
        </div>
     );
}

export default DiagnosisPage;