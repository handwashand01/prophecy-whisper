import { useState } from 'react';
import { Prediction } from '@/types/predictions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ShareModal } from './ShareModal';
import {
  Calendar,
  ExternalLink,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Quote,
  Target,
  FileText,
  Link2,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const QUOTE_MAX_LENGTH = 200;

interface PredictionModalProps {
  prediction: Prediction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
    label: 'Высокая уверенность',
    className: 'bg-primary/10 text-primary',
  },
  medium: {
    label: 'Средняя уверенность',
    className: 'bg-secondary text-secondary-foreground',
  },
  low: {
    label: 'Низкая уверенность',
    className: 'bg-muted text-muted-foreground',
  },
};

const verificationConfig = {
  auto_verified: { label: 'Автоматическая проверка', icon: CheckCircle2 },
  manual_verified: { label: 'Ручная проверка', icon: CheckCircle2 },
  unverifiable: { label: 'Не проверяется', icon: AlertCircle },
};

export const PredictionModal = ({ prediction, open, onOpenChange }: PredictionModalProps) => {
  const [isQuoteExpanded, setIsQuoteExpanded] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!prediction) return null;

  const isLongQuote = prediction.originalQuote.length > QUOTE_MAX_LENGTH;
  const displayedQuote = isLongQuote && !isQuoteExpanded
    ? prediction.originalQuote.slice(0, QUOTE_MAX_LENGTH) + '...'
    : prediction.originalQuote;

  const status = statusConfig[prediction.status];
  const confidence = confidenceConfig[prediction.confidence];
  const verification = verificationConfig[prediction.verificationStatus];
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const youtubeUrl = prediction.sourceTimestamp
    ? `${prediction.source}&t=${prediction.sourceTimestamp}`
    : prediction.source;

  const hasVerification = prediction.verification?.actualResult;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Детали прогноза</DialogTitle>
        </DialogHeader>

        {/* Expert info header */}
        <div className="flex items-center gap-4 pb-4">
          <a
            href={prediction.expert.profileLink}
            className="shrink-0 transition-opacity hover:opacity-80"
          >
            <img
              src={prediction.expert.avatar}
              alt={prediction.expert.name}
              className="h-14 w-14 rounded-full border-2 border-border object-cover"
            />
          </a>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <a
                href={prediction.expert.profileLink}
                className="text-lg font-semibold hover:underline"
              >
                {prediction.expert.name}
              </a>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setIsShareOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                Поделиться
              </Button>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{prediction.expert.rating.toFixed(1)}</span>
              </div>
              <div className={cn(
                'flex items-center gap-1',
                prediction.expert.accuracy >= 0.7 ? 'text-emerald-500' :
                prediction.expert.accuracy >= 0.5 ? 'text-amber-500' : 'text-rose-500'
              )}>
                <Target className="h-4 w-4" />
                <span>{Math.round(prediction.expert.accuracy * 100)}% точность</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{prediction.expert.totalPredictions} прогнозов</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 py-4">
          <Badge variant="outline" className="gap-1 text-sm">
            {prediction.topic.icon} {prediction.topic.name}
          </Badge>
          <Badge className={cn('border-0 text-sm', confidence.className)}>
            {confidence.label}
          </Badge>
          <Badge variant="outline" className="gap-1 text-sm text-muted-foreground">
            <verification.icon className="h-3.5 w-3.5" />
            {verification.label}
          </Badge>
        </div>

        {/* Prediction content */}
        <div className="space-y-6">
          {/* Прогноз */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Target className="h-4 w-4" />
              Прогноз
            </h3>
            <p className="text-base leading-relaxed">
              {prediction.interpretation}
            </p>
          </div>

          {/* Оригинальная цитата */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Quote className="h-4 w-4" />
              Оригинальная цитата
            </h3>
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              "{displayedQuote}"
            </p>
            {isLongQuote && (
              <button
                onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
                className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {isQuoteExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Свернуть
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Показать полностью
                  </>
                )}
              </button>
            )}
          </div>

          {/* Проверка факта */}
          <div className={cn(
            'rounded-lg border p-4',
            hasVerification ? status.bgClassName : 'border-border/50 bg-muted/30'
          )}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Проверка факта
              </h3>
              <div className={cn(
                'flex items-center gap-1.5 rounded-full border px-4 py-2 font-semibold shadow-sm',
                status.className
              )}>
                <StatusIcon className="h-5 w-5" />
                <span className="text-base">{status.label}</span>
              </div>
            </div>
            {hasVerification ? (
              <p className="text-base leading-relaxed">
                {prediction.verification?.actualResult}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Прогноз ожидает наступления срока проверки ({formatDate(prediction.targetDate)})
              </p>
            )}
          </div>

          {/* Источник верификации */}
          {prediction.verification?.evidenceLink && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Link2 className="h-4 w-4" />
                Источник подтверждения
              </h3>
              <a
                href={prediction.verification.evidenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary underline-offset-2 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                {prediction.verification.evidenceLink}
              </a>
            </div>
          )}

        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Создан: {formatDate(prediction.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Срок: {formatDate(prediction.targetDate)}</span>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="gap-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-600"
          >
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              YouTube
            </a>
          </Button>
        </div>

        <ShareModal
          prediction={prediction}
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
