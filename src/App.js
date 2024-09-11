import logo from './logo.svg';
import './App.css';
import Login from './login/Login'
import Home from './home'
import CreatePolicy from './CreatePolicy';
import ApprovePolicy from './ApprovePolicyVersions';
import AckPolicy from './AckPolicy';
import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} /> 
      <Route path="/home" element={<Home />} /> 
      <Route path="/createpolicy" element={<CreatePolicy />} /> 
      <Route path="/approvepolicy" element={<ApprovePolicy />} /> 
      <Route path="/ackpolicy" element={<AckPolicy />} /> 
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
