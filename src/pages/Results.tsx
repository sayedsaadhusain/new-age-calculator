import { type FC, useEffect, useState } from 'react';
import { useAgeStore } from '../stores/useAgeStore';
import { calculateAgeDetails, type AgeDetails } from '../utils/dateUtils';
import {
    ChevronLeft,
    Share2,
    Cake,
    Calendar,
    Clock,
    Timer,
    Info,
    Moon,
    CalendarDays
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const Results: FC = () => {
    const { birthDate } = useAgeStore();
    const navigate = useNavigate();
    const [details, setDetails] = useState<AgeDetails | null>(null);

    useEffect(() => {
        if (birthDate) {
            setDetails(calculateAgeDetails(new Date(birthDate)));
            const interval = setInterval(() => {
                setDetails(calculateAgeDetails(new Date(birthDate)));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [birthDate]);

    if (!details) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Loading...</div>;

    const dob = new Date(birthDate!);
    const nextBday = details.nextBirthday.date;
    const lastBday = new Date(nextBday);
    lastBday.setFullYear(nextBday.getFullYear() - 1);

    // Calculate progress for next birthday
    const totalDuration = nextBday.getTime() - lastBday.getTime();
    const elapsed = new Date().getTime() - lastBday.getTime();
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    return (
        <div className="min-h-screen bg-background-dark text-white pb-32 font-sans relative overflow-x-hidden">
            {/* Top Navigation */}
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-white/10 text-primary transition-colors"
                >
                    <ChevronLeft size={28} />
                </button>
                <h2 className="text-lg font-bold">Age Results</h2>
                <button className="p-2 rounded-full hover:bg-white/10 text-primary transition-colors">
                    <Share2 size={24} />
                </button>
            </div>

            {/* Hero Section */}
            <div className="pt-24 px-4 pb-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center shadow-sm relative overflow-hidden">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full p-1 border-2 border-primary bg-primary/10 mx-auto">
                            {/* Placeholder Avatar */}
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden flex items-center justify-center">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-4 border-background-dark">
                            <Cake size={16} />
                        </div>
                    </div>

                    <div className="text-center space-y-1 z-10">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {details.years} Years, {details.months} Months
                        </h1>
                        <p className="text-2xl font-bold text-primary">
                            {details.days} Days
                        </p>
                        <div className="mt-4 flex flex-col items-center gap-1 text-gray-400">
                            <p className="text-sm font-medium">Born: {dob.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{details.zodiac}</p>
                        </div>
                    </div>

                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl rounded-full -z-0" />
                </div>
            </div>

            {/* Age Breakdown Grid */}
            <div className="px-6 pb-2">
                <h3 className="text-lg font-bold mb-4">Age Breakdown</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 px-4 mb-8">
                {[
                    { label: 'Total Weeks', value: details.totalWeeks.toLocaleString(), icon: Calendar, color: 'text-blue-400' },
                    { label: 'Total Days', value: details.totalDays.toLocaleString(), icon: CalendarDays, color: 'text-purple-400' },
                    { label: 'Total Hours', value: details.totalHours.toLocaleString(), icon: Clock, color: 'text-orange-400' },
                    { label: 'Total Minutes', value: details.totalMinutes.toLocaleString(), icon: Timer, color: 'text-cyan-400' }
                ].map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-2">
                            <item.icon size={20} className={item.color} />
                            <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                        </div>
                        <p className={cn("text-2xl font-bold tracking-tight", item.value.length > 8 ? "text-xl" : "text-2xl")}>
                            {item.value}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Next Big Milestone */}
            <div className="px-6 pb-2">
                <h3 className="text-lg font-bold mb-4">Next Big Milestone</h3>
            </div>
            <div className="px-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary rounded-2xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden"
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                                {details.nextBirthday.ageTurning}th Birthday Countdown
                            </p>
                            <h4 className="text-white text-4xl font-bold">
                                {details.nextBirthday.days} Days Left
                            </h4>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <Cake size={24} className="text-white" />
                        </div>
                    </div>

                    <div className="w-full bg-black/20 rounded-full h-2 mt-6 relative z-10 overflow-hidden">
                        <motion.div
                            className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-white/80 text-xs mt-2 font-medium relative z-10">
                        <span>{lastBday.getFullYear()}</span>
                        <span>{nextBday.getFullYear()}</span>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                </motion.div>
            </div>

            {/* Additional Stats */}
            <div className="px-4 flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-gray-400" />
                        <span className="text-gray-200 font-medium">Leap years lived</span>
                    </div>
                    <span className="text-white font-bold text-lg">{details.leapYearsLived}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Moon size={20} className="text-gray-400" />
                        <span className="text-gray-200 font-medium">Sleep cycles</span>
                    </div>
                    <span className="text-white font-bold text-lg">{(details.totalHours / 1.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
            </div>

        </div>
    );
};
