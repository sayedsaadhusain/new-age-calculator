import { type FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, RotateCcw, Globe, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const Navbar: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { id: 'results', icon: Calendar, label: 'Results', path: '/results' },
        { id: 'milestones', icon: Globe, label: 'Milestones', path: '/milestones' },
        { id: 'friends', icon: Users, label: 'Friends', path: '/friends' },
        { id: 'home', icon: RotateCcw, label: 'New', path: '/' },
    ];

    if (location.pathname === '/') return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-card rounded-full p-2 flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-black/40 backdrop-blur-xl">
                {items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "relative px-6 py-3 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[80px]",
                                isActive ? "text-white" : "text-gray-400 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon size={20} className="relative z-10" />
                            {isActive && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-[10px] font-bold relative z-10"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
