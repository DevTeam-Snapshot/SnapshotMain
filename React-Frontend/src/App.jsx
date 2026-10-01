import './assets/css/style.css'; // import .css 

// import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// import Hangeul Font
import "pretendard/dist/web/static/pretendard.css";

// import React Modules
import {Routes, Route} from 'react-router-dom';

// import pages
import Mainpage from './pages/Mainpage.jsx';
import MakingAds from './pages/MakingAds.jsx';
import SelectAd from './pages/SelectAd.jsx';

const App = function() {

    return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage/>}/>
        <Route path="/makingads/:sessionId" element={<MakingAds />} />
        <Route path="/selectad/:sessionId" element={<SelectAd/>}/>      
      </Routes>
    </>
  );
}

export default App;