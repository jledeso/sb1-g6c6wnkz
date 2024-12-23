import React from 'react';
import { Account, AccountType } from '../types/account';

interface AccountFormProps {
  onSubmit: (account: Omit<Account, 'id'>) => void;
  initialData?: Account;
}

export function AccountForm({ onSubmit, initialData }: AccountFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    type: initialData?.type || 'checking',
    balance: initialData?.balance || 0,
    creditLimit: initialData?.creditLimit || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Account, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as AccountType })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="checking">Checking</option>
          <option value="wallet">Wallet</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Initial Balance
        </label>
        <input
          type="number"
          value={formData.balance}
          onChange={(e) =>
            setFormData({ ...formData, balance: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {formData.type === 'credit' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credit Limit
          </label>
          <input
            type="number"
            value={formData.creditLimit}
            onChange={(e) =>
              setFormData({ ...formData, creditLimit: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {initialData ? 'Update Account' : 'Create Account'}
      </button>
    </form>
  );
}