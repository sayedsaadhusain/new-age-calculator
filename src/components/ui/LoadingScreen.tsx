import { type FC } from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Main Logo / Loader */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-12">
                    {/* Rotating Rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-blue-500/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-[10px] rounded-full border border-purple-500/30"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-[20px] rounded-full border border-white/10"
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Glowing Core */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_0_50px_rgba(79,70,229,0.5)] flex items-center justify-center z-20"
                    >
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
                        <span className="relative text-2xl font-black text-white tracking-tighter">AGE</span>
                    </motion.div>

                    {/* Orbiting Particle */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-3 h-3 bg-blue-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 blur-[1px] shadow-[0_0_10px_#60a5fa]" />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-blue-200 tracking-tight"
                    >
                        Age Calculator
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <p className="text-white/40 text-sm tracking-widest uppercase font-medium">
                            Preparing your journey
                        </p>

                        {/* Custom Progress Bar */}
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-10 left-0 right-0 text-center"
            >
                <p className="text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase">
                    Version 2.0 • Premium Edition
                </p>
            </motion.div>
        </div>
    );
};
