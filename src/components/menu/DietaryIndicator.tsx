import { DietaryType } from '../../types/menu';

interface DietaryIndicatorProps {
  type: DietaryType;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DietaryIndicator({ type, showLabel = false, className = '', size = 'sm' }: DietaryIndicatorProps) {
  const isVeg = type === 'veg' || type === 'vegan';
  const isEgg = type === 'egg';

  const sizeClasses = {
    sm: 'w-4 h-4 p-[2px]',
    md: 'w-5 h-5 p-[3px]',
    lg: 'w-6 h-6 p-[4px]'
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  const borderColor = isVeg 
    ? 'border-emerald-600 bg-emerald-950/20' 
    : isEgg 
    ? 'border-amber-600 bg-amber-950/20' 
    : 'border-rose-600 bg-rose-950/20';

  const fillColor = isVeg 
    ? 'bg-emerald-500' 
    : isEgg 
    ? 'bg-amber-500' 
    : 'bg-rose-500';

  const labelText = type === 'vegan' 
    ? 'Vegan' 
    : type === 'veg' 
    ? 'Pure Veg' 
    : type === 'egg' 
    ? 'Contains Egg' 
    : 'Non-Veg';

  return (
    <div 
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={labelText}
      role="img"
      aria-label={labelText}
    >
      <span className={`border-2 rounded-[3px] flex items-center justify-center shrink-0 ${sizeClasses[size]} ${borderColor}`}>
        {isVeg ? (
          <span className={`rounded-full ${dotSizeClasses[size]} ${fillColor}`} />
        ) : isEgg ? (
          <span className={`rounded-full ${dotSizeClasses[size]} ${fillColor}`} />
        ) : (
          <span 
            className={`${dotSizeClasses[size]} ${fillColor}`} 
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} 
          />
        )}
      </span>
      {showLabel && (
        <span className={`text-xs font-medium tracking-tight ${isVeg ? 'text-emerald-400' : isEgg ? 'text-amber-400' : 'text-rose-400'}`}>
          {labelText}
        </span>
      )}
    </div>
  );
}
