import React from 'react';
import { Calendar, CheckCircle2, Trophy } from 'lucide-react';

const Timeline = () => {
  return (
    <section id="timeline" className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-4xl font-bold text-center text-brand-primary mb-16 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-brand-accent after:mx-auto after:mt-4 after:rounded-full">
          Competition Timeline
        </h2>
        <div className="max-w-3xl mx-auto relative before:content-[''] before:absolute before:left-[31px] before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200">
          
          {/* Timeline Item 1 */}
          <div className="flex mb-12 relative group">
            <div className="w-16 h-16 bg-white/80 backdrop-blur-sm border-4 border-brand-secondary rounded-full flex items-center justify-center text-brand-secondary z-10 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div className="ml-8 glass-card rounded-2xl p-8 grow hover-card">
              <h4 className="text-xl font-bold text-brand-primary mb-1">Registration Opens</h4>
              <p className="text-brand-accent font-semibold mb-3">August 1, 2026</p>
              <p className="text-slate-600">Form your teams and register on the platform.</p>
            </div>
          </div>
          
          {/* Timeline Item 2 */}
          <div className="flex mb-12 relative group">
            <div className="w-16 h-16 bg-white/80 backdrop-blur-sm border-4 border-brand-secondary rounded-full flex items-center justify-center text-brand-secondary z-10 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <div className="ml-8 glass-card rounded-2xl p-8 grow hover-card">
              <h4 className="text-xl font-bold text-brand-primary mb-1">Task 1 Submission</h4>
              <p className="text-brand-accent font-semibold mb-3">September 15, 2026</p>
              <p className="text-slate-600">Submit your initial design and simulation results.</p>
            </div>
          </div>
          
          {/* Timeline Item 3 */}
          <div className="flex relative group">
            <div className="w-16 h-16 bg-brand-secondary border-4 border-brand-secondary rounded-full flex items-center justify-center text-white z-10 shrink-0 shadow-sm group-hover:scale-110 transition-transform shadow-brand-secondary/40">
              <Trophy size={24} />
            </div>
            <div className="ml-8 glass-card rounded-2xl p-8 grow hover-card">
              <h4 className="text-xl font-bold text-brand-primary mb-1">Grand Finale</h4>
              <p className="text-brand-accent font-semibold mb-3">December 20, 2026</p>
              <p className="text-slate-600">Live demonstrations and award ceremony.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Timeline;
