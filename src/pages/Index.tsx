import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const services = [
    { day: 0, name: 'Воскресное служение', time: 'Воскресенье, 13:00', icon: 'Sun', dialog: () => setShowSundayDialog(true) },
    { day: 1, name: 'Поклонение Богу', time: 'Понедельник, 08:00', icon: 'Music', dialog: () => setShowWorshipDialog(true) },
    { day: 2, name: 'Изучение Библии', time: 'Вторник, 08:00', icon: 'BookOpen', dialog: () => setShowBibleDialog(true) },
    { day: 3, name: 'Молитвенное собрание', time: 'Среда, 19:00', icon: 'Moon', dialog: () => setShowPrayerDialog(true) },
    { day: 4, name: 'Сестринский разговор', time: 'Четверг, 19:00', icon: 'Users', dialog: () => setShowSistersDialog(true) },
    { day: 5, name: 'Братский разговор', time: 'Пятница, 19:00', icon: 'Users', dialog: () => setShowBrothersDialog(true) },
  ];

  const getNextServiceIndex = () => {
    const today = new Date().getDay();
    let nextIndex = services.findIndex(service => service.day > today);
    if (nextIndex === -1) {
      nextIndex = 0;
    }
    return nextIndex;
  };

  const biblicalVerses = [
    {
      text: "«Возложи на Господа заботы твои, и Он поддержит тебя»",
      reference: "Псалом 54:23"
    },
    {
      text: "«Ибо все возможно верующему»",
      reference: "Марк 9:23"
    },
    {
      text: "«Господь — Пастырь мой; я ни в чем не буду нуждаться»",
      reference: "Псалом 22:1"
    },
    {
      text: "«Бог есть любовь, и пребывающий в любви пребывает в Боге»",
      reference: "1 Иоанна 4:16"
    },
    {
      text: "«Все могу в укрепляющем меня Иисусе Христе»",
      reference: "Филиппийцам 4:13"
    }
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const updateIrkutskTime = () => {
      const now = new Date();
      const irkutskTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Irkutsk' }));
      setCurrentDay(irkutskTime.getDay());
    };

    updateIrkutskTime();
    
    const interval = setInterval(updateIrkutskTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const verseInterval = setInterval(() => {
      setCurrentVerseIndex((prevIndex) => 
        (prevIndex + 1) % biblicalVerses.length
      );
    }, 5000);

    return () => clearInterval(verseInterval);
  }, [biblicalVerses.length]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 transition-all duration-300 mt-1">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/фон 65.jpg" 
              alt="Церковь Бога Моего" 
              className="h-14 w-14 object-contain rounded-lg shadow-md"
            />
            <span className="text-xl font-semibold text-primary">Церковь Бога Моего</span>
          </div>
          <div className="hidden md:flex gap-6">
            {["home", "about", "schedule", "ministries", "sermons", "contacts"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === section ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {section === "home" && "Главная"}
                {section === "about" && "О церкви"}
                {section === "schedule" && "Расписание"}
                {section === "ministries" && "Служения"}
                {section === "sermons" && "Проповеди"}
                {section === "contacts" && "Контакты"}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </Button>
        </div>
        
        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {["home", "about", "schedule", "ministries", "sermons", "contacts"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-left text-base font-medium transition-colors hover:text-primary py-2 ${
                    activeSection === section ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {section === "home" && "Главная"}
                  {section === "about" && "О церкви"}
                  {section === "schedule" && "Расписание"}
                  {section === "ministries" && "Служения"}
                  {section === "sermons" && "Проповеди"}
                  {section === "contacts" && "Контакты"}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/files/фон 56.JPEG')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: y,
          }}
        />
        <motion.div 
          className="container mx-auto px-4 z-10 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ opacity }}
          <motion.div 
            className="mb-6 inline-block"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              y: [0, -10, 0]
            }}
            transition={{ 
              scale: { type: "spring", duration: 1.5, delay: 0.2 },
              rotate: { type: "spring", duration: 1.5, delay: 0.2 },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }}
          >
            <img 
              src="https://cdn.poehali.dev/files/фон 72.PNG" 
              alt="Церковь Бога Моего" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto drop-shadow-2xl"
            />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Церковь Бога Моего
          </motion.h1>
          <div className="relative h-40 md:h-32 overflow-hidden max-w-3xl mx-auto px-4">
            {biblicalVerses.map((verse, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentVerseIndex
                    ? 'opacity-100 translate-y-0'
                    : index < currentVerseIndex
                    ? 'opacity-0 -translate-y-full'
                    : 'opacity-0 translate-y-full'
                }`}
              >
                <p className="text-lg md:text-2xl text-white/95 mb-4 font-light px-2">
                  {verse.text}
                </p>
                <p className="text-base md:text-lg text-white/90">{verse.reference}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 px-4">
            <div className="flex items-center gap-2 text-white text-center">
              <Icon name="MapPin" size={20} />
              <span className="font-semibold text-base md:text-lg">Иркутск / Павла Красильникова 109</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-foreground font-semibold text-lg px-8 py-6 shadow-xl"
              onClick={() => scrollToSection("schedule")}
            >
              <Icon name="Calendar" className="mr-2" size={20} />
              Посетить служение
            </Button>
          </motion.div>
          <div className="mt-16">
            <button
              onClick={() => scrollToSection("about")}
              className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all animate-bounce"
            >
              <Icon name="ChevronDown" size={32} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      </section>

      <section id="about" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary animate-on-scroll animate-fade-up">
            О нашей церкви
          </h2>
          
          {/* Пастор церкви */}
          <motion.div 
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-primary/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <img 
                      src="https://cdn.poehali.dev/files/фон 32.jpg" 
                      alt="Алексей Нарутдинов" 
                      className="w-48 h-auto md:w-64 md:h-auto object-contain rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon name="Church" className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary">Алексей Нарутдинов</h3>
                        <p className="text-lg text-foreground font-semibold">Пастор церкви</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      Служитель Божий, посвятивший свою жизнь проповеди Евангелия и духовному
                      наставлению общины. С любовью и мудростью ведет церковь по пути веры и служения.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)" }} transition={{ duration: 0.3 }}>
                <Card className="border-primary/20 shadow-lg h-full">
              <CardContent className="p-6 md:p-8">
                <div className="mb-4">
                  <Icon name="Heart" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-primary">Наша миссия</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Мы стремимся быть светом в этом мире, распространяя любовь Божью и помогая
                  людям найти истинный путь к спасению через Иисуса Христа. Наша церковь — это
                  место, где каждый может встретиться с живым Богом.
                </p>
              </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)" }} transition={{ duration: 0.3 }}>
                <Card className="border-primary/20 shadow-lg h-full">
              <CardContent className="p-6 md:p-8">
                <div className="mb-4">
                  <Icon name="Users" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-primary">Наше сообщество</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Мы — семья верующих людей разных возрастов и культур, объединённых одной верой.
                  В нашей церкви вы найдёте тёплую атмосферу принятия, поддержки и духовного роста
                  в присутствии Господа.
                </p>
              </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)" }} transition={{ duration: 0.3 }}>
                <Card className="border-primary/20 shadow-lg h-full">
              <CardContent className="p-6 md:p-8">
                <div className="mb-4">
                  <Icon name="HandHeart" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-primary">Центр социальной помощи</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                  Если вы находитесь в сложной жизненной ситуации, нет где жить, нужна работа — мы поможем.
                </p>
                <a href="tel:+79041269873" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm md:text-base">
                  <Icon name="Phone" size={18} />
                  8 (904) 126-98-73
                </a>
              </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="schedule"
        className="py-12 md:py-20 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://cdn.poehali.dev/projects/3f2eba44-cb9b-45d8-9905-8690c25d20d6/files/f916dc69-76a7-4102-b24c-969c6df2d668.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary animate-on-scroll animate-fade-up">
            Расписание богослужений
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            {services.map((service, index) => {
              const nextServiceIndex = getNextServiceIndex();
              const isNext = index === nextServiceIndex;
              const isToday = service.day === currentDay;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                  className={`shadow-lg cursor-pointer transition-all ${
                    isToday ? 'border-2 border-accent bg-accent/10 ring-2 ring-accent/50' : ''
                  } ${
                    isNext && !isToday ? 'border-2 border-primary bg-primary/5' : ''
                  }`}
                  onClick={service.dialog}
                >
                  <CardContent className="p-4 md:p-8 flex items-start gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-accent text-white' : isNext ? 'bg-primary text-white' : 'bg-primary/10'
                      }`}>
                        <Icon name={service.icon as any} className={isToday || isNext ? 'text-white' : 'text-primary'} size={24} />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-xl md:text-2xl font-semibold text-primary">{service.name}</h3>
                        {isToday && (
                          <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full animate-pulse">
                            Сегодня
                          </span>
                        )}
                        {isNext && !isToday && (
                          <span className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                            Следующее
                          </span>
                        )}
                      </div>
                      <p className="text-base md:text-lg text-muted-foreground mb-2">{service.time}</p>
                      <Button variant="outline" size="sm" className="text-primary mt-2">
                        Подробнее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ministries" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary animate-on-scroll animate-fade-up">Наши служения</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: 'Music', title: 'Прославление', desc: 'Музыкальное служение, воспевающее славу Богу через современные и традиционные гимны', delay: 0 },
              { icon: 'Baby', title: 'Детское служение', desc: 'Воскресная школа для детей с библейскими уроками, играми и творчеством', delay: 0.1 },
              { icon: 'Sparkles', title: 'Молодёжное служение', desc: 'Встречи молодёжи для общения, духовного роста и совместного служения', delay: 0.2 },
              { icon: 'HandHeart', title: 'Милосердие', desc: 'Помощь нуждающимся, социальное служение и благотворительность', delay: 0.3 },
              { icon: 'Users2', title: 'Малые группы', desc: 'Домашние группы для близкого общения, изучения Библии и взаимной поддержки', delay: 0.4 },
              { icon: 'Heart', title: 'Семейное служение', desc: 'Поддержка семей, консультирование и совместные мероприятия для укрепления отношений', delay: 0.5 },
            ].map((ministry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ministry.delay }}
              >
                <motion.div
                  whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-primary/20 shadow-lg h-full">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className="mb-4 flex justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon name={ministry.icon as any} className="text-primary" size={32} />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-3 text-primary">{ministry.title}</h3>
                      <p className="text-muted-foreground">
                        {ministry.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Globe" className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Миссионерство</h3>
                <p className="text-muted-foreground">
                  Распространение Евангелия и поддержка миссионерской деятельности
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="sermons"
        className="py-20 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('https://cdn.poehali.dev/projects/3f2eba44-cb9b-45d8-9905-8690c25d20d6/files/97d663b3-d65b-4555-9e8d-b0440c16c7ab.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Проповеди</h2>
          <div className="max-w-4xl mx-auto grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="PlayCircle" className="text-primary" size={28} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold mb-2 text-primary">Сила Божье Благодати</h3>
                    <p className="text-muted-foreground mb-3">Пастор Алексей Нарутдинов • 11 января 2026</p>
                    <p className="text-muted-foreground mb-4">Благодать — это подарок Бога, который невозможно купить или заработать.</p>
                    <a 
                      href="https://rutube.ru/video/67904ab1f57a236744674e492b534fea/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="default" size="sm">
                        <Icon name="PlayCircle" className="mr-2" size={16} />
                        Смотреть
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Контакты</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Где нас найти</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon name="MapPin" className="text-primary mt-1" size={20} />
                    <div>
                      <p className="font-medium">Адрес</p>
                      <p className="text-muted-foreground">г.Иркутск / Павла Красильникова 109</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Phone" className="text-primary mt-1" size={20} />
                    <div>
                      <p className="font-medium">Телефон</p>
                      <p className="text-muted-foreground">+7 (904) 130-40-51</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Mail" className="text-primary mt-1" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">cerkv_irkutsk@mail.ru</p>
                    </div>
                  </div>
                  <a 
                    href="https://vk.com/cerkv_irkutsk?from=groups" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                  >
                    <Icon name="Users" className="text-primary mt-1" size={20} />
                    <div>
                      <p className="font-medium">ВКонтакте</p>
                      <p className="text-muted-foreground">Наша группа</p>
                    </div>
                  </a>
                  <a 
                    href="https://rutube.ru/channel/41528628/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                  >
                    <Icon name="Video" className="text-primary mt-1" size={20} />
                    <div>
                      <p className="font-medium">RuTube</p>
                      <p className="text-muted-foreground">Наш канал</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Написать нам</h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      className="w-full px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Ваш email"
                      className="w-full px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Ваше сообщение"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button className="w-full" size="lg">
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-5xl mx-auto mt-12">
            <Card className="shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A52.28785247802825%2C%22lon%22%3A104.29652214050294%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22irkutsk%22%7D%2C%22org%22%3A%2270000001098974642%22%7D"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  title="Карта 2ГИС"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="inline-block mb-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <img 
                src="https://cdn.poehali.dev/files/фон 72.PNG" 
                alt="Церковь Бога Моего" 
                className="w-20 h-20 object-contain mx-auto"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Церковь Бога Моего</h3>
            <p className="text-white/80">Павла Красильникова 109</p>
          </div>

          <p className="text-white/60 text-sm">
            © 2026 Церковь Бога Моего. Все права защищены.
          </p>
        </div>
      </footer>

      <Dialog open={showSundayDialog} onOpenChange={setShowSundayDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Что такое воскресное христианское богослужение</DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Воскресное богослужение — это особое собрание христиан, которое проходит в церкви по воскресеньям. В этот день верующие приходят вместе, чтобы поклоняться Богу, благодарить Его и укрепляться в вере.
              </p>
              <p>
                Во время богослужения звучит христианская музыка и песни прославления. Музыка помогает людям почувствовать Божье присутствие, выразить радость и благодарность, а также настроиться на молитву.
              </p>
              <p>
                Важной частью служения является общение. Люди приветствуют друг друга, делятся поддержкой, знакомятся и помогают тем, кто нуждается. Это создаёт атмосферу дружбы, любви и единства.
              </p>
              <p>
                Также на богослужении звучит проповедь. Пастор или служитель объясняет Библию, рассказывает, как применять Божье слово в повседневной жизни, и вдохновляет людей жить по христианским ценностям.
              </p>
              <p>
                Воскресное богослужение помогает верующим становиться духовно сильнее, находить мир в сердце и чувствовать себя частью большой христианской семьи.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showWorshipDialog} onOpenChange={setShowWorshipDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Поклонение Богу</DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Поклонение Богу — это время, когда верующие собираются вместе, чтобы выразить свою любовь, благодарность и преклонение перед Господом через молитву и песни.
              </p>
              <p>
                Начало недели с поклонения помогает настроить сердце на Божье присутствие, получить силу и мудрость для предстоящих дней.
              </p>
              <p>
                В атмосфере искреннего прославления люди испытывают духовное обновление, находят покой и укрепление в вере.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showBibleDialog} onOpenChange={setShowBibleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Изучение Библии</DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Изучение Библии в малых группах — это возможность глубже понять Священное Писание, обсудить его значение и применение в повседневной жизни.
              </p>
              <p>
                В небольших группах создаётся доверительная атмосфера, где каждый может задать вопросы, поделиться своими размышлениями и получить поддержку.
              </p>
              <p>
                Регулярное изучение Библии помогает верующим расти духовно, укрепляет веру и даёт практические ответы на жизненные вопросы.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrayerDialog} onOpenChange={setShowPrayerDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Молитвенное собрание</DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Молитвенное собрание — это особое время, когда верующие объединяются в совместной молитве, обращаясь к Богу с благодарностью, просьбами и ходатайством.
              </p>
              <p>
                Вечернее молитвенное служение создаёт пространство для глубокого общения с Богом, где люди могут излить своё сердце и получить утешение.
              </p>
              <p>
                Совместная молитва укрепляет единство церкви, помогает нести бремена друг друга и свидетельствует о силе веры.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showSistersDialog} onOpenChange={setShowSistersDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Сестринский разговор</DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Сестринский разговор — это встреча женщин церкви для общения, молитвы и взаимной поддержки в атмосфере доверия и любви.
              </p>
              <p>
                На этих встречах сёстры делятся своим опытом, обсуждают духовные вопросы, учатся друг у друга и растут в вере вместе.
              </p>
              <p>
                Это время помогает женщинам найти понимание, получить мудрый совет и почувствовать себя частью любящей христианской семьи.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showBrothersDialog} onOpenChange={setShowBrothersDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Братский разговор</DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Братский разговор — это встреча мужчин церкви для общения, молитвы и взаимной поддержки, где братья укрепляют друг друга в вере.
              </p>
              <p>
                На этих встречах мужчины обсуждают духовные вопросы, делятся жизненным опытом, учатся библейским принципам лидерства и служения.
              </p>
              <p>
                Братское общение помогает мужчинам становиться более зрелыми в вере, развивать характер и быть примером для своих семей и церкви.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg z-50"
          aria-label="Наверх"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)" }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Icon name="ArrowUp" size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default Index;