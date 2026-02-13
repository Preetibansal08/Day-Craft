import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    BookOpen,
    StickyNote,
    ListTodo,
    Target,
    Menu,
    X,
    LogOut,
    Home
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Home Page', path: '/', icon: Home },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Tasks', path: '/dashboard/tasks', icon: ListTodo },
        { name: 'Journal', path: '/dashboard/journal', icon: BookOpen },
        { name: 'Notes', path: '/dashboard/notes', icon: StickyNote },
        { name: 'Checklists', path: '/dashboard/checklists', icon: CheckSquare },
        { name: 'Bucket List', path: '/dashboard/bucket-list', icon: Target },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 transform bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            Day Craft
                        </h1>
                        <div className="md:hidden">
                            <ThemeToggle />
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon
                                    size={20}
                                    className={`mr-3 transition-colors ${isActive(item.path)
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                        }`}
                                />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 pb-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut size={20} className="mr-3" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>

                    <div className="hidden md:flex items-center justify-between mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>v1.1.0</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
