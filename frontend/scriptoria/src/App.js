import './App.css';
import SignIn from './components/sign-in/SignIn';
import { Route, Routes } from 'react-router-dom';
import SingUp from "./components/sign-up/SignUp";
import SignUpInfo from './components/sign-up-info/SignUpInfo';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SingUp" element={<SingUp />} />
        {/* <Route path="/SignUpInfo" element={<SignUpInfo />} /> */}
      </Routes>
    </div>
  )
}

export default App;
