import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import AnnouncementBanner from '../components/AnnouncementBanner';
import Hero from '../components/Hero';
import About from '../components/About';
import Themes from '../components/Themes';
import Timeline from '../components/Timeline';
import Prizes from '../components/Prizes';
import Rules from '../components/Rules';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen font-sans">
      <Helmet>
        <title>Specteq | Industry-Grade Robotics Competition</title>
        <meta name="description" content="Specteq is a premium robotics competition platform bridging the gap between academic learning and real-world industrial application." />
      </Helmet>

      <Navbar />
      <AnnouncementBanner />
      <Hero />
      <About />
      <Themes />
      <Timeline />
      <Prizes />
      <Rules />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;
