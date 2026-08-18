import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function ExternalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getExternalUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load external users.');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">External Team Directory</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading external users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">External Team Directory</h2>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">External Team Directory</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">No external users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">External Team Directory</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Users retrieved from the external API.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{user.email}</p>
            {user.company?.name && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{user.company.name}</p>
            )}
            {user.address?.city && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{user.address.city}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}