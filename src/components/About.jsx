import React from 'react';
import { Shield, Zap, Target } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-brand-primary mb-6">
              About Specteq
            </h2>
            <div className="w-16 h-1 bg-brand-accent rounded-full mb-8"></div>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Specteq is an industry-grade robotics competition platform designed to bridge the gap between academic learning and real-world industrial application. We provide a rigorous, competitive environment where engineering students and professionals can test their skills.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our mission is to empower the next generation of roboticists by challenging them with complex, multidisciplinary problems that reflect current industry demands in automation, aerospace, and navigation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 text-brand-secondary rounded-full flex items-center justify-center mr-4">
                  <Target size={24} />
                </div>
                <span className="font-bold text-brand-primary">Precision</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 text-brand-accent rounded-full flex items-center justify-center mr-4">
                  <Zap size={24} />
                </div>
                <span className="font-bold text-brand-primary">Innovation</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-200 text-brand-primary rounded-full flex items-center justify-center mr-4">
                  <Shield size={24} />
                </div>
                <span className="font-bold text-brand-primary">Excellence</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full h-[400px] glass-card rounded-3xl overflow-hidden relative shadow-2xl shadow-brand-primary/10">
            {/* Placeholder for an actual image or video, using glass gradient to make it look premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 flex items-center justify-center">
               <div className="text-slate-500 font-mono text-center glass-panel p-8 rounded-2xl">
                 <span className="text-6xl mb-4 block">🤖</span>
                 [Robotics Lab Showcase]
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
