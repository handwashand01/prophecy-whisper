import { Expert, Prediction, Topic } from '@/types/predictions';
import { Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

interface TopExpertsProps {
  experts: Expert[];
  predictions: Prediction[];
  topics: Topic[];
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

interface ExpertStats {
  expert: Expert;
  accuracy: number;
  total: number;
  fulfilled: number;
}

export const TopExperts = ({ experts, predictions, topics }: TopExpertsProps) => {
  // Calculate top 3 experts per topic based on their predictions accuracy
  const topExpertsByTopic = useMemo(() => {
    const mainTopics = topics.slice(0, 4); // Take first 4 main topics
    
    return mainTopics.map(topic => {
      // Get all predictions for this topic
      const topicPredictions = predictions.filter(p => p.topic.id === topic.id);
      
      // Group by expert and calculate accuracy
      const expertStatsMap = new Map<string, ExpertStats>();
      
      topicPredictions.forEach(prediction => {
        const expertId = prediction.expert.id;
        const existing = expertStatsMap.get(expertId);
        
        if (existing) {
          existing.total++;
          if (prediction.status === 'fulfilled') existing.fulfilled++;
          existing.accuracy = existing.fulfilled / existing.total;
        } else {
          expertStatsMap.set(expertId, {
            expert: prediction.expert,
            total: 1,
            fulfilled: prediction.status === 'fulfilled' ? 1 : 0,
            accuracy: prediction.status === 'fulfilled' ? 1 : 0,
          });
        }
      });
      
      // Sort by accuracy and take top 1
      const topExperts = Array.from(expertStatsMap.values())
        .filter(s => s.total >= 1) // At least 1 prediction
        .sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)
        .slice(0, 1);
      
      return {
        topic,
        experts: topExperts,
      };
    }).filter(group => group.experts.length > 0);
  }, [predictions, topics]);

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Топ экспертов по категориям</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {topExpertsByTopic.map(({ topic, experts: topExperts }) => (
          <div
            key={topic.id}
            className="rounded-2xl border border-border/50 bg-card p-4"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">{topic.icon}</span>
              <h3 className="font-semibold">{topic.name}</h3>
            </div>
            
            <div className="space-y-3">
              {topExperts.map((stats) => (
                <Link
                  key={stats.expert.id}
                  to={stats.expert.profileLink}
                  className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50"
                >
                  <img
                    src={stats.expert.avatar}
                    alt={stats.expert.name}
                    className="h-10 w-10 rounded-full border border-border object-cover transition-transform group-hover:scale-105"
                  />
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{stats.expert.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{stats.expert.rating.toFixed(1)}</span>
                      </div>
                      <span>•</span>
                      <span>{stats.total} прогн.</span>
                    </div>
                  </div>
                  
                  <div className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    getAccuracyBg(stats.accuracy),
                    getAccuracyColor(stats.accuracy)
                  )}>
                    {Math.round(stats.accuracy * 100)}%
                  </div>
                </Link>
              ))}
              
              {topExperts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Нет данных
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
