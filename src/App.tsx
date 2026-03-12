/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Music, 
  Gift, 
  Clock, 
  Info,
  ChevronDown,
  Camera,
  GlassWater,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WEDDING_DATE = new Date('2026-07-11T18:00:00');

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now < WEDDING_DATE) {
        setTimeLeft({
          days: differenceInDays(WEDDING_DATE, now),
          hours: differenceInHours(WEDDING_DATE, now) % 24,
          minutes: differenceInMinutes(WEDDING_DATE, now) % 60,
          seconds: differenceInSeconds(WEDDING_DATE, now) % 60
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    "https://www.invitacionevento.com/primos/fotos/1.png",
    "https://www.invitacionevento.com/primos/fotos/2.png",
    "https://www.invitacionevento.com/primos/fotos/3.png",
    "https://www.invitacionevento.com/primos/fotos/4.png",
    "https://www.invitacionevento.com/primos/fotos/5.png",
    "https://www.invitacionevento.com/primos/fotos/6.png",
    "https://www.invitacionevento.com/primos/fotos/7.png"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] selection:bg-[#e6d5c3] selection:text-[#5a4a3a]">
      <audio id="bg-music" loop src="https://www.invitacionevento.com/primos/musica.mp3" />
      
      {/* Music Toggle Button */}
      <button 
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#8a7a6a] hover:scale-110 transition-transform border border-[#f0ebe6]"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://www.invitacionevento.com/primos/portada.png" 
            alt="Wedding background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <div className="relative z-10 text-center max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm uppercase tracking-[0.3em] mb-6 text-[#8a7a6a] font-medium"
          >
            ¡Nos Casamos!
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="serif text-7xl md:text-9xl mb-8 text-[#4a3a2a] leading-tight"
          >
            Lore <span className="text-3xl md:text-5xl align-middle mx-2">&</span> Leo
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center"
          >
            <div className="h-px w-24 bg-[#c6b5a3] mb-6" />
            <p className="serif text-2xl md:text-3xl text-[#5a4a3a] mb-2 italic">
              11 de Julio de 2026
            </p>
            <p className="text-sm uppercase tracking-widest text-[#8a7a6a]">
              Chaco, Argentina
            </p>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#c6b5a3]"
        >
          <ChevronDown size={32} strokeWidth={1} />
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-24 px-4 bg-white border-y border-[#f5f0eb]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="serif text-4xl mb-12 text-[#4a3a2a]">Faltan tan solo...</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Días', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
              { label: 'Segundos', value: timeLeft.seconds }
            ].map((item, idx) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <span className="serif text-5xl md:text-6xl text-[#8a7a6a] mb-2">{item.value}</span>
                <span className="text-xs uppercase tracking-widest text-[#c6b5a3] font-semibold">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Welcome */}
      <section className="py-32 px-4 max-w-3xl mx-auto text-center">
        <Heart className="mx-auto mb-8 text-[#e6d5c3]" size={40} strokeWidth={1} />
        <h2 className="serif text-4xl md:text-5xl mb-8 text-[#4a3a2a]">Nuestra Historia</h2>
        <p className="serif text-xl md:text-2xl leading-relaxed text-[#5a4a3a] italic">
          "El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección."
        </p>
        <p className="mt-8 text-[#6a5a4a] leading-relaxed max-w-2xl mx-auto">
          Después de tantos años compartidos, risas, viajes y sueños, de haber construido nuestro hogar juntos y ver crecer a nuestros hijos, hemos decidido dar el paso más importante de nuestras vidas. Queremos que seas parte de este nuevo comienzo y que celebremos juntos el amor que nos une.
        </p>
      </section>

      {/* Video Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="serif text-4xl mb-12 text-[#4a3a2a]">Un Recorrido por Nuestro Amor</h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-[#f9f7f5]"
          >
            <video 
              src="https://www.invitacionevento.com/primos/primos.mp4" 
              controls
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-24 px-4 bg-[#f9f7f5]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Ceremony */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-12 rounded-3xl shadow-sm border border-[#f0ebe6] text-center"
          >
            <div className="w-16 h-16 bg-[#fdfcfb] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#f0ebe6]">
              <Calendar className="text-[#8a7a6a]" size={24} />
            </div>
            <h3 className="serif text-3xl mb-4 text-[#4a3a2a]">Ceremonia</h3>
            <p className="text-[#6a5a4a] mb-6 leading-relaxed">
              Ambas ceremonias, Civil y Religiosa, se llevarán a cabo en:
            </p>
            <div className="space-y-1 mb-8">
              <p className="font-medium text-[#4a3a2a] text-lg">Salon Amudoch</p>
              <p className="text-[#8a7a6a]">Ruta 11 km 1001</p>
              <p className="text-[#8a7a6a]">Resistencia - Chaco</p>
            </div>
            <a 
              href="https://maps.app.goo.gl/AM8YLGbAM7johokJ6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#8a7a6a] text-white rounded-full text-sm tracking-widest uppercase hover:bg-[#6a5a4a] transition-colors"
            >
              Cómo llegar
            </a>
          </motion.div>

          {/* Party */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-12 rounded-3xl shadow-sm border border-[#f0ebe6] text-center"
          >
            <div className="w-16 h-16 bg-[#fdfcfb] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#f0ebe6]">
              <Music className="text-[#8a7a6a]" size={24} />
            </div>
            <h3 className="serif text-3xl mb-4 text-[#4a3a2a]">La Fiesta</h3>
            <p className="text-[#6a5a4a] mb-8 leading-relaxed">
              Luego de las Ceremonias, esperamos compartir a lo grande el festejo de nuestras vidas y que deseamos celebrar con ustedes.
            </p>
            <button 
              onClick={() => setIsPartyModalOpen(true)}
              className="px-8 py-3 bg-[#8a7a6a] text-white rounded-full text-sm tracking-widest uppercase hover:bg-[#6a5a4a] transition-colors"
            >
              Fiesta
            </button>
          </motion.div>
        </div>
      </section>

      {/* Dress Code & Gifts */}
      <section className="py-24 px-4 bg-[#f9f7f5]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-12 rounded-3xl border border-[#f0ebe6] text-center">
            <Camera className="mx-auto mb-6 text-[#c6b5a3]" size={32} strokeWidth={1} />
            <h3 className="serif text-2xl mb-4 text-[#4a3a2a]">Código de Vestimenta</h3>
            <p className="text-[#8a7a6a] mb-2 uppercase tracking-widest text-sm font-semibold">Elegante Sport</p>
            <p className="text-sm text-[#6a5a4a]">
              ¡Queremos verte brillar! Ven cómodo pero con tu mejor estilo para celebrar y bailar.
              <br /><br />
              <span className="italic">Les pedimos amablemente evitar el color blanco, reservado especialmente para los novios.</span>
            </p>
          </div>

          <div className="bg-white p-12 rounded-3xl border border-[#f0ebe6] text-center">
            <Gift className="mx-auto mb-6 text-[#c6b5a3]" size={32} strokeWidth={1} />
            <h3 className="serif text-2xl mb-4 text-[#4a3a2a]">Regalos</h3>
            <p className="text-sm text-[#6a5a4a] mb-6">
              Tu presencia es nuestro mejor regalo. Como ya tenemos nuestro hogar completo, si deseas obsequiarnos algo, puedes ayudarnos a cumplir nuestro sueño de la luna de miel a través de nuestra cuenta bancaria:
            </p>
            <div className="bg-[#fdfcfb] p-4 rounded-xl border border-[#f0ebe6] inline-block">
              <p className="text-xs uppercase tracking-widest text-[#c6b5a3] mb-1">CBU / Alias</p>
              <p className="font-mono text-[#4a3a2a]">LORE.LEO.BODA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="serif text-4xl md:text-5xl mb-4 text-[#4a3a2a]">Nuestra Sesión Pre-Boda</h2>
            <p className="text-[#8a7a6a] uppercase tracking-widest text-xs">Momentos capturados antes del gran día</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto group">
            <div className="aspect-[4/5] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl bg-[#f9f7f5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slides[currentSlide]}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8a7a6a] shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8a7a6a] shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentSlide === idx ? "bg-[#8a7a6a] w-6" : "bg-[#e6d5c3]"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="serif text-4xl md:text-5xl mb-6 text-[#4a3a2a]">Confirmación de Asistencia</h2>
          <p className="text-[#6a5a4a] mb-12">
            Por favor, confírmanos tu presencia antes del 10 de Junio de 2026.
          </p>
          
          <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Nombres de todos los invitados</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb]"
                  placeholder="Nombres"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">¿Asistirás?</label>
                <select className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb] appearance-none">
                  <option>Sí, ¡allí estaré!</option>
                  <option>Lamentablemente no puedo</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Cantidad de invitados adultos</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb]"
                  placeholder="Ej: 2"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Cantidad de invitados infantes</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb]"
                  placeholder="Ej: 0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Preferencia de bebidas (consulta para adultos)</label>
              <select className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb] appearance-none">
                <option>Vino</option>
                <option>Cerveza</option>
                <option>Indistinto</option>
              </select>
            </div>
            <button className="w-full py-5 bg-[#4a3a2a] text-white rounded-2xl text-sm tracking-[0.2em] uppercase font-semibold hover:bg-[#2d2d2d] transition-all shadow-lg shadow-[#4a3a2a]/10">
              Enviar Confirmación
            </button>
          </form>
        </div>
      </section>

      {/* Fiesta Modal */}
      <AnimatePresence>
        {isPartyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPartyModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] p-12 shadow-2xl text-center border border-[#f0ebe6]"
            >
              <button 
                onClick={() => setIsPartyModalOpen(false)}
                className="absolute top-6 right-6 text-[#c6b5a3] hover:text-[#8a7a6a] transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-16 h-16 bg-[#fdfcfb] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#f0ebe6]">
                <Music className="text-[#8a7a6a]" size={24} />
              </div>
              <h3 className="serif text-3xl mb-6 text-[#4a3a2a]">La Fiesta</h3>
              <div className="space-y-4 text-[#6a5a4a] leading-relaxed serif text-lg italic">
                <p>
                  Contamos que nos acompañen en este momento tan importante de nuestras vidas.
                </p>
                <p>
                  Al finalizar la ceremonia, los invitamos a quedarse y celebrar con nosotros la fiesta de nuestra boda.
                </p>
              </div>
              <button 
                onClick={() => setIsPartyModalOpen(false)}
                className="mt-10 px-10 py-4 bg-[#4a3a2a] text-white rounded-full text-sm tracking-widest uppercase hover:bg-[#2d2d2d] transition-all shadow-lg"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-24 px-4 bg-[#f9f7f5] text-center">
        <div className="max-w-4xl mx-auto">
          <p className="serif text-3xl text-[#4a3a2a] mb-4 italic">¡Te esperamos para celebrar!</p>
          <div className="flex items-center justify-center gap-4 text-[#c6b5a3] mb-8">
            <div className="h-px w-12 bg-[#c6b5a3]" />
            <Heart size={20} fill="currentColor" />
            <div className="h-px w-12 bg-[#c6b5a3]" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a7a6a]">Lore & Leo 2026</p>
        </div>
      </footer>
    </div>
  );
}
