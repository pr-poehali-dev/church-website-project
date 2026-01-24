import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

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
  isOwn?: boolean;
}

interface Prayer {
  id: number;
  text: string;
  created_at: string;
}

const leafColors = [
  "rgba(144, 238, 144, 0.8)",
  "rgba(152, 251, 152, 0.8)",
  "rgba(173, 216, 230, 0.8)",
  "rgba(221, 160, 221, 0.8)",
  "rgba(255, 218, 185, 0.8)",
  "rgba(240, 248, 255, 0.8)"
];

const ownPrayerColor = "rgba(255, 215, 0, 0.9)";

const API_URL = 'https://functions.poehali.dev/57f42e9e-17c9-49d0-a8ef-6335b8072413';
const USER_ID_KEY = 'prayer_tree_user_id';
const USER_PRAYER_KEY = 'prayer_tree_user_prayer';

const PrayerTree = ({ onClose }: PrayerTreeProps) => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [showPrayerForm, setShowPrayerForm] = useState(false);
  const [prayerText, setPrayerText] = useState("");
  const [canAddPrayer, setCanAddPrayer] = useState(true);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    setUserId(storedUserId);

    const today = new Date().toDateString();
    const storedPrayer = localStorage.getItem(USER_PRAYER_KEY);
    if (storedPrayer) {
      const { date, prayer } = JSON.parse(storedPrayer);
      if (date === today) {
        setCanAddPrayer(false);
        setPrayerText(prayer);
      }
    }

    loadPrayers();

    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const loadPrayers = async () => {
    try {
      const response = await fetch(`${API_URL}?limit=50`);
      const data = await response.json();
      
      setTodayCount(data.count || 0);
      
      if (data.prayers && data.prayers.length > 0) {
        const newLeaves: Leaf[] = data.prayers.slice(0, 20).map((prayer: Prayer, index: number) => ({
          id: prayer.id.toString(),
          text: prayer.text,
          x: 20 + (index % 5) * 15 + Math.random() * 10,
          y: 20 + Math.floor(index / 5) * 15 + Math.random() * 10,
          rotation: Math.random() * 60 - 30,
          scale: 0.8 + Math.random() * 0.4,
          color: leafColors[Math.floor(Math.random() * leafColors.length)]
        }));
        setLeaves(newLeaves);
      }
    } catch (error) {
      console.error('Failed to load prayers:', error);
    }
  };

  const addLeaf = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (showPrayerForm) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setShowHint(false);
    setShowPrayerForm(true);
  };

  const handleSubmitPrayer = async () => {
    if (!prayerText.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          prayer_text: prayerText.trim()
        })
      });

      const data = await response.json();

      if (response.status === 429) {
        setErrorMessage("Вы уже добавили молитву сегодня");
        setCanAddPrayer(false);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add prayer');
      }

      const today = new Date().toDateString();
      localStorage.setItem(USER_PRAYER_KEY, JSON.stringify({
        date: today,
        prayer: prayerText.trim()
      }));

      setCanAddPrayer(false);
      setTodayCount(data.today_count || todayCount + 1);

      const centerX = 50;
      const centerY = 40;
      const newLeaf: Leaf = {
        id: data.prayer.id.toString(),
        text: prayerText.trim(),
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        rotation: Math.random() * 60 - 30,
        scale: 1,
        color: ownPrayerColor,
        isOwn: true
      };

      setLeaves(prev => [newLeaf, ...prev.slice(0, 19)]);
      setShowPrayerForm(false);
      setPrayerText("");
    } catch (error) {
      console.error('Failed to submit prayer:', error);
      setErrorMessage("Не удалось добавить молитву. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50 overflow-hidden touch-none"
      onClick={addLeaf}
      onTouchStart={addLeaf}
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
              className={`relative px-3 py-2 md:px-4 md:py-3 rounded-full shadow-lg backdrop-blur-sm text-[10px] md:text-xs font-light text-gray-700 max-w-[200px] md:max-w-none text-center ${leaf.isOwn ? 'ring-2 ring-yellow-500' : ''}`}
              style={{ backgroundColor: leaf.color }}
            >
              <span className="block truncate md:whitespace-nowrap">{leaf.text}</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 rotate-45" style={{ backgroundColor: leaf.color }}></div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none px-4"
      >
        <h1 className="text-2xl md:text-4xl font-light text-gray-700 mb-1 md:mb-2">
          Молитвенное дерево
        </h1>
        <p className="text-xs md:text-sm text-gray-500 font-light">
          {canAddPrayer ? 'Нажмите в любом месте, чтобы добавить молитву' : 'Молитвы других людей'}
        </p>
      </motion.div>

      <AnimatePresence>
        {showHint && canAddPrayer && !showPrayerForm && (
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

      <AnimatePresence>
        {showPrayerForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 max-w-md mx-4">
              <h3 className="text-xl md:text-2xl font-light text-gray-700 mb-4 text-center">
                {canAddPrayer ? 'Ваша молитва' : 'Вы уже молились сегодня'}
              </h3>
              
              {canAddPrayer ? (
                <>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Одна молитва в день. Её увидят все посетители.
                  </p>
                  <Input
                    value={prayerText}
                    onChange={(e) => setPrayerText(e.target.value)}
                    placeholder="Напишите свою молитву..."
                    maxLength={200}
                    className="mb-4"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-400 mb-4 text-right">
                    {prayerText.length}/200
                  </p>
                  {errorMessage && (
                    <p className="text-sm text-red-500 mb-4 text-center">
                      {errorMessage}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setShowPrayerForm(false);
                        setPrayerText("");
                        setErrorMessage("");
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={handleSubmitPrayer}
                      className="flex-1 bg-primary"
                      disabled={!prayerText.trim() || isLoading}
                    >
                      {isLoading ? 'Отправка...' : 'Добавить'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Ваша сегодняшняя молитва:
                  </p>
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 text-center">{prayerText}</p>
                  </div>
                  <Button
                    onClick={() => setShowPrayerForm(false)}
                    className="w-full"
                  >
                    Закрыть
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none px-4"
      >
        <div className="bg-white/70 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg">
          <div className="flex items-center gap-2 md:gap-3">
            <Icon name="Sparkles" size={18} className="text-gray-600 md:w-5 md:h-5" />
            <div className="text-left">
              <p className="text-[10px] md:text-xs text-gray-500 font-light">Молитв сегодня</p>
              <p className="text-lg md:text-2xl font-light text-gray-700">{todayCount}</p>
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
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        className="absolute top-4 md:top-6 right-4 md:right-6 text-gray-500 hover:text-gray-700 transition-colors pointer-events-auto z-10 p-2"
        aria-label="Закрыть"
      >
        <Icon name="X" size={24} className="md:w-7 md:h-7" />
      </motion.button>
    </motion.div>
  );
};

export default PrayerTree;
