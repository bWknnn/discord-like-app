import Mainpage from "./components/mainpage/Mainpage";
import RegisterForm from "./components/register/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterForm />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Mainpage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
