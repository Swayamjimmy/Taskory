import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function ExternalUsers() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await api.getExternalCharacters();

        if (data.error) {
          throw new Error(data.error);
        }

        setCharacters(data);
      } catch (err) {
        console.error(err);
        setError(
          err.message || 'Failed to load characters from the external API.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Multiverse Character Directory
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading characters from the multiverse...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Multiverse Character Directory
          </h2>

          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Multiverse Character Directory
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            No characters found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Multiverse Character Directory
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Characters retrieved from an external API with backend caching.
        </p>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {characters.map((character) => (

          <div
            key={character.id}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >

            {/* Character Image */}
            <img
              src={character.image}
              alt={character.name}
              className="w-full aspect-square object-cover"
            />

            {/* Character Information */}
            <div className="p-4">

              <div className="flex items-start justify-between gap-3">

                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  {character.name}
                </h2>

                <span
                  className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium
                    ${
                      character.status === 'Alive'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : character.status === 'Dead'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {character.status}
                </span>

              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {character.species}
                {character.type ? ` • ${character.type}` : ''}
              </p>

              <div className="mt-4 space-y-3">

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Origin
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {character.origin?.name || 'Unknown'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Current Location
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {character.location?.name || 'Unknown'}
                  </p>
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}