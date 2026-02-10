import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Network, Users, AlertTriangle, ArrowRight, CheckCircle2, BookOpen, Globe, Server, Clock, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
  >
    <div className="bg-cyan-500/10 p-3 rounded-lg mb-4">
      <Icon className="w-6 h-6 text-cyan-400" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </motion.div>
);

const StatCard = ({ number, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="text-center"
  >
    <div className="flex items-center justify-center mb-3">
      <div className="bg-slate-800 p-2 rounded-lg">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
    </div>
    <div className="text-3xl font-bold text-white mb-1">{number}</div>
    <div className="text-slate-400 text-sm">{label}</div>
  </motion.div>
);

const FAQItem = ({ question, answer, isOpen, onToggle, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="border-b border-slate-800 py-4"
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left"
    >
      <h3 className="text-lg font-semibold text-white">{question}</h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-cyan-400"
      >
        <ArrowRight className="w-5 h-5" />
      </motion.div>
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <p className="text-slate-400 text-sm mt-3 leading-relaxed">{answer}</p>
    </motion.div>
  </motion.div>
);

export const HomePage = ({ onNavigate }) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const features = [
    {
      icon: Shield,
      title: 'Seguridad Blockchain',
      description: 'Protección avanzada contra fraudes y ataques cibernéticos mediante análisis de patrones de transacciones sospechosas.'
    },
    {
      icon: Network,
      title: 'Monitoreo en Tiempo Real',
      description: 'Supervisa la red blockchain 24/7 y recibe alertas instantáneas sobre actividades anómalas y riesgos de seguridad.'
    },
    {
      icon: Users,
      title: 'Análisis de Usuarios',
      description: 'Perfilamiento de wallets y detección de patrones de comportamiento para identificar actividades fraudulentas.'
    },
    {
      icon: AlertTriangle,
      title: 'Detección de Riesgos',
      description: 'Algoritmos de IA avanzados que detectan transacciones sospechosas relacionadas con lavado de activos y fraude.'
    },
    {
      icon: Globe,
      title: 'Red Global',
      description: 'Cobertura de múltiples blockchains y cadenas de bloques para una protección completa en todo el ecosistema.'
    },
    {
      icon: Server,
      title: 'Infraestructura Escalable',
      description: 'Sistema distribuido y escalable que maneja miles de transacciones por segundo con latencia mínima.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Transacciones Analizadas', icon: CheckCircle2 },
    { number: '24/7', label: 'Monitoreo', icon: Clock },
    { number: '99.9%', label: 'Precisión', icon: Target },
    { number: '500+', label: 'Wallets Protegidos', icon: Shield }
  ];

  const faqs = [
    {
      question: '¿Qué es ChainAudit Pro?',
      answer: 'ChainAudit Pro es una plataforma avanzada de seguridad blockchain que analiza transacciones y wallets para detectar patrones de fraude, lavado de activos y actividades sospechosas en tiempo real.'
    },
    {
      question: '¿Cómo funciona el análisis de transacciones?',
      answer: 'Nuestros algoritmos de IA examinan patrones de actividad, correlacionan transacciones entre wallets y comparan contra bases de datos de actividades fraudulentas conocidas para identificar riesgos.'
    },
    {
      question: '¿Qué blockchains se admiten?',
      answer: 'Actualmente soportamos Ethereum, Binance Smart Chain y Polygon. Estamos continuamente agregando soporte para nuevas blockchains y cadenas de bloques.'
    },
    {
      question: '¿Es seguro usar la plataforma?',
      answer: 'Sí, ChainAudit Pro utiliza criptografía de vanguardia para proteger los datos de los usuarios. No almacenamos información sensible y todas las comunicaciones son encriptadas.'
    },
    {
      question: '¿Cómo puedo obtener alertas de seguridad?',
      answer: 'Puede configurar alertas personalizadas en la plataforma. Recibirá notificaciones por correo electrónico o mensaje cuando se detecten actividades sospechosas relacionadas con sus wallets.'
    },
    {
      question: '¿Qué tipos de riesgos detecta la plataforma?',
      answer: 'Nuestro sistema identifica riesgos como lavado de activos, phishing, ransomware, fraudes de ICO y actividades relacionadas con direcciones maliciosas.'
    }
  ];

  const handleToggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <section className="relative overflow-hidden py-20 px-6 md:px-12">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              ChainAudit <span className="text-cyan-500">Pro</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              La plataforma líder en seguridad blockchain. Analiza, monitorea y protege tu actividad digital en la red de manera inteligente y en tiempo real.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all duration-300 border border-slate-700"
              >
                Ver Características
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 md:px-12 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Nuestras Características</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Tecnología avanzada para la protección de tu inversión y seguridad en la blockchain
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Impacto de ChainAudit Pro</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Resultados comprobados en seguridad blockchain
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                {...stat}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
            <p className="text-slate-400 text-lg">
              Todo lo que necesitas saber sobre ChainAudit Pro
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => handleToggleFAQ(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 p-12 md:p-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¡Protege tu Blockchain Ahora!
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Únete a miles de usuarios que ya confían en ChainAudit Pro para mantener segura su actividad digital.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              Comenzar Ahora
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 px-6 md:px-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8 border-t border-slate-900">
            <p className="text-slate-500 text-sm">
              &copy; 2024 ChainAudit Pro. Todos los derechos reservados. Grupo 7.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;