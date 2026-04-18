'use client';

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  color?: 'strike' | 'bat-blue' | 'ball-pink';
  align?: 'left' | 'center';
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  color = 'strike',
  align = 'left'
}: SectionHeaderProps) {
  const colorMap = {
    strike: 'text-strike',
    'bat-blue': 'text-bat-blue',
    'ball-pink': 'text-ball-pink',
  };

  const bgColorMap = {
    strike: 'bg-strike',
    'bat-blue': 'bg-bat-blue',
    'ball-pink': 'bg-ball-pink',
  };

  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <span className={`font-ui ${colorMap[color]} text-xs tracking-[6px] uppercase font-bold block mb-3`}>
        {label}
      </span>
      <h2 className="font-wordmark text-4xl md:text-5xl uppercase leading-none text-white">
        {title.split(' ').map((word, i) => (
          <span key={i} className={i % 2 !== 0 ? colorMap[color] : ''}>
            {word}{' '}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p className="font-sans text-gray-mid text-sm mt-4 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`w-12 h-1 ${bgColorMap[color]} mt-4 ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}
