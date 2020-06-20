import React from 'react';
import Messenger from '../Messenger';
import Login from '../Login';
import Register from "../Register";
import ConfirmationPage from "../ConfirmationPage";
import Confirm from "../Confirm";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function App() {


    return (
        <main>
            <Router>
                <Switch>
                    <Route exact path='/' component={Messenger}/>
                    <Route exact path='/register' component={Register}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/confirmation_send' component={ConfirmationPage}/>
                    <Route path='/confirm/:code' component={Confirm}/>
                </Switch>
            </Router>
        </main>
    );
}