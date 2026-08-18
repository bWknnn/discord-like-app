import Mainpage from "./components/mainpage/Mainpage";
import RegisterForm from "./components/register/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a2e",
            border: "1px solid rgba(0, 255, 136, 0.3)",
            color: "#e0e0e0",
            fontFamily: "monospace",
          },
        }}
      />
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
