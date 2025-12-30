// src/components/ui/TagInput.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react'; // Opsional: Menggunakan icon dari lucide-react

const TagInput = ({ keywords, setKeywords, maxKeywords = 10 }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addKeyword(input.trim());
    } else if (e.key === 'Backspace' && !input && keywords.length > 0) {
      removeKeyword(keywords.length - 1);
    }
  };

  const addKeyword = (word) => {
    // Normalisasi: kecilkan huruf dan hapus koma
    const cleanWord = word.toLowerCase().replace(/,/g, '');
    if (keywords.length >= maxKeywords) return;
    if (!keywords.includes(cleanWord) && cleanWord !== '') {
      setKeywords([...keywords, cleanWord]);
    }
    setInput('');
  };

  const removeKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className={`flex flex-wrap gap-2 p-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all ${keywords.length >= maxKeywords ? 'bg-gray-50' : 'bg-white'}`}>
        {/* Render Tag/Keyword */}
        {keywords.map((word, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200"
          >
            {word}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="hover:text-blue-900 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        
        {/* Input Field */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={keywords.length < maxKeywords ? "Tambah keyword..." : "Sudah penuh"}
          disabled={keywords.length >= maxKeywords}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm py-1 disabled:cursor-not-allowed"
        />
      </div>
      
      {/* Indicator */}
      <div className="flex justify-between mt-1 px-1">
        <p className="text-xs text-gray-500">Gunakan koma atau Enter</p>
        <p className={`text-xs ${keywords.length >= maxKeywords ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
          {keywords.length}/{maxKeywords}
        </p>
      </div>
    </div>
  );
};

export default TagInput;