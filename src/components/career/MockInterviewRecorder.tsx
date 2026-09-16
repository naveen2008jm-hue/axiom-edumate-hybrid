import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  Square,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Clock,
  RotateCcw,
  BookOpen,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { InterviewQuestion, InterviewCritique, MockInterviewSession, Track } from '../../types';
import { useTrack } from '../../context/TrackContext';
import { getInterviewQuestionsForTrack } from '../../data/interviewQuestions';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';
import { critiqueMockInterview } from '../../services/aiService';

interface MockInterviewRecorderProps {
  onAwardXP?: (amount: number) => void;
  onInterviewComplete?: () => void;
}

export const MockInterviewRecorder: React.FC<MockInterviewRecorderProps> = ({
  onAwardXP,
  onInterviewComplete,
}) => {
  const { track, trackMeta } = useTrack();
  const questions = getInterviewQuestionsForTrack(track);

  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(questions[0] || questions[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Self Checklist & Notes
  const [answerNotes, setAnswerNotes] = useState('');
  const [selfChecklist, setSelfChecklist] = useState({
    coveredSTAR: true,
    clearTone: true,
    statedComplexityOrRatio: false,
    confidentPacing: true,
  });

  // AI Critique State
  const [critiqueLoading, setCritiqueLoading] = useState(false);
  const [critique, setCritique] = useState<InterviewCritique | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const playbackVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Switch questions when track changes
  useEffect(() => {
    const trackQuestions = getInterviewQuestionsForTrack(track);
    if (trackQuestions.length > 0) {
      setSelectedQuestion(trackQuestions[0]);
      handleResetSession();
    }
  }, [track]);

  // Clean up media streams on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
        setCameraActive(true);
        soundFx.playSuccess();
      } else {
        setCameraError('Webcam / microphone access not supported in this environment.');
      }
    } catch (err: any) {
      console.warn('Camera stream request rejected or not available:', err);
      setCameraError('Camera access unavailable. You can still practice with timed speech / transcript notes!');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleStartRecording = async () => {
    if (!cameraActive) {
      await startCamera();
    }

    recordedChunksRef.current = [];
    setRecordedBlobUrl(null);
    setCritique(null);
    setTimerSeconds(0);
    setIsRecording(true);
    soundFx.playClick();

    if (streamRef.current && typeof MediaRecorder !== 'undefined') {
      try {
        const recorder = new MediaRecorder(streamRef.current);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedBlobUrl(url);
        };
        mediaRecorderRef.current = recorder;
        recorder.start(500);
      } catch (err) {
        console.warn('MediaRecorder init error:', err);
      }
    }

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedDuration(timerSeconds);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    soundFx.playLevelUp();
    toast.success('Interview Response Recorded!', {
      description: `Completed in ${timerSeconds} seconds. Ready for self-review & AI critique.`,
    });
  };

  const handleResetSession = () => {
    setIsRecording(false);
    setRecordedBlobUrl(null);
    setCritique(null);
    setTimerSeconds(0);
    setAnswerNotes('');
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const handleRequestCritique = async () => {
    setCritiqueLoading(true);
    soundFx.playClick();

    try {
      const data = await critiqueMockInterview({
        question: selectedQuestion.question,
        track,
        durationSeconds: recordedDuration || timerSeconds || 75,
        answerNotes: answerNotes || 'Candidate completed spoken walkthrough covering core principles and trade-offs.',
      });

      setCritique(data);
      onAwardXP?.(30);
      onInterviewComplete?.();
      soundFx.playLevelUp();
      toast.success('AI Interview Critique Generated!', {
        description: `Score: ${data.score}/100. +30 XP earned for interview practice!`,
      });
    } catch (err) {
      console.warn('Critique error:', err);
      toast.error('Critique Error', { description: 'Failed to generate AI interview evaluation.' });
    } finally {
      setCritiqueLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow-badge">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              <span>MOCK INTERVIEW STUDIO</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
              {trackMeta.label}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display">
            In-Session Video Mock Interview Recorder
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Record privacy-first timed video/audio answers to domain-specific questions.
            All recordings stay strictly in your local browser session. Receive instant AI pacing analysis, filler word estimates, and STAR/IRAC critique.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Selector & Camera Recorder */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question Card */}
          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                  {selectedQuestion.category}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase">
                  {selectedQuestion.difficulty}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-display leading-snug">
                {selectedQuestion.question}
              </h3>

              {/* Hints dropdown */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interview Key Points to Hit:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuestion.keyPointsToCover.map((pt, i) => (
                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                      ✓ {pt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Question Switcher */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">More Prompts:</span>
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q);
                      handleResetSession();
                    }}
                    className={`text-[11px] font-mono px-3 py-1 rounded-xl transition whitespace-nowrap flex-shrink-0 ${
                      selectedQuestion.id === q.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Prompt {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Camera Recording Console */}
          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    {isRecording ? 'Recording Live...' : recordedBlobUrl ? 'Playback Ready' : 'Camera Feed Standby'}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
                  <span className="text-slate-500 font-normal">/ max 3:00</span>
                </div>
              </div>

              {/* Video Preview Box */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                {recordedBlobUrl ? (
                  <video
                    ref={playbackVideoRef}
                    src={recordedBlobUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : cameraActive ? (
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Video className="w-12 h-12 text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-400 max-w-sm">
                      {cameraError || 'Activate your browser camera & mic to simulate a live technical / panel interview.'}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
                    >
                      Enable Camera Feed
                    </button>
                  </div>
                )}

                {/* Live recording indicator badge */}
                {isRecording && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>REC</span>
                  </div>
                )}
              </div>

              {/* Recorder Actions Toolbar */}
              <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="btn-island flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition pressable"
                    >
                      <Video className="w-4 h-4" />
                      <span>{recordedBlobUrl ? 'Re-record Answer' : 'Start Recording'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="btn-island flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs border border-rose-500/30 transition pressable"
                    >
                      <Square className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>Finish & Save Recording</span>
                    </button>
                  )}

                  {recordedBlobUrl && (
                    <button
                      onClick={handleResetSession}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Reset Session"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={handleRequestCritique}
                  disabled={critiqueLoading || (!recordedBlobUrl && !answerNotes.trim())}
                  className="btn-island flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition pressable disabled:opacity-50"
                >
                  {critiqueLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating Response...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Request AI Critique (+30 XP)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Self Review Checklist & AI Critique */}
        <div className="lg:col-span-5 space-y-6">
          {/* Answer Notes & Transcript Scratchpad */}
          <div className="bezel-shell">
            <div className="bezel-core p-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Spoken Summary / Key Notes
              </span>
              <textarea
                value={answerNotes}
                onChange={(e) => setAnswerNotes(e.target.value)}
                placeholder="Optional: Paste your spoken transcript or bullet points here for enhanced AI evaluation..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />

              {/* Rubric Self-Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">Self-Review Rubric Checklist</span>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selfChecklist.coveredSTAR}
                      onChange={(e) => setSelfChecklist({ ...selfChecklist, coveredSTAR: e.target.checked })}
                      className="rounded accent-indigo-600"
                    />
                    <span className="text-slate-300">Used STAR / IRAC structured breakdown</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selfChecklist.statedComplexityOrRatio}
                      onChange={(e) => setSelfChecklist({ ...selfChecklist, statedComplexityOrRatio: e.target.checked })}
                      className="rounded accent-indigo-600"
                    />
                    <span className="text-slate-300">Stated exact complexity, metrics, or statute sections</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selfChecklist.confidentPacing}
                      onChange={(e) => setSelfChecklist({ ...selfChecklist, confidentPacing: e.target.checked })}
                      className="rounded accent-indigo-600"
                    />
                    <span className="text-slate-300">Steady voice pacing without prolonged pauses</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* AI Generated Evaluation Report Card */}
          {critique && (
            <div className="bezel-shell animate-fade-in-up">
              <div className="bezel-core p-6 space-y-5 bg-gradient-to-b from-indigo-950/30 to-slate-900 border-indigo-500/30">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Evaluation Complete
                    </span>
                    <h4 className="text-base font-bold text-white mt-1 font-display">AI Performance Assessment</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono">{critique.score}/100</div>
                    <span className="text-[10px] font-mono text-slate-400">STAR Rating: {critique.starStructureRating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  "{critique.overallImpression}"
                </p>

                {/* Metrics row */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Pacing Cadence</span>
                    <span className="text-indigo-400 font-bold">{critique.pacingPpm}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Filler Word Frequency</span>
                    <span className="text-purple-400 font-bold">{critique.fillerWordFrequency}</span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">Core Strengths</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {critique.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">Recommendations to Polish</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {critique.areasForImprovement.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal Answer Outline */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-indigo-300 uppercase block">Model Answer Framing Outline</span>
                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                    {critique.idealAnswerOutline}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
