import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"
import SpeechButton from "../components/SpeechButton";

function DiagnosisPage() {
    return ( 
        <div className="main">
            <div className="diagnois-page">
                <div className="diagnois-page-left">
                    <MyEditor  showTools={true}></MyEditor>

                    <div className="audio-btns">
                        <SpeechButton></SpeechButton>
                        <SpeechButton></SpeechButton>
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