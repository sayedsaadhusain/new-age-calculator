import { type ReactNode, type FC } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    variant?: 'glass' | 'solid' | 'outline';
    glow?: boolean;
}

export const Card: FC<CardProps> = ({
    children,
    className,
    variant = 'glass',
    glow = false,
    ...props
}) => {
    const baseStyles = "rounded-2xl p-6 transition-all duration-300";

    const variants = {
        glass: "glass-card border border-white/10 text-white",
        solid: "bg-card-dark border border-white/5 text-white",
        outline: "border border-white/20 bg-transparent text-white"
    };

    const glowStyles = glow ? "shadow-[0_0_20px_rgba(43,75,238,0.2)] hover:shadow-[0_0_30px_rgba(43,75,238,0.4)]" : "";

    return (
        <motion.div
            className={cn(baseStyles, variants[variant], glowStyles, className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
