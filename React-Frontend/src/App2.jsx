import './assets/css/style.css';
import './assets/css/bootstrap.css';

import './assets/js/script.js';

import {Routes, Route} from 'react-router-dom';
import Mainpage from './pages/Mainpage';

const App = function() {

    return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage/>}/>
      </Routes>
    </>
  );
}

export default App;