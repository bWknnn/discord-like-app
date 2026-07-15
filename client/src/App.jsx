import Mainpage from "./components/mainpage/Mainpage";
import RegisterForm from "./components/register/RegisterForm";
import { BrowserRouter as Router, Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterForm />} />
          <Route path="/main" element={<Mainpage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
