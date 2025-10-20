import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ links = [], copyrightHolder = 'This Company', year = new Date().getFullYear() }) => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            <span>&copy; {year} {copyrightHolder}. All rights reserved.</span>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-3 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:underline text-gray-600 dark:text-gray-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
  copyrightHolder: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Footer;
