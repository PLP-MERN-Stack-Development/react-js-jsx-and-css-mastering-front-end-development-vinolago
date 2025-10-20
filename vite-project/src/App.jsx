import { useState } from 'react';
import './index.css';

// Import your components here
import Button from './components/Button';
import TaskManager from './components/TaskManager';
import Card from './components/Card';
import ApiData from './api/ApiData';
import Layout from './components/Layout';
import ThemeProvider, { useTheme } from './contexts/ThemeContext';

// App content component that uses theme context
function ThemeToggleButton({ theme, toggleTheme }) {
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
  className="fixed z-50 bottom-6 right-6 p-3 rounded-full shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors transition-transform duration-200 ease-in-out active:scale-90 hover:scale-110"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.24 7.07l-.71-.71M6.34 6.34l-.71-.71" /><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      )}
    </button>
  );
}

function AppContent() {
  const [count, setCount] = useState(0);
  const [theme, toggleTheme] = useTheme();
  
  const navLinks = [
    { label: 'Home', href: '/', icon: '' },
    { label: 'Tasks', href: '/tasks', icon: '' },
    { label: 'About', href: '/about', icon: '' },
  ];

  const footerColumns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Documentation', href: '/docs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
      ],
    },
  ];

  const footerLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { icon: '🐦', href: 'https://x.com', label: 'Twitter' },
    { icon: '💼', href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: '📱', href: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <>
    <Layout
      title="PLP Task Manager"
      navLinks={navLinks}
      isSticky={true}
      showSignIn={true}
      signInText="Login"
      onSignInClick={() => console.log('Sign in clicked')}
      footerLinks={footerLinks}
      footerColumns={footerColumns}
      socialLinks={socialLinks}
      copyrightHolder="PLP Task Manager"
      description="A powerful task management application"
      theme={theme}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Quick Start"
          subtitle="Get started in minutes"
          theme={theme}
          variant="elevated"
          hover={true}
          headerActions={
            <Button variant="primary" size="sm">Learn More</Button>
          }
        >
          <p>Edit your tasks and stay organized with our intuitive interface.</p>

        </Card>

        <Card
          title="Task Counter"
          theme={theme}
          variant="outlined"
          size="lg"
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 my-4">
            <Button
              variant="danger"
              size="lg"
              onClick={() => setCount((count) => count - 1)}
            >
              -
            </Button>
            <span className="text-xl font-bold">{count}</span>
            <Button
              variant="success"
              size="lg"
              onClick={() => setCount((count) => count + 1)}
            >
              +
            </Button>
          </div>
        </Card>

        <Card
          title="Theme Toggle"
          theme={theme}
          variant="subtle"
          hover={true}
          onClick={toggleTheme}
        >
          <p>Click to toggle between light and dark theme</p>
          <p className="text-sm mt-2 bg-red-100 opacity-75">Current theme: {theme}</p>
        </Card>
      </div>

      <TaskManager className="my-8" theme={theme} />

      <ApiData theme={theme} />
    </Layout>
    <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
    </>
  );
}

// Main App component that provides theme context
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;