import { type FC, useEffect, useState } from 'react';

import { useAgeStore } from '../stores/useAgeStore';
import { calculateAgeDetails, type AgeDetails } from '../utils/dateUtils';
import { Card } from '../components/ui/Card';
import { Calendar, Clock, RotateCcw, User, Smile } from 'lucide-react';


export const Results: FC = () => {
    const { birthDate } = useAgeStore();
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

    if (!details) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-background-dark text-white p-4 pb-20">
            {/* Hero Section */}
            <div className="flex flex-col items-center gap-4 mb-8 pt-8">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500 p-1">
                    <div className="w-full h-full rounded-full bg-blue-500/20 flex items-center justify-center">
                        <User size={40} className="text-blue-300" />
                    </div>
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {details.years} Years
                    </h1>
                    <p className="text-xl text-gray-400">
                        {details.months} Months, {details.days} Days
                    </p>
                    <div className="mt-2 text-sm text-blue-300 font-medium px-3 py-1 rounded-full bg-blue-500/10 inline-block border border-blue-500/20">
                        {details.zodiac}
                    </div>
                </div>
            </div>

            {/* Age Breakdown Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card variant="glass" className="flex flex-col items-center p-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <Calendar size={18} className="text-blue-400" />
                    </div>
                    <span className="text-xl font-bold">{details.totalWeeks.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 uppercase">Weeks</span>
                </Card>
                <Card variant="glass" className="flex flex-col items-center p-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                        <Calendar size={18} className="text-purple-400" />
                    </div>
                    <span className="text-xl font-bold">{details.totalDays.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 uppercase">Days</span>
                </Card>
                <Card variant="glass" className="flex flex-col items-center p-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                        <Clock size={18} className="text-orange-400" />
                    </div>
                    <span className="text-xl font-bold">{details.totalHours.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 uppercase">Hours</span>
                </Card>
                <Card variant="glass" className="flex flex-col items-center p-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                        <RotateCcw size={18} className="text-green-400" />
                    </div>
                    <span className="text-xl font-bold">{details.totalMinutes.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 uppercase">Minutes</span>
                </Card>
            </div>

            {/* Next Milestone */}
            <Card variant="solid" className="mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 border-none relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-blue-100">Next Birthday</h3>
                            <p className="text-sm text-blue-300">Turning {details.nextBirthday.ageTurning}</p>
                        </div>
                        <Smile className="text-yellow-400" />
                    </div>

                    <div className="flex justify-between items-end mt-4">
                        <div className="text-center">
                            <span className="text-2xl font-bold">{details.nextBirthday.days}</span>
                            <div className="text-[10px] uppercase opacity-70">Days</div>
                        </div>
                        <div className="text-center">
                            <span className="text-2xl font-bold">{details.nextBirthday.hours}</span>
                            <div className="text-[10px] uppercase opacity-70">Hrs</div>
                        </div>
                        <div className="text-center">
                            <span className="text-2xl font-bold">{details.nextBirthday.minutes}</span>
                            <div className="text-[10px] uppercase opacity-70">Mins</div>
                        </div>
                        <div className="text-center">
                            <span className="text-2xl font-bold">{details.nextBirthday.seconds}</span>
                            <div className="text-[10px] uppercase opacity-70">Secs</div>
                        </div>
                    </div>
                </div>
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
            </Card>

            {/* Additional Stats */}
            <div className="space-y-4 mb-20">
                <div className="flex justify-between items-center p-4 glass-card rounded-xl">
                    <span className="text-gray-300">Leap Years Lived</span>
                    <span className="text-xl font-bold">{details.leapYearsLived}</span>
                </div>
                <div className="flex justify-between items-center p-4 glass-card rounded-xl">
                    <span className="text-gray-300">Sleep Cycles (est.)</span>
                    <span className="text-xl font-bold">{(details.totalHours / 1.5).toFixed(0)}</span>
                </div>
            </div>



        </div>
    );
};
