import { type FC, useEffect, useState } from 'react';
import { useAgeStore } from '../stores/useAgeStore';
import { calculatePlanetaryAges, getMilestones, type PlanetaryAge, type Milestone } from '../utils/dateUtils';
import { Card } from '../components/ui/Card';
import { Rocket, Flag, CalendarCheck, Lock, Unlock } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export const Milestones: FC = () => {
    const { birthDate } = useAgeStore();
    const [planets, setPlanets] = useState<PlanetaryAge[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);

    useEffect(() => {
        if (birthDate) {
            const date = new Date(birthDate);
            setPlanets(calculatePlanetaryAges(date));
            setMilestones(getMilestones(date));
        }
    }, [birthDate]);

    // Find next upcoming milestone
    const nextMilestone = milestones.find(m => !m.isCompleted);

    return (
        <div className="min-h-screen bg-background-dark text-white p-4 pb-32">
            <h1 className="text-3xl font-bold mb-6 pt-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Milestones
            </h1>

            {/* Next Milestone Hero */}
            {nextMilestone && (
                <Card variant="solid" className="mb-8 relative overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-900/40 to-black">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Flag size={80} className="text-orange-500/20" />
                    </div>
                    <h2 className="text-sm text-orange-400 font-bold uppercase tracking-widest mb-2">Next Big Moment</h2>
                    <div className="text-3xl font-bold mb-1">{nextMilestone.title}</div>
                    <div className="text-xl text-gray-400 mb-4">{new Date(nextMilestone.date).toLocaleDateString()}</div>

                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }} // approximate progress
                        />
                    </div>
                    <div className="text-right text-xs text-orange-300 mt-2">Coming soon</div>
                </Card>
            )}

            {/* Timeline Section */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CalendarCheck className="text-blue-400" /> Life Journey
            </h2>
            <div className="space-y-4 mb-8 pl-4 border-l-2 border-white/10 relative">
                {milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-6">
                        <div className={cn(
                            "absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2",
                            milestone.isCompleted ? "bg-green-500 border-green-500" : "bg-black border-gray-600"
                        )} />
                        <Card variant={milestone.isCompleted ? "glass" : "outline"} className={cn("p-4 transition-all hover:scale-[1.02]", !milestone.isCompleted && "opacity-60")}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={cn("font-bold text-lg", milestone.isCompleted ? "text-white" : "text-gray-400")}>
                                        {milestone.title}
                                    </h3>
                                    <p className="text-sm text-blue-300">{milestone.value}</p>
                                </div>
                                {milestone.isCompleted ? <Unlock size={18} className="text-green-500" /> : <Lock size={18} className="text-gray-500" />}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {new Date(milestone.date).toDateString()}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Planetary Ages */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Rocket className="text-purple-400" /> Galactic Age
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {planets.map((planet) => (
                    <Card key={planet.planet} variant="glass" className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className={cn("font-bold", planet.iconColor)}>{planet.planet}</span>
                            <span className="text-2xl font-bold">{planet.years}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                            Birthday in {planet.nextBirthdayIn} days
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div
                                className={cn("h-full opacity-50", planet.iconColor.replace('text-', 'bg-'))}
                                style={{ width: `${Math.random() * 100}%` }} // Simplified progress for MVP
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
