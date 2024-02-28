import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";
import { useEffect,useRef, useState } from "react";
import axios from "axios";
import { documentToolRouter } from "../config/routeConfig";
import { getCurrentTimeFormatted } from "../utils/util";
import { wrapBasicInformation, wrapObject, wrapSubject } from "../utils/editorWraper";



const defaultKeywordList = [
    // {word:"HADD", tag:"Ideation", time:"John"},
    // {word:"Asd", tag:"testtag", time:"Amy"},
]


function formatTime(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以+1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function DiagnosisPage() {
    // keyword part
    const [keywords, setKeywords] = useState(defaultKeywordList);
    const [inputWord, setInputWord] = useState("");
    const [inputTag, setInputTag] = useState("");
    // const [inputTime, setInputTime] = useState("");
    const removeKeyword = (kw) => {
        setKeywords(keywords.filter(item => item.word !== kw));
    }
    const addkeyword = () => {
        let w = inputWord;
        let t = inputTag;
        // let f = inputTime;
        let currentTime = getCurrentTimeFormatted();
        setKeywords([...keywords, {word:w, tag:t, time:currentTime}])
        setInputWord("");
        setInputTag("");
        // setInputTime("");
    }

    const [messages, setMessages] = useState([]);
//     const [messages, setMessages] = useState([
//         {role: 'therapist', time: '02-26 18:46:28', conv: 'hello'}, 
// {role: 'patient', time: '02-26 18:46:31', conv: 'hello'},
// {role: 'therapist', time: '02-26 18:46:34', conv: 'hi there'},
// {role: 'patient', time: '02-26 18:46:38', conv: 'oh hi'},
// {role: 'therapist', time: '02-26 18:46:41', conv: 'nice to meet you too'},
// {role: 'patient', time: '02-26 18:46:45', conv: 'nice to meet you too'},
// {role: 'therapist', time: '02-26 18:46:47', conv: "what's your name"},
// {role: 'patient', time: '02-26 18:46:51', conv: 'my name is Bob'},
// {role: 'therapist', time: '02-26 18:46:55', conv: 'hi Bob how are you'}
//     ]);
    const editorRef = useRef();

    const scrollRef = useRef(null);

    useEffect(() => {
        // every time adding new messages, the Text Content will scroll down automatically
        if (scrollRef.current) {
        const { current } = scrollRef;
        current.scrollTop = current.scrollHeight;
        }
    }, [messages]); // depends on messages

    // const [inputText, setInputText] = useState('');

    const handleTranscript = (text) => {
        // console.log(text);
    //   setTranscript(text);
        let inputContent = {
            "role": "therapist",
            "time": formatTime(new Date()),
            "conv": text
        }
        setMessages([...messages, inputContent]);

        // setTimes([...times, formatTime(new Date())]);
        // setRoles([...roles, "therapist"]);
        console.log(messages);
    

    };
    const handleTranscriptPatient = (text) => {
        let inputContent = {
            "role": "patient",
            "time": formatTime(new Date()),
            "conv": text
        }
        setMessages([...messages, inputContent]);
        console.log(messages);

    };

    const addEditorSection = (selectedOption, customizedOption, AIprompt) => {
        if(selectedOption === "Basic Information"){
            if(editorRef.current){
                editorRef.current.setRawContent(wrapBasicInformation());
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


    // const sampleAPIRequest = () => {
    //     axios.post(documentToolRouter, {
    //         task: "TEST",
    //         prompt:"test api",
    //         content: editorRef.current.getTextContent(),
    //     })
    //     .then((resp) => {
    //         // receive the response and add it to right editor
    //         editorRef.current.setTextContent(resp.data);
    //     })
    //     .catch((e) => alert(e));
    // }


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
                        <div className="diagnois-page-title font-c2">TRANSCRIPT</div>
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
                            <div className="audio-btn-box">
                                <SpeechButton onTranscript={handleTranscript}></SpeechButton>
                                <div>Therapist</div>
                            </div>
                            {/* <div className="audio-btn-gap" ></div> */}
                            <div className="audio-btn-box">
                                <SpeechButton onTranscript={handleTranscriptPatient}></SpeechButton>
                                <div>Patient</div>
                            </div>
                            <button onClick={() => {
                                console.log(editorRef.current.getRawContent());
                            }}>tEST</button>
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