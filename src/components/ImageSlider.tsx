import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    url: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=1920",
    alt: "Digital signature concept"
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920",
    alt: "Digital security"
  },
  {
    url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1920",
    alt: "Document signing"
  }
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export default function ImageSlider() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const imageIndex = Math.abs(page % images.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setTimeout(() => {
        paginate(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [page, isAutoPlaying]);

  return (
    <div 
      className="relative h-[600px] overflow-hidden bg-transparent"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          {/* Background image with blur effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
            style={{ backgroundImage: `url(${images[imageIndex].url})` }}
          />
          
          {/* Main image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.img
              src={images[imageIndex].url}
              alt={images[imageIndex].alt}
              className="max-h-full w-auto rounded-2xl shadow-2xl"
              style={{ maxWidth: '90%', objectFit: 'contain' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute inset-x-0 top-1/2 flex items-center justify-between px-4 -translate-y-1/2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
        {images.map((_, index) => (
          <motion.button
            key={index}
            initial={false}
            animate={{
              scale: index === imageIndex ? 1.2 : 1,
              backgroundColor: index === imageIndex ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.5)'
            }}
            whileHover={{ scale: 1.2 }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 backdrop-blur-sm`}
            onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
          />
        ))}
      </div>
    </div>
  );
}