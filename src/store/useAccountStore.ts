import { create } from 'zustand';
import { Account } from '../types/account';

interface AccountStore {
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  getAccount: (id: string) => Account | undefined;
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  addAccount: (account) => {
    const newAccount = {
      ...account,
      id: crypto.randomUUID(),
    };
    set((state) => ({
      accounts: [...state.accounts, newAccount],
    }));
  },
  updateAccount: (id, account) => {
    set((state) => ({
      accounts: state.accounts.map((acc) =>
        acc.id === id ? { ...acc, ...account } : acc
      ),
    }));
  },
  deleteAccount: (id) => {
    set((state) => ({
      accounts: state.accounts.filter((acc) => acc.id !== id),
    }));
  },
  getAccount: (id) => {
    return get().accounts.find((acc) => acc.id === id);
  },
}));