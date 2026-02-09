import { useState, type FC } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CircularSelectorProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    label?: string;
}

export const CircularSelector: FC<CircularSelectorProps> = ({
    value,
    min,
    max,
    onChange,
    label
}) => {
    const [isDragging, setIsDragging] = useState(false);

    // Calculate percentage for visual ring (0-100)
    // Ensure value is within bounds
    const clampedValue = Math.min(Math.max(value, min), max);
    const percentage = ((clampedValue - min) / (max - min));
    // Map to full circle? Or partial? "Circular dial" implies full circle usually.
    // Visual representation:
    // If years: 1900 to 2025 -> 125 values.
    // One rotation = full range? Or infinite?
    // Let's do partial ring for cleaner look if range is small, 
    // but for years, a full ring is better.
    // Let's us SVG dasharray.
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (percentage) * circumference;

    const handleDrag = (_: any, info: PanInfo) => {
        const sensitivity = 5; // px per unit
        // We only care about delta X for simplicity unless we implement rotary drag
        if (Math.abs(info.delta.x) > 0) {
            const delta = info.delta.x / sensitivity;
            const potentialValue = value + delta;
            const newValue = Math.min(Math.max(Math.round(potentialValue), min), max);
            if (newValue !== value) {
                onChange(newValue);
            }
        }
    };

    // Convert percentage to angle for handle position
    // 0% -> -90deg (top)
    // 100% -> 270deg (top again)
    const angle = percentage * 2 * Math.PI - (Math.PI / 2); // Start at top
    const handleX = 150 + radius * Math.cos(angle);
    const handleY = 150 + radius * Math.sin(angle);

    return (
        <div className="relative w-[300px] h-[300px] mx-auto flex items-center justify-center select-none">
            {/* Interactive area for drag - full cover or just the ring? */}
            {/* Let's make the whole area draggable for ease on mobile */}
            <motion.div
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={handleDrag}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                style={{ touchAction: 'none' }}
            />

            {/* Background SVG Ring */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300">
                <defs>
                    <linearGradient id="gradientRing" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Track */}
                <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="20"
                />

                {/* Progress with dashes */}
                <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                />

                {/* Active Progress */}
                <motion.circle
                    cx="150"
                    cy="150"
                    r={radius}
                    fill="none"
                    stroke="url(#gradientRing)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 150 150)"
                    filter="url(#glow)"
                />
            </svg>

            {/* Knob Handle */}
            {/* Calculate position based on percentage */}
            <motion.div
                className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 pointer-events-none flex items-center justify-center border-2 border-blue-500"
                style={{
                    left: handleX - 16, // Center the 32px handle
                    top: handleY - 16,
                }}
                animate={{ scale: isDragging ? 1.2 : 1 }}
            >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </motion.div>

            {/* Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="w-40 h-40 glass-card rounded-full flex flex-col items-center justify-center border border-white/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-md">
                    <span className="text-5xl font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent tracking-tighter">
                        {value}
                    </span>
                    {label && <span className="text-xs text-blue-300/70 mt-2 font-medium tracking-[0.2em]">{label}</span>}
                </div>
            </div>

            {/* Controls */}
            <div className="absolute -bottom-16 flex items-center gap-8 z-30 pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); onChange(Math.max(value - 1, min)); }}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors border border-white/10"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Adjust</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onChange(Math.min(value + 1, max)); }}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors border border-white/10"
                >
                    <ChevronRight size={24} className="text-white" />
                </button>
            </div>

        </div>
    );
};
