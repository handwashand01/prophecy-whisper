import { Expert, Topic, PredictionStatus, ConfidenceLevel } from '@/types/predictions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface PredictionFiltersProps {
  experts: Expert[];
  topics: Topic[];
  selectedExpert: string;
  selectedTopic: string;
  selectedStatus: PredictionStatus;
  selectedConfidence: ConfidenceLevel;
  onExpertChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onStatusChange: (value: PredictionStatus) => void;
  onConfidenceChange: (value: ConfidenceLevel) => void;
}

export const PredictionFilters = ({
  experts,
  topics,
  selectedExpert,
  selectedTopic,
  selectedStatus,
  selectedConfidence,
  onExpertChange,
  onTopicChange,
  onStatusChange,
  onConfidenceChange,
}: PredictionFiltersProps) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Фильтры:</span>
      </div>
      
      <Select value={selectedExpert} onValueChange={onExpertChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Эксперт" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все эксперты</SelectItem>
          {experts.map((expert) => (
            <SelectItem key={expert.id} value={expert.id}>
              {expert.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTopic} onValueChange={onTopicChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Тема" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все темы</SelectItem>
          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.id}>
              {topic.icon} {topic.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          <SelectItem value="pending">⏳ Ожидает</SelectItem>
          <SelectItem value="fulfilled">✅ Сбылся</SelectItem>
          <SelectItem value="failed">❌ Не сбылся</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedConfidence} onValueChange={onConfidenceChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Уверенность" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Любая</SelectItem>
          <SelectItem value="high">🔥 Высокая</SelectItem>
          <SelectItem value="medium">⚡ Средняя</SelectItem>
          <SelectItem value="low">💭 Низкая</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
