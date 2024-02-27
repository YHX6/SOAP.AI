import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";
import { useEffect,useRef, useState } from "react";
import axios from "axios";
import { documentToolRouter } from "../config/routeConfig";
import { getCurrentTimeFormatted } from "../utils/util";



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


    const editor_1_Ref = useRef();
    const editor_2_Ref = useRef();
    const [messages, setMessages] = useState([
        {role: 'therapist', time: '02-26 18:46:28', conv: 'hello'}, 
{role: 'patient', time: '02-26 18:46:31', conv: 'hello'},
{role: 'therapist', time: '02-26 18:46:34', conv: 'hi there'},
{role: 'patient', time: '02-26 18:46:38', conv: 'oh hi'},
{role: 'therapist', time: '02-26 18:46:41', conv: 'nice to meet you too'},
{role: 'patient', time: '02-26 18:46:45', conv: 'nice to meet you too'},
{role: 'therapist', time: '02-26 18:46:47', conv: "what's your name"},
{role: 'patient', time: '02-26 18:46:51', conv: 'my name is Bob'},
{role: 'therapist', time: '02-26 18:46:55', conv: 'hi Bob how are you'}
    ]);
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
    
    /*  pre code
        if(editor_1_Ref.current){
            let currentContent = editor_1_Ref.current.getTextContent();
            console.log(currentContent + text)
            editor_1_Ref.current.setTextContent(currentContent + text);
            console.log(editor_1_Ref.current);
        }
        */
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


    const sampleAPIRequest = () => {
        axios.post(documentToolRouter, {
            task: "TEST",
            prompt:"test api",
            content: editor_1_Ref.current.getTextContent(),
        })
        .then((resp) => {
            // receive the response and add it to right editor
            editor_2_Ref.current.setTextContent(resp.data);
        })
        .catch((e) => alert(e));
    }


    return ( 
        <div className="main">
            <div className="diagnois-page">
                <div className="diagnois-page-left">
                    {/*  key words  component*/}
                    <div className="diagnois-page-left-top">
                        KEY WORDS
                    </div>
                    <di className="diagnois-page-left-top">
                        <div className="keyword-container">
                            <div className="keyword-table-header">
                                <div className="keyword-table-row">
                                    <span>Key Words</span>
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
                    </di>


                    {/* transcription conponent */}
                    <div className="diagnois-page-left-bottom">
                        <div className="diagnois-page-title">TRANSCRIPT</div>
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
                        </div>
                    </div>

                </div>

                <div className="diagnois-page-right">
                    <MyEditor showTools={true} ref={editor_2_Ref}></MyEditor>
                </div>

            </div>
        </div>
     );
}

export default DiagnosisPage;