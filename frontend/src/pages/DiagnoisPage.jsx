import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";
import { useRef, useState } from "react";

function DiagnosisPage() {
    const doctorAudioRef = useRef();

    const handleTranscript = (text) => {
    //   setTranscript(text);
        if(doctorAudioRef.current){
            let currentContent = doctorAudioRef.current.getTextContent();
            console.log(currentContent + text)
            doctorAudioRef.current.setTextContent(currentContent + text);
        }

    };

    


    return ( 
        <div className="main">
            <div className="diagnois-page">
                <div className="diagnois-page-left">
                    <MyEditor  showTools={true}  ref={doctorAudioRef}></MyEditor>

                    <div className="audio-btns">
                        <SpeechButton onTranscript={handleTranscript}></SpeechButton>
                        {/* <SpeechButton></SpeechButton> */}
                        {/* <span>{`Transcript: ${transcript}`}</span> */}
                    </div>
                </div>

                <div className="diagnois-page-right">
                    <MyEditor showTools={true}></MyEditor>
                </div>

            </div>
        </div>
     );
}

export default DiagnosisPage;