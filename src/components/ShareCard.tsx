import { forwardRef } from 'react';
import { Prediction } from '@/types/predictions';
import { cn } from '@/lib/utils';

interface ShareCardProps {
  prediction: Prediction;
  className?: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ prediction, className }, ref) => {
    const isResolved = prediction.status === 'fulfilled' || prediction.status === 'failed';
    const stampText = prediction.status === 'fulfilled' ? 'СБЫЛСЯ' : 'НЕ СБЫЛСЯ';
    const stampColor = prediction.status === 'fulfilled' 
      ? 'border-emerald-500 text-emerald-500' 
      : 'border-rose-500 text-rose-500';

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-[600px] w-[400px] flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white',
          className
        )}
      >
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>

        {/* Breaking News header */}
        <div className="relative z-10 mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-rose-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-rose-500">
              Проверка фактов
            </span>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />
        </div>

        {/* Expert name */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={prediction.expert.avatar}
              alt={prediction.expert.name}
              className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold leading-tight">
                {prediction.expert.name}
              </h2>
              <p className="text-sm text-white/60">
                Точность: {Math.round(prediction.expert.accuracy * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Prediction text */}
        <div className="relative z-10 flex-1">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-lg font-bold leading-relaxed">
              "{prediction.interpretation.length > 180 
                ? prediction.interpretation.slice(0, 180) + '...' 
                : prediction.interpretation}"
            </p>
          </div>

          {/* Giant stamp overlay */}
          {isResolved && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={cn(
                  'rotate-[-15deg] transform rounded-lg border-[6px] px-8 py-4 text-center font-black uppercase tracking-wider opacity-90 shadow-2xl',
                  stampColor
                )}
                style={{
                  fontSize: '2.5rem',
                  lineHeight: '1.1',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  boxShadow: prediction.status === 'fulfilled' 
                    ? '0 0 40px rgba(16, 185, 129, 0.4)' 
                    : '0 0 40px rgba(244, 63, 94, 0.4)',
                }}
              >
                {stampText}
              </div>
            </div>
          )}
        </div>

        {/* Topic badge */}
        <div className="relative z-10 mt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            {prediction.topic.icon} {prediction.topic.name}
          </div>
        </div>

        {/* Footer with URL */}
        <div className="relative z-10 mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40">
                Проверено на
              </p>
              <p className="text-xl font-bold text-white">
                prognoznik.com
              </p>
            </div>
            <div className="flex flex-col items-end text-right">
              <p className="text-xs text-white/40">
                {new Date(prediction.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
