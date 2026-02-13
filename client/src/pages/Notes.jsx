import React, { useState } from 'react';
import { Plus, Search, Pin, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';

const Notes = () => {
    const [notes, setNotes] = useLocalStorage('notes', []);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: '', content: '' });

    const addNote = () => {
        if (!currentNote.title.trim() && !currentNote.content.trim()) return;

        const newNote = {
            id: Date.now().toString(),
            title: currentNote.title,
            content: currentNote.content,
            pinned: false,
            createdAt: new Date().toISOString(),
            color: 'bg-yellow-100 dark:bg-yellow-900/20' // Default color for now
        };

        setNotes([newNote, ...notes]);
        setCurrentNote({ title: '', content: '' });
        setIsModalOpen(false);
    };

    const deleteNote = (id, e) => {
        e.stopPropagation();
        setNotes(notes.filter((note) => note.id !== id));
    };

    const togglePin = (id, e) => {
        e.stopPropagation();
        setNotes(
            notes.map((note) =>
                note.id === id ? { ...note, pinned: !note.pinned } : note
            )
        );
    };

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedNotes = filteredNotes.filter((note) => note.pinned);
    const otherNotes = filteredNotes.filter((note) => !note.pinned);

    // Combine pinned first
    const displayNotes = [...pinnedNotes, ...otherNotes];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notes</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
                        aria-label="Add Note"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {displayNotes.map((note) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className={`p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md group relative
                ${note.pinned ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}
              `}
                        >
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => togglePin(note.id, e)}
                                    className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${note.pinned ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}
                                >
                                    <Pin size={16} className={note.pinned ? 'fill-current' : ''} />
                                </button>
                                <button
                                    onClick={(e) => deleteNote(note.id, e)}
                                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold mb-2 pr-12 text-gray-800 dark:text-gray-100">{note.title || 'Untitled'}</h3>
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap line-clamp-6">{note.content}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {displayNotes.length === 0 && (
                <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                    <p>{searchQuery ? 'No notes found matching your search.' : 'No notes yet. Click the + button to create one!'}</p>
                </div>
            )}

            {/* Add Note Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Note</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={currentNote.title}
                                        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                                        className="w-full text-xl font-bold mb-4 bg-transparent border-none outline-none placeholder-gray-400 dark:text-white"
                                        autoFocus
                                    />
                                    <textarea
                                        placeholder="Start typing..."
                                        value={currentNote.content}
                                        onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                                        className="w-full h-48 bg-transparent border-none outline-none resize-none placeholder-gray-400 dark:text-gray-300 text-lg leading-relaxed custom-scrollbar"
                                    />
                                </div>
                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                    <button
                                        onClick={addNote}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notes;
