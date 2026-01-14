import { CheckCircle2, BarChart3, FileCheck, ExternalLink } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-background to-secondary/30">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Small badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <FileCheck className="h-4 w-4 text-success" />
            <span>Независимая верификация прогнозов</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Мы проверяем прогнозы экспертов —{' '}
            <span className="text-primary">по фактам</span>, а не по словам
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Прогнозы из публичных видео с проверкой по реальным событиям и источникам
          </p>

          {/* Trust indicators */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Факты</div>
                <div className="text-xs text-muted-foreground">Не мнения</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Источники</div>
                <div className="text-xs text-muted-foreground">YouTube + таймкоды</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <BarChart3 className="h-5 w-5 text-warning" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Аналитика</div>
                <div className="text-xs text-muted-foreground">Рейтинг точности</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
