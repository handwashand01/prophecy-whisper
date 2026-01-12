import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Prediction } from '@/types/predictions';
import { ShareCard } from './ShareCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Share2,
  Download,
  Instagram,
  MessageCircle,
  Send,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  prediction: Prediction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareModal = ({ prediction, open, onOpenChange }: ShareModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!prediction) return null;

  const shareUrl = `${window.location.origin}/prediction/${prediction.id}`;
  const shareText = `${prediction.expert.name}: "${prediction.interpretation.slice(0, 100)}..." — Проверка на prognoznik.com`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Прогноз от ${prediction.expert.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Не удалось поделиться');
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast.success('Ссылка скопирована в буфер обмена');
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `prediction-${prediction.id}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Изображение скачано!');
    } catch (err) {
      console.error('Error generating image:', err);
      toast.error('Не удалось создать изображение');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-4 w-4" />
            Поделиться
          </DialogTitle>
        </DialogHeader>

        {/* Preview card - larger scale */}
        <div className="flex justify-center overflow-hidden rounded-lg border border-border bg-muted/30 p-2">
          <div className="scale-[0.55] origin-top -mb-[180px]">
            <ShareCard ref={cardRef} prediction={prediction} />
          </div>
        </div>

        {/* Share buttons - compact */}
        <div className="space-y-3 pt-2">
          {/* Native share + messengers in one row */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleNativeShare}
              size="sm"
              className="gap-1.5"
            >
              <Share2 className="h-4 w-4" />
              Ссылка
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              variant="outline"
              size="sm"
              className="gap-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              onClick={handleTelegramShare}
              variant="outline"
              size="sm"
              className="gap-1.5 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20"
            >
              <Send className="h-4 w-4" />
              Telegram
            </Button>
          </div>

          {/* Download for Instagram */}
          <Button
            onClick={handleDownloadImage}
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Скачать для Instagram / Stories
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
