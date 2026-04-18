'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: 'strike' | 'bat-blue' | 'ball-pink';
  icon?: string;
}

export default function StatCard({
  label,
  value,
  color = 'strike',
  icon
}: StatCardProps) {
  const textColorMap = {
    strike: 'text-strike',
    'bat-blue': 'text-bat-blue',
    'ball-pink': 'text-ball-pink',
  };

  const borderColorMap = {
    strike: 'hover:border-strike/40',
    'bat-blue': 'hover:border-bat-blue/40',
    'ball-pink': 'hover:border-ball-pink/40',
  };

  return (
    <div className={`bg-navy border border-white/8 rounded-xl p-6 group transition-all ${borderColorMap[color]} hover:bg-navy-dark/60`}>
      {icon && <div className="text-3xl mb-4">{icon}</div>}
      <div className={`font-wordmark text-4xl ${textColorMap[color]} mb-2`}>
        {value}
      </div>
      <div className="font-ui text-[11px] text-gray-mid tracking-[3px] uppercase">
        {label}
      </div>
    </div>
  );
}
