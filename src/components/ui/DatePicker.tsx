import { useState, useEffect, useRef } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek,
    setMonth,
    setYear,
    getYear,
    getMonth
} from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface DatePickerProps {
    className?: string;
    selected?: Date;
    onSelect: (date: Date) => void;
}

type ViewMode = 'days' | 'months' | 'years';

export const DatePicker: React.FC<DatePickerProps> = ({ className, selected, onSelect }) => {
    const [currentDate, setCurrentDate] = useState(selected || new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('days');
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync state with prop if it changes externally
    useEffect(() => {
        if (selected) {
            setCurrentDate(selected);
        }
    }, [selected]);

    const handlePrevious = () => {
        setSlideDirection('right');
        if (viewMode === 'days') setCurrentDate(subMonths(currentDate, 1));
        if (viewMode === 'years') setCurrentDate(new Date(getYear(currentDate) - 12, getMonth(currentDate), 1));
    };

    const handleNext = () => {
        setSlideDirection('left');
        if (viewMode === 'days') setCurrentDate(addMonths(currentDate, 1));
        if (viewMode === 'years') setCurrentDate(new Date(getYear(currentDate) + 12, getMonth(currentDate), 1));
    };

    const handleDateClick = (date: Date) => {
        onSelect(date);
    };

    const handleMonthSelect = (monthIndex: number) => {
        setCurrentDate(setMonth(currentDate, monthIndex));
        setViewMode('days');
    };

    const handleYearSelect = (year: number) => {
        setCurrentDate(setYear(currentDate, year));
        setViewMode('months'); // Go to month selection after year
    };

    const toggleViewMode = () => {
        if (viewMode === 'days') setViewMode('years');
        else setViewMode('days');
    };

    // Generate days for the grid
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });



    // Years generation
    const currentYear = getYear(currentDate);
    const yearsStart = currentYear - 6;
    const yearsEnd = currentYear + 5;
    const years = Array.from({ length: 12 }, (_, i) => yearsStart + i);

    return (
        <div className={cn("p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl w-full max-w-[340px]", className)} ref={containerRef}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <button
                    onClick={handlePrevious}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={toggleViewMode}
                    className="flex items-center gap-1 font-bold text-lg text-white hover:text-primary transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
                >
                    {viewMode === 'days' && format(currentDate, 'MMMM yyyy')}
                    {viewMode === 'months' && getYear(currentDate)}
                    {viewMode === 'years' && `${yearsStart} - ${yearsEnd}`}
                    <ChevronDown size={16} className={cn("transition-transform duration-300", viewMode !== 'days' && "rotate-180")} />
                </button>

                <button
                    onClick={handleNext}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="relative overflow-hidden min-h-[280px]">
                <AnimatePresence mode="wait" custom={slideDirection}>
                    {viewMode === 'days' && (
                        <motion.div
                            key={format(currentDate, 'MM-yyyy')}
                            initial={{ x: slideDirection === 'right' ? -20 : 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: slideDirection === 'right' ? 20 : -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                        >
                            {/* Weekday Names */}
                            <div className="grid grid-cols-7 mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-center text-xs font-medium text-white/40 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day, i) => {
                                    const isSelected = selected && isSameDay(day, selected);
                                    const isCurrentMonth = isSameMonth(day, currentDate);
                                    const isToday = isSameDay(day, new Date());

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleDateClick(day)}
                                            className={cn(
                                                "aspect-square rounded-full flex items-center justify-center text-sm transition-all relative",
                                                !isCurrentMonth && "text-white/20",
                                                isCurrentMonth && "text-white/90 hover:bg-white/10",
                                                isSelected && "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-primary font-bold z-10",
                                                isToday && !isSelected && "border border-primary text-primary"
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'months' && (
                        <motion.div
                            key="months"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="grid grid-cols-3 gap-4 py-4"
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleMonthSelect(i)}
                                    className={cn(
                                        "p-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/10",
                                        getMonth(currentDate) === i ? "bg-primary text-white shadow-lg" : "text-white/80"
                                    )}
                                >
                                    {format(setMonth(new Date(), i), 'MMM')}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {viewMode === 'years' && (
                        <motion.div
                            key="years"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="grid grid-cols-3 gap-4 py-4"
                        >
                            {years.map(year => (
                                <button
                                    key={year}
                                    onClick={() => handleYearSelect(year)}
                                    className={cn(
                                        "p-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/10",
                                        getYear(currentDate) === year ? "bg-primary text-white shadow-lg" : "text-white/80",
                                        year === new Date().getFullYear() && getYear(currentDate) !== year && "border border-white/20"
                                    )}
                                >
                                    {year}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
