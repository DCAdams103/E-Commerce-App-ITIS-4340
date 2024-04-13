import React, {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom";
import './Login.css';
import {styled} from '@mui/system';
import { Button } from '@mui/base/Button';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import {auth} from '../userAuth/userAuth';

const InputElement = styled('input')(
    ({ theme }) => `
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    background: '#E0E0E0';
    border: 1px solid #DAE2ED;
    box-shadow: 0px 2px 4px rgba(0,0,0, 0.25);
  
    &:hover {
      border-color: #3399FF;
    }
  
    &:focus {
      border-color: #3399FF;
      box-shadow: 0 0 0 3px #80BFFF;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

const AuthTextField = ({value, onChange}) => (
    <InputElement placeholder="" onChange={onChange} value={value} />
);



export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [isLogged, setIsLogged] = useState(false);
    const [loginText, setLoginText] = useState("Login");

    const navigate = useNavigate();

    const onNameChange = (e) => { setFullName(e.target.value); }
    const onEmailChange = (e) => { setEmail(e.target.value); }
    const onPasswordChange = (e) => { setPassword(e.target.value); }

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
              console.log(user);
            } else {
              console.log("No user");
            }
          });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(loginText === "Login") {
            if(email === "" || password === "") {
                alert("Please fill in all fields");
            } else {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        navigate("/");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
            }

        } else if (loginText === "Sign Up") {
            if(email === "" || password === "" || fullName === "") {
                alert("Please fill in all fields");
            } else {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                    const user = userCredential.user;
                    updateProfile(user, {
                        displayName: fullName
                    }).then(() => {
                        navigate("/");
                    });
                         
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
            }
            
        }
        if(email === "admin" && password === "admin") {
            setIsLogged(true);
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="login-main-container">
            <div className="left-container">
                <Link to={`/`} className="logo-link">
                    <section className="">
                        <div className="">
                            <h1>🛒</h1>
                        </div>
                    </section>
                </Link>
                <img className="main-img" src="https://static.nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/g1ljiszo4qhthfpluzbt/nike-joyride.jpg" alt="login" />
            </div>

            <div className="right-container">
                <div className="login-container">
                    <h3>Welcome</h3>
                    {loginText === "Sign Up" && (
                        <>
                            <p>Full Name</p>
                            <AuthTextField value={fullName} onChange={onNameChange} />
                        </>
                    )}
                    <p>Email Address</p>
                    <AuthTextField value={email} onChange={onEmailChange} />
                    <p>Password</p>
                    <AuthTextField value={password} onChange={onPasswordChange} />
                    <p className="signup-field"></p>
                    
                    <Button variant="contained" color="primary" className="button" onClick={handleSubmit}>{loginText}</Button>
                    
                    <div className="signup-text-container">
                        {loginText === "Login" ? <p>Don't have an account? <p className="signup-text" onClick={()=> {setLoginText("Sign Up")}}>Sign Up</p></p>
                         : <p>Already have an account? <p className="signup-text" onClick={()=> {setLoginText("Login")}}>Login</p></p>}
                        
                    </div>

                </div>
            </div>
            
        </div>
    )

}
