import MyEditor from "../components/MyEditor";
import "../assets/css/diagnois.css"

function DiagnosisPage() {
    return ( 
        <div className="main">
            <div className="diagnois-page">
                <div className="diagnois-page-left">
                    <MyEditor></MyEditor>
                </div>

                <div className="diagnois-page-right">
                    <MyEditor></MyEditor>
                </div>

            </div>
        </div>
     );
}

export default DiagnosisPage;