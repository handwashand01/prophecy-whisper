export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-sm font-bold text-primary-foreground">
              П
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-lg font-bold tracking-tight">PredictTracker</span>
              <span className="text-sm text-muted-foreground">— проверяем прогнозы экспертов <span className="text-primary font-medium">по фактам</span></span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground/80 sm:max-w-sm sm:text-right">
            <span className="text-foreground font-medium">Фиксируем</span> прогнозы · <span className="text-foreground font-medium">Проверяем</span> факты · <span className="text-foreground font-medium">Публикуем</span> результаты
          </p>
        </div>
      </div>
    </header>
  );
};
