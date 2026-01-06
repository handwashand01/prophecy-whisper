import { Prediction } from '@/types/predictions';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, ExternalLink, Star, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionCardProps {
  prediction: Prediction;
}

const statusConfig = {
  pending: {
    label: 'Ожидает',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  fulfilled: {
    label: 'Сбылся',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  failed: {
    label: 'Не сбылся',
    icon: XCircle,
    className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  },
};

const confidenceConfig = {
  high: {
    label: 'Высокая',
    className: 'bg-primary/10 text-primary',
  },
  medium: {
    label: 'Средняя',
    className: 'bg-secondary text-secondary-foreground',
  },
  low: {
    label: 'Низкая',
    className: 'bg-muted text-muted-foreground',
  },
};

const verificationConfig = {
  auto_verified: { label: 'Авто-проверка', icon: CheckCircle2 },
  manual_verified: { label: 'Ручная проверка', icon: CheckCircle2 },
  unverifiable: { label: 'Не проверяется', icon: AlertCircle },
};

export const PredictionCard = ({ prediction }: PredictionCardProps) => {
  const status = statusConfig[prediction.status];
  const confidence = confidenceConfig[prediction.confidence];
  const verification = verificationConfig[prediction.verificationStatus];
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const youtubeUrl = prediction.sourceTimestamp
    ? `${prediction.source}&t=${prediction.sourceTimestamp}`
    : prediction.source;

  return (
    <Card className={cn(
      'group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
      prediction.confidence === 'low' && 'opacity-75'
    )}>
      <div className="p-5">
        {/* Header with expert info */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <a
            href={prediction.expert.profileLink}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img
              src={prediction.expert.avatar}
              alt={prediction.expert.name}
              className="h-10 w-10 rounded-full border border-border object-cover"
            />
            <div>
              <h3 className="text-sm font-medium">{prediction.expert.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{prediction.expert.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span className={cn(
                  prediction.expert.accuracy >= 0.7 ? 'text-emerald-500' :
                  prediction.expert.accuracy >= 0.5 ? 'text-amber-500' : 'text-rose-500'
                )}>
                  {Math.round(prediction.expert.accuracy * 100)}% точность
                </span>
              </div>
            </div>
          </a>

          <div className={cn('flex items-center gap-1.5 rounded-full border px-2.5 py-1', status.className)}>
            <StatusIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{status.label}</span>
          </div>
        </div>

        {/* Topic and confidence */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            {prediction.topic.icon} {prediction.topic.name}
          </Badge>
          <Badge className={cn('border-0', confidence.className)}>
            {confidence.label}
          </Badge>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                <verification.icon className="h-3 w-3" />
                {verification.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Статус верификации прогноза</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Prediction content */}
        <div className="mb-4">
          <p className="mb-2 text-sm leading-relaxed text-foreground">
            {prediction.interpretation}
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="cursor-help text-xs italic text-muted-foreground line-clamp-2">
                "{prediction.originalQuote}"
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-xs">{prediction.originalQuote}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Footer with dates and source */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Создан: {formatDate(prediction.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Срок: {formatDate(prediction.targetDate)}</span>
            </div>
          </div>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/20"
          >
            <ExternalLink className="h-3 w-3" />
            YouTube
          </a>
        </div>
      </div>
    </Card>
  );
};
