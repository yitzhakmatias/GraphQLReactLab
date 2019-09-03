import React from 'react';
import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import AuthPage from './pages/Auth'
import BookingPage from './pages/Booking'
import EventPage from "./pages/Events";
import MainNavigation from "./components/Navigation";
import './App.css'

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <React.Fragment>
                    <MainNavigation/>
                    <main className="main-content">
                        <Switch>
                            <Redirect from="/" to="/auth" exact/>
                            <Route path="/auth" component={AuthPage}/>
                            <Route path="/events" component={EventPage}/>
                            <Route path="/booking" component={BookingPage}/>
                        </Switch>
                    </main>
                </React.Fragment>
            </BrowserRouter>
        </div>
    );
}

export default App;
