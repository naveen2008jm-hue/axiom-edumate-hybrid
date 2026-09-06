import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  RotateCw,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Trash2,
  Search,
  Check,
  X,
  Volume2,
  Keyboard,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { FlashcardDeck, Flashcard } from '../../types';
import confetti from 'canvas-confetti';

interface FlashcardsTrackerProps {
  decks: FlashcardDeck[];
  onAddDeck: (deck: Omit<FlashcardDeck, 'id'>) => void;
  onDeleteDeck: (deckId: string) => void;
  onUpdateCardMastery: (deckId: string, cardId: string, mastery: Flashcard['mastery']) => void;
  onAddCardToDeck: (deckId: string, card: Omit<Flashcard, 'id'>) => void;
  demoMode?: boolean;
}

export const FlashcardsTracker: React.FC<FlashcardsTrackerProps> = ({
  decks,
  onAddDeck,
  onDeleteDeck,
  onUpdateCardMastery,
  onAddCardToDeck,
  demoMode = false,
}) => {
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Auto 3D flip animation in Demo Mode
  useEffect(() => {
    if (demoMode && decks.length > 0) {
      setActiveDeck(decks[0]);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      const timer1 = setTimeout(() => {
        setIsFlipped(true);
      }, 1500);
      const timer2 = setTimeout(() => {
        setIsFlipped(false);
      }, 4000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [demoMode, decks]);

  // Modals
  const [createDeckModalOpen, setCreateDeckModalOpen] = useState(false);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  // Form states
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('');
  const [newDeckColor, setNewDeckColor] = useState('#6366f1');

  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardSubtopic, setNewCardSubtopic] = useState('');
  const [newCardDifficulty, setNewCardDifficulty] = useState<Flashcard['difficulty']>('MEDIUM');

  // Keyboard controls for Study Mode
  useEffect(() => {
    if (!activeDeck || sessionCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1' && isFlipped) {
        handleScoreCurrentCard('LEARNING');
      } else if (e.key === '2' && isFlipped) {
        handleScoreCurrentCard('LEARNING');
      } else if (e.key === '3' && isFlipped) {
        handleScoreCurrentCard('MASTERED');
      } else if (e.key === 'ArrowRight') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeck, currentCardIndex, isFlipped, sessionCompleted]);

  const handleStartReview = (deck: FlashcardDeck) => {
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  const handleScoreCurrentCard = (mastery: Flashcard['mastery']) => {
    if (!activeDeck) return;
    const card = activeDeck.cards[currentCardIndex];
    if (card) {
      onUpdateCardMastery(activeDeck.id, card.id, mastery);
    }
    handleNextCard();
  };

  const handleNextCard = () => {
    if (!activeDeck) return;
    if (currentCardIndex < activeDeck.cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionCompleted(true);
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleSaveDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    onAddDeck({
      title: newDeckTitle,
      subject: newDeckSubject || 'General',
      color: newDeckColor,
      cards: [],
    });

    setNewDeckTitle('');
    setNewDeckSubject('');
    setCreateDeckModalOpen(false);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeck || !newCardFront.trim() || !newCardBack.trim()) return;

    onAddCardToDeck(activeDeck.id, {
      front: newCardFront,
      back: newCardBack,
      subtopic: newCardSubtopic || 'Key Concepts',
      difficulty: newCardDifficulty,
      mastery: 'NEW',
      reviewCount: 0,
    });

    setNewCardFront('');
    setNewCardBack('');
    setNewCardSubtopic('');
    setAddCardModalOpen(false);
  };

  // Deck view or Active Review Mode
  if (activeDeck) {
    const currentCard = activeDeck.cards[currentCardIndex];
    const progress = activeDeck.cards.length > 0 ? ((currentCardIndex + 1) / activeDeck.cards.length) * 100 : 0;

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Review Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveDeck(null)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Decks</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
              {activeDeck.title}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({currentCardIndex + 1} / {activeDeck.cards.length})
            </span>
          </div>
          <button
            onClick={() => setAddCardModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {sessionCompleted ? (
          /* Session Completed Summary */
          <div className="bezel-shell p-10 text-center space-y-4 bg-gradient-to-b from-slate-900 to-indigo-950/30">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Review Session Completed!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              You reviewed all {activeDeck.cards.length} cards in this deck. Spaced active recall reinforces long-term synaptic retention.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                  setSessionCompleted(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Review Again
              </button>
              <button
                onClick={() => setActiveDeck(null)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Return to Decks
              </button>
            </div>
          </div>
        ) : currentCard ? (
          /* Interactive 3D Flip Card */
          <div className="space-y-6">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[320px] sm:min-h-[380px] perspective-1000 select-none group"
            >
              <div
                className={`relative w-full h-full min-h-[320px] sm:min-h-[380px] rounded-3xl p-8 transition-transform duration-500 transform-style-preserve-3d flex flex-col justify-between border ${
                  isFlipped
                    ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border-indigo-500/40 shadow-2xl shadow-indigo-950/50'
                    : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Card Meta Header */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {isFlipped ? 'Answer / Invariant' : 'Question / Concept'}
                    </span>
                    {currentCard.subtopic && (
                      <span className="text-[10px] text-slate-500 font-mono">[{currentCard.subtopic}]</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        currentCard.mastery === 'MASTERED'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : currentCard.mastery === 'LEARNING'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {currentCard.mastery}
                    </span>
                    <RotateCw className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>

                {/* Question / Answer Text */}
                <div className="my-auto py-6">
                  {isFlipped ? (
                    <div className="text-sm sm:text-base text-slate-100 font-medium whitespace-pre-wrap leading-relaxed">
                      {currentCard.back}
                    </div>
                  ) : (
                    <div className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                      {currentCard.front}
                    </div>
                  )}
                </div>

                {/* Footer Hint */}
                <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Click card or tap <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">Space</kbd> to flip</span>
                </div>
              </div>
            </div>

            {/* Self Rating Bar (Shown when flipped) */}
            {isFlipped ? (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                <span className="text-xs text-slate-400 font-semibold">How well did you know this?</span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleScoreCurrentCard('LEARNING')}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
                  >
                    Hard (1)
                  </button>
                  <button
                    onClick={() => handleScoreCurrentCard('LEARNING')}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
                  >
                    Good (2)
                  </button>
                  <button
                    onClick={() => handleScoreCurrentCard('MASTERED')}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
                  >
                    Easy (3) (+15 XP)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Reveal Answer
                </button>
                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bezel-shell p-12 text-center space-y-3">
            <h3 className="text-sm font-bold text-white">This deck has no cards yet</h3>
            <button
              onClick={() => setAddCardModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Add First Card
            </button>
          </div>
        )}

        {/* Add Card to Active Deck Modal */}
        {addCardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Add Flashcard to {activeDeck.title}</h3>
                <button onClick={() => setAddCardModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCard} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Front (Prompt / Question) *</label>
                  <textarea
                    required
                    value={newCardFront}
                    onChange={(e) => setNewCardFront(e.target.value)}
                    placeholder="e.g. What are the 4 Coffman conditions for deadlock?"
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Back (Explanation / Solution) *</label>
                  <textarea
                    required
                    value={newCardBack}
                    onChange={(e) => setNewCardBack(e.target.value)}
                    placeholder="Concise, high-yield answer points..."
                    rows={4}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold mb-1">Subtopic</label>
                    <input
                      type="text"
                      value={newCardSubtopic}
                      onChange={(e) => setNewCardSubtopic(e.target.value)}
                      placeholder="e.g. Deadlocks"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold mb-1">Difficulty</label>
                    <select
                      value={newCardDifficulty}
                      onChange={(e) => setNewCardDifficulty(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAddCardModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Decks Overview Grid ---
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="eyebrow-badge">
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>ACTIVE RECALL HUB</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Flashcard Decks & Spaced Repetition
              </h2>
              <p className="text-xs text-slate-400">
                Reinforce technical concepts with interactive 3D recall cards across OS, DBMS, Networks, and Algorithms.
              </p>
            </div>

            <button
              onClick={() => setCreateDeckModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Deck</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {decks.map((deck) => {
          const total = deck.cards.length;
          const masteredCount = deck.cards.filter((c) => c.mastery === 'MASTERED').length;
          const masteryRate = total > 0 ? Math.round((masteredCount / total) * 100) : 0;

          return (
            <div
              key={deck.id}
              className="bezel-shell p-5 space-y-4 group hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
                    style={{
                      color: deck.color || '#6366f1',
                      borderColor: `${deck.color || '#6366f1'}40`,
                      backgroundColor: `${deck.color || '#6366f1'}15`,
                    }}
                  >
                    {deck.subject}
                  </span>
                  <button
                    onClick={() => onDeleteDeck(deck.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{deck.title}</h3>

                <p className="text-xs text-slate-400 font-mono">
                  {total} flashcards · {masteredCount} mastered ({masteryRate}%)
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${masteryRate}%`,
                      backgroundColor: deck.color || '#6366f1',
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Spaced recall ready</span>
                <button
                  onClick={() => handleStartReview(deck)}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Deck Modal */}
      {createDeckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Flashcard Deck</h3>
              <button onClick={() => setCreateDeckModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDeck} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Deck Title *</label>
                <input
                  type="text"
                  required
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  placeholder="e.g. Computer Networks Protocols"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Subject / Domain</label>
                <input
                  type="text"
                  value={newDeckSubject}
                  onChange={(e) => setNewDeckSubject(e.target.value)}
                  placeholder="e.g. Computer Networks"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Accent Theme</label>
                <div className="flex items-center gap-2">
                  {['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewDeckColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        newDeckColor === c ? 'scale-125 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateDeckModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
