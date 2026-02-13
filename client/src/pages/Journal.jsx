import React, { useState, useRef } from 'react';
import { Save, Image as ImageIcon, Trash2, Calendar as CalendarIcon, Smile, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';

const Journal = () => {
  const today = new Date().toISOString().split('T')[0];
  const [entries, setEntries] = useLocalStorage('journal_entries', {});

  // Current entry state
  const [currentEntry, setCurrentEntry] = useState(entries[today] || {
    title: '',
    content: '',
    images: [],
    mood: 'neutral'
  });

  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    setEntries((prev) => ({
      ...prev,
      [today]: currentEntry
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentEntry(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setCurrentEntry(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moods = ['😊', '😐', '😔', '😡', '😴', '🤩'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Day Craft</h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <CalendarIcon size={18} className="mr-2" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center px-6 py-2 rounded-xl transition-all ${isSaved
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
        >
          <Save size={20} className="mr-2" />
          {isSaved ? 'Saved!' : 'Save Entry'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        {/* Mood Selector */}
        <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
          <span className="text-gray-500 font-medium">Mood:</span>
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setCurrentEntry(prev => ({ ...prev, mood: m }))}
              className={`text-2xl p-2 rounded-full transition-transform hover:scale-110 ${currentEntry.mood === m ? 'bg-indigo-50 dark:bg-indigo-900/30 scale-110 ring-2 ring-indigo-200 dark:ring-indigo-800' : ''
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={currentEntry.title}
          onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Title of your day..."
          className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600 dark:text-white mb-6"
        />

        {/* Content Textarea */}
        <textarea
          value={currentEntry.content}
          onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Write about your day..."
          className="w-full h-64 md:h-96 text-lg bg-transparent border-none outline-none resize-none placeholder-gray-300 dark:placeholder-gray-600 dark:text-gray-200 leading-relaxed custom-scrollbar"
        />

        {/* Image Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <ImageIcon size={20} className="mr-2" />
              Memories
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Add Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {currentEntry.images && currentEntry.images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img src={img} alt={`Memory ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-white/90 rounded-full text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(!currentEntry.images || currentEntry.images.length === 0) && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="col-span-1 aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-600/50 dark:hover:text-indigo-400 transition-colors"
              >
                <Plus size={32} className="mb-2" />
                <span className="text-sm">Add Photo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
