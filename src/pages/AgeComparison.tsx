import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgeStore } from '../stores/useAgeStore';
import { calculateAgeDifference, calculateNextRatioMilestone } from '../utils/dateUtils';
import { ChevronLeft, Share2, ArrowRightLeft, Heart, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AgeComparison: FC = () => {
    const navigate = useNavigate();
    const { birthDate, name, friends, comparisonPersonId, setComparisonPersonId } = useAgeStore();

    // Select default second person if not set
    useEffect(() => {
        if (!comparisonPersonId && friends.length > 0) {
            setComparisonPersonId(friends[0].id);
        }
    }, [comparisonPersonId, friends, setComparisonPersonId]);

    const comparisonPerson = friends.find(f => f.id === comparisonPersonId);

    // If no data, show empty state or redirect
    if (!birthDate) return <div className="p-10 text-center">Please set your birthday first.</div>;

    // Data Calculation
    const person1 = { name: name || 'You', dob: birthDate };
    const person2 = comparisonPerson || (friends.length > 0 ? friends[0] : null);

    if (!person2) {
        return (
            <div className="min-h-screen bg-background-dark text-white p-6 flex flex-col items-center justify-center text-center">
                <p className="mb-4 text-slate-400">Add friends to compare ages.</p>
                <button
                    onClick={() => navigate('/friends')}
                    className="px-6 py-3 bg-primary rounded-xl font-bold"
                >
                    Go to Friends
                </button>
            </div>
        );
    }

    const diff = calculateAgeDifference(person1.dob, new Date(person2.dob));
    const milestone = calculateNextRatioMilestone(person1.dob, new Date(person2.dob));

    const isPerson1Older = diff.olderPerson === 'A';
    const olderPerson = isPerson1Older ? person1 : person2;
    const youngerPerson = isPerson1Older ? person2 : person1;

    // Timeline Calculation
    // Total range from older birth to now
    const now = new Date().getTime();
    const olderTime = olderPerson.dob.getTime();
    const youngerTime = new Date(youngerPerson.dob).getTime();
    const totalRange = now - olderTime;

    const youngerStartPercent = ((youngerTime - olderTime) / totalRange) * 100;

    return (
        <div className="min-h-screen bg-[#060812] font-sans text-slate-100 pb-28 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] -left-[10%] w-[80%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] -right-[10%] w-[60%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-8">
                <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-transform">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-base font-bold tracking-tight opacity-90">Age Comparison</h1>
                <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-transform">
                    <Share2 size={18} className="text-blue-500" />
                </button>
            </header>

            {/* Content */}
            <main className="relative z-10 px-6 space-y-6">

                {/* VS Configurator */}
                <div className="relative flex items-center justify-between py-6 mb-4">
                    {/* Person 1 */}
                    <div className="flex flex-col items-center gap-4 flex-1">
                        <div className="relative group">
                            <div className={`w-24 h-24 rounded-full border-4 p-1 ${isPerson1Older ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-white/5 bg-white/5'}`}>
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold">
                                    {person1.name.charAt(0)}
                                </div>
                            </div>
                            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border ${isPerson1Older ? 'bg-blue-600 border-white/20' : 'bg-slate-700 border-white/10'}`}>
                                {isPerson1Older ? 'Older' : 'Younger'}
                            </div>
                        </div>
                        <div className="text-center">
                            <p className={`font-extrabold text-lg ${isPerson1Older ? 'text-white' : 'text-slate-300'}`}>{person1.name}</p>
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#060812] text-white font-black italic shadow-2xl border-[1.5px] border-white/10 backdrop-blur-md">
                            <span className="text-xl tracking-tighter">VS</span>
                        </div>
                    </div>

                    {/* Person 2 (Selector) */}
                    <div className="flex flex-col items-center gap-4 flex-1">
                        <div className="relative group cursor-pointer" onClick={() => navigate('/friends')}>
                            <div className={`w-24 h-24 rounded-full border-4 p-1 ${!isPerson1Older ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-white/5 bg-white/5'}`}>
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold">
                                    {person2.name.charAt(0)}
                                </div>
                            </div>
                            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border ${!isPerson1Older ? 'bg-blue-600 border-white/20' : 'bg-slate-700 border-white/10'}`}>
                                {!isPerson1Older ? 'Older' : 'Younger'}
                            </div>
                        </div>
                        <div className="text-center">
                            <p className={`font-extrabold text-lg ${!isPerson1Older ? 'text-white' : 'text-slate-300'}`}>{person2.name}</p>
                            {friends.length > 1 && <p className="text-[10px] text-blue-400 mt-1 uppercase font-bold tracking-wide">Tap to Change</p>}
                        </div>
                    </div>
                </div>

                {/* Age Gap Card */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-7 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-6 font-extrabold">The Age Gap</h2>

                    <div className="flex items-center justify-center gap-5">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-white tracking-tight">{diff.years.toString().padStart(2, '0')}</span>
                            <span className="text-[9px] uppercase text-blue-500 font-black mt-1">Years</span>
                        </div>
                        <span className="text-2xl text-slate-600 font-light mb-4">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-white tracking-tight">{diff.months.toString().padStart(2, '0')}</span>
                            <span className="text-[9px] uppercase text-blue-500 font-black mt-1">Months</span>
                        </div>
                        <span className="text-2xl text-slate-600 font-light mb-4">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-white tracking-tight">{diff.days.toString().padStart(2, '0')}</span>
                            <span className="text-[9px] uppercase text-blue-500 font-black mt-1">Days</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
                        <Heart size={14} className="text-blue-500 fill-blue-500" />
                        <p className="text-xs text-slate-400 font-medium">
                            {olderPerson.name.split(' ')[0]} was born <span className="text-white font-bold">{diff.totalDays.toLocaleString()} days</span> before {youngerPerson.name.split(' ')[0]}.
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-extrabold mb-8 flex items-center gap-2 tracking-tight">
                        <ArrowRightLeft size={16} className="text-blue-500" />
                        Birth Timeline
                    </h3>

                    <div className="relative px-2">
                        {/* Bar */}
                        <div className="relative h-2.5 bg-white/5 rounded-full mb-12 overflow-hidden border border-white/5">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60"
                                style={{ width: `${youngerStartPercent}%` }}
                            />
                            <div
                                className="absolute top-0 h-full bg-white/10"
                                style={{ left: `${youngerStartPercent}%`, right: 0 }}
                            />
                        </div>

                        {/* Older Marker */}
                        <div className="absolute top-[-4px] left-0 flex flex-col items-center -translate-x-1/2">
                            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-2"></div>
                            <span className="text-[11px] font-black text-white tracking-tight uppercase">{olderPerson.name.split(' ')[0]}</span>
                            <span className="text-[9px] text-slate-500 font-bold mt-0.5">
                                {new Date(olderPerson.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                            </span>
                        </div>

                        {/* Younger Marker */}
                        <div className="absolute top-[-4px] flex flex-col items-center -translate-x-1/2" style={{ left: `${youngerStartPercent}%` }}>
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-700 mb-2"></div>
                            <span className="text-[11px] font-black text-slate-300 tracking-tight uppercase">{youngerPerson.name.split(' ')[0]}</span>
                            <span className="text-[9px] text-slate-500 font-bold mt-0.5">
                                {new Date(youngerPerson.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Age Ratio */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Zap size={18} className="text-blue-500" />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Age Ratio</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-black">{diff.ratio.toFixed(2)}</p>
                            <span className="text-xs font-bold text-blue-500">x</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase">
                            {((diff.ratio - 1) * 100).toFixed(0)}% Older
                        </p>
                    </div>

                    {/* Heartbeats */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <Heart size={18} className="text-red-500" />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Heartbeats</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-black">{(diff.heartbeatsDiff / 1000000).toFixed(1)}</p>
                            <span className="text-xs font-bold text-red-500">M</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase">More Beats</p>
                    </div>
                </div>

                {/* Milestone Progress */}
                {milestone && (
                    <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
                        <div className="absolute -right-8 -bottom-8 opacity-[0.05]">
                            <Award size={120} className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-2 py-0.5 bg-blue-500/20 rounded text-[9px] font-black text-blue-500 uppercase tracking-tighter">Milestone</div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ratio Progress</h3>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 font-medium text-slate-200">
                            In <span className="text-white font-extrabold">{milestone.daysRemaining} days</span>, {olderPerson.name.split(' ')[0]} will be exactly <span className="text-blue-500 font-black underline decoration-2 underline-offset-4">{milestone.targetRatio.toFixed(2)}x</span> the age of {youngerPerson.name.split(' ')[0]}.
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Progress Status</span>
                                <span className="text-xs font-black text-blue-500">{milestone.progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                                <div className="h-full w-full rounded-full bg-slate-800 relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${milestone.progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
};
