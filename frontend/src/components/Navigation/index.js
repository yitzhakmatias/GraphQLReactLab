import React from 'react';
import {NavLink} from 'react-router-dom'
import './index.css';

const MainNavigation = props => {
    return (
        <header className="main-navigation">
            <div className="main-navigation_logo">
                <h1>EasyEvents</h1>
            </div>
            <nav className="main-navigation_items">
                <ul>
                    <li><NavLink to="/auth"> Authentication</NavLink></li>
                    <li><NavLink to="/events"> Events</NavLink></li>
                    <li><NavLink to="/booking"> Booking</NavLink></li>
                </ul>
            </nav>
        </header>);
};
export default MainNavigation;
