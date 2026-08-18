export function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-lg p-4 shadow border dark:border-gray-700 ${color}`}>
      <p className='text-sm text-gray-500 dark:text-gray-400'>{label}</p>
      <p className='text-3xl font-bold dark:text-white'>{value}</p>
    </div>
  );
}