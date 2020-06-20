import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import './Login.css'


export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return (login.length > 0 && password.length > 0);

  }

  function handleSubmit(event) {
      fetch('https://api.rtf17.ru/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({login: login, password: password}),

        }).then(r => {return r.json()})
            .then(

                data => {
                    if (data.success === false) return false;
              localStorage.setItem("USER_ID", data.id);
              localStorage.setItem("USER_LOGIN", data.login);
              localStorage.setItem("USER_TOKEN", data.token);
              history.push("/");
            });
    event.preventDefault();
  }
return(
    <div id="Login">
        <div id="BackgroundColor"></div>
        <div className='Window'>
            <div id={'Input'}>
                <div className="Auth">
                    <h1>Sign In</h1>
                    <p>Log in to continue</p>
                    <form onSubmit={handleSubmit}>
                        <input type="text" className={'fullSize'} placeholder={'Login'} autoFocus value={login} onChange={e => setLogin(e.target.value)}/>
                        <input className={'fullSize'} placeholder={'Password'} value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="password"/>
                        <button id="Submit" block disabled={!validateForm()} type="submit">Submit</button>

                    </form>
                    <div className="a-center"><a href="/register" className={'in-up'}>Sign Up</a></div>
                </div>
            </div>

            <div id={'Output'}>
                <div id="Description">
                    <h1>GoEv</h1>
                    <h2>The messenger for everyone...</h2>
                </div>
            </div>
        </div>
    </div>
);
}