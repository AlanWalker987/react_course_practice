import React from 'react';
import Styles from './AppLayout.module.css';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import User from '../components/User';

export default function AppLayout() {
    return (
        <div className={Styles.app}>
            <Sidebar />
            <Map />
            <User />
        </div>
    )
}
