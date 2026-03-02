import { create } from 'zustand';

export type UserRole = 'national' | 'state' | 'city';

interface AuthState {
  role: UserRole | null;
  assignedId: string | null;
  userName: string;
  login: (role: UserRole, id?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  assignedId: null,
  userName: '',
  login: (role, id) => set({
    role,
    assignedId: id || null,
    userName: role === 'national' ? 'NLDC Operator' : role === 'state' ? 'RLDC Operator' : 'City Operator',
  }),
  logout: () => set({ role: null, assignedId: null, userName: '' }),
}));
