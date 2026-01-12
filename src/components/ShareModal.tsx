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
      <DialogContent className="max-h-[95vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Поделиться прогнозом
          </DialogTitle>
        </DialogHeader>

        {/* Preview card */}
        <div className="mb-4 flex justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
          <div className="scale-[0.45] origin-top">
            <ShareCard ref={cardRef} prediction={prediction} />
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-4">
          {/* Native share (mobile) */}
          <Button
            onClick={handleNativeShare}
            className="w-full gap-2"
            size="lg"
          >
            <Share2 className="h-5 w-5" />
            Поделиться
          </Button>

          {/* Messenger buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsAppShare}
              variant="outline"
              className="gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
            <Button
              onClick={handleTelegramShare}
              variant="outline"
              className="gap-2 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 hover:text-sky-700"
            >
              <Send className="h-5 w-5" />
              Telegram
            </Button>
          </div>

          {/* Download for Instagram/Stories */}
          <div className="border-t border-border pt-4">
            <p className="mb-3 text-center text-sm text-muted-foreground">
              Для Instagram Stories скачайте изображение:
            </p>
            <Button
              onClick={handleDownloadImage}
              variant="outline"
              className="w-full gap-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Скачать для Instagram / Stories
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
