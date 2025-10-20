import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children, title, navLinks, footerLinks, copyrightHolder }) => {
    const { theme } = useTheme();
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:dark:bg-gray-800 focus:px-3 focus:py-2 focus:rounded">
            Skip to content
        </a>
        <Navbar title={title} links={navLinks} />

        <main id="main" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </main>

        <Footer links={footerLinks} copyrightHolder={copyrightHolder} />
        </div>
    );
    };

    Layout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    navLinks: PropTypes.array,
    footerLinks: PropTypes.array,
    copyrightHolder: PropTypes.string,
    };

    Layout.defaultProps = {
    title: 'My App',
    navLinks: [],
    footerLinks: [],
    copyrightHolder: 'Your Company',
    };

export default Layout;
