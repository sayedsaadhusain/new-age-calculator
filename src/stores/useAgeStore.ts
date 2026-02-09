import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AgeState {
    birthDate: Date | null;
    name: string;
    setBirthDate: (date: Date) => void;
    setName: (name: string) => void;
    friends: Array<{ id: string; name: string; dob: Date }>;
    addFriend: (name: string, dob: Date) => void;
    removeFriend: (id: string) => void;
}

export const useAgeStore = create<AgeState>()(
    persist(
        (set) => ({
            birthDate: null,
            name: '',
            setBirthDate: (date) => set({ birthDate: date }),
            setName: (name) => set({ name }),
            friends: [],
            addFriend: (name, dob) => set((state) => ({
                friends: [...state.friends, { id: crypto.randomUUID(), name, dob }]
            })),
            removeFriend: (id) => set((state) => ({
                friends: state.friends.filter((f) => f.id !== id)
            })),
        }),
        {
            name: 'age-calculator-storage',
            partialize: (state) => ({
                ...state,
                birthDate: state.birthDate ? state.birthDate.toISOString() : null, // Store as string if object, but persist usually handles simple JSON.
                // Wait, Date objects need to be deserialized.
                // Zustand persist stores JSON string. So parsing back is needed.
                // Or store as timestamps/strings.
                // Best to store as strings and parse on read or make state store strings.
                // Since `birthDate` is critical, let's keep it as string in storage, but Date in state?
                // Let's store as string in Zustand state simplifies everything.
            }),
            onRehydrateStorage: () => (state) => {
                if (state && state.birthDate && typeof state.birthDate === 'string') {
                    state.birthDate = new Date(state.birthDate);
                }
                if (state && state.friends) {
                    state.friends = state.friends.map(f => ({ ...f, dob: typeof f.dob === 'string' ? new Date(f.dob) : f.dob }));
                }
            }
        }
    )
);
