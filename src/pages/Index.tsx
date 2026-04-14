import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import StarCanvas from "@/components/StarCanvas";
import MinistryQuiz from "@/components/MinistryQuiz";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [showSundayDialog, setShowSundayDialog] = useState(false);
  const [showWorshipDialog, setShowWorshipDialog] = useState(false);
  const [showBibleDialog, setShowBibleDialog] = useState(false);
  const [showPrayerDialog, setShowPrayerDialog] = useState(false);
  const [showSistersDialog, setShowSistersDialog] = useState(false);
  const [showBrothersDialog, setShowBrothersDialog] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, name: '' });
  const [prayerSent, setPrayerSent] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const services = [
    { day: 0, name: 'Воскресное служение', time: 'Воскресенье, 11:00', icon: 'Sun', dialog: () => setShowSundayDialog(true) },
    { day: 1, name: 'Поклонение Богу', time: 'Понедельник, 08:00', icon: 'Music', dialog: () => setShowWorshipDialog(true) },
    { day: 2, name: 'Изучение Библии', time: 'Вторник, 08:00', icon: 'BookOpen', dialog: () => setShowBibleDialog(true) },
    { day: 3, name: 'Молитвенное собрание', time: 'Среда, 19:00', icon: 'Moon', dialog: () => setShowPrayerDialog(true) },
    { day: 4, name: 'Сестринский разговор', time: 'Четверг, 19:00', icon: 'Users', dialog: () => setShowSistersDialog(true) },
    { day: 5, name: 'Братский разговор', time: 'Пятница, 19:00', icon: 'Users2', dialog: () => setShowBrothersDialog(true) },
  ];

  const getNextServiceIndex = () => {
    const today = new Date().getDay();
    let nextIndex = services.findIndex(s => s.day > today);
    if (nextIndex === -1) nextIndex = 0;
    return nextIndex;
  };

  const biblicalVerses = [
    { text: "«Возложи на Господа заботы твои, и Он поддержит тебя»", reference: "Псалом 54:23" },
    { text: "«Ибо все возможно верующему»", reference: "Марк 9:23" },
    { text: "«Господь — Пастырь мой; я ни в чём не буду нуждаться»", reference: "Псалом 22:1" },
    { text: "«Бог есть любовь, и пребывающий в любви пребывает в Боге»", reference: "1 Иоанна 4:16" },
    { text: "«Всё могу в укрепляющем меня Иисусе Христе»", reference: "Филиппийцам 4:13" },
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const updateDay = () => {
      const now = new Date();
      const irkutsk = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Irkutsk' }));
      setCurrentDay(irkutsk.getDay());
    };
    updateDay();
    const i = setInterval(updateDay, 60000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setCurrentVerseIndex(p => (p + 1) % biblicalVerses.length);
    }, 5000);
    return () => clearInterval(i);
  }, [biblicalVerses.length]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Таймер до следующего служения
  useEffect(() => {
    const serviceSchedule = [
      { day: 0, hour: 11, minute: 0, name: 'Воскресное служение' },
      { day: 1, hour: 8, minute: 0, name: 'Поклонение Богу' },
      { day: 2, hour: 8, minute: 0, name: 'Изучение Библии' },
      { day: 3, hour: 19, minute: 0, name: 'Молитвенное собрание' },
      { day: 4, hour: 19, minute: 0, name: 'Сестринский разговор' },
      { day: 5, hour: 19, minute: 0, name: 'Братский разговор' },
    ];
    const calcCountdown = () => {
      const now = new Date();
      const irkutsk = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Irkutsk' }));
      const curDay = irkutsk.getDay();
      const curH = irkutsk.getHours();
      const curM = irkutsk.getMinutes();
      const curS = irkutsk.getSeconds();
      let next = serviceSchedule.find(s => s.day > curDay || (s.day === curDay && (s.hour > curH || (s.hour === curH && s.minute > curM))));
      if (!next) next = serviceSchedule[0];
      let daysUntil = next.day - curDay;
      if (daysUntil < 0 || (daysUntil === 0 && (next.hour < curH || (next.hour === curH && next.minute <= curM)))) daysUntil += 7;
      const totalSeconds = daysUntil * 86400 + next.hour * 3600 + next.minute * 60 - curH * 3600 - curM * 60 - curS;
      setCountdown({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        name: next.name,
      });
    };
    calcCountdown();
    const t = setInterval(calcCountdown, 1000);
    return () => clearInterval(t);
  }, []);

  const galleryImages = [
    { src: 'https://cdn.poehali.dev/files/фон 56.JPEG', caption: 'Наш храм' },
    { src: 'https://cdn.poehali.dev/files/фон 32.jpg', caption: 'Пастор Алексей' },
    { src: 'https://cdn.poehali.dev/files/фон 65.jpg', caption: 'Логотип церкви' },
    { src: 'https://cdn.poehali.dev/files/фон 72.PNG', caption: 'Символ веры' },
  ];

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О церкви" },
    { id: "schedule", label: "Расписание" },
    { id: "ministries", label: "Служения" },
    { id: "sermons", label: "Проповеди" },
    { id: "contacts", label: "Контакты" },
  ];

  const ministriesList = [
    { icon: 'Music', title: 'Прославление', desc: 'Музыкальное служение, воспевающее славу Богу через современные и традиционные гимны' },
    { icon: 'Baby', title: 'Детское служение', desc: 'Воскресная школа для детей с библейскими уроками, играми и творчеством' },
    { icon: 'Sparkles', title: 'Молодёжное служение', desc: 'Встречи молодёжи для общения, духовного роста и совместного служения' },
    { icon: 'HandHeart', title: 'Милосердие', desc: 'Помощь нуждающимся, социальное служение и благотворительность' },
    { icon: 'Users2', title: 'Малые группы', desc: 'Домашние группы для близкого общения, изучения Библии и взаимной поддержки' },
    { icon: 'Heart', title: 'Семейное служение', desc: 'Поддержка семей, консультирование и совместные мероприятия' },
    { icon: 'Globe', title: 'Миссионерство', desc: 'Распространение Евангелия и поддержка миссионерской деятельности' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Прогресс-бар */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, hsl(220 55% 22%), hsl(38 92% 50%))"
        }}
      />

      {/* Навигация */}
      <nav className="fixed top-0.5 w-full z-50 transition-all duration-500">
        <div className="mx-4 md:mx-8 mt-3">
          <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg shadow-black/5">
            <button onClick={() => scrollToSection("home")} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-xl blur-sm group-hover:blur-md transition-all" />
                <img
                  src="https://cdn.poehali.dev/files/фон 65.jpg"
                  alt="Церковь Бога Моего"
                  className="relative h-10 w-10 object-contain rounded-xl"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-primary leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Церковь Бога Моего
                </p>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Иркутск</p>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass rounded-2xl mt-2 px-4 py-4 shadow-xl"
              >
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      activeSection === item.id ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <img
            src="https://cdn.poehali.dev/files/фон 56.JPEG"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/6 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Логотип */}
          <motion.div
            className="mb-8 inline-block"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 120 }}
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse" />
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-3">
                <img
                  src="https://cdn.poehali.dev/files/фон 72.PNG"
                  alt="Церковь Бога Моего"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Подзаголовок */}
          <motion.p
            className="text-accent tracking-[0.3em] uppercase text-xs md:text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Христианская церковь · Иркутск
          </motion.p>

          {/* Заголовок */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            Церковь<br />
            <span className="italic text-accent/90">Бога Моего</span>
          </motion.h1>

          {/* Разделитель */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="w-16 h-px bg-accent/60" />
            <Icon name="Cross" size={16} className="text-accent" />
            <div className="w-16 h-px bg-accent/60" />
          </motion.div>

          {/* Цитаты */}
          <div className="relative h-20 md:h-16 overflow-hidden max-w-2xl mx-auto mb-10">
            {biblicalVerses.map((verse, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: index === currentVerseIndex ? 1 : 0,
                  y: index === currentVerseIndex ? 0 : (index < currentVerseIndex ? -20 : 20)
                }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-white/90 text-base md:text-lg font-light italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {verse.text}
                </p>
                <p className="text-accent/80 text-sm mt-1 tracking-widest">{verse.reference}</p>
              </motion.div>
            ))}
          </div>

          {/* Адрес */}
          <motion.div
            className="flex items-center justify-center gap-2 text-white/70 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Icon name="MapPin" size={16} className="text-accent" />
            <span className="text-sm tracking-wide">Павла Красильникова 109</span>
          </motion.div>

          {/* CTA кнопки */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-10 py-6 text-base shadow-2xl shadow-accent/30 rounded-2xl"
              onClick={() => scrollToSection("schedule")}
            >
              <Icon name="Calendar" className="mr-2" size={18} />
              Посетить служение
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-10 py-6 text-base rounded-2xl"
              onClick={() => scrollToSection("about")}
            >
              <Icon name="ChevronDown" className="mr-2" size={18} />
              Узнать больше
            </Button>
          </motion.div>
        </motion.div>

        {/* Стрелка вниз */}
        <motion.button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon name="ChevronDown" size={32} strokeWidth={1.5} />
        </motion.button>
      </section>

      {/* О церкви */}
      <section id="about" className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll animate-fade-up">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Наша история</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              О нашей церкви
            </h2>
            <div className="section-divider" />
          </div>

          {/* Пастор */}
          <motion.div
            className="max-w-5xl mx-auto mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl shadow-primary/10 rounded-3xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Фото пастора */}
                  <div className="md:w-2/5 relative bg-primary min-h-[360px] md:min-h-[480px]">
                    <img
                      src="https://cdn.poehali.dev/files/фон 32.jpg"
                      alt="Алексей Нарутдинов"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    {/* Лёгкий градиент снизу на мобилке */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                    {/* На десктопе — тонкая тень справа для перехода */}
                    <div className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/5 to-transparent" />
                    {/* Имя поверх фото на мобилке */}
                    <div className="absolute bottom-6 left-6 md:hidden">
                      <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-1">Служитель церкви</p>
                      <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Алексей Нарутдинов</h3>
                    </div>
                    {/* Золотая плашка-лейбл (десктоп) */}
                    <div className="hidden md:flex absolute top-6 left-6 items-center gap-2 bg-accent/90 backdrop-blur-sm text-primary rounded-xl px-4 py-2">
                      <Icon name="Star" size={14} />
                      <span className="text-xs font-bold tracking-wide uppercase">Пастор церкви</span>
                    </div>
                  </div>

                  {/* Текстовая часть */}
                  <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="hidden md:block mb-6">
                      <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Служитель церкви</p>
                      <h3 className="text-3xl md:text-4xl font-bold text-primary mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Алексей Нарутдинов
                      </h3>
                      <div className="w-12 h-0.5 bg-accent" />
                    </div>
                    <p className="text-foreground/70 leading-relaxed mb-5" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
                      Служитель Божий, посвятивший свою жизнь проповеди Евангелия и духовному наставлению общины. С любовью и мудростью ведёт церковь по пути веры и служения.
                    </p>
                    <p className="text-foreground/60 leading-relaxed text-sm mb-8">
                      Алексей — пример того, как вера способна изменить жизнь. Он принимает каждого с открытым сердцем и всегда готов помочь найти ответы на важные жизненные вопросы.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="tel:+79041304051"
                        className="inline-flex items-center gap-3 px-5 py-3 bg-primary/8 hover:bg-primary hover:text-white rounded-xl transition-all group text-sm font-medium text-primary"
                      >
                        <Icon name="Phone" size={16} />
                        +7 (904) 130-40-51
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3 колонки */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: 'Heart',
                title: 'Наша миссия',
                text: 'Мы стремимся быть светом в этом мире, распространяя любовь Божью и помогая людям найти истинный путь к спасению через Иисуса Христа.',
                delay: 0
              },
              {
                icon: 'Users',
                title: 'Наше сообщество',
                text: 'Мы — семья верующих людей разных возрастов, объединённых одной верой. Тёплая атмосфера принятия, поддержки и духовного роста.',
                delay: 0.1
              },
              {
                icon: 'HandHeart',
                title: 'Центр помощи',
                text: 'Если вы в сложной жизненной ситуации — нет где жить, нужна работа — мы поможем.',
                delay: 0.2,
                phone: true
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
              >
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                  <Card className="h-full border border-border/50 shadow-lg shadow-primary/5 rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-shadow">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-6 group-hover:bg-accent/15 transition-colors">
                        <Icon name={item.icon} className="text-primary group-hover:text-accent transition-colors" size={26} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.text}</p>
                      {item.phone && (
                        <a href="tel:+79041269873" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors text-sm mt-4">
                          <Icon name="Phone" size={14} />
                          8 (904) 126-98-73
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Расписание */}
      <section id="schedule" className="py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/3f2eba44-cb9b-45d8-9905-8690c25d20d6/files/f916dc69-76a7-4102-b24c-969c6df2d668.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-background to-accent/4" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-on-scroll animate-fade-up">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Каждую неделю</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Расписание богослужений
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {services.map((service, index) => {
              const nextIdx = getNextServiceIndex();
              const isNext = index === nextIdx;
              const isToday = service.day === currentDay;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={service.dialog}
                >
                  <motion.div whileHover={{ scale: 1.015, x: 4 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2 }}>
                    <Card className={`cursor-pointer border transition-all rounded-2xl overflow-hidden ${
                      isToday
                        ? 'border-accent/60 shadow-lg shadow-accent/15 bg-gradient-to-r from-accent/5 to-accent/10'
                        : isNext
                        ? 'border-primary/40 shadow-lg shadow-primary/10 bg-gradient-to-r from-primary/3 to-primary/6'
                        : 'border-border/40 shadow-md hover:border-primary/20 hover:shadow-lg'
                    }`}>
                      <CardContent className="p-5 md:p-6 flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isToday ? 'bg-accent shadow-md shadow-accent/30' : isNext ? 'bg-primary shadow-md shadow-primary/20' : 'bg-secondary'
                        }`}>
                          <Icon name={service.icon} className={isToday || isNext ? 'text-white' : 'text-primary'} size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                              {service.name}
                            </h3>
                            {isToday && (
                              <span className="px-2.5 py-0.5 bg-accent text-primary text-xs font-bold rounded-full animate-pulse">
                                Сегодня
                              </span>
                            )}
                            {isNext && !isToday && (
                              <span className="px-2.5 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                                Следующее
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{service.time}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isToday ? 'bg-accent/20' : 'bg-secondary'
                        }`}>
                          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Таймер до следующего служения */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsl(38 92% 50%) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Следующее служение</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              {countdown.name}
            </h3>
            <div className="grid grid-cols-4 gap-3 md:gap-6 mb-6">
              {[
                { v: countdown.days, label: 'Дней' },
                { v: countdown.hours, label: 'Часов' },
                { v: countdown.minutes, label: 'Минут' },
                { v: countdown.seconds, label: 'Секунд' },
              ].map(({ v, label }) => (
                <div key={label} className="glass rounded-2xl py-5 px-2 flex flex-col items-center">
                  <motion.span
                    key={v}
                    initial={{ scale: 1.3, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="text-3xl md:text-5xl font-bold text-white tabular-nums"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {String(v).padStart(2, '0')}
                  </motion.span>
                  <span className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest mt-2">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm">Иркутское время (UTC+8)</p>
          </div>
        </div>
      </section>

      {/* Служения */}
      <section id="ministries" className="py-24 md:py-32 bg-primary overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(38 92% 50%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(220 55% 40%) 0%, transparent 40%)"
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-on-scroll animate-fade-up">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Вместе с Богом</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Наши служения
            </h2>
            <div className="w-16 h-0.5 bg-accent mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {ministriesList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 hover:bg-white/10 hover:border-accent/30 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-5 group-hover:bg-accent/30 transition-colors">
                      <Icon name={item.icon} className="text-accent" size={22} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Галерея */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll animate-fade-up">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Наша жизнь</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Фотогалерея
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                style={{ aspectRatio: idx === 0 ? '1/1' : '1/1' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveGallery(idx)}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ minHeight: idx === 0 ? '320px' : '160px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Expand" size={14} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {activeGallery !== null && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGallery(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={galleryImages[activeGallery].src}
                alt={galleryImages[activeGallery].caption}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-white font-medium text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {galleryImages[activeGallery].caption}
                </p>
              </div>
              <button
                onClick={() => setActiveGallery(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <Icon name="X" size={18} className="text-white" />
              </button>
              <button
                onClick={() => setActiveGallery(p => p! > 0 ? p! - 1 : galleryImages.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <Icon name="ChevronLeft" size={20} className="text-white" />
              </button>
              <button
                onClick={() => setActiveGallery(p => p! < galleryImages.length - 1 ? p! + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <Icon name="ChevronRight" size={20} className="text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Проповеди */}
      <section id="sermons" className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll animate-fade-up">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Слово Божье</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Проповеди
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <Card className="border border-border/40 shadow-xl shadow-primary/8 rounded-3xl overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-56 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-10">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <Icon name="PlayCircle" className="text-accent" size={40} />
                          </div>
                        </motion.div>
                      </div>
                      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                        <p className="text-accent text-xs tracking-[0.2em] uppercase font-medium mb-3">11 января 2026</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Сила Божьей Благодати
                        </h3>
                        <p className="text-muted-foreground mb-2 font-medium text-sm">Пастор Алексей Нарутдинов</p>
                        <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                          Благодать — это подарок Бога, который невозможно купить или заработать. Узнайте, как принять этот дар и как он меняет жизнь.
                        </p>
                        <a href="https://rutube.ru/video/67904ab1f57a236744674e492b534fea/" target="_blank" rel="noopener noreferrer">
                          <Button className="w-fit rounded-xl shadow-md shadow-primary/20">
                            <Icon name="Play" className="mr-2" size={16} />
                            Смотреть на RuTube
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="mt-10 text-center">
              <a href="https://rutube.ru/channel/41528628/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-xl border-primary/20 hover:border-primary/40">
                  <Icon name="Video" className="mr-2" size={16} />
                  Все проповеди на RuTube
                  <Icon name="ExternalLink" className="ml-2" size={14} />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Молитва дня */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-on-scroll animate-fade-up">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Обратитесь к Богу</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Молитва дня
              </h2>
              <div className="section-divider" />
            </div>

            {/* Цитата-молитва */}
            <motion.div
              className="relative rounded-3xl overflow-hidden mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-primary p-8 md:p-12 text-center relative">
                <div className="absolute top-6 left-8 text-accent/20 text-8xl font-serif leading-none select-none">"</div>
                <div className="absolute bottom-2 right-8 text-accent/20 text-8xl font-serif leading-none select-none">"</div>
                <p className="text-white text-xl md:text-2xl leading-relaxed relative z-10" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Господи, благодарю Тебя за этот день. Укрепи мою веру, наполни моё сердце миром и любовью. Помоги мне быть светом для окружающих и хранить упование на Тебя во всех обстоятельствах.
                </p>
                <p className="text-accent mt-6 text-sm font-medium tracking-widest uppercase relative z-10">Аминь</p>
              </div>
            </motion.div>

            {/* Форма личной молитвы */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border border-border/40 shadow-xl shadow-primary/8 rounded-3xl">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Поделитесь своей молитвенной нуждой
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Напишите свою просьбу — наша церковь помолится за вас
                  </p>
                  <AnimatePresence mode="wait">
                    {!prayerSent ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <textarea
                          value={prayerText}
                          onChange={e => setPrayerText(e.target.value)}
                          placeholder="Господи, прошу о помощи в..."
                          rows={4}
                          className="w-full px-5 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none text-sm mb-4"
                          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem' }}
                        />
                        <Button
                          className="w-full py-6 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                          onClick={() => { if (prayerText.trim()) setPrayerSent(true); }}
                          disabled={!prayerText.trim()}
                        >
                          <Icon name="Send" className="mr-2" size={16} />
                          Отправить молитвенную нужду
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="thanks"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <motion.div
                          className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: 2 }}
                        >
                          <Icon name="Heart" size={36} className="text-accent" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Мы помолимся за вас
                        </h4>
                        <p className="text-muted-foreground text-sm mb-6">
                          Ваша молитвенная нужда принята. Бог слышит каждое сердце.
                        </p>
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => { setPrayerSent(false); setPrayerText(''); }}
                        >
                          Написать ещё
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Звёздная секция — Стена веры */}
      <section className="relative overflow-hidden bg-[#060a14]" style={{ minHeight: "600px" }}>
        <StarCanvas />
        {/* Градиент сверху */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#060a14] to-transparent z-10 pointer-events-none" />
        {/* Градиент снизу */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#060a14] to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-28 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="pointer-events-none select-none"
          >
            <p className="text-accent text-xs tracking-[0.35em] uppercase font-semibold mb-5">
              ✦ Небо говорит ✦
            </p>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "Playfair Display, serif", textShadow: "0 0 60px rgba(255,210,100,0.15)" }}
            >
              «Небеса проповедуют<br />
              <span className="italic" style={{ color: "hsl(38 92% 60%)" }}>славу Божию»</span>
            </h2>
            <p className="text-white/30 text-sm tracking-[0.4em] mb-10 uppercase">Псалом 18:2</p>
            <p className="text-white/55 max-w-md mx-auto leading-relaxed" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>
              Касайтесь звёздного неба — и оно откликнется,<br className="hidden md:inline" />
              как Бог откликается на каждое сердце
            </p>
          </motion.div>

          {/* Подсказки */}
          <motion.div
            className="flex items-center gap-6 mt-12 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <span className="hidden md:inline">🖱</span>
              <span className="md:hidden">👆</span>
              <span className="hidden md:inline">Двигайте мышью</span>
              <span className="md:hidden">Касайтесь экрана</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <span>✨</span>
              <span>Нажмите — взрыв звёзд</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Тест — Узнай своё служение */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-accent/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-14 animate-on-scroll animate-fade-up">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">
              Интерактив
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-primary mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Узнай своё служение
            </h2>
            <div className="section-divider" />
            <p className="text-muted-foreground mt-6 max-w-md mx-auto text-sm">
              4 простых вопроса — и ты узнаешь, в каком служении раскроется твой дар
            </p>
          </div>
          <MinistryQuiz />
        </div>
      </section>

      {/* Контакты */}
      <section id="contacts" className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll animate-fade-up">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">Мы рядом</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Контакты
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-10">
            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border border-border/40 shadow-xl shadow-primary/8 rounded-3xl">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-primary mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Где нас найти
                  </h3>
                  <div className="space-y-6">
                    {[
                      { icon: 'MapPin', label: 'Адрес', value: 'г. Иркутск, ул. Павла Красильникова 109', href: null },
                      { icon: 'Phone', label: 'Телефон', value: '+7 (904) 130-40-51', href: 'tel:+79041304051' },
                      { icon: 'Mail', label: 'Email', value: 'cerkv_irkutsk@mail.ru', href: 'mailto:cerkv_irkutsk@mail.ru' },
                    ].map((contact, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                        {contact.href ? (
                          <a href={contact.href} className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 transition-colors">
                              <Icon name={contact.icon} className="text-primary group-hover:text-accent transition-colors" size={18} />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">{contact.label}</p>
                              <p className="text-foreground font-medium text-sm group-hover:text-primary transition-colors">{contact.value}</p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                              <Icon name={contact.icon} className="text-primary" size={18} />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">{contact.label}</p>
                              <p className="text-foreground font-medium text-sm">{contact.value}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4">Социальные сети</p>
                      <div className="flex gap-3">
                        <a href="https://vk.com/cerkv_irkutsk?from=groups" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-white transition-all text-sm font-medium text-foreground group">
                          <Icon name="Users" size={16} className="group-hover:text-white" />
                          ВКонтакте
                        </a>
                        <a href="https://rutube.ru/channel/41528628/" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-white transition-all text-sm font-medium text-foreground group">
                          <Icon name="Video" size={16} className="group-hover:text-white" />
                          RuTube
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Форма */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border border-border/40 shadow-xl shadow-primary/8 rounded-3xl">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Написать нам
                  </h3>
                  <p className="text-muted-foreground text-sm mb-8">Мы ответим в ближайшее время</p>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      className="w-full px-5 py-3.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Ваш email"
                      className="w-full px-5 py-3.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                    />
                    <textarea
                      placeholder="Ваше сообщение"
                      rows={5}
                      className="w-full px-5 py-3.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none text-sm"
                    />
                    <Button className="w-full py-6 rounded-xl text-base font-semibold shadow-lg shadow-primary/20">
                      <Icon name="Send" className="mr-2" size={16} />
                      Отправить сообщение
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Карта */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border border-border/40 shadow-xl shadow-primary/8 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A52.28785247802825%2C%22lon%22%3A104.29652214050294%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22irkutsk%22%7D%2C%22org%22%3A%2270000001098974642%22%7D"
                  width="100%"
                  height="450"
                  style={{ border: 0, display: 'block' }}
                  title="Карта 2ГИС"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <img src="https://cdn.poehali.dev/files/фон 72.PNG" alt="" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Церковь Бога Моего</p>
                  <p className="text-white/50 text-xs tracking-widest uppercase">Иркутск</p>
                </div>
              </div>
              <p className="text-white/50 text-sm max-w-xs">
                Место, где каждый может встретиться с живым Богом
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-white/40 text-sm mb-2">Павла Красильникова 109, Иркутск</p>
              <a href="tel:+79041304051" className="text-white/70 hover:text-accent transition-colors text-sm">+7 (904) 130-40-51</a>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© 2026 Церковь Бога Моего. Все права защищены.</p>
            <div className="flex gap-4">
              <a href="https://vk.com/cerkv_irkutsk?from=groups" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-accent transition-colors text-xs">ВКонтакте</a>
              <a href="https://rutube.ru/channel/41528628/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-accent transition-colors text-xs">RuTube</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Кнопка наверх */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Icon name="ArrowUp" size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Диалоги */}
      <Dialog open={showSundayDialog} onOpenChange={setShowSundayDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Воскресное богослужение
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-base space-y-4 pt-4">
                {new Date() < new Date('2026-06-14') && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
                    <span className="text-amber-500 text-xl">⏰</span>
                    <div>
                      <p className="font-semibold text-amber-800">Внимание! Изменение времени</p>
                      <p className="text-amber-700 text-sm mt-1">С этого воскресенья служение начинается в <strong>11:00</strong> (ранее было в 13:00). Приходите раньше!</p>
                    </div>
                  </div>
                )}
                <p>Воскресное богослужение — это особое собрание христиан, которое проходит в церкви по воскресеньям. В этот день верующие приходят вместе, чтобы поклоняться Богу, благодарить Его и укрепляться в вере.</p>
                <p>Во время богослужения звучит христианская музыка и песни прославления. Музыка помогает людям почувствовать Божье присутствие, выразить радость и благодарность, а также настроиться на молитву.</p>
                <p>Важной частью служения является общение. Люди приветствуют друг друга, делятся поддержкой, знакомятся и помогают тем, кто нуждается. Это создаёт атмосферу дружбы, любви и единства.</p>
                <p>Также на богослужении звучит проповедь. Пастор или служитель объясняет Библию, рассказывает, как применять Божье слово в повседневной жизни, и вдохновляет людей жить по христианским ценностям.</p>
                <p>Воскресное богослужение помогает верующим становиться духовно сильнее, находить мир в сердце и чувствовать себя частью большой христианской семьи.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showWorshipDialog} onOpenChange={setShowWorshipDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>Поклонение Богу</DialogTitle>
            <DialogDescription asChild>
              <div className="text-base space-y-4 pt-4">
                <p>Поклонение Богу — это время, когда верующие собираются вместе, чтобы выразить свою любовь, благодарность и преклонение перед Господом через молитву и песни.</p>
                <p>Начало недели с поклонения помогает настроить сердце на Божье присутствие, получить силу и мудрость для предстоящих дней.</p>
                <p>В атмосфере искреннего прославления люди испытывают духовное обновление, находят покой и укрепление в вере.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showBibleDialog} onOpenChange={setShowBibleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>Изучение Библии</DialogTitle>
            <DialogDescription asChild>
              <div className="text-base space-y-4 pt-4">
                <p>Изучение Библии в малых группах — это возможность глубже понять Священное Писание, обсудить его значение и применение в повседневной жизни.</p>
                <p>В небольших группах создаётся доверительная атмосфера, где каждый может задать вопросы, поделиться своими размышлениями и получить поддержку.</p>
                <p>Регулярное изучение Библии помогает верующим расти духовно, укрепляет веру и даёт практические ответы на жизненные вопросы.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrayerDialog} onOpenChange={setShowPrayerDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>Молитвенное собрание</DialogTitle>
            <DialogDescription asChild>
              <div className="text-base space-y-4 pt-4">
                <p>Молитвенное собрание — это особое время, когда верующие объединяются в совместной молитве, обращаясь к Богу с благодарностью, просьбами и ходатайством.</p>
                <p>Вечернее молитвенное служение создаёт пространство для глубокого общения с Богом, где люди могут излить своё сердце и получить утешение.</p>
                <p>Совместная молитва укрепляет единство церкви, помогает нести бремена друг друга и свидетельствует о силе веры.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showSistersDialog} onOpenChange={setShowSistersDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>Сестринский разговор</DialogTitle>
            <DialogDescription asChild>
              <div className="text-base space-y-4 pt-4">
                <p>Сестринский разговор — это встреча женщин церкви для общения, молитвы и взаимной поддержки в атмосфере доверия и любви.</p>
                <p>На этих встречах сёстры делятся своим опытом, обсуждают духовные вопросы, учатся друг у друга и растут в вере вместе.</p>
                <p>Это время помогает женщинам найти понимание, получить мудрый совет и почувствовать себя частью любящей христианской семьи.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showBrothersDialog} onOpenChange={setShowBrothersDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>Братский разговор</DialogTitle>
            <DialogDescription asChild>
              <div className="text-base space-y-4 pt-4">
                <p>Братский разговор — это встреча мужчин церкви для общения, молитвы и взаимной поддержки, где братья укрепляют друг друга в вере.</p>
                <p>На этих встречах мужчины обсуждают духовные вопросы, делятся жизненным опытом, учатся библейским принципам лидерства и служения.</p>
                <p>Братское общение помогает мужчинам становиться более зрелыми в вере, развивать характер и быть примером для своих семей и церкви.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;