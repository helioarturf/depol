import React from 'react';

interface PNACrestProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showReflection?: boolean;
}

export const EMBLEM_SRC = '/assets/aistudio/Emblem_of_the_Angola_National_Police_e00f8bcf.png';

export const PNACrest: React.FC<PNACrestProps> = ({
  className = '',
  size = 'md',
  showReflection = false,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
    '2xl': 'w-36 h-36'
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${sizeMap[size]} ${className}`}>
      <img
        src={EMBLEM_SRC}
        alt="Emblema Oficial da Polícia Nacional de Angola"
        className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-transform duration-200"
        loading="eager"
        decoding="async"
      />
      {showReflection && (
        <div className="absolute -bottom-2 w-3/4 h-2 bg-gradient-to-t from-transparent via-amber-400/20 to-transparent blur-xs pointer-events-none" />
      )}
    </div>
  );
};
