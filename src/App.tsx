import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import Events from './components/Events';
import Members from './components/Members';
import Leadership from './components/Leadership';
import Footer from './components/Footer';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <main>
        <Hero />
        <Pillars />
        <Events />
        <Members />
        <Leadership />
      </main>
      <Footer />
    </>
  );
}

export default App;
