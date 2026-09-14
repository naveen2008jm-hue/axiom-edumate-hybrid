import React, { useState, useEffect, useRef } from 'react';
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
  VolumeX,
  Mic,
  MicOff,
  Keyboard,
  ArrowRight,
  GraduationCap,
  Send,
  Wand2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { FlashcardDeck, Flashcard } from '../../types';
import { useTrack } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';
import confetti from 'canvas-confetti';

interface FlashcardsTrackerProps {
  decks: FlashcardDeck[];
  onAddDeck: (deck: Omit<FlashcardDeck, 'id'>) => void;
  onDeleteDeck: (deckId: string) => void;
  onUpdateCardMastery: (deckId: string, cardId: string, mastery: Flashcard['mastery']) => void;
  onAddCardToDeck: (deckId: string, card: Omit<Flashcard, 'id'>) => void;
  onVoiceSessionComplete?: () => void;
  demoMode?: boolean;
  onAwardXP?: (amount: number) => void;
}

const AI_SUGGESTIONS_BY_TRACK: Record<string, { topic: string; desc: string }[]> = {
  engineering: [
    { topic: 'Operating Systems Internals', desc: 'Focus on deadlock Coffman conditions, CPU scheduling algorithms, and virtual memory paging vs segmentation.' },
    { topic: 'Computer Networks (TCP/IP & OSI)', desc: 'Focus on TCP 3-way handshake, sliding window, congestion control, and DNS resolution flow.' },
    { topic: 'Database Management Systems', desc: 'Focus on ACID properties, B+ Tree indexing, and isolation levels (Phantom reads vs Dirty reads).' },
    { topic: 'System Design Patterns', desc: 'Focus on CAP theorem, rate limiting algorithms, caching strategies, and load balancing.' },
  ],
  commerce: [
    { topic: 'Ind AS 115 Revenue Recognition', desc: 'Focus on the 5-step model, performance obligations, transaction price allocation, and contract assets.' },
    { topic: 'Corporate Direct Taxation & MAT', desc: 'Focus on Section 115JB MAT calculations, deferred tax Ind AS 12, and transfer pricing methods.' },
    { topic: 'Working Capital & Ratio Analysis', desc: 'Focus on cash conversion cycle, DuPont 5-step decomposition, and quick ratio liquidity.' },
    { topic: 'Financial Derivatives & Options', desc: 'Focus on Black-Scholes Greeks (Delta, Gamma, Theta), futures margin, and interest rate swaps.' },
  ],
  medical: [
    { topic: 'Cardiovascular Pharmacology', desc: 'Focus on beta-blockers, ACE inhibitors vs ARBs, antiarrhythmic classes (Vaughan Williams), and statins.' },
    { topic: 'Renal Physiology & Acid-Base', desc: 'Focus on Henderson-Hasselbalch equation, high anion gap metabolic acidosis (MUDPILES), and nephron transport.' },
    { topic: 'Antimicrobial Spectrum & Resistance', desc: 'Focus on beta-lactams, MRSA coverage, vancomycin mechanism, and protein synthesis inhibitors.' },
    { topic: 'Endocrine Pathology & Diabetes', desc: 'Focus on DKA vs HHS criteria, thyroid storm diagnosis, Cushing syndrome testing, and MEN syndromes.' },
  ],
  law: [
    { topic: 'Fundamental Rights (Art 14-32)', desc: 'Focus on doctrine of severability, reasonable classification test, Article 21 golden triangle, and constitutional writs.' },
    { topic: 'Bharatiya Nyaya Sanhita (BNS) Offences', desc: 'Focus on culpable homicide vs murder, theft vs extortion, criminal breach of trust, and defamation.' },
    { topic: 'Law of Contracts & Specific Relief', desc: 'Focus on doctrine of frustration (Sec 56), liquidated damages vs penalty, and anticipatory breach.' },
    { topic: 'Evidence Law & Relevancy', desc: 'Focus on dying declaration exceptions to hearsay, electronic evidence certificate (Sec 63), and confessions.' },
  ],
  competitive_exams: [
    { topic: 'Indian Polity & Constitutional Amendments', desc: 'Focus on basic structure doctrine, emergency provisions (Art 352-360), and anti-defection 10th Schedule.' },
    { topic: 'Modern Indian History (1857-1947)', desc: 'Focus on Non-Cooperation, Civil Disobedience, Quit India Movement, and government acts (1909, 1919, 1935).' },
    { topic: 'Macroeconomics & Monetary Policy', desc: 'Focus on RBI repo rate transmission, MPC inflation target band, fiscal deficit metrics, and balance of payments.' },
    { topic: 'Environmental Ecology & Conservation', desc: 'Focus on Ramsar wetlands, Wildlife Protection Act schedules, Project Tiger corridors, and Paris COP targets.' },
  ],
  humanities: [
    { topic: 'Sociological Paradigms & Thinkers', desc: 'Focus on Emile Durkheim division of labour, Karl Marx historical materialism, and Max Weber bureaucracy.' },
    { topic: 'Western Political Philosophy', desc: 'Focus on social contract theory (Hobbes, Locke, Rousseau), John Stuart Mill on liberty, and Rawlsian justice.' },
  ],
  other: [
    { topic: 'First Principles & Mental Models', desc: 'Focus on second-order thinking, Pareto principle 80/20, inversion, and Occam razor in problem solving.' },
  ],
};

export const FlashcardsTracker: React.FC<FlashcardsTrackerProps> = ({
  decks,
  onAddDeck,
  onDeleteDeck,
  onUpdateCardMastery,
  onAddCardToDeck,
  onVoiceSessionComplete,
  demoMode = false,
  onAwardXP,
}) => {
  const { track, trackMeta, config } = useTrack();
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Voice Mode States
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenAnswer, setSpokenAnswer] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const recognitionRef = useRef<any>(null);

  // AI Flashcards Generation State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [aiCardCount, setAiCardCount] = useState<number>(10);
  const [aiDeckColor, setAiDeckColor] = useState('#8b5cf6');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual Modals & Forms
  const [createDeckModalOpen, setCreateDeckModalOpen] = useState(false);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('');
  const [newDeckColor, setNewDeckColor] = useState('#6366f1');

  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardSubtopic, setNewCardSubtopic] = useState('');
  const [newCardDifficulty, setNewCardDifficulty] = useState<Flashcard['difficulty']>('MEDIUM');

  // Helper to read text aloud with SpeechSynthesis
  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Auto-speak question when card changes if Voice Mode is on
  useEffect(() => {
    if (voiceMode && activeDeck && !sessionCompleted) {
      const card = activeDeck.cards[currentCardIndex];
      if (card && !isFlipped) {
        setVoiceFeedback(null);
        setSpokenAnswer('');
        speakText(card.front);
      }
    }
  }, [voiceMode, activeDeck, currentCardIndex, isFlipped, sessionCompleted]);

  // Speech Recognition listener
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.info('Speech Recognition not supported in this browser. You can type your spoken answer!');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        soundFx.playClick();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        setSpokenAnswer(transcript);
        handleEvaluateVoiceAnswer(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error('Voice input error', { description: 'Please try again or type your answer.' });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleEvaluateVoiceAnswer = (answerText: string) => {
    if (!activeDeck) return;
    const card = activeDeck.cards[currentCardIndex];
    if (!card) return;

    const answerLower = answerText.toLowerCase();
    const backLower = card.back.toLowerCase();
    const keywords = backLower.split(/\W+/).filter((w) => w.length > 3);
    const matchedCount = keywords.filter((k) => answerLower.includes(k)).length;
    const ratio = keywords.length > 0 ? matchedCount / keywords.length : 0.5;

    const isCorrect = ratio >= 0.3 || answerLower.length > 15;
    const feedbackMsg = isCorrect
      ? 'Excellent recall! Your answer aligns with the core invariants.'
      : 'Review the key concepts below to reinforce this topic.';

    setVoiceFeedback({ isCorrect, message: feedbackMsg });
    setIsFlipped(true);

    if (isCorrect) {
      onUpdateCardMastery(activeDeck.id, card.id, 'MASTERED');
      onVoiceSessionComplete?.();
      onAwardXP?.(15);
      soundFx.playLevelUp();
      speakText(`Correct! ${feedbackMsg}`);
    } else {
      onUpdateCardMastery(activeDeck.id, card.id, 'LEARNING');
      soundFx.playBlip();
      speakText(`Not quite. Here is the answer: ${card.back.slice(0, 120)}`);
    }
  };

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
      if (mastery === 'MASTERED') {
        onAwardXP?.(10);
      }
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
      onAwardXP?.(20);
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
      subject: newDeckSubject || config.name,
      color: newDeckColor,
      cards: [],
    });

    setNewDeckTitle('');
    setNewDeckSubject('');
    setCreateDeckModalOpen(false);
    toast.success('Flashcard Deck Created');
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
    toast.success('Card Added to Deck');
  };

  // AI Generation Handler
  const handleGenerateWithAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiTopic.trim()) {
      toast.error('Topic Required', { description: 'Please provide a subject or topic title.' });
      return;
    }

    setIsGeneratingAi(true);
    setAiError(null);
    soundFx.playClick();

    try {
      const res = await fetch('/api/gemini/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          description: aiDescription.trim(),
          track,
          cardCount: aiCardCount,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const rawCards = Array.isArray(data.cards) ? data.cards : [];

      // Defensive validation
      const validCards: Flashcard[] = rawCards
        .filter((c: any) => c && typeof c.front === 'string' && c.front.trim() && typeof c.back === 'string' && c.back.trim())
        .map((c: any, idx: number) => {
          const diff = String(c.difficulty || 'MEDIUM').toUpperCase();
          const normalizedDiff: Flashcard['difficulty'] =
            diff === 'EASY' || diff === 'HARD' ? diff : 'MEDIUM';

          return {
            id: `card-${Date.now()}-${idx}`,
            front: c.front.trim(),
            back: c.back.trim(),
            subtopic: c.subtopic?.trim() || aiTopic.trim(),
            difficulty: normalizedDiff,
            mastery: 'NEW' as const,
            reviewCount: 0,
          };
        });

      if (validCards.length === 0) {
        throw new Error('No valid flashcards could be parsed from the AI response.');
      }

      const newDeckId = `deck-${Date.now()}`;
      const newDeck: FlashcardDeck = {
        id: newDeckId,
        title: data.deckTitle || `${aiTopic.trim()} Active Recall`,
        subject: data.subject || aiTopic.trim(),
        color: aiDeckColor,
        cards: validCards,
      };

      onAddDeck({
        title: newDeck.title,
        subject: newDeck.subject,
        color: newDeck.color,
        cards: newDeck.cards,
      });

      onAwardXP?.(25);
      soundFx.playLevelUp();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      toast.success(`Generated ${validCards.length} Flashcards with AI! (+25 XP)`, {
        description: `Deck "${newDeck.title}" is ready for 3D active recall & voice practice.`,
      });

      setAiModalOpen(false);
      // Immediately start reviewing the new deck
      setActiveDeck(newDeck);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
    } catch (err: any) {
      console.error('Error generating flashcards with AI:', err);
      setAiError(err.message || 'Failed to generate flashcards. Please check your topic and try again.');
      toast.error('AI Generation Failed', {
        description: 'You can retry or adjust your prompt description.',
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const trackSuggestions = AI_SUGGESTIONS_BY_TRACK[track] || AI_SUGGESTIONS_BY_TRACK.engineering;

  // Deck view or Active Review Mode
  if (activeDeck) {
    const currentCard = activeDeck.cards[currentCardIndex];
    const progress = activeDeck.cards.length > 0 ? ((currentCardIndex + 1) / activeDeck.cards.length) * 100 : 0;

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Review Header Navigation */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              setActiveDeck(null);
            }}
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
              ({activeDeck.cards.length > 0 ? currentCardIndex + 1 : 0} / {activeDeck.cards.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice-based Revision Mode Toggle */}
            <button
              onClick={() => {
                const next = !voiceMode;
                setVoiceMode(next);
                soundFx.playClick();
                if (next) {
                  toast.success('Voice Revision Mode Enabled', {
                    description: 'Questions will be read aloud. You can speak or type your recall!',
                  });
                  speakText(currentCard?.front || '');
                } else {
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  toast.info('Standard Flashcard Mode');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                voiceMode
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {voiceMode ? <Mic className="w-3.5 h-3.5 text-purple-200 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>Voice Mode</span>
            </button>

            <button
              onClick={() => setAddCardModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Voice Mode Banner and Spoken Answer Bar (When Voice Mode is Active) */}
        {voiceMode && currentCard && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-purple-400 animate-bounce' : 'text-slate-400'}`} />
                <span>Web Speech Active Recall Engine</span>
              </div>
              <button
                onClick={() => speakText(isFlipped ? currentCard.back : currentCard.front)}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
              >
                <span>{isSpeaking ? 'Reading Aloud...' : 'Replay Audio'}</span>
              </button>
            </div>

            {/* Mic / Spoken Input Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startListening}
                disabled={isListening}
                className={`p-3 rounded-2xl flex items-center justify-center transition border ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/40 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400/40 shadow-md shadow-purple-600/30'
                }`}
                title="Click and Speak your answer"
              >
                <Mic className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={spokenAnswer}
                  onChange={(e) => setSpokenAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && spokenAnswer.trim()) {
                      handleEvaluateVoiceAnswer(spokenAnswer);
                    }
                  }}
                  placeholder={isListening ? 'Listening to your speech...' : 'Speak with mic or type your recall answer here...'}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => handleEvaluateVoiceAnswer(spokenAnswer)}
                  disabled={!spokenAnswer.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-purple-400 hover:text-white disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Voice Feedback Notification */}
            {voiceFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                  voiceFeedback.isCorrect
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                }`}
              >
                {voiceFeedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0" />
                )}
                <span>{voiceFeedback.message}</span>
              </div>
            )}
          </div>
        )}

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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(isFlipped ? currentCard.back : currentCard.front);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-300 transition"
                      title="Read text aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
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
                    Easy (3) (+10 XP)
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
                <span>ACTIVE RECALL & SPACED REPETITION ENGINE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {config.name} Flashcard Decks
              </h2>
              <p className="text-xs text-slate-400">
                Reinforce high-yield discipline concepts with interactive 3D recall cards, voice recognition, and AI deck synthesis.
              </p>
            </div>

            {/* Action Buttons: AI Generator + Manual Create */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => {
                  setAiModalOpen(true);
                  setAiError(null);
                  soundFx.playClick();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all pressable"
              >
                <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                <span>Generate Flashcards with AI (+25 XP)</span>
              </button>

              <button
                onClick={() => setCreateDeckModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-400" />
                <span>Manual Deck</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <div className="bezel-shell p-12 text-center bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Flashcard Decks Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Generate a full active recall deck instantly using AI or build one manually.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setAiModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Flashcards with AI</span>
            </button>
            <button
              onClick={() => setCreateDeckModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Create Blank Deck
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((deck) => {
            const total = deck.cards.length;
            const masteredCount = deck.cards.filter((c) => c.mastery === 'MASTERED').length;
            const masteryRate = total > 0 ? Math.round((masteredCount / total) * 100) : 0;

            return (
              <div
                key={deck.id}
                className="bezel-shell p-5 space-y-4 group hover:border-indigo-500/40 transition-all flex flex-col justify-between bg-slate-900/90"
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
                      title="Delete Deck"
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
                  <span className="text-[11px] text-slate-500 font-mono">
                    {total > 0 ? 'Ready for recall' : 'Empty deck'}
                  </span>
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
      )}

      {/* --- AI Flashcards Generator Modal --- */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bezel-shell max-w-xl w-full bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>AI Flashcard Deck Generator</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
                      {trackMeta.shortLabel}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Generates 10-15 high-yield active recall cards with Gemini AI.</p>
                </div>
              </div>

              {!isGeneratingAi && (
                <button
                  onClick={() => setAiModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {isGeneratingAi ? (
              /* Loading State */
              <div className="p-10 text-center space-y-4 bg-slate-950/60 rounded-2xl border border-slate-800 animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
                  <RefreshCw className="w-7 h-7 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Synthesizing {aiTopic} Flashcards...</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Gemini is curating high-yield exam questions, conceptual derivations, and common pitfall solutions for {config.name}.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                  Structuring Active Recall Deck
                </div>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleGenerateWithAi} className="space-y-4">
                {aiError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Generation Error</p>
                      <p className="text-[11px] text-rose-200 mt-0.5">{aiError}</p>
                    </div>
                  </div>
                )}

                {/* Subject / Topic Title Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Subject / Topic Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder={`e.g. ${trackSuggestions[0]?.topic || 'Operating Systems'}`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Quick Track Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Quick Suggestions ({config.name}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trackSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiTopic(s.topic);
                          setAiDescription(s.desc);
                          soundFx.playClick();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-300 hover:text-white transition text-left"
                      >
                        ⚡ {s.topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focus Area / Description Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Description / Focus Area (Optional)
                  </label>
                  <textarea
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="e.g. Focus on deadlock conditions, race conditions, CPU scheduling algorithms, and interview edge cases..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>

                {/* Card Count & Color Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                      Card Deck Size
                    </label>
                    <select
                      value={aiCardCount}
                      onChange={(e) => setAiCardCount(parseInt(e.target.value) || 10)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="8">8 Flashcards (Quick Sprint)</option>
                      <option value="10">10 Flashcards (Standard)</option>
                      <option value="12">12 Flashcards (Comprehensive)</option>
                      <option value="15">15 Flashcards (Deep Recall)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                      Deck Accent Color
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {['#8b5cf6', '#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAiDeckColor(c)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            aiDeckColor === c ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-80'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
                  >
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>Generate Full Deck (+25 XP)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- Manual Create Deck Modal --- */}
      {createDeckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Blank Flashcard Deck</h3>
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
                  placeholder={`e.g. ${config.name}`}
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
