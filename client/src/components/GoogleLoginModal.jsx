import React, { useState } from 'react';
import { X, User, Plus } from 'lucide-react';

const GoogleLoginModal = ({ isOpen, onClose, onLogin }) => {
    const [step, setStep] = useState('accounts'); // accounts, email, password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const mockAccounts = [
        { name: 'John Doe', email: 'john.doe@gmail.com', letter: 'J', color: 'bg-green-600' },
    ];

    const handleAccountClick = (acc) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLogin(acc.email);
        }, 800);
    }

    const handleNext = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (step === 'email') {
                if (email.trim().includes('@')) setStep('password');
            } else {
                onLogin(email);
            }
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[450px] p-10 relative overflow-hidden transition-all">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <div className="relative w-full h-1 bg-gray-100 overflow-hidden">
                            <div className="absolute left-0 h-full w-1/3 bg-blue-600 animate-[loading_1s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 p-2 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 mb-4">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>

                    <h2 className="text-2xl font-normal text-gray-900 mb-2">
                        {step === 'accounts' ? 'Choose an account' : 'Sign in with Google'}
                    </h2>
                    <p className="text-base text-gray-800 mb-8">
                        {step === 'accounts' ? 'to continue to Day Craft' : step === 'email' ? 'Use your Google Account' : 'Welcome'}
                    </p>

                    {step === 'accounts' ? (
                        <div className="w-full space-y-2">
                            {mockAccounts.map(acc => (
                                <button
                                    key={acc.email}
                                    onClick={() => handleAccountClick(acc)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0 text-left"
                                >
                                    <div className={`w-8 h-8 rounded-full ${acc.color} text-white flex items-center justify-center text-sm font-bold`}>
                                        {acc.letter}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">{acc.name}</div>
                                        <div className="text-xs text-gray-500">{acc.email}</div>
                                    </div>
                                </button>
                            ))}

                            <button
                                onClick={() => setStep('email')}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                    <Plus size={16} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Use another account</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {step === 'password' && (
                                <div className="w-full flex items-center justify-center p-1 border border-gray-200 rounded-full mb-8">
                                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold mr-2">
                                        {email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-700">{email}</span>
                                </div>
                            )}

                            <form onSubmit={handleNext} className="w-full">
                                {step === 'email' ? (
                                    <div className="relative mb-8 group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full px-3 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                                            placeholder=" "
                                            required
                                            autoFocus
                                        />
                                        <label className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">
                                            Email or phone
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative mb-8">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full px-3 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                                            placeholder=" "
                                            required
                                            autoFocus
                                        />
                                        <label className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">
                                            Enter your password
                                        </label>
                                    </div>
                                )}

                                <div className="text-sm text-blue-600 font-medium cursor-pointer mb-12 hover:underline inline-block">
                                    Forgot {step === 'email' ? 'email?' : 'password?'}
                                </div>

                                <div className="flex items-center justify-end w-full">
                                    {step === 'email' && (
                                        <button type="button" className="text-blue-600 font-medium text-sm hover:bg-blue-50 px-4 py-2 rounded mr-auto">
                                            Create account
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-[4px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleLoginModal;
