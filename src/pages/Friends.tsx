import { type FC, useState } from 'react';
import { useAgeStore } from '../stores/useAgeStore';
import { calculateAgeDetails } from '../utils/dateUtils';
import { Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Friends: FC = () => {
    const { friends, addFriend, removeFriend } = useAgeStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newFriendName, setNewFriendName] = useState('');
    const [newFriendDate, setNewFriendDate] = useState('');

    const handleAddFriend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFriendName && newFriendDate) {
            addFriend(newFriendName, new Date(newFriendDate));
            setNewFriendName('');
            setNewFriendDate('');
            setIsAdding(false);
        }
    };

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-32">
            {/* Header */}
            <div className="flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between sticky top-0 z-20">
                <div className="w-10"></div>
                <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Friends & Family</h2>
                <div className="flex w-10 items-center justify-end">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex w-10 h-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform active:scale-95"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800/50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                        placeholder="Search friends & family"
                    />
                </div>
            </div>

            {/* Friends List */}
            <div className="flex flex-col gap-4 p-4">
                {filteredFriends.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        {searchTerm ? 'No matches found.' : 'No friends added yet.'}
                    </div>
                ) : (
                    filteredFriends.map((friend, index) => {
                        const details = calculateAgeDetails(new Date(friend.dob));
                        if (!details) return null;

                        const nextBday = details.nextBirthday.date;
                        const lastBday = new Date(nextBday);
                        lastBday.setFullYear(nextBday.getFullYear() - 1);

                        const totalDuration = nextBday.getTime() - lastBday.getTime();
                        const elapsed = new Date().getTime() - lastBday.getTime();
                        const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

                        return (
                            <motion.div
                                key={friend.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative group"
                            >
                                <button
                                    onClick={() => removeFriend(friend.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <X size={12} />
                                </button>

                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <span className="text-xl font-bold text-slate-400">
                                            {friend.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div className="truncate pr-2">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{friend.name}</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{details.years} years old</p>
                                        </div>
                                        <div className="bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                            In {details.nextBirthday.days} days
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                            {new Date(friend.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* FAB (Mobile Only) */}
            <button
                onClick={() => setIsAdding(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/40 flex items-center justify-center z-30 sm:hidden transition-transform active:scale-90"
            >
                <Plus size={32} />
            </button>

            {/* Add Friend Modal */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Add New Person</h3>
                                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddFriend} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Name</label>
                                    <input
                                        type="text"
                                        value={newFriendName}
                                        onChange={(e) => setNewFriendName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:border-primary transition-colors"
                                        placeholder="Enter name"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={newFriendDate}
                                        onChange={(e) => setNewFriendDate(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:border-primary transition-colors"
                                        required
                                    />
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
                                    >
                                        Save Friend
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
