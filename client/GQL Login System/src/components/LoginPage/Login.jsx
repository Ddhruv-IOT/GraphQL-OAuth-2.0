import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import { useEffect } from "react";


import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password)
    }
  `);

  useEffect(() => {
    // This code will run when the component mounts, 
    // which happens when the page has been loaded
    handleGitHubCallback();
  }, []); // Empty dependency array to run the effect only once

  const handleLogin = async () => {
    try {
      const { data } = await login({
        variables: { username, password },
      });
      // Handle successful login, e.g., redirect user or store token
      localStorage.setItem("token", data.login);
      console.log(data.login);
    //   Swal.fire({title: "Login successful!", icon: "success"});
    //   navigate("/home");
    window.location.href = "/home";
    } catch (error) {
      // Handle login error
      Swal.fire({title: "Login failed!", text: error.message, icon: "error"})
      console.error("Login error:", error);
    }
  };

  const handleGitHubLogin = async () => {
    window.location.href = "http://localhost:4000/auth/github"; // Redirect to GitHub login
    // handleGitHubCallback();
  };

  const handleGitHubCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('token');
    localStorage.setItem("token", code);
    console.log(code);
    if (code) {
      Swal.fire({title: "Login successful!", icon: "success"});
    
    setTimeout(() => {
      window.location.href = "/home"; // Redirect to the homepage or any other desired location
    }, 1000);
  }
    // window.location.href = "/home";

    // if (code) {
    //   try {
    //     const response = await fetch(`http://localhost:4000/auth/github/callback?code=${code}`);
    //     const data = await response.json();
        
    //     // Assuming your server responds with a token
    //     const token = data.token;

    //     // Do something with the token, such as storing it in localStorage
    //     localStorage.setItem("token", token);

    //     // Redirect the user to another page or perform additional actions
    //     navigate("/dashboard"); // Redirect to dashboard page
    //   } catch (error) {
    //     console.error("Error exchanging code for token:", error);
    //     Swal.fire({title: "Error", text: "Failed to login with GitHub", icon: "error"});
    //   }
    // } else {
    //   console.error("Authorization code not found");
    //   Swal.fire({title: "Error", text: "Authorization code not found", icon: "error"});
    // }

 
}
  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                style={{ width: "185px" }}
                alt="logo"
              />
              <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
            </div>
            <p>Please login to your account</p>
            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
              id="form1"
              type="email"
              style={{ background: "#5c8def" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form2"
              type="password"
              style={{ background: "#5a2daf" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn
                className="mb-6 w-30 gradient-custom-2"
                onClick={handleLogin}
                disabled={loading}
              >
                Sign in
              </MDBBtn>
              <span className="mb-2">               </span>
              <MDBBtn
                className="mb-6 w-30 gradient-custom-2"
                onClick={handleGitHubLogin}
                disabled={loading}
              >
                GitHub
              </MDBBtn>
              <p className="text-muted" href="#!">
                Forgetting password was never an option 😂😎
              </p>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Don&apos;t have an account?</p>
                <MDBBtn outline className="mx-2" color="danger" onClick={() => Swal.fire({title:"Don't have an account? No worries, we're just existential yet!", icon: "success"})}>
                    Know More
                </MDBBtn>
            </div>
          </div>
        </MDBCol>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">
                We're a symbol of excellence, where every endeavor reflects our unwavering dedication to innovation and quality. 
                Our legacy goes beyond mere business operations, encompassing a culture of collaboration and forward-thinking. 
                Together, as Team Lotus, we pave the way towards a future defined by transformative solutions and enduring impact.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
