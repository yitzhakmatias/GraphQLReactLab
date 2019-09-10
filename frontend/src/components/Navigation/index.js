import React from 'react';
import {NavLink} from 'react-router-dom'
import './index.css';
import AuthContext from '../../context/auth-context'

const MainNavigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (<header className="main-navigation">
                    <div className="main-navigation_logo">
                        <h1>EasyEvents</h1>
                    </div>
                    <nav className="main-navigation_items">
                        <ul>
                            {!context.token &&
                            <li><NavLink to="/auth"> Authentication</NavLink></li>
                            }
                            <li><NavLink to="/events"> Events</NavLink></li>
                            {context.token &&
                            <li><NavLink to="/booking"> Booking</NavLink></li>}
                        </ul>
                    </nav>
                </header>
            );
        }}

    </AuthContext.Consumer>
);
export default MainNavigation;
