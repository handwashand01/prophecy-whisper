import { useState } from 'react';
import { Prediction } from '@/types/predictions';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, ExternalLink, Star, Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PredictionModal } from './PredictionModal';

interface PredictionCardProps {
  prediction: Prediction;
}

const statusConfig = {
  pending: {
    label: 'Ожидает проверки',
    icon: Clock,
    className: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
    bgClassName: 'bg-amber-500/5 border-amber-500/20',
  },
  fulfilled: {
    label: '✓ Сбылся',
    icon: CheckCircle2,
    className: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
    bgClassName: 'bg-emerald-500/5 border-emerald-500/20',
  },
  failed: {
    label: '✗ Не сбылся',
    icon: XCircle,
    className: 'bg-rose-500/20 text-rose-600 border-rose-500/30',
    bgClassName: 'bg-rose-500/5 border-rose-500/20',
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const hasVerification = prediction.verification?.actualResult;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on links or buttons
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Card 
        onClick={handleCardClick}
        className={cn(
          'group flex flex-col overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer',
          prediction.confidence === 'low' && 'opacity-75'
        )}>
        <div className="flex flex-1 flex-col p-5">
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
        <div className="mb-4 flex-1 space-y-4">
          {/* Прогноз */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Прогноз
            </p>
            <p className={cn(
              'text-sm leading-relaxed text-foreground',
              !isExpanded && 'line-clamp-2'
            )}>
              {prediction.interpretation}
            </p>
          </div>

          {/* Оригинальная цитата */}
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

          {/* Проверка факта с бейджем статуса */}
          {hasVerification && (
            <div className={cn(
              'rounded-lg border p-3',
              status.bgClassName
            )}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Проверка факта
                </p>
                <div className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold shadow-sm',
                  status.className
                )}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="text-sm">{status.label}</span>
                </div>
              </div>
              <p className={cn(
                'text-sm leading-relaxed text-foreground',
                !isExpanded && 'line-clamp-2'
              )}>
                {prediction.verification?.actualResult}
              </p>
            </div>
          )}

          {/* Источник */}
          {prediction.verification?.evidenceLink && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Источник
              </p>
              <a
                href={prediction.verification.evidenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'block text-sm text-primary underline-offset-2 hover:underline',
                  !isExpanded && 'truncate'
                )}
              >
                {prediction.verification.evidenceLink}
              </a>
            </div>
          )}

          {/* Кнопка развернуть */}
          {(hasVerification || prediction.interpretation.length > 100) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-auto w-full justify-center gap-1 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Свернуть
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Развернуть
                </>
              )}
            </Button>
          )}
        </div>

        {/* Footer with dates and source */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
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

    <PredictionModal
      prediction={prediction}
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    />
  </>
  );
};
