import { type FC } from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#101322]">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[80px]" />

            <div className="relative">
                {/* Main Logo / Icon container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-32 h-32 rounded-full relative flex items-center justify-center mb-8"
                >
                    {/* Pulsing rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-blue-500/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-purple-500/30"
                        animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />

                    {/* Center Icon Graphic (matches user request icon style roughly) */}
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center justify-center relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{ transformOrigin: "center" }}
                        >
                            <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-white/10" />
                        </motion.div>
                        <div className="glass w-20 h-20 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm border border-white/10">
                            <span className="text-2xl font-black text-white tracking-tighter">AGE</span>
                        </div>
                    </div>
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                        Calculate Your Journey
                    </h2>
                    <div className="flex justify-center gap-1 mt-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-blue-500 rounded-full"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-8 text-xs text-gray-600 font-mono">
                v1.0.0 • POWERED BY VITE
            </div>
        </div>
    );
};
