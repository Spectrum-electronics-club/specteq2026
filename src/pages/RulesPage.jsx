import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen, AlertTriangle, ShieldCheck, Scale, Download, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RulesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Official Rules & Guidelines | Specteq</title>
        <meta name="description" content="Read the comprehensive rulebook for the Specteq robotics competition. Includes details on eligibility, hardware constraints, and plagiarism." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-brand-primary font-medium mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Link>
          
          <div className="glass-card rounded-3xl overflow-hidden p-8 md:p-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-extrabold text-brand-primary mb-6">Comprehensive Rulebook</h1>
                  <p className="text-lg text-slate-600 mb-12">
                    Please read through all the general rules carefully. Violation of any primary rules may result in immediate disqualification of the team.
                  </p>

                  <div className="space-y-12">
                    {/* Section 1 */}
                    <section>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 text-brand-secondary rounded-lg flex items-center justify-center mr-4">
                          <BookOpen size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-primary">1. Eligibility & Team Formation</h2>
                      </div>
                      <div className="pl-14 space-y-4 text-slate-600">
                        <p><strong>1.1</strong> Teams must consist of a minimum of 2 and a maximum of 4 members.</p>
                        <p><strong>1.2</strong> For the Student Category, all members must belong to the same college/university. Cross-college teams are only permitted in the Open Category.</p>
                        <p><strong>1.3</strong> A participant cannot be a part of more than one team simultaneously.</p>
                      </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-orange-100 text-brand-accent rounded-lg flex items-center justify-center mr-4">
                          <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-primary">2. Originality & Plagiarism</h2>
                      </div>
                      <div className="pl-14 space-y-4 text-slate-600">
                        <p><strong>2.1</strong> All submitted code, CAD designs, and simulation configurations must be the original work of the team members.</p>
                        <p><strong>2.2</strong> Use of open-source libraries is permitted, but they must be explicitly cited in the final report.</p>
                        <p className="text-red-600 font-medium"><strong>2.3</strong> Any team caught sharing code or plagiarizing from past years will be immediately disqualified and barred from future competitions.</p>
                      </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center mr-4">
                          <Scale size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-primary">3. Hardware & Task Constraints</h2>
                      </div>
                      <div className="pl-14 space-y-4 text-slate-600">
                        <p><strong>3.1</strong> The physical robot (in Stage 2) must not exceed a weight of 5kg and dimensions of 30cm x 30cm x 30cm.</p>
                        <p><strong>3.2</strong> Power sources must not exceed 12V DC. Unsafe power setups will fail the safety inspection.</p>
                      </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mr-4">
                          <AlertTriangle size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-primary">4. Evaluation & Disputes</h2>
                      </div>
                      <div className="pl-14 space-y-4 text-slate-600">
                        <p><strong>4.1</strong> Tasks will be evaluated based on completion time, accuracy, and efficiency as defined in the specific task manuals.</p>
                        <p><strong>4.2</strong> The judges' decisions are final and binding. No disputes regarding scoring will be entertained after the results are published.</p>
                      </div>
                    </section>
                  </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RulesPage;
