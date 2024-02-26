import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";
import { useRef, useState } from "react";
import axios from "axios";
import { documentToolRouter } from "../config/routeConfig";

function DiagnosisPage() {
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
                        KEY WORDS
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