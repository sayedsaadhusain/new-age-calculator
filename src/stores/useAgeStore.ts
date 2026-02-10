import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:5000/api';

interface Friend {
    id: string | number;
    name: string;
    dob: Date;
}

interface AgeState {
    birthDate: Date | null;
    name: string;
    setBirthDate: (date: Date) => void;
    setName: (name: string) => void;

    friends: Friend[];
    isLoading: boolean;
    error: string | null;
    comparisonPersonId: string | number | null; // ID of the friend selected for comparison

    fetchFriends: () => Promise<void>;
    addFriend: (name: string, dob: Date) => Promise<void>;
    removeFriend: (id: string | number) => Promise<void>;
    setComparisonPersonId: (id: string | number | null) => void;
}

export const useAgeStore = create<AgeState>()(
    persist(
        (set, get) => ({
            birthDate: null,
            name: '',
            setBirthDate: (date) => set({ birthDate: date }),
            setName: (name) => set({ name }),

            friends: [],
            isLoading: false,
            error: null,
            comparisonPersonId: null,

            setComparisonPersonId: (id) => set({ comparisonPersonId: id }),

            fetchFriends: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/friends`);
                    if (!response.ok) throw new Error('Failed to fetch friends');
                    const data = await response.json();
                    set({
                        friends: data.map((f: any) => ({ ...f, dob: new Date(f.dob) })),
                        isLoading: false
                    });
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },

            addFriend: async (name, dob) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/friends`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name,
                            dob: dob.toISOString().split('T')[0] // Send as YYYY-MM-DD
                        }),
                    });
                    if (!response.ok) throw new Error('Failed to add friend');
                    const newFriend = await response.json();

                    set((state) => ({
                        friends: [...state.friends, { ...newFriend, dob: new Date(newFriend.dob) }],
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },

            removeFriend: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/friends/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Failed to delete friend');

                    set((state) => ({
                        friends: state.friends.filter((f) => f.id !== id),
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
        }),
        {
            name: 'age-calculator-storage',
            partialize: (state) => ({
                // Only persist local preferences, NOT the database data to avoid sync issues
                birthDate: state.birthDate,
                name: state.name
            }),
            onRehydrateStorage: () => (state) => {
                if (state && state.birthDate && typeof state.birthDate === 'string') {
                    state.birthDate = new Date(state.birthDate);
                }
            }
        }
    )
);
