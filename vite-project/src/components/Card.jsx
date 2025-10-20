import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  title,
  subtitle,
  image,
  imageAlt,
  imagePosition = 'top',
  children,
  footer,
  onClick,
  className = '',
  variant = 'default',
  size = 'md',
  rounded = true,
  shadow = true,
  hover = true,
  padding = true,
  theme = 'light',
  loading = false,
  headerActions,
  bodyClassName = '',
  imageClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  footerClassName = '',
}) => {
  const themes = {
    light: 'bg-white text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700',
    dark: 'bg-gray-800 text-gray-100 border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700',
    primary: 'bg-blue-600 text-white border-blue-700 dark:bg-blue-500 dark:text-gray-900 dark:border-blue-400',
    transparent: 'bg-transparent',
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantClasses = {
    default: 'border border-transparent',
    subtle: `border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`,
    elevated: 'border border-transparent shadow-lg',
    outlined: `border-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`,
  };

  const base = `
    ${themes[theme]}
    ${sizes[size]}
    ${rounded ? 'rounded-lg' : ''}
    ${shadow ? 'shadow-md' : ''}
    ${hover ? 'transform-gpu transition-all duration-200 hover:-translate-y-1 hover:shadow-lg' : ''}
    overflow-hidden
    animate-fadeIn
  `;

  const clickableProps = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        },
        'aria-disabled': loading,
      }
    : {};

  const imageComponent = image && (
    <div className={`overflow-hidden ${imagePosition === 'left' ? 'md:w-1/3' : 'w-full'} ${imageClassName}`}>
      <img
        src={image}
        alt={imageAlt || title || 'Card image'}
        className={`
          object-cover w-full h-full
          ${loading ? 'opacity-50' : 'opacity-100'}
          transition-opacity duration-200
        `}
      />
    </div>
  );

  return (
    <article
      className={`
        ${base}
        ${variantClasses[variant] || ''}
        ${loading ? 'animate-pulse' : ''}
        ${imagePosition === 'left' ? 'md:flex' : 'flex flex-col'}
        ${className}
      `}
      {...clickableProps}
    >
      {imagePosition === 'top' && imageComponent}

      <div className={`flex-1 ${padding ? 'p-4 md:p-6' : ''} ${bodyClassName}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className={`font-semibold mb-1 ${titleClassName}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={`text-sm opacity-75 ${subtitleClassName}`}>
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="ml-4">{headerActions}</div>
          )}
        </div>

        <div className={`
          ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
          ${size === 'sm' ? 'text-sm' : ''}
        `}>
          {children}
        </div>
      </div>

      {imagePosition === 'right' && imageComponent}

      {footer && (
        <div className={`
          ${padding ? 'p-4 md:p-6' : ''}
          ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'}
          ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
          ${footerClassName}
        `}>
          {footer}
        </div>
      )}
    </article>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  imagePosition: PropTypes.oneOf(['top', 'left', 'right']),
  children: PropTypes.node,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'subtle', 'elevated', 'outlined']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.bool,
  shadow: PropTypes.bool,
  hover: PropTypes.bool,
  padding: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark', 'primary', 'transparent']),
  loading: PropTypes.bool,
  headerActions: PropTypes.node,
  bodyClassName: PropTypes.string,
  imageClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  subtitleClassName: PropTypes.string,
  footerClassName: PropTypes.string,
};

export default Card;
