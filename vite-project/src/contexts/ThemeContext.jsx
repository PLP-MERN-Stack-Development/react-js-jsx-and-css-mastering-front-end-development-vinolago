import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const THEME_STORAGE_KEY = 'app-theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // Return tuple pattern to match useState convention
  return [context.theme, context.toggleTheme];
};

export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  // Initialize theme from localStorage or default
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved || defaultTheme;
  });

  // Update localStorage and document classes when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Update document classes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Update color scheme meta tag
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (!metaColorScheme) {
      const meta = document.createElement('meta');
      meta.name = 'color-scheme';
      document.head.appendChild(meta);
    }
    metaColorScheme?.setAttribute('content', theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  // Provide both theme value and toggle function
  const contextValue = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.oneOf(['light', 'dark']),
};

export default ThemeProvider;

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};