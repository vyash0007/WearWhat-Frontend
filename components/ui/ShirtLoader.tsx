import React from 'react';
import { IoShirtOutline } from 'react-icons/io5';

interface ShirtLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ShirtLoader: React.FC<ShirtLoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-flip-horizontal`}
        style={{
          animation: 'flipHorizontal 1.2s ease-in-out infinite',
        }}
      >
        <IoShirtOutline className="text-gray-600 dark:text-gray-400" />
      </div>
      <style jsx>{`
        @keyframes flipHorizontal {
          0%, 100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
        }
        .animate-flip-horizontal {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default ShirtLoader;
