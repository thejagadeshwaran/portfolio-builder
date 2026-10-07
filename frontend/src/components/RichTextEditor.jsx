// frontend/src/components/RichTextEditor.jsx
import React from 'react';

const RichTextEditor = ({ value, onChange }) => {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="form-control"
      rows="8"
      placeholder="Write your description here..."
      style={{ width: '100%', resize: 'vertical' }}
    />
  );
};

export default RichTextEditor;