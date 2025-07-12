import React from 'react';

const JobLoadingSkeleton: React.FC = () => {
  return (
    <div className="p-4 border rounded-md animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};

export default JobLoadingSkeleton;