

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

        </div>
      </div>
    </section>
  );
};