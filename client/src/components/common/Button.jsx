import React from 'react';

const Button = ({ onClick, children, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;