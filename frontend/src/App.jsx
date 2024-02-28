import './App.css';
import "./assets/css/color.css";
import "./assets/css/font.css";
import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home';

import Welcome from './pages/Welcome';
import Header from './pages/Header';
import DiagnosisPage from './pages/DiagnoisPage';
import PreDiagnosisPage from './pages/PreDiagnoisPage';



function App() {
  const [showHeader, setShowHeader] = useState(true);
  const toggleShowHeader = (e) => {
    e.preventDefault();
    setShowHeader(!showHeader);
  }

  useEffect(() => {
    document.title = "SOAP.AI";
  }, []);
  
  

    return (
      <>
        <BrowserRouter>
            <Routes>
              <Route path='/home' element={<><Header showHeader={showHeader} toggleShowHeader={toggleShowHeader}></Header><Home></Home></>}></Route>
              <Route path="/" element={<Welcome></Welcome>}></Route>
              <Route path="/prediagnois" element={<><Header showHeader={showHeader} toggleShowHeader={toggleShowHeader}></Header><PreDiagnosisPage></PreDiagnosisPage></>}></Route>
              <Route path="/diagnois" element={<><Header showHeader={showHeader} toggleShowHeader={toggleShowHeader}></Header><DiagnosisPage></DiagnosisPage></>}></Route>
            </Routes>
          
          </BrowserRouter>
      </>
    );
  
}

export default App;
