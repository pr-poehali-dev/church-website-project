import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PrayerTreeProps {
  onClose: () => void;
}

interface Leaf {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

const prayers = [
  "Господи, благодарю за этот день",
  "Даруй мне мудрость и терпение",
  "Будь со мной в трудностях",
  "Благодарю за Твою любовь",
  "Помоги мне быть светом для других",
  "Укрепи мою веру",
  "Спасибо за семью и близких",
  "Направь меня на правильный путь",
  "Даруй мир в моём сердце",
  "Помоги мне прощать",
  "Благодарю за Твою защиту",
  "Да будет воля Твоя",
  "Наполни меня Своей любовью",
  "Даруй силы на новый день",
  "Спасибо за все благословения"
];

const bibleVerses = [
  "Возлюби ближнего твоего",
  "Я с вами во все дни",
  "Не бойся, ибо Я с тобой",
  "Блаженны миротворцы",
  "Любовь долготерпит, милосердствует",
  "Всё могу в укрепляющем меня",
  "Господь — пастырь мой",
  "В начале было Слово",
  "Возлюби Господа всем сердцем",
  "Просите, и дано будет вам"
];

const leafColors = [
  "rgba(144, 238, 144, 0.8)",
  "rgba(152, 251, 152, 0.8)",
  "rgba(173, 216, 230, 0.8)",
  "rgba(221, 160, 221, 0.8)",
  "rgba(255, 218, 185, 0.8)",
  "rgba(240, 248, 255, 0.8)"
];

const PrayerTree = ({ onClose }: PrayerTreeProps) => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    setTodayCount(Math.floor(Math.random() * 50) + 20);
    
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const addLeaf = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const allTexts = [...prayers, ...bibleVerses];
    const randomText = allTexts[Math.floor(Math.random() * allTexts.length)];
    const randomColor = leafColors[Math.floor(Math.random() * leafColors.length)];
    
    const newLeaf: Leaf = {
      id: Date.now().toString(),
      text: randomText,
      x,
      y,
      rotation: Math.random() * 60 - 30,
      scale: 0.8 + Math.random() * 0.4,
      color: randomColor
    };

    setLeaves(prev => [...prev, newLeaf]);
    setTodayCount(prev => prev + 1);
    setShowHint(false);

    if (leaves.length >= 20) {
      setLeaves(prev => prev.slice(1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50"
      onClick={addLeaf}
    >
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
          <motion.path
            d="M 50 100 Q 48 80 50 60 Q 52 40 50 20"
            stroke="rgba(101, 67, 33, 0.6)"
            strokeWidth="0.8"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          <motion.path
            d="M 50 70 Q 40 65 35 60"
            stroke="rgba(101, 67, 33, 0.5)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          
          <motion.path
            d="M 50 50 Q 60 45 65 40"
            stroke="rgba(101, 67, 33, 0.5)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />
          
          <motion.path
            d="M 50 30 Q 42 28 38 25"
            stroke="rgba(101, 67, 33, 0.4)"
            strokeWidth="0.4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.9 }}
          />
          
          <motion.path
            d="M 50 30 Q 58 28 62 25"
            stroke="rgba(101, 67, 33, 0.4)"
            strokeWidth="0.4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 1.1 }}
          />
        </svg>
      </div>

      <AnimatePresence>
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: leaf.scale, 
              opacity: 1, 
              rotate: leaf.rotation,
              y: [0, -5, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute pointer-events-none"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div 
              className="relative px-4 py-3 rounded-full shadow-lg backdrop-blur-sm text-xs font-light text-gray-700 whitespace-nowrap"
              style={{ backgroundColor: leaf.color }}
            >
              {leaf.text}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45" style={{ backgroundColor: leaf.color }}></div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
      >
        <h1 className="text-3xl md:text-4xl font-light text-gray-700 mb-2">
          Молитвенное дерево
        </h1>
        <p className="text-sm text-gray-500 font-light">
          Нажмите в любом месте, чтобы добавить молитву
        </p>
      </motion.div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              👆
            </motion.div>
            <p className="text-center text-gray-600 font-light mt-4 text-lg">
              Коснитесь экрана
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
      >
        <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
          <div className="flex items-center gap-3">
            <Icon name="Users" size={20} className="text-gray-600" />
            <div className="text-left">
              <p className="text-xs text-gray-500 font-light">Молитв сегодня</p>
              <p className="text-2xl font-light text-gray-700">{todayCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors pointer-events-auto z-10"
        aria-label="Закрыть"
      >
        <Icon name="X" size={28} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setLeaves([]);
            setTodayCount(Math.floor(Math.random() * 50) + 20);
          }}
          variant="ghost"
          className="text-gray-600 hover:text-gray-800 hover:bg-white/40 backdrop-blur-sm"
        >
          <Icon name="RotateCcw" className="mr-2" size={16} />
          Начать заново
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PrayerTree;
