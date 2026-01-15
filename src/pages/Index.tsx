import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { TopExperts } from '@/components/TopExperts';
import { PredictionFilters } from '@/components/PredictionFilters';
import { PredictionCard } from '@/components/PredictionCard';
import { TrendingTopics } from '@/components/TrendingTopics';
import { experts, predictions, topics } from '@/data/mockData';
import { FileQuestion } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpert, setSelectedExpert] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const filteredPredictions = useMemo(() => {
    return predictions.filter((prediction) => {
      const matchesSearch =
        searchQuery === '' ||
        prediction.interpretation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prediction.originalQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prediction.expert.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExpert =
        selectedExpert === 'all' || prediction.expert.id === selectedExpert;

      const matchesTopic =
        selectedTopic === 'all' || prediction.topic.id === selectedTopic;

      return matchesSearch && matchesExpert && matchesTopic;
    });
  }, [searchQuery, selectedExpert, selectedTopic]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Hero текст */}
        <div className="mb-6 rounded-xl border border-border/50 bg-muted/30 px-4 py-4 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="font-semibold text-foreground">Фиксируем</span> прогнозы экспертов · 
            <span className="font-semibold text-foreground"> Проверяем</span> их · 
            <span className="font-semibold text-foreground"> Публикуем</span> фактические результаты
          </p>
        </div>

        <TopExperts experts={experts} predictions={predictions} topics={topics} />

        <section className="py-8">
          <h2 className="mb-6 text-xl font-semibold">Прогнозы экспертов</h2>

          <PredictionFilters
            experts={experts}
            topics={topics}
            selectedExpert={selectedExpert}
            selectedTopic={selectedTopic}
            onExpertChange={setSelectedExpert}
            onTopicChange={setSelectedTopic}
          />

          {filteredPredictions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredPredictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
              <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">Прогнозов не найдено</h3>
              <p className="text-sm text-muted-foreground">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
            </div>
          )}
        </section>

        <TrendingTopics topics={topics} />
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 PredictTracker. Отслеживание и аналитика прогнозов экспертов.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
