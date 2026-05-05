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
  Sparkles,
  GlassWater,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Users,
  Download,
  ArrowLeft
} from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WEDDING_DATE = new Date('2026-06-13T20:30:00');

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Admin State
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchRsvps = async () => {
    setIsLoadingRsvps(true);
    try {
      const q = query(
        collection(db, 'rsvps'), 
        where('eventId', '==', 'lore-leo-boda-2026'),
        where('clientId', '==', 'particular'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        let dateStr = 'N/A';
        
        if (docData.createdAt) {
          if (typeof docData.createdAt.toDate === 'function') {
            dateStr = docData.createdAt.toDate().toLocaleString();
          } else {
            // Handle if it's already a string or other format
            dateStr = new Date(docData.createdAt).toLocaleString();
          }
        }

        return {
          id: doc.id,
          ...docData,
          createdAt: dateStr
        };
      });
      setRsvps(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'rsvps');
    } finally {
      setIsLoadingRsvps(false);
    }
  };

  const handleDeleteRSVP = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'rsvps', id));
      setRsvps(prev => prev.filter(rsvp => rsvp.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `rsvps/${id}`);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (showAdmin) {
      fetchRsvps();
    }
  }, [showAdmin]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nombre", "Asiste", "Acompañantes", "Mensaje", "Fecha"];
    const tableRows = rsvps.map(rsvp => [
      rsvp.infantName,
      rsvp.attending ? "Sí" : "No",
      rsvp.guests,
      rsvp.comments || "-",
      rsvp.createdAt
    ]);

    doc.text("Listado de Invitados - Boda Lore & Leo", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("invitados_boda_lore_leo.pdf");
  };
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // RSVP Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    infantName: '',
    attending: true,
    guests: 0,
    responsibleAdult: '',
    phone: '',
    comments: '',
    interestedInFutureEvents: false
  });

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const rsvpData = {
        ...formData,
        responsibleAdult: 'Adulto', // Default for schema compatibility
        phone: '0000000000',      // Default for schema compatibility
        eventId: 'lore-leo-boda-2026',
        clientId: 'particular',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'rsvps'), rsvpData);
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'rsvps');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '2026') {
      setShowAdmin(true);
      setShowLoginModal(false);
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

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
      {/* Admin Button */}
      <button 
        onClick={() => setShowLoginModal(true)}
        className="fixed bottom-6 left-6 z-50 px-5 h-12 bg-[#4a3a2a] text-white rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform border border-[#f0ebe6] font-semibold text-sm"
      >
        <Users size={18} />
        Admin
      </button>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full relative"
            >
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError(false);
                  setPasswordInput('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#f9f7f5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <X size={24} className="text-[#8a7a6a]" />
                </div>
                <h3 className="serif text-2xl text-[#3d2b1f] mb-2">Acceso Restringido</h3>
                <p className="text-xs uppercase tracking-widest text-[#8a7a6a] font-bold">Ingresa el código para continuar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input 
                    autoFocus
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError(false);
                    }}
                    placeholder="Código de acceso"
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl border focus:outline-none transition-all text-center text-lg tracking-[0.5em] font-bold",
                      loginError 
                        ? "border-red-300 bg-red-50 focus:border-red-400" 
                        : "border-[#f0ebe6] bg-[#fdfcfb] focus:border-[#8a7a6a]"
                    )}
                  />
                  {loginError && (
                    <p className="text-red-500 text-xs text-center mt-2 font-bold uppercase tracking-tight">Código incorrecto</p>
                  )}
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#4a3a2a] text-white rounded-2xl text-sm tracking-[0.2em] uppercase font-semibold hover:bg-[#2d2d2d] transition-all shadow-lg"
                >
                  Entrar
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Modal/Panel */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto p-6 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <button 
                  onClick={() => setShowAdmin(false)}
                  className="flex items-center gap-2 text-[#8a7a6a] hover:text-[#4a3a2a] transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="font-semibold uppercase tracking-widest text-xs">Volver a la invitación</span>
                </button>
                
                <h2 className="serif text-4xl text-[#3d2b1f]">Listado de Invitados</h2>
                
                <button 
                  onClick={exportToPDF}
                  disabled={rsvps.length === 0}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8a7a6a] text-white rounded-xl hover:bg-[#6a5a4a] transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Download size={20} />
                  <span className="font-semibold text-sm uppercase tracking-wider">Exportar PDF</span>
                </button>
              </div>

              {isLoadingRsvps ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-12 h-12 border-4 border-[#e6d5c3] border-t-[#8a7a6a] rounded-full animate-spin mb-4" />
                  <p className="text-[#8a7a6a] font-poppins">Cargando confirmaciones...</p>
                </div>
              ) : rsvps.length > 0 ? (
                <div className="overflow-x-auto bg-[#fdfcfb] rounded-3xl border border-[#f0ebe6] shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9f7f5] border-bottom border-[#f0ebe6]">
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8a7a6a] font-bold">Invitado</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8a7a6a] font-bold text-center">Asistirá</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8a7a6a] font-bold text-center">Acompañantes</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8a7a6a] font-bold">Mensaje</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8a7a6a] font-bold">Fecha</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8a7a6a] font-bold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0ebe6]">
                      {rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-white transition-colors">
                          <td className="px-6 py-4 text-[#3d2b1f] font-medium">{rsvp.infantName}</td>
                          <td className="px-6 py-4 text-center">
                            {rsvp.attending ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">SÍ</span>
                            ) : (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">NO</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-[#6a5a4a]">{rsvp.guests}</td>
                          <td className="px-6 py-4 text-[#6a5a4a] italic text-sm max-w-xs truncate" title={rsvp.comments}>
                            {rsvp.comments || "-"}
                          </td>
                          <td className="px-6 py-4 text-[#8a7a6a] text-xs font-mono">{rsvp.createdAt}</td>
                          <td className="px-6 py-4 text-center">
                            {confirmDeleteId === rsvp.id ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleDeleteRSVP(rsvp.id)}
                                  disabled={deletingId === rsvp.id}
                                  className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
                                >
                                  {deletingId === rsvp.id ? "..." : "Sí"}
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-xs font-bold text-gray-500 hover:underline"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(rsvp.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                                title="Eliminar invitado"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="p-6 bg-[#f9f7f5] flex justify-between items-center border-t border-[#f0ebe6]">
                    <div className="flex gap-8">
                      <p className="text-sm text-[#8a7a6a]">
                        Total respuestas: <span className="font-bold text-[#4a3a2a]">{rsvps.length}</span>
                      </p>
                      <p className="text-sm text-[#8a7a6a]">
                        Asistirán: <span className="font-bold text-[#4a3a2a]">{rsvps.filter(r => r.attending).length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-24 bg-[#fdfcfb] rounded-3xl border border-[#f0ebe6] border-dashed">
                  <div className="w-16 h-16 bg-[#f9f7f5] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="text-[#c6b5a3]" size={32} />
                  </div>
                  <h3 className="serif text-2xl text-[#3d2b1f] mb-2">No hay confirmaciones aún</h3>
                  <p className="text-[#8a7a6a]">Las respuestas de los invitados aparecerán aquí.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio id="bg-music" loop src="https://invitacionevento.com/primos/musica.mp3" />
      
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
            className="text-sm uppercase tracking-[0.3em] mb-6 text-[#8a7a6a] font-poppins font-bold"
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
            <p className="serif text-3xl md:text-4xl text-[#3d2b1f] mb-2 italic">
              13 de Junio de 2026
            </p>
            <p className="text-sm uppercase tracking-widest text-[#8a7a6a] font-poppins font-semibold">
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
        <h2 className="serif text-4xl md:text-5xl mb-8 text-[#3d2b1f]">Nuestra Historia</h2>
        <p className="serif text-2xl md:text-3xl leading-relaxed text-[#3d2b1f] italic px-4">
          "El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección."
        </p>
        <p className="mt-10 text-[#6a5a4a] leading-relaxed max-w-2xl mx-auto font-poppins text-lg md:text-xl px-4">
          Después de tantos años compartidos, risas, viajes y sueños, de haber construido nuestro hogar juntos y ver crecer a nuestros hijos, hemos decidido dar el paso más importante de nuestras vidas. Queremos que seas parte de este nuevo comienzo y que celebremos juntos el amor que nos une.
        </p>
      </section>

      {/* Video Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="serif text-4xl md:text-5xl mb-12 text-[#3d2b1f]">Nuestra historia</h2>
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
            <h3 className="serif text-3xl md:text-4xl mb-6 text-[#3d2b1f]">Ceremonia</h3>
            <div className="text-[#6a5a4a] mb-8 leading-relaxed space-y-6">
              <p className="serif text-2xl md:text-3xl italic text-[#3d2b1f]">Dos “sí”, un mismo amor</p>
              <p className="serif italic text-xl md:text-2xl">Primero firmaremos nuestra historia…luego la bendeciremos ante Dios y junto a quienes más queremos.</p>
              <p className="serif italic text-xl md:text-2xl">- Unión Civil: 20:30 hs y al finalizar 🤍 Ceremonia Religiosa.</p>
            </div>
            <div className="space-y-2 mb-10">
              <p className="serif italic text-[#8a7a6a] text-lg">📍 Todo se llevará a cabo en:</p>
              <p className="font-poppins font-bold text-[#3d2b1f] text-xl uppercase tracking-wider">Salon Amudoch</p>
              <p className="text-[#6a5a4a] text-lg">Ruta 11 km 1001</p>
              <p className="text-[#6a5a4a] text-lg">Resistencia - Chaco</p>
              <p className="mt-6 font-poppins font-bold text-[#3d2b1f] text-xl">Los esperamos 20:30 Hs</p>
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
            <h3 className="serif text-3xl md:text-4xl mb-6 text-[#3d2b1f]">La Fiesta</h3>
            <p className="serif italic text-[#6a5a4a] mb-10 leading-relaxed text-xl md:text-2xl">
              Contamos que nos acompañen en este momento tan importante de nuestras vidas.
              <br /><br />
              Al finalizar las ceremonias, los invitamos a quedarse y celebrar con nosotros la fiesta de nuestra boda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dress Code & Gifts */}
      <section className="py-24 px-4 bg-[#f9f7f5]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-12 md:p-16 rounded-3xl border border-[#f0ebe6] text-center shadow-sm">
            <Sparkles className="mx-auto mb-8 text-[#c6b5a3]" size={40} strokeWidth={1} />
            <h3 className="serif text-3xl md:text-4xl mb-6 text-[#3d2b1f]">Código de Vestimenta</h3>
            <p className="text-[#8a7a6a] mb-4 uppercase tracking-[0.2em] text-sm font-poppins font-bold">Elegante Sport</p>
            <div className="serif italic text-xl md:text-2xl text-[#6a5a4a] space-y-4">
              <p>¡Queremos verte brillar! Ven cómodo pero con tu mejor estilo para celebrar y bailar.</p>
              <p className="text-lg md:text-xl opacity-80">Les pedimos amablemente evitar el color blanco, reservado especialmente para los novios.</p>
            </div>
          </div>

          <div className="bg-white p-12 md:p-16 rounded-3xl border border-[#f0ebe6] text-center shadow-sm">
            <Gift className="mx-auto mb-8 text-[#c6b5a3]" size={40} strokeWidth={1} />
            <h3 className="serif text-3xl md:text-4xl mb-6 text-[#3d2b1f]">Regalos</h3>
            <p className="serif italic text-xl md:text-2xl text-[#6a5a4a] mb-10 leading-relaxed">
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
            <h2 className="serif text-4xl md:text-5xl mb-4 text-[#3d2b1f]">Nuestra Sesión Pre-Boda</h2>
            <p className="text-[#8a7a6a] uppercase tracking-widest text-xs font-poppins font-bold">Momentos capturados antes del gran día</p>
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
      <section id="confirmacion" className="py-32 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="serif text-4xl md:text-5xl mb-8 text-[#3d2b1f]">Confirmación de Asistencia</h2>
          <p className="text-[#6a5a4a] mb-12 text-lg md:text-xl font-poppins font-medium px-4">
            Por favor, confírmanos tu presencia antes del 1 de Junio de 2026.
          </p>
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="rsvp-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 text-left" 
                onSubmit={handleRSVPSubmit}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Nombre del invitado/a</label>
                    <input 
                      required
                      type="text" 
                      id="name-input"
                      value={formData.infantName}
                      onChange={(e) => setFormData({ ...formData, infantName: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb]"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">¿Asistirás?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: true })}
                        className={cn(
                          "py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 font-medium",
                          formData.attending 
                            ? "bg-[#e6d5c3] border-[#8a7a6a] text-[#4a3a2a]" 
                            : "bg-white border-[#f0ebe6] text-[#8a7a6a] hover:border-[#c6b5a3]"
                        )}
                      >
                        <span className="text-xl">✅</span> Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: false })}
                        className={cn(
                          "py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 font-medium",
                          !formData.attending 
                            ? "bg-[#f8f0ea] border-[#d4a373] text-[#4a3a2a]" 
                            : "bg-white border-[#f0ebe6] text-[#8a7a6a] hover:border-[#c6b5a3]"
                        )}
                      >
                        <span className="text-xl">❌</span> No
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Acompañantes adicionales</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 0 })}
                      className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb]"
                      placeholder="Cantidad de personas que vienen contigo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8a7a6a] mb-2 font-semibold">Mensaje para Lore & Leo</label>
                  <textarea 
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl border border-[#f0ebe6] focus:outline-none focus:border-[#8a7a6a] transition-colors bg-[#fdfcfb] resize-none"
                    placeholder="Escríbeles algo lindo para este momento tan especial..."
                  />
                </div>

                <button 
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-5 text-white rounded-2xl text-sm tracking-[0.2em] uppercase font-semibold transition-all shadow-lg",
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#4a3a2a] hover:bg-[#2d2d2d] shadow-[#4a3a2a]/10"
                  )}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Confirmación"}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#fdfcfb] p-12 rounded-3xl border border-[#f0ebe6] shadow-sm flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-[#f0ebe6] rounded-full flex items-center justify-center mb-6 text-[#8a7a6a]">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="serif text-3xl mb-4 text-[#3d2b1f]">¡Muchas Gracias!</h3>
                <p className="text-[#6a5a4a] text-lg font-poppins">
                  Tu confirmación ha sido enviada con éxito. ¡Nos vemos pronto!
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-sm uppercase tracking-widest text-[#8a7a6a] hover:underline"
                >
                  Enviar otra respuesta
                </button>
              </motion.div>
            )}
          </AnimatePresence>
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
