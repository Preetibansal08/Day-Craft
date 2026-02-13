import React, { useState } from 'react';
import { Plus, Trash2, Check, CheckSquare, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';

// Extracted components to avoid re-mounting issues
const ChecklistItem = ({ item, listId, toggleItem, deleteItem }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg group"
    >
        <button
            onClick={() => toggleItem(listId, item.id)}
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.completed
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'border-gray-400 dark:border-gray-500 hover:border-indigo-500'
                }`}
        >
            {item.completed && <Check size={14} />}
        </button>
        <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {item.text}
        </span>
        <button
            onClick={() => deleteItem(listId, item.id)}
            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
        >
            <Trash2 size={14} />
        </button>
    </motion.div>
);

const NewItemInput = ({ listId, addItem }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            addItem(listId, text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add item..."
                className="w-full text-sm bg-transparent border-none focus:ring-0 p-2 placeholder-gray-400 text-gray-700 dark:text-gray-200"
            />
        </form>
    );
};

const Checklists = () => {
    const [checklists, setChecklists] = useLocalStorage('checklists', []);
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [showNewInput, setShowNewInput] = useState(false);

    const addChecklist = (e) => {
        e.preventDefault();
        if (newChecklistTitle.trim()) {
            setChecklists([
                {
                    id: Date.now(),
                    title: newChecklistTitle,
                    items: [],
                    color: `hsl(${Math.random() * 360}, 70%, 80%)`,
                    createdAt: new Date().toISOString()
                },
                ...checklists
            ]);
            setNewChecklistTitle('');
            setShowNewInput(false);
        }
    };

    const deleteChecklist = (id) => {
        setChecklists(checklists.filter(list => list.id !== id));
    };

    const addItem = (checklistId, itemText) => {
        setChecklists(checklists.map(list => {
            if (list.id === checklistId) {
                return {
                    ...list,
                    items: [...list.items, { id: Date.now(), text: itemText, completed: false }]
                };
            }
            return list;
        }));
    };

    const toggleItem = (checklistId, itemId) => {
        setChecklists(checklists.map(list => {
            if (list.id === checklistId) {
                return {
                    ...list,
                    items: list.items.map(item =>
                        item.id === itemId ? { ...item, completed: !item.completed } : item
                    )
                };
            }
            return list;
        }));
    };

    const deleteItem = (checklistId, itemId) => {
        setChecklists(checklists.map(list => {
            if (list.id === checklistId) {
                return {
                    ...list,
                    items: list.items.filter(item => item.id !== itemId)
                };
            }
            return list;
        }));
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Checklists</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage grocery lists, packing lists, and more</p>
                </div>
                <button
                    onClick={() => setShowNewInput(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={20} />
                    <span className="font-medium">New Checklist</span>
                </button>
            </header>

            <AnimatePresence>
                {showNewInput && (
                    <motion.form
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={addChecklist}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/30"
                    >
                        <div className="flex gap-2">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-500">
                                <CheckSquare size={24} />
                            </div>
                            <input
                                type="text"
                                value={newChecklistTitle}
                                onChange={(e) => setNewChecklistTitle(e.target.value)}
                                placeholder="Checklist Title (e.g. Grocery List)"
                                className="flex-1 bg-transparent text-xl font-semibold placeholder-gray-300 focus:outline-none dark:text-white"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!newChecklistTitle.trim()}
                                className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Check size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowNewInput(false)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {checklists.map(list => (
                        <motion.div
                            key={list.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="flex-1 min-w-0 mr-2">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate" title={list.title}>{list.title}</h3>
                                    {list.createdAt && (
                                        <div className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 mt-1 font-medium">
                                            <Calendar size={12} />
                                            <span>{formatDate(list.createdAt)}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteChecklist(list.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Delete Checklist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="p-2 flex-1 min-h-[150px]">
                                {list.items.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 p-4 text-center">
                                        <CheckSquare size={32} className="mb-2 opacity-50" />
                                        <p className="text-sm">Empty list</p>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <AnimatePresence>
                                        {list.items.map(item => (
                                            <ChecklistItem
                                                key={item.id}
                                                item={item}
                                                listId={list.id}
                                                toggleItem={toggleItem}
                                                deleteItem={deleteItem}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
                                <NewItemInput listId={list.id} addItem={addItem} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Checklists;
