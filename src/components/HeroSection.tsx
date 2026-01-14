import { CheckCircle2, BarChart3, ExternalLink } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative border-b border-border/50 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline */}
          <h1 className="mb-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            Проверяем прогнозы экспертов —{' '}
            <span className="text-primary">по фактам</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-5 text-sm text-muted-foreground sm:text-base">
            Прогнозы из публичных видео с проверкой по реальным событиям
          </p>

          {/* Compact trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Факты, не мнения</span>
            </div>
            <div className="hidden h-3 w-px bg-border sm:block" />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ExternalLink className="h-4 w-4 text-primary" />
              <span>YouTube + таймкоды</span>
            </div>
            <div className="hidden h-3 w-px bg-border sm:block" />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <BarChart3 className="h-4 w-4 text-warning" />
              <span>Рейтинг точности</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};