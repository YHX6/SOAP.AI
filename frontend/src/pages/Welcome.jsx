import React from 'react';
import "../assets/css/welcome.css"
import WelcomeImg from "../assets/imgs/welcome.png"
import { useNavigate } from 'react-router-dom';


function Welcome(props) {
    const navigate = useNavigate();

    return (
        <div className='welcome'>
            <div className='welcome-top'>
     

            </div>
            <div className='welcome-left'>
                <div className='welcome-left-top'>
                    <div className='welcome-subheader text-dec'>Mental Therapist Documentation Tool Platform</div>
                    <div className='welcome-hedaer font-h1'>SOAP.AI</div>
                    <div className='welcome-description'>
                        "Add a description here"
                    </div>
                </div>
                

                <div className='welcome-login'>
                    {/* {showLogin ? <Login></Login>  : <Signup></Signup>} */}
                    <button className='login-form-submit' onClick={() => navigate("/home")}>Continue</button>
                </div>
            
            </div>

            <div className='welcome-right'>
            
                <div className='img-box welcome-img'>
                    <img src={WelcomeImg} alt="welcom img" className='box-img'></img>
                </div>
            </div>
        </div>
    );
}

export default Welcome;