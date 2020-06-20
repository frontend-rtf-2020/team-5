import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import './Register.css';
import ReactNotification, {store} from "react-notifications-component";


function Notification(msg) {
    store.addNotification({
        title: 'Warning!',
        message: msg,
        type: "warning",
        insert: "bottom",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: 3000,
            onScreen: true,
            pauseOnHover: true
        }
    });
}

export default function Register() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [Email, setEmail] = useState("");
    const history = useHistory();

    function handleSubmit(event) {
        event.preventDefault();
        if(login === "" ||
            password === "" ||
            passwordConfirm === "" ||
            firstName === "" ||
            secondName === "" ||
            Email === "") {
            Notification('There are empty fields');
            return false;
        }
        let validate = firstName.replace(/[^a-zA-Z]/g, '');
        if (validate !== firstName) {
            Notification('Only latin symbols allowed in first name');
            return false;
        }

        validate = secondName.replace(/[^a-zA-Z]/g, '');
        if (validate !== secondName) {
            Notification('Only latin symbols allowed in second name');
            return false;
        }
        validate = login.replace(/[^a-zA-Z0-9]/g, '');
        if (validate !== login) {
            Notification('Only latin symbols allowed in login');
            return false;
        }

        if (login.length < 5){
            Notification('Login is too short (min - 5 characters)');
            return false;
        }

        const emailValidate = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        if (!emailValidate.test(Email)){
            Notification('Email incorrect');
            return false;
        }
        if (password !== passwordConfirm){
            Notification('Password mismatch');
            return false;
        }
        if (password.length < 6){
            Notification('Password is too short (min - 6 characters)');
            return false;
        }
        fetch('https://api.rtf17.ru/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({login: login, password: password, name: firstName + " " + secondName, email: Email}),
        }).then(r => {return r.json()})
            .then(
                data => {
                    if (data.success === false){
                        Notification('Internal Server ERROR!!!');
                    } else {
                        Notification('Account created');
                        history.push('/confirmation_send');
                    }
                });
    }


    return(
        <div className="one-block">
            <ReactNotification />
        <div id="back-ground"></div>
        <div id='Register'>
            <div id={'formField'}>
                <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                    <p>First name:</p>
                    <input required type="text" className={'fullSize'} placeholder={'First name'} onChange={e => setFirstName(e.target.value)}/>
                    <p>Second name:</p>
                    <input required type="text" className={'fullSize'} placeholder={'Second name'} onChange={e => setSecondName(e.target.value)}/>
                    <p>Login:</p>
                    <input required type="text" className={'fullSize'} placeholder={'Login'} onChange={e => setLogin(e.target.value)}/>
                    <p>E-mail address:</p>
                    <input required type="email" className={'fullSize'} placeholder={'E-mail'} onChange={e => setEmail(e.target.value)}/>
                    <p>Password:</p>
                    <input required type="password" className={'fullSize'} placeholder={'Password'} onChange={e => setPassword(e.target.value)}/>
                    <p>Confirm password:</p>
                    <input required type="password" className={'fullSize'} placeholder={'Confirm password'} onChange={e => setPasswordConfirm(e.target.value)}/>
                    <button type="submit" id={'Submit'}>Register</button>
                </form>
                <div className="a-center"><a href="/login" className={'in-up'}>Sign In</a></div>

            </div>
        </div>
        </div>
    );
}