export default function SearchInput({ value, onChange, placeholder = 'Search...', className = 'w-72' }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-charcoal placeholder-ash/50 focus:outline-none focus:ring-2 focus:ring-warmblack/5 focus:border-gray-300 transition-colors ${className}`}
    />
  );
}
