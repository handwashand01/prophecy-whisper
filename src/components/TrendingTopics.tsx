import { Topic } from '@/types/predictions';
import { Card } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendingTopicsProps {
  topics: Topic[];
}

export const TrendingTopics = ({ topics }: TrendingTopicsProps) => {
  const sortedTopics = [...topics].sort((a, b) => b.predictionsCount - a.predictionsCount);

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Трендовые темы</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {sortedTopics.map((topic) => (
          <Card
            key={topic.id}
            className="group cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{topic.icon}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{topic.predictionsCount}</span>
                </div>
              </div>

              <h3 className="mb-2 font-medium">{topic.name}</h3>

              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      topic.successRate >= 0.7 ? 'bg-emerald-500' :
                      topic.successRate >= 0.5 ? 'bg-amber-500' : 'bg-rose-500'
                    )}
                    style={{ width: `${topic.successRate * 100}%` }}
                  />
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  topic.successRate >= 0.7 ? 'text-emerald-500' :
                  topic.successRate >= 0.5 ? 'text-amber-500' : 'text-rose-500'
                )}>
                  {Math.round(topic.successRate * 100)}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">успешность</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
