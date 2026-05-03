export default function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="relative rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${accent || 'bg-warmblack/10'}`} />
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? accent.replace('bg-', 'bg-').split(' ')[0] + '/10' : 'bg-gray-100'} ${accent?.split(' ')[1] || 'text-charcoal/40'}`}>
          {icon}
        </div>
        <p className="text-[11px] font-semibold tracking-wide text-ash uppercase">{label}</p>
      </div>
      <p className="text-[22px] font-extrabold tracking-tight text-warmblack leading-none">{value}</p>
      {sub && <p className="mt-1.5 text-[11px] text-ash">{sub}</p>}
    </div>
  );
}
