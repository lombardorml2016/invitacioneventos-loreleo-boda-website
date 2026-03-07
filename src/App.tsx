/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  GlassWater
} from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WEDDING_DATE = new Date('2026-07-18T18:00:00');

export default function App() {
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

  return (
    <div className="min-h-screen bg-[#fdfcfb] selection:bg-[#e6d5c3] selection:text-[#5a4a3a]">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000" 
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
              18 de Julio de 2026
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
            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-[#f9f7f5] group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000" 
              alt="Video thumbnail"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#8a7a6a] border-b-[12px] border-b-transparent ml-2" />
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm uppercase tracking-widest font-medium drop-shadow-md">
              Reproducir Video
            </div>
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
            <h3 className="serif text-3xl mb-4 text-[#4a3a2a]">La Ceremonia</h3>
            <p className="text-[#6a5a4a] mb-6">
              Acompáñanos en el momento del "Sí, quiero".
            </p>
            <div className="space-y-2 mb-8">
              <p className="font-medium text-[#4a3a2a]">18:00 Horas</p>
              <p className="text-[#8a7a6a]">Parroquia San Benito Abad</p>
              <p className="text-sm text-[#8a7a6a]">Villanueva 905, CABA</p>
            </div>
            <button className="px-8 py-3 bg-[#8a7a6a] text-white rounded-full text-sm tracking-widest uppercase hover:bg-[#6a5a4a] transition-colors">
              Cómo llegar
            </button>
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
            <p className="text-[#6a5a4a] mb-6">
              ¡A festejar toda la noche!
            </p>
            <div className="space-y-2 mb-8">
              <p className="font-medium text-[#4a3a2a]">20:30 Horas</p>
              <p className="text-[#8a7a6a]">Salón La Mansión</p>
              <p className="text-sm text-[#8a7a6a]">Av. Figueroa Alcorta 2200, CABA</p>
            </div>
            <button className="px-8 py-3 bg-[#8a7a6a] text-white rounded-full text-sm tracking-widest uppercase hover:bg-[#6a5a4a] transition-colors">
              Cómo llegar
            </button>
          </motion.div>
        </div>
      </section>

      {/* Child-Free Section (The requested addition) */}
      <section className="py-32 px-4 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative"
          >
            <div className="aspect-[4/5] rounded-[100px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000" 
                alt="Elegant celebration"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#fdfcfb] rounded-full border border-[#f0ebe6] flex items-center justify-center">
              <GlassWater className="text-[#e6d5c3]" size={48} strokeWidth={1} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#f9f7f5] text-[#8a7a6a] text-xs uppercase tracking-widest mb-6">
              <Info size={14} />
              <span>Nota Especial</span>
            </div>
            <h2 className="serif text-4xl md:text-5xl mb-8 text-[#4a3a2a] leading-tight">
              Una Noche para <br /> <span className="italic">Celebrar como Adultos</span>
            </h2>
            <div className="space-y-6 text-[#6a5a4a] leading-relaxed">
              <p>
                Como papás, sabemos que nuestros hijos son nuestro tesoro más grande. Sin embargo, para este día tan especial, hemos decidido organizar una <strong>celebración exclusivamente para adultos</strong>.
              </p>
              <p>
                Deseamos que esta noche sea un regalo para todos: un momento de desconexión total donde podamos disfrutar plenamente de la música, el baile y el festejo sin preocupaciones. Queremos verlos disfrutar con total libertad, brindando juntos hasta el amanecer.
              </p>
              <p className="serif text-xl italic text-[#8a7a6a]">
                ¡Gracias por comprender y por acompañarnos en este respiro que tanto soñamos!
              </p>
            </div>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 row-span-2 rounded-3xl overflow-hidden aspect-square"
            >
              <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000" alt="Pre-wedding 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden aspect-[3/4]"
            >
              <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" alt="Pre-wedding 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="col-span-2 rounded-3xl overflow-hidden aspect-[16/9]"
            >
              <img src="https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=1000" alt="Pre-wedding 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="serif text-4xl md:text-5xl mb-6 text-[#4a3a2a]">Confirmación de Asistencia</h2>
          <p className="text-[#6a5a4a] mb-12">
            Por favor, confírmanos tu presencia antes del 15 de Junio de 2026.
          </p>
          
          <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Nombre Completo</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb]"
                  placeholder="Tu nombre"
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
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Preferencia de bebidas</label>
              <select className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb] appearance-none">
                <option>Vino</option>
                <option>Cerveza</option>
              </select>
            </div>
            <button className="w-full py-5 bg-[#4a3a2a] text-white rounded-2xl text-sm tracking-[0.2em] uppercase font-semibold hover:bg-[#2d2d2d] transition-all shadow-lg shadow-[#4a3a2a]/10">
              Enviar Confirmación
            </button>
          </form>
        </div>
      </section>

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
