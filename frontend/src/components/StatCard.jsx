// Renders a single dashboard metric with a label, value, and background color
export function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-lg p-4 shadow ${color}`}>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='text-3xl font-bold'>{value}</p>
    </div>
  );
}