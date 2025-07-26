import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neonPurple border-opacity-60"></div>
    </div>
  );
}
