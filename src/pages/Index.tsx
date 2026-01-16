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

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [showSundayDialog, setShowSundayDialog] = useState(false);
  const [showWorshipDialog, setShowWorshipDialog] = useState(false);
  const [showBibleDialog, setShowBibleDialog] = useState(false);
  const [showPrayerDialog, setShowPrayerDialog] = useState(false);
  const [showSistersDialog, setShowSistersDialog] = useState(false);
  const [showBrothersDialog, setShowBrothersDialog] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
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
            onClick={() => setActiveSection("home")}
          >
            <Icon name="Menu" size={24} />
          </Button>
        </div>
      </nav>

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/files/фон 56.JPEG')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
          <div className="mb-6 inline-block">
            <img 
              src="https://cdn.poehali.dev/files/фон 72.PNG" 
              alt="Церковь Бога Моего" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Церковь Бога Моего
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-4 max-w-2xl mx-auto font-light">
            «Возложи на Господа заботы твои, и Он поддержит тебя»
          </p>
          <p className="text-lg text-white/90 mb-8">Псалом 54:23</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-white">
              <Icon name="MapPin" size={20} />
              <span className="font-semibold text-lg">Павла Красильникова 109</span>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-foreground font-semibold text-lg px-8 py-6 shadow-xl"
            onClick={() => scrollToSection("schedule")}
          >
            <Icon name="Calendar" className="mr-2" size={20} />
            Посетить служение
          </Button>
          <div className="mt-16">
            <button
              onClick={() => scrollToSection("about")}
              className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all animate-bounce"
            >
              <Icon name="ChevronDown" size={32} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary animate-on-scroll animate-fade-up">
            О нашей церкви
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow animate-on-scroll animate-fade-left">
              <CardContent className="p-8">
                <div className="mb-4">
                  <Icon name="Heart" className="text-primary" size={40} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary">Наша миссия</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Мы стремимся быть светом в этом мире, распространяя любовь Божью и помогая
                  людям найти истинный путь к спасению через Иисуса Христа. Наша церковь — это
                  место, где каждый может встретиться с живым Богом.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow animate-on-scroll animate-fade-right delay-200">
              <CardContent className="p-8">
                <div className="mb-4">
                  <Icon name="Users" className="text-primary" size={40} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary">Наше сообщество</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Мы — семья верующих людей разных возрастов и культур, объединённых одной верой.
                  В нашей церкви вы найдёте тёплую атмосферу принятия, поддержки и духовного роста
                  в присутствии Господа.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="schedule"
        className="py-20 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://cdn.poehali.dev/projects/3f2eba44-cb9b-45d8-9905-8690c25d20d6/files/f916dc69-76a7-4102-b24c-969c6df2d668.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary animate-on-scroll animate-fade-up">
            Расписание богослужений
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <Card className="shadow-lg animate-on-scroll animate-scale delay-100 border-2 border-primary cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setShowSundayDialog(true)}>
              <CardContent className="p-8 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Sun" className="text-primary" size={28} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold mb-2 text-primary">Воскресное служение</h3>
                  <p className="text-lg text-muted-foreground mb-2">Воскресенье, 13:00</p>
                  <p className="text-muted-foreground mb-3">
                    Основное воскресное богослужение с проповедью, прославлением и общением
                  </p>
                  <Button variant="outline" size="sm" className="text-primary">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg animate-on-scroll animate-scale delay-200 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setShowWorshipDialog(true)}>
              <CardContent className="p-8 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Music" className="text-primary" size={28} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold mb-2 text-primary">Поклонение Богу</h3>
                  <p className="text-lg text-muted-foreground mb-2">Понедельник, 08:00</p>
                  <p className="text-muted-foreground mb-3">
                    Начинаем неделю с поклонения к Богу
                  </p>
                  <Button variant="outline" size="sm" className="text-primary">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg animate-on-scroll animate-scale delay-300 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setShowBibleDialog(true)}>
              <CardContent className="p-8 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="BookOpen" className="text-primary" size={28} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold mb-2 text-primary">Изучение Библии</h3>
                  <p className="text-lg text-muted-foreground mb-2">Вторник, 08:00 </p>
                  <p className="text-muted-foreground mb-3">
                    Глубокое изучение Священного Писания в малых группах
                  </p>
                  <Button variant="outline" size="sm" className="text-primary">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg animate-on-scroll animate-scale delay-400 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setShowPrayerDialog(true)}>
              <CardContent className="p-8 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Moon" className="text-primary" size={28} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold mb-2 text-primary">Молитвенное собрание</h3>
                  <p className="text-lg text-muted-foreground mb-2">Среда, 19:00 </p>
                  <p className="text-muted-foreground mb-3">
                    Вечернее молитвенное служение для углубления веры и общения с Богом
                  </p>
                  <Button variant="outline" size="sm" className="text-primary">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg animate-on-scroll animate-scale delay-500 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setShowSistersDialog(true)}>
              <CardContent className="p-8 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Users" className="text-primary" size={28} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold mb-2 text-primary">Сестринский разговор</h3>
                  <p className="text-lg text-muted-foreground mb-2">Четверг, 19:00</p>
                  <p className="text-muted-foreground mb-3">
                    Встреча сестер церкви для общения, молитвы и взаимной поддержки
                  </p>
                  <Button variant="outline" size="sm" className="text-primary">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg animate-on-scroll animate-scale delay-100 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setShowBrothersDialog(true)}>
              <CardContent className="p-8 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Users" className="text-primary" size={28} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold mb-2 text-primary">Братский разговор</h3>
                  <p className="text-lg text-muted-foreground mb-2">Пятница, 19:00</p>
                  <p className="text-muted-foreground mb-3">
                    Встреча братьев церкви для общения, молитвы и взаимной поддержки
                  </p>
                  <Button variant="outline" size="sm" className="text-primary">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="ministries" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary animate-on-scroll animate-fade-up">Наши служения</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll animate-fade-up delay-100">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Music" className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Прославление</h3>
                <p className="text-muted-foreground">
                  Музыкальное служение, воспевающее славу Богу через современные и традиционные гимны
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll animate-fade-up delay-200">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Baby" className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Детское служение</h3>
                <p className="text-muted-foreground">
                  Воскресная школа для детей с библейскими уроками, играми и творчеством
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll animate-fade-up delay-300">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Sparkles" className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Молодёжное служение</h3>
                <p className="text-muted-foreground">
                  Встречи молодёжи для общения, духовного роста и совместного служения
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="HandHeart" className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Милосердие</h3>
                <p className="text-muted-foreground">
                  Помощь нуждающимся, социальное служение и благотворительность
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Users2" className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Малые группы</h3>
                <p className="text-muted-foreground">
                  Домашние группы для близкого общения, изучения Библии и взаимной поддержки
                </p>
              </CardContent>
            </Card>
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
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="PlayCircle" className="text-primary" size={28} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold mb-2 text-primary">Вера, движущая горами</h3>
                    <p className="text-muted-foreground mb-3">Пастор Алексей Нарутдинов • 14 января 2026</p>
                    <p className="text-muted-foreground mb-4">
                      Исследование силы веры и её влияния на нашу повседневную жизнь
                    </p>
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
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="PlayCircle" className="text-primary" size={28} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold mb-2 text-primary">Любовь как основа</h3>
                    <p className="text-muted-foreground mb-3">Пастор Алексей Нарутдинов • 7 января 2026</p>
                    <p className="text-muted-foreground">
                      Размышления о любви Божьей и как мы можем проявлять её в отношениях
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="PlayCircle" className="text-primary" size={28} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold mb-2 text-primary">Обновление через Духа</h3>
                    <p className="text-muted-foreground mb-3">Пастор Алексей Нарутдинов • 31 декабря 2025</p>
                    <p className="text-muted-foreground">
                      Как Святой Дух обновляет нашу жизнь и даёт силу для преодоления трудностей
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <p className="text-muted-foreground">Павла Красильникова 109</p>
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
                      <p className="text-muted-foreground">info@church-god.ru</p>
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
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Icon name="Facebook" size={24} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Icon name="Instagram" size={24} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Icon name="Youtube" size={24} />
            </a>
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
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all z-50 animate-fade-in"
          aria-label="Наверх"
        >
          <Icon name="ArrowUp" size={24} />
        </button>
      )}
    </div>
  );
};

export default Index;