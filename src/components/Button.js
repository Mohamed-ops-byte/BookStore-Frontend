import React from 'react';


const Button = ({ 
  text, 
  children,
  variant = 'primary', 
  fullWidth = true,
  icon,
  onClick,
  type = 'button',
  disabled = false,
  ...rest
}) => {
  return (
    <button 
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children || text}
    </button>
  );
};

export default Button;
