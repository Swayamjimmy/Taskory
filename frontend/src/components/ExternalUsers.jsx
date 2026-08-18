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
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          External Team Directory
        </h2>

        <p className="text-sm text-gray-500">
          Loading external users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          External Team Directory
        </h2>

        <p className="text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          External Team Directory
        </h2>

        <p className="text-sm text-gray-500">
          No external users found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          External Team Directory
        </h2>

        <p className="text-sm text-gray-500">
          Users retrieved from the external API.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <h3 className="font-medium text-gray-900">
              {user.name}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {user.email}
            </p>

            {user.company?.name && (
              <p className="text-sm text-gray-500 mt-2">
                {user.company.name}
              </p>
            )}

            {user.address?.city && (
              <p className="text-xs text-gray-400 mt-1">
                {user.address.city}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}