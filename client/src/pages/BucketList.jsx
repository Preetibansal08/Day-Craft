import React, { useState } from 'react';
import { Plus, Trash2, Check, Target, Trophy, Plane, Briefcase, Book, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import ProgressBar from '../components/ProgressBar';

const BucketList = () => {
    const [goals, setGoals] = useLocalStorage('bucket_list', []);
    const [newGoal, setNewGoal] = useState('');
    const [category, setCategory] = useState('Personal');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = [
        { name: 'Personal', icon: User, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
        { name: 'Career', icon: Briefcase, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
        { name: 'Travel', icon: Plane, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
        { name: 'Learning', icon: Book, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
    ];

    const addGoal = () => {
        if (!newGoal.trim()) return;
        const newBucketItem = {
            id: Date.now().toString(),
            text: newGoal,
            category,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        setGoals([newBucketItem, ...goals]);
        setNewGoal('');
        setIsModalOpen(false);
    };

    const toggleGoal = (id) => {
        setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const deleteGoal = (id, e) => {
        e.stopPropagation();
        setGoals(goals.filter(g => g.id !== id));
    };

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header & Stats */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bucket List</h1>
                        <p className="text-gray-500 dark:text-gray-400">Dream big, achieve bigger.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-indigo-500/30"
                    >
                        <Plus size={20} />
                        Add Goal
                    </button>
                </div>

                {/* Progress Card */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy size={120} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Your Journey</h2>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-bold">{completedGoals}</span>
                            <span className="text-indigo-200 mb-1">/ {totalGoals} Goals Achieved</span>
                        </div>
                        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories & Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map(cat => {
                    const catGoals = goals.filter(g => g.category === cat.name);
                    if (catGoals.length === 0) return null;

                    return (
                        <div key={cat.name} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-3 rounded-xl ${cat.color}`}>
                                    <cat.icon size={22} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                                <span className="ml-auto text-sm text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                    {catGoals.filter(g => g.completed).length}/{catGoals.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {catGoals.map(goal => (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onClick={() => toggleGoal(goal.id)}
                                            className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between
                                ${goal.completed
                                                    ? 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700 opacity-70'
                                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm'
                                                }
                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                    ${goal.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 dark:border-gray-600'}
                                `}>
                                                    {goal.completed && <Check size={12} strokeWidth={3} />}
                                                </div>
                                                <span className={`transition-all ${goal.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                                    {goal.text}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => deleteGoal(goal.id, e)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>

            {goals.length === 0 && (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <Target size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg">Your bucket list is empty.</p>
                    <p className="text-sm">Start adding your dreams today!</p>
                </div>
            )}

            {/* Add Goal Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6"
                        >
                            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Add New Goal</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal</label>
                                    <input
                                        type="text"
                                        value={newGoal}
                                        onChange={(e) => setNewGoal(e.target.value)}
                                        placeholder="e.g., Visit Japan"
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.name}
                                                onClick={() => setCategory(cat.name)}
                                                className={`flex items-center gap-2 p-2 rounded-lg border transition-all
                                        ${category === cat.name
                                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    }
                                    `}
                                            >
                                                <cat.icon size={16} />
                                                <span className="text-sm">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addGoal}
                                        disabled={!newGoal.trim()}
                                        className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add Goal
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BucketList;
