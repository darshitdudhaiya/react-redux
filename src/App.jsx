import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import ClientScreen from "./Components/ClientScreen";
import Login from "./Components/Login";
import { Navigate } from "react-router-dom";
import NotFound from "./Components/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes className="max-h-screen">
          <Route path="/" element={<Login />} />
          {/* <Route path="/*" element={<Navigate to={"/"} replace />} /> */}
          <Route path="/*" element={<NotFound/>} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Client" element={<ClientScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
