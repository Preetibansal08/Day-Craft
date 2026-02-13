import React, { useState } from 'react';
import { Plus, Trash2, Check, X, Calendar as CalendarIcon, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import ProgressBar from '../components/ProgressBar';

const Tasks = () => {
    // Key by date to ensure daily unique lists
    const today = new Date().toISOString().split('T')[0];
    const [tasksByDate, setTasksByDate] = useLocalStorage('daily_tasks', {});
    const [newTask, setNewTask] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const tasks = tasksByDate[today] || [];

    const updateTasks = (newTasks) => {
        setTasksByDate((prev) => ({
            ...prev,
            [today]: newTasks,
        }));
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now().toString(),
            text: newTask,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        updateTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        updateTasks(updatedTasks);
    };

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        updateTasks(updatedTasks);
    };

    const startEditing = (task) => {
        setEditingId(task.id);
        setEditText(task.text);
    };

    const saveEdit = () => {
        if (!editText.trim()) return;
        const updatedTasks = tasks.map((task) =>
            task.id === editingId ? { ...task, text: editText } : task
        );
        updateTasks(updatedTasks);
        setEditingId(null);
        setEditText('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Daily Tasks</h1>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <CalendarIcon size={18} className="mr-2" />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {completedCount}/{tasks.length} Completed
                    </p>
                    <div className="w-32">
                        <ProgressBar progress={progress} />
                    </div>
                </div>
            </div>

            <form onSubmit={addTask} className="mb-8 relative">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full p-4 pl-5 pr-14 rounded-xl bg-white dark:bg-gray-800 border-none shadow-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 dark:text-white"
                />
                <button
                    type="submit"
                    disabled={!newTask.trim()}
                    className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus size={24} />
                </button>
            </form>

            <div className="space-y-3">
                <AnimatePresence>
                    {tasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12 text-gray-400 dark:text-gray-500"
                        >
                            <p>No tasks for today. Start by adding one!</p>
                        </motion.div>
                    )}

                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            layout
                            className={`p-4 rounded-xl shadow-sm border transition-all ${task.completed
                                    ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800'
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-between group">
                                {editingId === task.id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            autoFocus
                                        />
                                        <button onClick={saveEdit} className="text-green-500 hover:text-green-600"><Check size={20} /></button>
                                        <button onClick={cancelEdit} className="text-red-500 hover:text-red-600"><X size={20} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${task.completed
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                                                    }`}
                                            >
                                                {task.completed && <Check size={16} strokeWidth={3} />}
                                            </div>
                                            <span
                                                className={`text-lg transition-all ${task.completed
                                                        ? 'text-gray-400 line-through'
                                                        : 'text-gray-800 dark:text-gray-200'
                                                    }`}
                                            >
                                                {task.text}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(task)}
                                                className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Tasks;
