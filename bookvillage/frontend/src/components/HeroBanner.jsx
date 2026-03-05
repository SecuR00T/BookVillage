import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    tag: "BEST",
    title: "2025 상반기\n베스트셀러 특별전",
    subtitle: "올해 가장 사랑받은 책들을 만나보세요",
    cta: "베스트셀러 보기",
    to: "/books?category=%EB%B2%A0%EC%8A%A4%ED%8A%B8%EC%85%80%EB%9F%AC",
    gradient: "from-[hsl(24,38%,27%)] via-[hsl(26,34%,32%)] to-[hsl(152,28%,36%)]",
    accent: "📚",
  },
  {
    id: 2,
    tag: "NEW",
    title: "분야별 신간\n최대 30% 할인",
    subtitle: "이번 주 업데이트된 인기 신간 모음",
    cta: "신간 보러가기",
    to: "/books",
    gradient: "from-[hsl(30,44%,30%)] via-[hsl(36,52%,38%)] to-[hsl(44,64%,52%)]",
    accent: "✨",
  },
  {
    id: 3,
    tag: "EVENT",
    title: "학습/자격증\n집중 기획전",
    subtitle: "취업과 시험 대비 도서를 한 번에",
    cta: "기획전 보기",
    to: "/books",
    gradient: "from-[hsl(152,34%,30%)] via-[hsl(160,30%,34%)] to-[hsl(170,28%,38%)]",
    accent: "🎯",
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.98,
  }),
};

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goTo = (index) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="group relative overflow-hidden rounded-[26px]">
      <div className="relative h-[230px] sm:h-[310px] md:h-[360px]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 bg-gradient-to-br ${banners[current].gradient}`}
          >
            <div className="absolute -left-10 -top-14 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute right-[14%] -top-14 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute right-8 bottom-6 h-24 w-24 rounded-full bg-white/10" />

            <div className="relative h-full container mx-auto px-7 sm:px-12 flex items-center justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {banners[current].tag}
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white whitespace-pre-line leading-tight">
                  {banners[current].title}
                </h2>
                <p className="text-sm sm:text-base text-white/80">{banners[current].subtitle}</p>
                <Link
                  to={banners[current].to}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {banners[current].cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="hidden sm:block text-7xl md:text-8xl drop-shadow-lg">{banners[current].accent}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/30"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/30"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "w-9 bg-white" : "w-2.5 bg-white/45 hover:bg-white/65"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
