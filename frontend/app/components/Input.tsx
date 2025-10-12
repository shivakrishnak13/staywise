import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input
        className={`input-field ${error ? 'border-red-600 focus:ring-red-600' : ''} ${className}`}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}