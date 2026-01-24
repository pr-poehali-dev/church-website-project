import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface SilenceMinuteProps {
  onClose: () => void;
}

const DURATION = 60; // 60 секунд

const bibleVerses = [
  {
    text: "Остановитесь и познайте, что Я — Бог",
    reference: "Псалом 45:11"
  },
  {
    text: "Придите ко Мне, все труждающиеся и обремененные, и Я успокою вас",
    reference: "Матфея 11:28"
  },
  {
    text: "Мир оставляю вам, мир Мой даю вам",
    reference: "Иоанна 14:27"
  },
  {
    text: "В тихом веянии был Господь",
    reference: "3 Царств 19:12"
  },
  {
    text: "Душа моя, молчи пред Богом, ибо на Него уповаю",
    reference: "Псалом 61:6"
  }
];

const reflections = [
  "О чём Бог хочет сказать мне сегодня?",
  "За что я благодарен в этот момент?",
  "Что я могу доверить Богу прямо сейчас?",
  "Как я могу быть ближе к Нему сегодня?",
  "Где я чувствую Его присутствие в своей жизни?"
];

type Stage = "intro" | "silence" | "reflection" | "complete";

const SilenceMinute = ({ onClose }: SilenceMinuteProps) => {
  const [stage, setStage] = useState<Stage>("intro");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [verse] = useState(() => bibleVerses[Math.floor(Math.random() * bibleVerses.length)]);
  const [reflection] = useState(() => reflections[Math.floor(Math.random() * reflections.length)]);
  const [breatheScale, setBreatheScale] = useState(1);

  useEffect(() => {
    if (stage === "intro") {
      const timer = setTimeout(() => {
        setStage("silence");
        setTimeLeft(DURATION);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "silence") {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStage("reflection");
      }
    }
  }, [stage, timeLeft]);

  useEffect(() => {
    if (stage === "silence") {
      const breatheInterval = setInterval(() => {
        setBreatheScale(prev => prev === 1 ? 1.3 : 1);
      }, 4000);
      return () => clearInterval(breatheInterval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "reflection") {
      const timer = setTimeout(() => {
        setStage("complete");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const progress = ((DURATION - timeLeft) / DURATION) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-center px-6 max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon name="Heart" size={40} className="text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-4xl md:text-5xl font-light text-white mb-8 leading-relaxed"
            >
              {verse.text}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-white/60 font-light"
            >
              {verse.reference}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 text-white/40 text-sm"
            >
              Приготовьтесь к минуте тишины...
            </motion.div>
          </motion.div>
        )}

        {stage === "silence" && (
          <motion.div
            key="silence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            <motion.div
              animate={{ scale: breatheScale }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="relative w-64 h-64 mx-auto mb-12"
            >
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    strokeDasharray: "753.98",
                    strokeDashoffset: `${753.98 * (1 - progress / 100)}`
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: breatheScale }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="w-32 h-32 bg-white/20 rounded-full backdrop-blur-md flex items-center justify-center"
                >
                  <span className="text-5xl font-light text-white">{timeLeft}</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/60 text-lg font-light"
            >
              {breatheScale === 1 ? "Вдох..." : "Выдох..."}
            </motion.p>
          </motion.div>
        )}

        {stage === "reflection" && (
          <motion.div
            key="reflection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-6 max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="mb-8"
            >
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon name="Sparkles" size={32} className="text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-light text-white mb-8 leading-relaxed"
            >
              {reflection}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-white/50 font-light"
            >
              Возьмите этот вопрос с собой в день
            </motion.p>
          </motion.div>
        )}

        {stage === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center px-6 max-w-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon name="Check" size={40} className="text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-light text-white mb-6"
            >
              Благодать и мир вам
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-white/60 mb-12 font-light"
            >
              Вы уделили время Богу. Пусть это принесёт покой в ваш день.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-3"
            >
              <Button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm py-6 text-lg font-light"
              >
                Вернуться на сайт
              </Button>

              <Button
                onClick={() => {
                  setStage("intro");
                  setTimeLeft(DURATION);
                }}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/5 py-6 text-lg font-light"
              >
                Ещё минута тишины
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage !== "complete" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          onClick={onClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="X" size={24} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SilenceMinute;
