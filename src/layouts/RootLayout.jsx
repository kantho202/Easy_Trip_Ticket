import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Shares/Navbar';
import Footer from '../pages/Shares/Footer';
import Loader from '../components/Loading/Loading';

const RootLayout = () => {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading time (you can adjust this or tie it to actual data loading)
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1500); // 2.5 seconds loading time

        return () => clearTimeout(timer);
    }, []);

    // Show loading screen on first visit
    if (isInitialLoading) {
        return (
            <Loader/>
        );
    }
   
    return (
        <div className=''>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;