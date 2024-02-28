import React from 'react';
import "../assets/css/home.css";
import HomeBG from "../assets/imgs/home_bg.png";
import { useNavigate } from 'react-router-dom';

function Home(props) {
    const navigate = useNavigate();
    const startPreDiagnosis = () => {
        navigate("/prediagnois")
    }


    return (
        <div className='main'>
            <div className='home'>
                <div className='home-top img-box'>
                    <img src={HomeBG} alt="home bg" className='box-img'></img>
                </div>

                <div className='home-bottom'>
                    <div className='home-bottom-1'>
                        <div className='home-bottom-title font-c2'>Tools</div>

                        <div className='home-bottom-container'>
                            <div className='home-bottom-block' onClick={startPreDiagnosis}>
                                Diagnosis
                            </div>

                            <div className='home-bottom-block' onClick={startPreDiagnosis}>
                                Treatment Plan
                            </div>
                        </div>
                    </div>

                    <div className='home-bottom-2'>
                        <div className='home-bottom-title font-c2'>Patients</div>

                        <div className='home-bottom-container'>
                            <div className='home-bottom-block'>
                                "NA"
                            </div>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
}

export default Home;