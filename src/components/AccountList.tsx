import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useAccountStore } from '../store/useAccountStore';
import { formatCurrency } from '../utils/format';

export function AccountList() {
  const { accounts, deleteAccount } = useAccountStore();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="px-6 py-4 whitespace-nowrap">{account.name}</td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">
                {account.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatCurrency(account.balance)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteAccount(account.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}