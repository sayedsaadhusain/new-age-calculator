import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgeStore } from '../stores/useAgeStore';
import {
    ArrowRight,
    Menu,
    History,
    PartyPopper, // Celebration
    CalendarDays
} from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '../components/ui/DatePicker';

export const Home: FC = () => {
    const navigate = useNavigate();
    const { birthDate, setBirthDate } = useAgeStore();

    // State for date input
    const [dateString, setDateString] = useState(birthDate ? birthDate.toLocaleDateString('en-GB') : '');
    const [showCalendar, setShowCalendar] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = () => {
        if (dateString.length !== 10) {
            setError('Please enter a full date (DD/MM/YYYY)');
            return;
        }

        const [day, month, year] = dateString.split('/').map(Number);
        const dob = new Date(year, month - 1, day);

        // Basic validation
        if (
            dob.getDate() !== day ||
            dob.getMonth() !== month - 1 ||
            dob.getFullYear() !== year ||
            year < 1900 ||
            year > new Date().getFullYear()
        ) {
            setError('Invalid Date');
            return;
        }

        setBirthDate(dob);
        navigate('/results');
    };

    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-background-dark text-white flex flex-col items-center relative overflow-hidden font-display">
            {/* Background Pattern Decoration (Mesh Gradient) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Top Navigation Bar */}
            <div className="w-full flex items-center justify-between p-4 z-20 border-b border-white/5 bg-background-dark/50 backdrop-blur-md sticky top-0">
                <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors">
                    <Menu className="text-white" />
                </button>
                <h2 className="text-lg font-bold">Age Calculator</h2>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Hero Content */}
            <main className="flex-1 w-full max-w-md flex flex-col items-center px-6 pt-12 z-10 pb-24">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-8"
                >
                    <CalendarDays className="text-primary w-10 h-10" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-2"
                >
                    When were you born?
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-base text-center mb-10"
                >
                    Today is <span className="font-medium text-white">{today}</span>
                </motion.p>

                {/* Input Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full space-y-6"
                >
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-sm font-semibold text-gray-300 ml-1">Date of Birth</label>
                        <div className="relative group">
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={cn(
                                    "w-full h-16 bg-white/5 border rounded-xl px-4 text-xl font-medium flex items-center justify-between transition-all outline-none text-left",
                                    error ? "border-red-500 focus:ring-red-500" : "border-white/10 hover:border-primary/50",
                                    showCalendar && "border-primary ring-2 ring-primary/20"
                                )}
                            >
                                <span className={cn(!dateString && "text-gray-600")}>
                                    {dateString || "DD / MM / YYYY"}
                                </span>
                                <CalendarDays size={24} className="text-gray-400" />
                            </button>

                            <AnimatePresence>
                                {showCalendar && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 right-0 mt-2 z-50"
                                    >
                                        <div className="bg-background-dark/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1">
                                            <DatePicker
                                                selected={birthDate || new Date()}
                                                onSelect={(date) => {
                                                    setBirthDate(date);
                                                    setDateString(date.toLocaleDateString('en-GB')); // DD/MM/YYYY
                                                    setShowCalendar(false);
                                                    setError('');
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {error && <span className="text-red-400 text-xs ml-1">{error}</span>}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleCalculate}
                        className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                        <span>Calculate Age</span>
                        <ArrowRight size={20} />
                    </button>
                </motion.div>

                {/* Secondary Info/Features */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 w-full"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/friends')}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center text-center transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <History className="text-blue-400 w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Saved</span>
                            <span className="text-sm font-bold mt-1">History</span>
                        </button>

                        <button
                            onClick={() => navigate('/milestones')}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center text-center transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <PartyPopper className="text-amber-500 w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Next</span>
                            <span className="text-sm font-bold mt-1">Milestones</span>
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
