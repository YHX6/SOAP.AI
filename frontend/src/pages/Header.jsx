import React from 'react';
import "../assets/css/header.css";
import { useNavigate } from 'react-router-dom';
import IconLogout from "../assets/icons/Icon_logout.svg";
import SampleProfile from "../assets/imgs/sample_profile.jpg"
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconMenu from "../assets/icons/icon_menu.svg";

function Header(props) {
    const navigate = useNavigate();
    const goHomePage = () => {
        navigate("/home");
    }
  
  
    // const logout = () => {
    //   // sessionStorage.removeItem("erised-info");
    //   sessionStorage.removeItem("erised-user");
    //   navigate("/welcome");
    // }


    return (
        <div id="header" className={`header header-hidden-${props.showHeader}`}>
          <div id='header-menu-btn'>
            <img src={IconMenu} alt="a menu button" onClick={props.toggleShowHeader}></img>
          </div>

          <div className='header-user'>
            <img src={SampleProfile} alt="user profile" className='header-user-profile'></img>
            <Typography variant='c3'>User Name</Typography>
          </div>
          <div className='header-table'>

            <Button variant="contained" className='button-primary font-c3' onClick={goHomePage}>Home</Button>

            
          </div>
    
          <button className="log-out" onClick={() => {}}><img src={IconLogout} alt="icon logout"></img></button>
        </div>
    );
}

export default Header;