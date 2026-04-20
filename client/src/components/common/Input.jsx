import React from 'react';

const Input = ({ label, type = 'text', value, onChange, required = false, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;