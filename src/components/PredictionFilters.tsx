import { useState } from 'react';
import { Expert, Topic } from '@/types/predictions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Filter, User, Hash, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionFiltersProps {
  experts: Expert[];
  topics: Topic[];
  selectedExpert: string;
  selectedTopic: string;
  onExpertChange: (value: string) => void;
  onTopicChange: (value: string) => void;
}

export const PredictionFilters = ({
  experts,
  topics,
  selectedExpert,
  selectedTopic,
  onExpertChange,
  onTopicChange,
}: PredictionFiltersProps) => {
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [topicModalOpen, setTopicModalOpen] = useState(false);

  const selectedExpertName = selectedExpert === 'all' 
    ? 'Все эксперты' 
    : experts.find(e => e.id === selectedExpert)?.name || 'Все эксперты';

  const selectedTopicData = selectedTopic === 'all'
    ? null
    : topics.find(t => t.id === selectedTopic);

  const selectedTopicName = selectedTopicData 
    ? `${selectedTopicData.icon} ${selectedTopicData.name}`
    : 'Все темы';

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Фильтры:</span>
      </div>
      
      {/* Expert Modal */}
      <Dialog open={expertModalOpen} onOpenChange={setExpertModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            {selectedExpertName}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Выберите эксперта</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid gap-1 p-1">
              <button
                onClick={() => {
                  onExpertChange('all');
                  setExpertModalOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted',
                  selectedExpert === 'all' && 'bg-primary/10'
                )}
              >
                <span className="font-medium">Все эксперты</span>
                {selectedExpert === 'all' && <Check className="h-4 w-4 text-primary" />}
              </button>
              {experts.map((expert) => (
                <button
                  key={expert.id}
                  onClick={() => {
                    onExpertChange(expert.id);
                    setExpertModalOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted',
                    selectedExpert === expert.id && 'bg-primary/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{expert.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Точность: {expert.accuracy}%
                      </p>
                    </div>
                  </div>
                  {selectedExpert === expert.id && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Topic Modal */}
      <Dialog open={topicModalOpen} onOpenChange={setTopicModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Hash className="h-4 w-4" />
            {selectedTopicName}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Выберите тему</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid gap-1 p-1">
              <button
                onClick={() => {
                  onTopicChange('all');
                  setTopicModalOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted',
                  selectedTopic === 'all' && 'bg-primary/10'
                )}
              >
                <span className="font-medium">Все темы</span>
                {selectedTopic === 'all' && <Check className="h-4 w-4 text-primary" />}
              </button>
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    onTopicChange(topic.id);
                    setTopicModalOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted',
                    selectedTopic === topic.id && 'bg-primary/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{topic.icon}</span>
                    <div>
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {topic.predictionsCount} прогнозов • {topic.successRate}% точность
                      </p>
                    </div>
                  </div>
                  {selectedTopic === topic.id && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
