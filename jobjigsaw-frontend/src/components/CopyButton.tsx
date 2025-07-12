import React from 'react';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      Copy
    </button>
  );
};

export default CopyButton;
