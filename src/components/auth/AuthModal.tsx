import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  X,
  KeyRound,
  ShieldCheck,
  Building2,
  GraduationCap,
  HelpCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Track } from '../../types';
import { ALL_TRACKS, TRACK_DEFINITIONS } from '../../context/TrackContext';
import { registerUser, loginUser, AuthUser, getRegisteredUsers } from '../../lib/auth';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose?: () => void;
  onAuthSuccess: (user: AuthUser, isNewSignup: boolean) => void;
  allowClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onAuthSuccess,
  allowClose = true,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track>('engineering');
  const [college, setCollege] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setGeneralError(null);
    setFieldErrors({});
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const validateSignup = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = 'Full name or username is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. student@axiom.edu).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!selectedTrack) {
      errors.track = 'Please select your academic discipline vertical.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLogin = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email format.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (mode === 'signup') {
      if (!validateSignup()) {
        soundFx.playClick();
        return;
      }

      setLoading(true);
      try {
        const res = await registerUser({
          name,
          email,
          password,
          track: selectedTrack,
          college: college.trim() || undefined,
        });

        if (!res.success || !res.user) {
          setGeneralError(res.error || 'Account creation failed. Please try again.');
          soundFx.playClick();
          return;
        }

        soundFx.playLevelUp();
        onAuthSuccess(res.user, true);
      } catch (err: any) {
        setGeneralError(err.message || 'An unexpected error occurred during signup.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateLogin()) {
        soundFx.playClick();
        return;
      }

      setLoading(true);
      try {
        const res = await loginUser({ email, password });
        if (!res.success || !res.user) {
          setGeneralError(res.error || 'Authentication failed. Please check your credentials.');
          soundFx.playClick();
          return;
        }

        soundFx.playLevelUp();
        onAuthSuccess(res.user, false);
      } catch (err: any) {
        setGeneralError(err.message || 'An unexpected error occurred during sign in.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuickDemoLogin = (demoTrack: Track) => {
    const users = getRegisteredUsers();
    const match = users.find((u) => u.track === demoTrack) || users[0];
    if (match) {
      setEmail(match.email);
      setPassword('admin123');
      setGeneralError(null);
      setFieldErrors({});
      toast.info(`Filled Demo Account: ${match.name} (${TRACK_DEFINITIONS[demoTrack]?.shortLabel})`, {
        description: 'Click "Sign In" or press Enter to continue.',
      });
      soundFx.playClick();
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    soundFx.playClick();
    toast.success('Password Recovery Link Sent', {
      description: `If an account exists for ${forgotEmail}, a password reset verification link has been dispatched.`,
    });
    setForgotPasswordOpen(false);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();
  const selectedMeta = TRACK_DEFINITIONS[selectedTrack] || TRACK_DEFINITIONS.engineering;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 bezel-shell">
        <div className="bezel-core p-6 sm:p-8 space-y-6 bg-slate-950/95 max-h-[92vh] overflow-y-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-70" />
                <div className="relative w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center ring-1 ring-white/20 text-white font-black text-base shadow-inner">
                  <span className="bg-gradient-to-tr from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">⚡</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                  {mode === 'signup' ? 'Create Axiom Account' : 'Welcome Back to Axiom'}
                </h2>
                <p className="text-xs text-slate-400">
                  {mode === 'signup'
                    ? 'Synthesize your discipline-specific AI learning environment'
                    : 'Access your persistent command center & career pipelines'}
                </p>
              </div>
            </div>

            {allowClose && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition pressable"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-900/90 border border-white/10">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMode('signup');
                setGeneralError(null);
                setFieldErrors({});
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account (Sign Up)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMode('login');
                setGeneralError(null);
                setFieldErrors({});
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Existing Member (Sign In)</span>
            </button>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{generalError}</div>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Full Name / Username *</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Sharma or Naveen"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-white focus:outline-none transition ${
                      fieldErrors.name
                        ? 'border-rose-500/80 focus:border-rose-500'
                        : 'border-white/10 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                <span>Email Address *</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@axiom.edu"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-white focus:outline-none transition ${
                    fieldErrors.email
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-white/10 focus:border-indigo-500'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  <span>Password *</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-white focus:outline-none transition ${
                    fieldErrors.password
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-white/10 focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                </p>
              )}

              {/* Password Strength Indicator for Signup */}
              {mode === 'signup' && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Security Strength</span>
                    <span className={strength >= 75 ? 'text-emerald-400' : strength >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                      {strength >= 75 ? 'Strong' : strength >= 50 ? 'Moderate' : 'Weak (min 8 chars)'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength >= 75 ? 'bg-emerald-500' : strength >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Confirm Password *</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-white focus:outline-none transition ${
                      fieldErrors.confirmPassword
                        ? 'border-rose-500/80 focus:border-rose-500'
                        : 'border-white/10 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Academic Discipline Selector (Signup only) */}
            {mode === 'signup' && (
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Academic Discipline Vertical *</span>
                  </label>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold">
                    Initializes Subjects & AI Mentor
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_TRACKS.map((t) => {
                    const Icon = t.icon;
                    const isChosen = selectedTrack === t.id;

                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedTrack(t.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isChosen
                            ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500/50'
                            : 'bg-slate-900/50 hover:bg-slate-900 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className={`p-1.5 rounded-lg ${t.bgSubtle} ${t.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          {isChosen ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-500/20" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white truncate font-display">
                            {t.shortLabel}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {t.badge}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Track Callout */}
                <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    Target Pipeline: <strong className="text-indigo-300">{selectedMeta.targetExamsOrRoles}</strong>
                  </span>
                  <span className="text-indigo-400 font-mono font-bold text-[11px] hidden sm:inline">
                    {selectedMeta.practiceTitle}
                  </span>
                </div>
              </div>
            )}

            {/* Optional College/Institution */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  <span>College / Institution Name (Optional)</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Technology or AIIMS"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/35 border border-white/20 pressable flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{mode === 'signup' ? 'Synthesizing Environment...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'signup'
                        ? `Create Account & Launch ${selectedMeta.shortLabel} Track`
                        : 'Sign In to Command Center'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Accounts Bar (in Login mode) */}
          {mode === 'login' && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>⚡ 1-Click Demo Accounts:</span>
                <span className="text-slate-500">(Password: admin123)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { track: 'engineering' as Track, label: 'Engineering' },
                  { track: 'commerce' as Track, label: 'Commerce & CA' },
                  { track: 'medical' as Track, label: 'Medical AIIMS' },
                  { track: 'law' as Track, label: 'Law & Judiciary' },
                  { track: 'competitive_exams' as Track, label: 'Civil Services' },
                ].map((item) => (
                  <button
                    key={item.track}
                    type="button"
                    onClick={() => handleQuickDemoLogin(item.track)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/40 text-[11px] font-mono text-indigo-300 transition pressable"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Security Assurance */}
          <div className="text-[11px] text-slate-500 text-center font-mono flex items-center justify-center gap-2">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Encrypted credentials with client-side SHA-256 hash & persistent local session</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Reset Password</span>
              </div>
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Enter your registered student email address. We will simulate sending a password reset magic link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="student@axiom.edu"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
