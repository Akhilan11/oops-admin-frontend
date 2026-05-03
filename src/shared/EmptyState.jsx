export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="mb-4 text-warmblack/10">{icon}</div>}
      <h3 className="text-base font-bold text-warmblack/25">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-warmblack/15">{subtitle}</p>}
    </div>
  );
}
