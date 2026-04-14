import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Question {
  text: string;
  emoji: string;
  options: { label: string; tags: string[] }[];
}

const questions: Question[] = [
  {
    text: "Что тебя больше всего вдохновляет?",
    emoji: "✨",
    options: [
      { label: "Музыка и творчество", tags: ["praise"] },
      { label: "Помощь людям в трудностях", tags: ["mercy", "family"] },
      { label: "Общение и новые знакомства", tags: ["youth", "small"] },
      { label: "Изучение глубоких истин", tags: ["bible", "mission"] },
    ],
  },
  {
    text: "Как ты чаще всего проводишь свободное время?",
    emoji: "🕊️",
    options: [
      { label: "Слушаю музыку или играю", tags: ["praise"] },
      { label: "Читаю книги или размышляю", tags: ["bible", "mission"] },
      { label: "Провожу время с семьёй", tags: ["family", "children"] },
      { label: "Встречаюсь с друзьями", tags: ["youth", "small"] },
    ],
  },
  {
    text: "Какой твой главный дар?",
    emoji: "🎁",
    options: [
      { label: "Умею слушать и поддержать", tags: ["mercy", "family", "small"] },
      { label: "Хорошо объясняю и учу", tags: ["bible", "children"] },
      { label: "Умею организовывать", tags: ["mission", "youth"] },
      { label: "Нахожу общий язык с детьми", tags: ["children"] },
    ],
  },
  {
    text: "Что ты хочешь изменить в мире?",
    emoji: "🌍",
    options: [
      { label: "Нести радость и красоту", tags: ["praise"] },
      { label: "Помогать нуждающимся", tags: ["mercy"] },
      { label: "Укреплять семьи", tags: ["family"] },
      { label: "Распространять Евангелие", tags: ["mission"] },
    ],
  },
];

const results: Record<string, { title: string; desc: string; icon: string; color: string }> = {
  praise:   { title: "Служение прославления", desc: "Твоё сердце поёт! Ты создан(а) для музыки и воспевания Бога вместе с командой.", icon: "Music", color: "from-purple-500 to-pink-500" },
  mercy:    { title: "Служение милосердия", desc: "Ты чувствуешь боль других — твоё место рядом с теми, кому нужна помощь и забота.", icon: "HandHeart", color: "from-rose-500 to-orange-400" },
  family:   { title: "Семейное служение", desc: "Твоя сила — в отношениях. Помогай семьям строить крепкий дом на основе веры.", icon: "Heart", color: "from-red-500 to-pink-400" },
  bible:    { title: "Изучение Библии", desc: "Ты любишь глубину слова Божьего — стань наставником для других на пути познания.", icon: "BookOpen", color: "from-blue-600 to-indigo-500" },
  youth:    { title: "Молодёжное служение", desc: "Ты заряжаешь энергией! Твоё призвание — вести молодёжь к Богу через дружбу.", icon: "Sparkles", color: "from-yellow-400 to-orange-500" },
  small:    { title: "Малые группы", desc: "Ты создаёшь тёплую атмосферу там, где ты есть. Домашние группы — твоё место.", icon: "Users2", color: "from-teal-500 to-green-400" },
  children: { title: "Детское служение", desc: "Дети тянутся к тебе! Сей семена веры в юные сердца — это самое важное.", icon: "Baby", color: "from-emerald-400 to-cyan-500" },
  mission:  { title: "Миссионерство", desc: "Твоё сердце за пределами церкви — неси Евангелие туда, где его ещё не слышали.", icon: "Globe", color: "from-sky-500 to-blue-600" },
};

const MinistryQuiz = () => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [resultKey, setResultKey] = useState("");

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const newScores = { ...scores };
    questions[step].options[idx].tags.forEach(t => {
      newScores[t] = (newScores[t] || 0) + 1;
    });
    setScores(newScores);

    setTimeout(() => {
      if (step + 1 >= questions.length) {
        const best = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0]?.[0] || "praise";
        setResultKey(best);
        setFinished(true);
      } else {
        setStep(s => s + 1);
        setSelected(null);
      }
    }, 600);
  };

  const restart = () => {
    setStep(0);
    setScores({});
    setSelected(null);
    setFinished(false);
    setResultKey("");
  };

  const result = results[resultKey];
  const progress = ((step) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Прогресс */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Вопрос {step + 1} из {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: `${((step - 1) / questions.length) * 100}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Вопрос */}
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">{questions[step].emoji}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
                {questions[step].text}
              </h3>
            </div>

            {/* Варианты */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questions[step].options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => pick(idx)}
                  whileHover={selected === null ? { scale: 1.03, y: -2 } : {}}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  className={`text-left p-5 rounded-2xl border-2 transition-all font-medium text-sm leading-relaxed ${
                    selected === idx
                      ? "border-accent bg-accent/10 text-primary"
                      : selected !== null
                      ? "border-border/30 bg-secondary/30 text-muted-foreground opacity-50"
                      : "border-border hover:border-primary/40 hover:bg-secondary/60 text-foreground bg-card"
                  }`}
                >
                  <span className="block mb-1 text-lg">
                    {["🎵", "🤝", "💡", "🌱"][idx]}
                  </span>
                  {opt.label}
                  {selected === idx && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="float-right text-accent"
                    >
                      <Icon name="CheckCircle" size={20} />
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
            className="text-center"
          >
            <motion.div
              className={`relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br ${result?.color} mb-6 shadow-2xl`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: 1 }}
            >
              <Icon name={result?.icon || "Star"} size={48} className="text-white" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
              />
            </motion.div>

            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-2">
              Твоё призвание
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
              {result?.title}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md mx-auto" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>
              {result?.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="rounded-2xl px-8 shadow-lg"
                onClick={() => {
                  document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Icon name="Phone" className="mr-2" size={18} />
                Присоединиться к служению
              </Button>
              <Button variant="outline" size="lg" className="rounded-2xl px-8" onClick={restart}>
                <Icon name="RefreshCw" className="mr-2" size={16} />
                Пройти снова
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MinistryQuiz;
