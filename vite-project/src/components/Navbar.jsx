import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Navbar = ({ 
  title = 'My App',
  links = [],
  logo,
  isSticky = false,
  theme = 'light',
  showSignIn = true,
  signInText = 'Sign in',
  onSignInClick,
  className = '',
  logoClassName = '',
  linkClassName = '',
  containerWidth = 'max-w-7xl',
}) => {
  const [open, setOpen] = useState(false);

  const baseClasses = [
    'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 transition-colors duration-200',
    isSticky ? 'sticky top-0 z-50' : '',
    className
  ].join(' ');

  return (
    <nav className={baseClasses}>
      <div className={`${containerWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {logo ? (
              <div className={`mr-4 ${logoClassName}`}>
                {typeof logo === 'string' ? (
                  <img src={logo} alt={title} className="h-8 w-auto" />
                ) : (
                  logo
                )}
              </div>
            ) : (
              <div className="text-xl font-bold mr-4">{title}</div>
            )}
            <div className="hidden md:flex gap-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${linkClassName}`}
                  {...(link.onClick && { onClick: link.onClick })}
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showSignIn && (
              <div className="hidden md:block">
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={onSignInClick}
                >
                  {signInText}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Toggle navigation"
                className={`
                  inline-flex items-center justify-center p-2 rounded-md
                  ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-gray-800'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  transition-colors duration-200
                `}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`
          md:hidden px-2 pt-2 pb-3 space-y-1
          ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}
          border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}
        `}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`
                block px-3 py-2 rounded-md text-base font-medium
                ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-gray-800'}
                ${linkClassName}
              `}
              {...(link.onClick && { onClick: link.onClick })}
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.label}
            </a>
          ))}
          {showSignIn && (
            <div className="px-3 py-2">
              <Button 
                variant={theme === 'light' ? 'primary' : 'secondary'}
                size="md"
                onClick={onSignInClick}
              >
                {signInText}
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func,
  })),
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isSticky: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark', 'transparent', 'primary']),
  showSignIn: PropTypes.bool,
  signInText: PropTypes.string,
  onSignInClick: PropTypes.func,
  className: PropTypes.string,
  logoClassName: PropTypes.string,
  linkClassName: PropTypes.string,
  containerWidth: PropTypes.string,
};

export default Navbar;
