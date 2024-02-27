import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";
import { useRef, useState } from "react";
import axios from "axios";
import { documentToolRouter } from "../config/routeConfig";
import { getCurrentTimeFormatted } from "../utils/util";



const defaultKeywordList = [
    // {word:"HADD", tag:"Ideation", time:"John"},
    // {word:"Asd", tag:"testtag", time:"Amy"},
]


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

    const handleTranscript = (text) => {
    //   setTranscript(text);
        if(editor_1_Ref.current){
            let currentContent = editor_1_Ref.current.getTextContent();
            console.log(currentContent + text)
            editor_1_Ref.current.setTextContent(currentContent + text);
        }
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
                        TRANSCRIPT


                        <div className="audio-btns">
                            <SpeechButton onTranscript={handleTranscript}></SpeechButton>
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