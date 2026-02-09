import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircularSelector } from '../components/entry/CircularSelector';
import { Card } from '../components/ui/Card';
import { useAgeStore } from '../stores/useAgeStore';
import { Calendar, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';

export const Home: FC = () => {
    const navigate = useNavigate();
    const { setBirthDate } = useAgeStore();
    const [step, setStep] = useState<'year' | 'month' | 'day'>('year');

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(2000);
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);

    const handleNext = () => {
        if (step === 'year') setStep('month');
        else if (step === 'month') setStep('day');
        else {
            // Calculate and save
            const dob = new Date(year, month - 1, day);
            setBirthDate(dob);
            navigate('/results');
        }
    };

    const getStepLabel = () => {
        if (step === 'year') return 'Select Birth Year';
        if (step === 'month') return 'Select Birth Month';
        return 'Select Birth Day';
    };

    const getDialProps = () => {
        if (step === 'year') return { min: 1900, max: currentYear, value: year, onChange: setYear };
        if (step === 'month') return { min: 1, max: 12, value: month, onChange: setMonth };

        // Calculate max days in month
        const maxDays = new Date(year, month, 0).getDate();
        return { min: 1, max: maxDays, value: day, onChange: setDay };
    };

    const dialProps = getDialProps();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Mesh Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10 space-y-8"
            >
                <div className="text-center space-y-2">
                    <motion.h1
                        key={step}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold text-white tracking-tight"
                    >
                        {getStepLabel()}
                    </motion.h1>
                    <div className="flex justify-center gap-2">
                        {['year', 'month', 'day'].map((s, i) => (
                            <div
                                key={s}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    s === step ? "bg-blue-500 w-6" : (['year', 'month', 'day'].indexOf(step) > i ? "bg-blue-500/50" : "bg-white/20")
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative h-80 flex items-center justify-center">
                    <CircularSelector
                        {...dialProps}
                        label={step.toUpperCase()}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Card variant="glass" className="p-4 flex flex-col items-center justify-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Date of Birth</span>
                        <span className="font-semibold">{day}/{month}/{year}</span>
                    </Card>
                    <Card variant="glass" className="p-4 flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 text-green-400" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Today</span>
                        <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                    </Card>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(43,75,238,0.4)] hover:shadow-[0_0_30px_rgba(43,75,238,0.6)] transition-shadow"
                >
                    {step === 'day' ? 'Calculate Age' : 'Next'}
                </motion.button>

                {/* Tab Strip */}
                <div className="flex justify-center gap-8 text-sm font-medium text-gray-500">
                    {['Year', 'Month', 'Day'].map((label) => (
                        <button
                            key={label}
                            onClick={() => setStep(label.toLowerCase() as any)}
                            className={cn(
                                "transition-colors hover:text-white",
                                step === label.toLowerCase() ? "text-blue-400" : ""
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
