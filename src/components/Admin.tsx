import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Sparkles, User, Link as LinkIcon, ArrowLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { GUEST_PREFIXES, buildInviteLink, buildInviteMessage, formatDisplayName } from '../utils/guest';

export const Admin: React.FC = () => {
  const [guestTitle, setGuestTitle] = useState<string>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ displayName: string; url: string } | null>(null);
  const [copied, setCopied] = useState<'link' | 'message' | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = formatDisplayName(guestTitle, guestName);
    if (!displayName) {
      toast.error('Please enter a guest name');
      return;
    }

    setGenerated({ displayName, url: buildInviteLink(window.location.origin, displayName) });
    setCopied(null);
    toast.success('Invitation link generated!');
  };

  const copyText = (text: string, kind: 'link' | 'message') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(kind);
      toast.success(kind === 'link' ? 'Link copied!' : 'Message copied!');
      setTimeout(() => setCopied(null), 3000);
    }).catch(() => {
      toast.error('Failed to copy. Please select and copy manually.');
    });
  };

  const message = generated ? buildInviteMessage(generated.displayName, generated.url) : '';

  return (
    <div className="min-h-screen bg-brand-blush py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 relative overflow-hidden selection:bg-brand-plum/20">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-radial from-brand-lavender/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Back to main website button */}
        <div className="mb-8 flex justify-between items-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-brand-lavender/40 text-stone-600 hover:text-brand-plum hover:bg-white transition-all shadow-sm font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Invitation
          </a>
          <span className="px-4 py-1.5 rounded-full bg-brand-rose border border-brand-lavender/30 text-brand-plum text-xs font-bold uppercase tracking-widest shadow-sm">
            Admin Dashboard
          </span>
        </div>

        {/* Main Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-brand-plum animate-pulse" />
            <span className="text-brand-plum uppercase tracking-[0.5em] text-xs font-bold drop-shadow-sm">Invitation Generator</span>
            <Sparkles className="w-5 h-5 text-brand-plum animate-pulse" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-display text-stone-800 tracking-tight mb-4 drop-shadow-sm">
            Wedding <span className="italic font-light text-brand-plum">Admin Panel</span>
          </h1>
          <p className="text-stone-500 font-serif italic text-lg max-w-xl mx-auto">
            Generate personalized invitation links and WhatsApp messages for your guests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Generator Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(176,137,104,0.15)] relative overflow-hidden self-start"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-rose via-brand-plum to-brand-rose" />

            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 flex items-center gap-2 ml-1">
                    <User className="w-4 h-4 text-brand-plum" />
                    Select Prefix
                  </label>
                  <select
                    value={guestTitle}
                    onChange={(e) => setGuestTitle(e.target.value)}
                    className="w-full bg-white px-6 py-4 rounded-full border border-stone-200/80 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all font-serif text-lg shadow-inner text-stone-800 cursor-pointer"
                  >
                    {GUEST_PREFIXES.map((prefix) => (
                      <option key={prefix} value={prefix}>{prefix}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 flex items-center gap-2 ml-1">
                    <User className="w-4 h-4 text-brand-plum" />
                    Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanjaya"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-white px-6 py-4 rounded-full border border-stone-200/80 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all font-serif italic text-lg shadow-inner text-stone-800 placeholder:text-stone-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-stone-800 text-brand-rose py-5 rounded-full font-sans tracking-[0.3em] font-bold text-xs uppercase hover:bg-stone-900 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <LinkIcon className="w-4 h-4 text-brand-plum" />
                Generate Link
              </button>
            </form>
          </motion.div>

          {/* Generated Link & Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(176,137,104,0.15)] relative overflow-hidden space-y-6"
          >
            <h3 className="font-serif text-2xl text-stone-800 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-brand-plum" />
              Generated Link
            </h3>

            {generated ? (
              <div className="space-y-6">
                <a
                  href={generated.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 bg-stone-50 rounded-2xl border border-stone-200/80 shadow-inner text-sm text-brand-plum font-medium break-all hover:underline"
                >
                  {generated.url}
                </a>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 shadow-inner">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-plum mb-3 flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" /> WhatsApp Message Preview
                  </p>
                  <div className="text-sm text-stone-700 font-serif whitespace-pre-wrap break-words leading-relaxed bg-white/60 p-4 rounded-xl border border-stone-100">
                    {message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl">
                <p className="text-stone-400 font-serif italic text-base">
                  Fill the form and click generate to create a link.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={!generated}
                onClick={() => generated && copyText(generated.url, 'link')}
                className="flex-1 bg-brand-plum text-white py-3.5 px-6 rounded-full font-sans tracking-[0.2em] font-bold text-[11px] uppercase hover:bg-brand-plum/90 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'link' ? 'Copied!' : 'Copy Link Only'}
              </button>
              <button
                type="button"
                disabled={!generated}
                onClick={() => copyText(message, 'message')}
                className="flex-1 bg-brand-rose text-brand-plum py-3.5 px-6 rounded-full font-sans tracking-[0.2em] font-bold text-[11px] uppercase hover:bg-brand-rose/90 transition-all shadow-sm border border-brand-lavender/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {copied === 'message' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'message' ? 'Copied!' : 'Copy Full Message'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
