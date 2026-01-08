import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { experts, predictions } from '@/data/mockData';
import { Header } from '@/components/Header';
import { PredictionCard } from '@/components/PredictionCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prediction } from '@/types/predictions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type GroupBy = 'source' | 'topic';

const ExpertPage = () => {
  const { expertId } = useParams();
  const [groupBy, setGroupBy] = useState<GroupBy>('source');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const expert = useMemo(() => {
    return experts.find(e => e.profileLink.includes(expertId || ''));
  }, [expertId]);

  const expertPredictions = useMemo(() => {
    if (!expert) return [];
    return predictions.filter(p => p.expert.id === expert.id);
  }, [expert]);

  const groupedPredictions = useMemo(() => {
    const groups: Record<string, { title: string; icon?: string; sourceUrl?: string; predictions: Prediction[] }> = {};
    
    expertPredictions.forEach(prediction => {
      const key = groupBy === 'source' ? prediction.source : prediction.topic.id;
      const title = groupBy === 'source' 
        ? prediction.sourceTitle
        : prediction.topic.name;
      const icon = groupBy === 'topic' ? prediction.topic.icon : undefined;
      const sourceUrl = groupBy === 'source' ? prediction.source : undefined;
      
      if (!groups[key]) {
        groups[key] = { title, icon, sourceUrl, predictions: [] };
      }
      groups[key].predictions.push(prediction);
    });
    
    return Object.entries(groups).map(([key, group]) => ({
      id: key,
      ...group,
      stats: {
        total: group.predictions.length,
        fulfilled: group.predictions.filter(p => p.status === 'fulfilled').length,
        failed: group.predictions.filter(p => p.status === 'failed').length,
        pending: group.predictions.filter(p => p.status === 'pending').length,
      }
    }));
  }, [expertPredictions, groupBy]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Open all groups by default on first render
  useMemo(() => {
    setOpenGroups(new Set(groupedPredictions.map(g => g.id)));
  }, [groupBy]);

  if (!expert) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Эксперт не найден</p>
          <Link to="/" className="mt-4 flex items-center justify-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Вернуться на главную
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link 
          to="/" 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к прогнозам
        </Link>

        {/* Expert Profile Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              {/* Avatar */}
              <img
                src={expert.avatar}
                alt={expert.name}
                className="h-24 w-24 rounded-full border-4 border-background object-cover shadow-lg md:h-32 md:w-32"
              />
              
              {/* Info */}
              <div className="flex-1">
                <h1 className="mb-2 text-2xl font-bold md:text-3xl">{expert.name}</h1>
                
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{expert.rating.toFixed(1)}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-sm',
                      expert.accuracy >= 0.7 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' :
                      expert.accuracy >= 0.5 ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 
                      'border-rose-500/50 bg-rose-500/10 text-rose-500'
                    )}
                  >
                    <TrendingUp className="mr-1 h-3.5 w-3.5" />
                    {Math.round(expert.accuracy * 100)}% точность
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-2xl font-bold">{expert.totalPredictions}</p>
                    <p className="text-xs text-muted-foreground">Всего прогнозов</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-500">{expert.fulfilledPredictions}</p>
                    <p className="text-xs text-muted-foreground">Сбылось</p>
                  </div>
                  <div className="rounded-lg bg-rose-500/10 p-3 text-center">
                    <p className="text-2xl font-bold text-rose-500">{expert.failedPredictions}</p>
                    <p className="text-xs text-muted-foreground">Не сбылось</p>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-500">
                      {expert.totalPredictions - expert.fulfilledPredictions - expert.failedPredictions}
                    </p>
                    <p className="text-xs text-muted-foreground">Ожидает</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Predictions Section */}
        <div>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Прогнозы эксперта</h2>
            
            <Tabs value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)} className="w-auto">
              <TabsList>
                <TabsTrigger value="source" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  По видео
                </TabsTrigger>
                <TabsTrigger value="topic" className="gap-2">
                  📊 По теме
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Grouped Predictions */}
          <div className="space-y-4">
            {groupedPredictions.map(group => (
              <Collapsible
                key={group.id}
                open={openGroups.has(group.id)}
                onOpenChange={() => toggleGroup(group.id)}
              >
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {openGroups.has(group.id) ? (
                        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                      )}
                      {groupBy === 'source' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                          <ExternalLink className="h-4 w-4 text-rose-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block text-base font-medium truncate">
                          {group.icon && <span className="mr-2">{group.icon}</span>}
                          {group.title}
                        </span>
                        {groupBy === 'source' && group.sourceUrl && (
                          <span className="text-xs text-muted-foreground">YouTube</span>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0">{group.stats.total} прогнозов</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-emerald-500">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {group.stats.fulfilled}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-rose-500">
                        <XCircle className="h-3.5 w-3.5" />
                        {group.stats.failed}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Clock className="h-3.5 w-3.5" />
                        {group.stats.pending}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="border-t border-border/50 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {group.predictions.map(prediction => (
                          <PredictionCard key={prediction.id} prediction={prediction} />
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {groupedPredictions.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">У этого эксперта пока нет прогнозов</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExpertPage;
