import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import AuthPage from './pages/Auth'
import BookingPage from './pages/Booking'
import EventPage from "./pages/Events";
import MainNavigation from "./components/Navigation";
import AuthContext from "./context/auth-context";
import './App.css'

class App extends Component {
    state = {
        token: null,
        userId: null
    };

    login = (token, userId, tokenExpiration) => {
        this.setState({token: token, userId: userId});
    };
    logout = () => {
        this.setState({token: null, userId: null})
    };

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <React.Fragment>
                        <AuthContext.Provider
                            value={{
                                token: this.state.token,
                                userId: this.state.userId,
                                login: this.login,
                                logout: this.logout
                            }}>
                            <MainNavigation/>
                            <main className="main-content">
                                <Switch>
                                    {this.state.token && <Redirect from="/" to="/events" exact/>}
                                    {this.state.token && <Redirect from="/auth" to="/events" exact/>}
                                    {!this.state.token && <Route path="/auth" component={AuthPage}/>}
                                    <Route path="/events" component={EventPage}/>
                                    {this.state.token && <Route path="/booking" component={BookingPage}/>}
                                    {!this.state.token && <Redirect from="/" to="/auth" exact/>}
                                </Switch>
                            </main>
                        </AuthContext.Provider>
                    </React.Fragment>
                </BrowserRouter>
            </div>)
    };
}

export default App;
