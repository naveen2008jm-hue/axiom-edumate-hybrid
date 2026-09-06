import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon, Heart, Sparkles, Shuffle } from 'lucide-react';
import { Quote } from '../../types';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface QuoteBannerProps {
  quotes: Quote[];
  onToggleFavorite: (id: string) => void;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({ quotes, onToggleFavorite }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      triggerQuoteChange((prev) => (prev + 1) % quotes.length);
    }, 18000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  if (!quotes.length) return null;
  const currentQuote = quotes[currentIndex];

  const triggerQuoteChange = (updater: (prev: number) => number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(updater);
      setIsTransitioning(false);
    }, 140);
  };

  const handleNext = () => {
    soundFx.playClick();
    triggerQuoteChange((prev) => (prev + 1) % quotes.length);
  };

  const handleFavorite = () => {
    soundFx.playSuccess();
    onToggleFavorite(currentQuote.id);
    if (!currentQuote.favorite) {
      toast.success('Quote Saved to Favorites', { description: `“${currentQuote.quote.slice(0, 40)}…”` });
    }
  };

  return (
    <div className="bezel-shell">
      <div className="bezel-core p-4 sm:p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex-shrink-0 mt-0.5 shadow-sm">
            <QuoteIcon className="w-4 h-4" />
          </div>
          <div className={`space-y-1.5 transition-all duration-150 ${isTransitioning ? 'opacity-0 scale-[0.98] blur-[1px]' : 'opacity-100 scale-100 blur-0'}`}>
            <p className="text-xs sm:text-sm font-medium text-slate-200 italic leading-relaxed">
              “{currentQuote.quote}”
            </p>
            <div className="flex items-center flex-wrap gap-2 text-[11px]">
              <span className="font-bold text-indigo-300 font-display">{currentQuote.author}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-medium">{currentQuote.designation}</span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/10 text-slate-300 font-mono text-[9px] uppercase tracking-wider">
                {currentQuote.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-xl pressable ${
              currentQuote.favorite
                ? 'text-pink-500 bg-pink-500/15 border border-pink-500/30 shadow-sm'
                : 'text-slate-400 hover:text-pink-400 hover:bg-slate-900/80 border border-transparent hover:border-white/5'
            }`}
            title="Favorite Quote"
          >
            <Heart className={`w-4 h-4 ${currentQuote.favorite ? 'fill-pink-500' : ''}`} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-900/80 border border-transparent hover:border-white/5 pressable"
            title="Next Quote"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
