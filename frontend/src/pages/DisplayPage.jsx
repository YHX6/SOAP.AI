import React, {useState, useEffect} from 'react';
import MyEditor from '../components/MyEditor';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../assets/css/script-creation.css";

function DisplayPage(props) {
    // const [editorData, setEditorData] = useState([1,2,3,4]);
    const documentData = useSelector((state) => state.document.documentData);
    // const scriptsDocuments = useSelector((state) => state.documentSlice.scripts);
    const navigate = useNavigate();
    const [pageData, setPageData] = useState([]);
    const nextPage = (e) => {
        e.preventDefault();
        navigate("/home");
    }



    const setReport = () => {
        let data = [];
        
        for(let person in documentData){
            console.log(person);
            data.push({personName:person,   data: documentData[person]})
        }
        console.log(data);
        setPageData(data);
    }


    return (
        <div className='main'>
            <div className='script-display'>
                    <div className='body-top'>
                        <div className='script-display-pages scrobar-1'>
                            {
                                pageData.map((item, i) => {
                                    return (
                                        <div className='script-display-container'  key = {i}>
                                            <MyEditor showTools={false}  rawContent={""} textContent={""} reportData={item.data} personName={item.personName}></MyEditor>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                    <div className='button-container'>
                        <button className='script-creation-btn' onClick={setReport}>Generate Reports</button>
                        <button className='script-creation-btn' onClick={nextPage}>Home</button>
                    </div>
                
            </div>
        </div>

    );
}



export default DisplayPage;