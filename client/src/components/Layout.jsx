// src/components/Layout.jsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';
import FlashMessage from './FlashMessage';
import Chatbot from './Chatbot'; 
import '../assets/css/Chatbot.css';

const Layout = () => {
  const location = useLocation();
  const pathsWithoutFooter = ['/login', '/signup'];
  const showFooter = !pathsWithoutFooter.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main className="container main-content">
        <FlashMessage />
        <Outlet />
      </main>

      {showFooter && <Footer />}
      <Chatbot />
    </>
  );
};

export default Layout;