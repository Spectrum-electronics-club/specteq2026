import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="py-32 text-center px-4 relative overflow-hidden bg-transparent">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-brand-secondary rounded-full filter blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-accent rounded-full filter blur-[100px]"
        />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight tracking-tight text-brand-primary"
        >
          Industry-grade <span className="text-gradient">robotics</span> competition
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-xl md:text-3xl text-slate-600 mb-10 max-w-3xl mx-auto font-medium"
        >
          For students and professionals ready to innovate and excel in the world of robotics.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <Link to="/login" className="inline-flex items-center px-8 py-4 bg-brand-secondary text-white font-bold rounded-xl hover:bg-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all text-lg">
            Join the Competition <ArrowRight className="ml-3" size={24} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
