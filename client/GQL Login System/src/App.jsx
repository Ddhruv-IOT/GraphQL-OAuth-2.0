import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./components/LoginPage/Login";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/HomePage/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <Routes>
          {localStorage.getItem("token") !== null &&
            localStorage.getItem("token") !== "" && (
              <Route path="/home"  element={<Home></Home>} />
            )}
        </Routes>

        <Routes>
          {/* <Route
            path="/"
            element={
              localStorage.getItem("token") !== null &&
              localStorage.getItem("token") !== "" ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/" />
              )
            }
          ></Route> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
