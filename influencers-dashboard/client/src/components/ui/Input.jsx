import React from "react";
import '@/styles/components/ui/Input.css';

const Input = React.forwardRef(({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder = '',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="input-container">
      {label && (
        <label
          htmlFor={name}
          className="input-label"
        >
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };