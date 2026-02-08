import React from 'react';


const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  name, 
  id, 
  value, 
  onChange, 
  setEmail, 
  setPassword,
  icon,
  required = false,
  minLength,
  maxLength,
  disabled = false,
  ...rest
}) => {
  // دعم الطريقة القديمة (setEmail/setPassword) والطريقة الجديدة (onChange)
  const handleChange = onChange || setEmail || setPassword;
  
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id || name} className="input-label">
          {icon && <span className="input-icon">{icon}</span>}
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={id || name}
          className="input-field"
          value={value}
          onChange={handleChange}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          disabled={disabled}
          {...rest}
        />
      </div>
    </div>
  );
};

export default Input;
