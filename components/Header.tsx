
import React from 'react';
import { LogoIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-dark-secondary p-4 shadow-md border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8 text-brand-purple" />
            <h1 className="text-xl md:text-2xl font-bold text-white">AI Image Generator</h1>
        </div>
        <a 
          href="https://ai.google.dev/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-brand-purple-light transition-colors"
        >
          Powered by Gemini
        </a>
      </div>
    </header>
  );
};

export default Header;
