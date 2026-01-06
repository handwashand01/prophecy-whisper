import { Expert } from '@/types/predictions';
import { Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopExpertsProps {
  experts: Expert[];
}

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 0.7) return 'text-emerald-500';
  if (accuracy >= 0.5) return 'text-amber-500';
  return 'text-rose-500';
};

const getAccuracyBg = (accuracy: number) => {
  if (accuracy >= 0.7) return 'bg-emerald-500/10';
  if (accuracy >= 0.5) return 'bg-amber-500/10';
  return 'bg-rose-500/10';
};

export const TopExperts = ({ experts }: TopExpertsProps) => {
  const topExperts = [...experts]
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5);

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Топ экспертов</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {topExperts.map((expert, index) => (
          <a
            key={expert.id}
            href={expert.profileLink}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="absolute -right-4 -top-4 text-6xl font-bold text-muted/10">
              #{index + 1}
            </div>
            
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="h-16 w-16 rounded-full border-2 border-border object-cover transition-transform group-hover:scale-105"
                />
                <div className={cn(
                  'absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  getAccuracyBg(expert.accuracy),
                  getAccuracyColor(expert.accuracy)
                )}>
                  {index + 1}
                </div>
              </div>
              
              <h3 className="mb-1 text-sm font-medium line-clamp-1">{expert.name}</h3>
              
              <div className="mb-2 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">{expert.rating.toFixed(1)}</span>
              </div>
              
              <div className={cn(
                'rounded-full px-3 py-1 text-sm font-semibold',
                getAccuracyBg(expert.accuracy),
                getAccuracyColor(expert.accuracy)
              )}>
                {Math.round(expert.accuracy * 100)}%
              </div>
              
              <p className="mt-2 text-xs text-muted-foreground">
                {expert.totalPredictions} прогнозов
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
