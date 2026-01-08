import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header = ({ searchQuery = '', onSearchChange }: HeaderProps = {}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground">
              П
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PredictTracker</h1>
              <p className="text-xs text-muted-foreground">Отслеживание прогнозов экспертов</p>
            </div>
          </div>
          
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск прогнозов и экспертов..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10"
            />
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Главная
            </a>
            <a href="/experts" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Эксперты
            </a>
            <a href="/topics" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Темы
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
