import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  ArrowUp,
  Square,
  Sparkles,
  Briefcase,
  Code2,
  Rocket,
  GraduationCap,
  Copy,
  Check,
  Mic,
  StopCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { track } from "@vercel/analytics";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import avatarVideoSrc from "@/assets/vidéo avatar.mp4";
import avatarImgSrc from "@/assets/avatar ia.png";

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

const STORAGE_KEY = "portfolio-chat-messages";
const MAX_MESSAGE_LENGTH = 500;

interface StarterCategory {
  icon: typeof Briefcase;
  label: string;
  prompt: string;
}

const COPY = {
  fr: {
    openLabel: "Discuter avec l'assistant IA",
    buttonHint: "Demande-moi",
    greeting: "Une question ?",
    name: "Assistant de Jean",
    status: "IA entraînée sur son profil",
    welcomeIntro: "Tu peux me poser n'importe quelle question.",
    welcomeHeading: "Que veux-tu savoir ?",
    starters: [
      { icon: Briefcase, label: "Parcours", prompt: "Quel est ton parcours et que cherches-tu en alternance ?" },
      { icon: Rocket, label: "Projets", prompt: "Quels sont tes projets phares en ce moment ?" },
      { icon: Code2, label: "Stack", prompt: "Quelle est ta stack technique et tes domaines d'expertise ?" },
      { icon: GraduationCap, label: "Formation", prompt: "Parle-moi de ta formation à l'ESSCA." },
    ] as StarterCategory[],
    placeholder: "Pose ta question…",
    send: "Envoyer",
    sendHint: "pour envoyer",
    error: "Erreur. Réessaye dans un instant.",
    rateLimit: "Trop de messages, réessaye dans une heure.",
    disclaimer: "Réponses générées par IA",
    clear: "Nouveau",
    copy: "Copier",
    copied: "Copié",
    recording: "Enregistrement",
    cancel: "Annuler",
  },
  en: {
    openLabel: "Chat with the AI assistant",
    buttonHint: "Ask me",
    greeting: "A question?",
    name: "Jean's Assistant",
    status: "AI trained on his profile",
    welcomeIntro: "You can ask me anything.",
    welcomeHeading: "What do you want to know?",
    starters: [
      { icon: Briefcase, label: "Background", prompt: "What's your background and what apprenticeship are you looking for?" },
      { icon: Rocket, label: "Projects", prompt: "What are your main projects right now?" },
      { icon: Code2, label: "Stack", prompt: "What's your tech stack and areas of expertise?" },
      { icon: GraduationCap, label: "Education", prompt: "Tell me about your studies at ESSCA." },
    ] as StarterCategory[],
    placeholder: "Ask your question…",
    send: "Send",
    sendHint: "to send",
    error: "Error. Try again in a moment.",
    rateLimit: "Too many messages, try again in an hour.",
    disclaimer: "AI-generated responses",
    clear: "New",
    copy: "Copy",
    copied: "Copied",
    recording: "Recording",
    cancel: "Cancel",
  },
} as const;

export default function ChatWidget() {
  const { lang } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const t = COPY[lang];

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const greetingDismissedRef = useRef(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Message[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const floatingVideoRef = useRef<HTMLVideoElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const video = avatarVideoRef.current;
    if (!video) return;
    if (isStreaming) {
      video.play().catch(() => {
        // autoplay can be blocked silently
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isStreaming]);

  // Floating button: play video on hover, pause + reset on leave
  useEffect(() => {
    const video = floatingVideoRef.current;
    if (!video) return;
    if (isHovered && !isOpen) {
      video.play().catch(() => {
        // autoplay can be blocked silently
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, isOpen]);

  // One-time greeting bubble — appears 3.5s after mount, auto-hides after 6s
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("chat-greeting-shown") === "1") return;
    if (isOpen) return;

    const showTimer = setTimeout(() => {
      if (!greetingDismissedRef.current) setShowGreeting(true);
    }, 3500);
    const hideTimer = setTimeout(() => {
      setShowGreeting(false);
      sessionStorage.setItem("chat-greeting-shown", "1");
    }, 9500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  // Dismiss greeting when user opens the chat
  useEffect(() => {
    if (isOpen && showGreeting) {
      setShowGreeting(false);
      greetingDismissedRef.current = true;
      sessionStorage.setItem("chat-greeting-shown", "1");
    }
  }, [isOpen, showGreeting]);

  // Safety net: never let isStreaming stay stuck for more than 60s
  useEffect(() => {
    if (!isStreaming) return;
    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      setIsStreaming(false);
    }, 60000);
    return () => clearTimeout(timeout);
  }, [isStreaming]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setError(t.error);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setInput("");
    const userMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...userMessages, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      track("chat_message_sent", { length: trimmed.length });
    } catch {
      // analytics failure shouldn't break the flow
    }

    let succeeded = false;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: userMessages }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setError(t.rateLimit);
        setMessages(userMessages);
        return;
      }
      if (!res.ok || !res.body) {
        throw new Error("API error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string };
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: accumulated,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (!accumulated) throw new Error("Empty response");
      succeeded = true;
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setError(t.error);
        setMessages(userMessages);
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setIsStreaming(false);
      if (succeeded) {
        // refocus the input so the user can keep typing immediately
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const copyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1600);
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 32 };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="chat-button-wrap"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 22, delay: 1.2 }
            }
            className="fixed bottom-5 right-5 z-50 flex items-end gap-3"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Left column — greeting bubble (one-time) + hover label */}
            <div className="flex flex-col items-end gap-2 pb-2">
              <AnimatePresence>
                {showGreeting && !prefersReducedMotion && (
                  <motion.div
                    key="greeting"
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                  >
                    <span className="whitespace-nowrap text-[12px] font-medium tracking-tight text-foreground">
                      {t.greeting}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGreeting(false);
                        greetingDismissedRef.current = true;
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("chat-greeting-shown", "1");
                        }
                      }}
                      aria-label="Dismiss"
                      className="-mr-1 flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                    >
                      <X className="h-2.5 w-2.5" strokeWidth={2.25} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isHovered && !showGreeting && !prefersReducedMotion && (
                  <motion.span
                    key="hover-label"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="pointer-events-none select-none whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium tracking-tight text-foreground shadow-[0_4px_16px_rgb(0,0,0,0.08)]"
                  >
                    {t.buttonHint}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Button container with soft halo */}
            <div className="relative">
              {/* Soft breathing halo behind the button */}
              {!prefersReducedMotion && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -inset-2 rounded-full bg-foreground/15 blur-md"
                  animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.04, 1] }}
                  transition={{
                    duration: 3.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              )}

              <motion.button
                onClick={() => {
                  setIsOpen(true);
                  track("chat_opened");
                }}
                aria-label={t.openLabel}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { scale: [1, 1.025, 1] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 4, ease: "easeInOut", repeat: Infinity }
                }
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                className="relative flex items-center justify-center rounded-full ring-1 ring-foreground/10 shadow-[0_6px_24px_rgb(0,0,0,0.18)] transition-shadow hover:shadow-[0_10px_32px_rgb(0,0,0,0.24)]"
                style={{ height: "52px", width: "52px" }}
              >
                {/* Avatar image + hover video (clipped to circle, crossfade) */}
                <span className="absolute inset-0 overflow-hidden rounded-full bg-background">
                  <img
                    src={avatarImgSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200"
                    style={{ opacity: isHovered ? 0 : 1 }}
                    draggable={false}
                  />
                  <video
                    ref={floatingVideoRef}
                    src={avatarVideoSrc}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full scale-[1.15] object-cover transition-opacity duration-200"
                    style={{ opacity: isHovered ? 1 : 0 }}
                    aria-hidden
                  />
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={transition}
            className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-50 flex h-[100dvh] sm:h-[min(640px,calc(100vh-2.5rem))] w-full sm:w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border sm:border-border bg-background shadow-none sm:shadow-[0_20px_60px_rgb(0,0,0,0.22)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 max-sm:pt-[max(0.75rem,env(safe-area-inset-top))]">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border">
                    <video
                      ref={avatarVideoRef}
                      src={avatarVideoSrc}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="absolute inset-0 h-full w-full scale-[1.15] object-cover"
                      aria-hidden
                    />
                  </div>

                  {/* Rotating arc when AI is responding — Siri / Apple Intelligence style */}
                  <AnimatePresence>
                    {isStreaming && !prefersReducedMotion && (
                      <motion.div
                        key="streaming-arc"
                        aria-hidden
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="pointer-events-none absolute -inset-1.5"
                      >
                        {/* Main rotating arc */}
                        <motion.svg
                          viewBox="0 0 100 100"
                          className="absolute inset-0 h-full w-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2.6, ease: "linear", repeat: Infinity }}
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="hsl(var(--foreground))"
                            strokeOpacity="0.7"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="60 230"
                          />
                        </motion.svg>
                        {/* Secondary slower arc on opposite side — adds depth */}
                        <motion.svg
                          viewBox="0 0 100 100"
                          className="absolute inset-0 h-full w-full"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="hsl(var(--foreground))"
                            strokeOpacity="0.25"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="30 260"
                          />
                        </motion.svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-tight text-foreground">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{t.status}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="rounded-md px-2 py-1 text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={t.clear}
                  >
                    {t.clear}
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-5"
              style={{ backgroundColor: "hsl(var(--section-alt))" }}
            >
              {messages.length === 0 ? (
                <WelcomeScreen
                  intro={t.welcomeIntro}
                  heading={t.welcomeHeading}
                  starters={t.starters}
                  onPick={sendMessage}
                  prefersReducedMotion={prefersReducedMotion ?? false}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((m, i) => (
                    <MessageBubble
                      key={i}
                      message={m}
                      index={i}
                      isLastEmptyAssistant={i === messages.length - 1 && m.role === "assistant" && m.content === ""}
                      onCopy={copyMessage}
                      copied={copiedIndex === i}
                      copyLabel={t.copy}
                      copiedLabel={t.copied}
                      prefersReducedMotion={prefersReducedMotion ?? false}
                    />
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}
            </div>

            {/* Input — pill design inspired by premium chat UIs */}
            <div className="px-3 pt-2 pb-3 max-sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <PromptPill
                value={input}
                onChange={(v) => setInput(v.slice(0, MAX_MESSAGE_LENGTH))}
                onKeyDown={handleKeyDown}
                onSubmit={() => sendMessage(input)}
                onStop={() => abortRef.current?.abort()}
                placeholder={t.placeholder}
                disclaimer={t.disclaimer}
                isStreaming={isStreaming}
                textareaRef={inputRef}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────── Welcome screen ─────────── */
interface WelcomeScreenProps {
  intro: string;
  heading: string;
  starters: StarterCategory[];
  onPick: (prompt: string) => void;
  prefersReducedMotion: boolean;
}

function WelcomeScreen({ intro, heading, starters, onPick, prefersReducedMotion }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-5 pt-2"
    >
      <div className="flex flex-col gap-1.5">
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
          {intro}
        </div>
        <h3 className="text-[17px] font-semibold leading-tight tracking-tight text-foreground">
          {heading}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {starters.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 * i }}
              onClick={() => onPick(s.prompt)}
              className="group flex flex-col gap-2 rounded-xl border border-border bg-background px-3 py-3 text-left transition-all hover:-translate-y-[1px] hover:border-foreground/25 hover:shadow-[0_4px_16px_rgb(0,0,0,0.06)]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/[0.04] text-foreground/70 transition-colors group-hover:bg-foreground group-hover:text-background">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {s.label}
              </div>
              <div className="text-[13px] leading-snug text-foreground/85">
                {s.prompt}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─────────── Message bubble ─────────── */
interface MessageBubbleProps {
  message: Message;
  index: number;
  isLastEmptyAssistant: boolean;
  onCopy: (content: string, index: number) => void;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
  prefersReducedMotion: boolean;
}

function MessageBubble({
  message,
  index,
  isLastEmptyAssistant,
  onCopy,
  copied,
  copyLabel,
  copiedLabel,
  prefersReducedMotion,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm leading-relaxed text-background"
      >
        {message.content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative mr-auto max-w-[92%]"
    >
      <div className="rounded-2xl rounded-tl-md border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground/90 shadow-sm">
        {isLastEmptyAssistant ? (
          <TypingDots />
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                a: ({ ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-foreground/30 underline-offset-2 transition-colors hover:decoration-foreground"
                  />
                ),
                ul: ({ ...props }) => (
                  <ul {...props} className="my-2 ml-4 list-disc space-y-1 marker:text-muted-foreground/60" />
                ),
                ol: ({ ...props }) => (
                  <ol {...props} className="my-2 ml-4 list-decimal space-y-1 marker:text-muted-foreground/60" />
                ),
                li: ({ ...props }) => <li {...props} className="leading-relaxed" />,
                strong: ({ ...props }) => <strong {...props} className="font-semibold text-foreground" />,
                em: ({ ...props }) => <em {...props} className="italic" />,
                code: ({ ...props }) => (
                  <code {...props} className="rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.85em]" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {message.content && (
        <button
          onClick={() => onCopy(message.content, index)}
          aria-label={copied ? copiedLabel : copyLabel}
          className="absolute -bottom-2 left-3 flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" strokeWidth={2} />
              {copiedLabel}
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" strokeWidth={1.75} />
              {copyLabel}
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}

/* ─────────── Typing indicator ─────────── */
function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5" aria-label="typing">
      <span className="h-1.5 w-1.5 animate-[bounce_1.4s_infinite_0ms] rounded-full bg-muted-foreground/60" />
      <span className="h-1.5 w-1.5 animate-[bounce_1.4s_infinite_180ms] rounded-full bg-muted-foreground/60" />
      <span className="h-1.5 w-1.5 animate-[bounce_1.4s_infinite_360ms] rounded-full bg-muted-foreground/60" />
    </span>
  );
}

/* ─────────── Prompt pill input ─────────── */
interface PromptPillProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onStop: () => void;
  placeholder: string;
  disclaimer: string;
  isStreaming: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const PROMPT_MAX_HEIGHT = 140;

// Web Speech Recognition support detection (Chrome, Edge, Safari)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSpeechRecognition = (): any => {
  if (typeof window === "undefined") return undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition;
};

function PromptPill({
  value,
  onChange,
  onKeyDown,
  onSubmit,
  onStop,
  placeholder,
  disclaimer,
  isStreaming,
  textareaRef,
}: PromptPillProps) {
  const { lang } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseTranscriptRef = useRef<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const speechSupported = !!getSpeechRecognition();

  // Auto-resize textarea based on content
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, PROMPT_MAX_HEIGHT)}px`;
  }, [value, textareaRef, isRecording]);

  const cleanupAudio = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close().catch(() => undefined);
    streamRef.current = null;
    audioContextRef.current = null;
    setAnalyser(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    const SR = getSpeechRecognition();
    if (!SR) return;

    try {
      // Acquire mic for visualizer (also primes permission for SR)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const node = audioContext.createAnalyser();
      node.fftSize = 64;
      node.smoothingTimeConstant = 0.7;
      source.connect(node);
      setAnalyser(node);

      const recognition = new SR();
      recognition.lang = lang === "fr" ? "fr-FR" : "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      baseTranscriptRef.current = value;
      let finalSegment = "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSegment += t;
          } else {
            interim += t;
          }
        }
        const prefix = baseTranscriptRef.current
          ? baseTranscriptRef.current.replace(/\s+$/, "") + " "
          : "";
        onChange(prefix + finalSegment + interim);
      };

      recognition.onerror = () => {
        stopRecording();
      };

      recognition.onend = () => {
        if (recognitionRef.current === recognition) {
          stopRecording();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(
        () => setRecordingSeconds((s) => s + 1),
        1000
      );
    } catch {
      cleanupAudio();
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    cleanupAudio();
    setIsRecording(false);
  };

  const hasContent = value.trim().length > 0;

  type ButtonState = "mic" | "send" | "stop-recording" | "stop-streaming";
  const buttonState: ButtonState = isStreaming
    ? "stop-streaming"
    : isRecording
      ? "stop-recording"
      : hasContent
        ? "send"
        : "mic";

  const handleButtonClick = () => {
    switch (buttonState) {
      case "stop-streaming":
        onStop();
        break;
      case "stop-recording":
        stopRecording();
        break;
      case "send":
        onSubmit();
        break;
      case "mic":
        startRecording();
        break;
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`rounded-3xl border bg-background p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 ${
        isStreaming
          ? "border-foreground/30"
          : isRecording
            ? "border-red-500/40 bg-red-500/[0.02]"
            : "border-border"
      }`}
    >
      {/* Textarea OR Voice recorder */}
      <AnimatePresence mode="wait" initial={false}>
        {isRecording ? (
          <motion.div
            key="recorder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex w-full flex-col items-center justify-center py-3"
          >
            {/* Red dot + timer, centered */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="font-mono text-sm text-foreground/80">
                {formatTime(recordingSeconds)}
              </span>
            </div>

            {/* Visualizer — full width, centered */}
            <VoiceVisualizer analyser={analyser} />
          </motion.div>
        ) : (
          <motion.textarea
            key="textarea"
            ref={textareaRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            className="block w-full resize-none border-0 bg-transparent px-2 pt-1 pb-0 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0"
            style={{ maxHeight: `${PROMPT_MAX_HEIGHT}px` }}
          />
        )}
      </AnimatePresence>

      {/* Action row */}
      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
          {disclaimer}
        </span>

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={buttonState === "mic" && !speechSupported}
          aria-label={
            buttonState === "stop-streaming"
              ? "Stop generation"
              : buttonState === "stop-recording"
                ? "Stop recording"
                : buttonState === "send"
                  ? "Send"
                  : "Voice"
          }
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            buttonState === "stop-recording"
              ? "bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.18)] hover:scale-[1.06]"
              : buttonState === "send" || buttonState === "stop-streaming"
                ? "bg-foreground text-background hover:scale-[1.06]"
                : speechSupported
                  ? "bg-foreground/[0.06] text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                  : "bg-foreground/[0.06] text-foreground/30 cursor-not-allowed"
          }`}
        >
          {buttonState === "stop-recording" ? (
            <StopCircle className="h-4 w-4" strokeWidth={2} />
          ) : buttonState === "stop-streaming" ? (
            <Square className="h-3 w-3 fill-current" strokeWidth={2} />
          ) : buttonState === "send" ? (
            <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
          ) : (
            <Mic className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────── Voice visualizer (real audio frequency data) ─────────── */
function VoiceVisualizer({ analyser }: { analyser: AnalyserNode | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const BARS = 32;

  useEffect(() => {
    if (!analyser || !containerRef.current) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const bars = Array.from(containerRef.current.children) as HTMLElement[];
    let rafId = 0;

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.max(1, Math.floor(data.length / bars.length));
      for (let i = 0; i < bars.length; i++) {
        const value = data[i * step] ?? 0;
        const norm = value / 255;
        const height = Math.max(15, Math.pow(norm, 0.6) * 100);
        bars[i].style.height = `${height}%`;
      }
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(rafId);
  }, [analyser]);

  return (
    <div
      ref={containerRef}
      className="flex h-10 w-full items-center justify-center gap-0.5 px-4"
    >
      {Array.from({ length: BARS }).map((_, i) => (
        <div
          key={i}
          className="w-0.5 rounded-full bg-foreground/50 transition-[height] duration-[60ms] ease-out"
          style={{ height: "15%" }}
        />
      ))}
    </div>
  );
}
