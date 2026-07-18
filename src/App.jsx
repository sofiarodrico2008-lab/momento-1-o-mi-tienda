import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import fcf from './assets/images-5.jpg';
import './App.css';

function App() {
  return (
    <div>
      <img src={fcf} alt="Mascota" style={{ width: '200px' }} />
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}

export default App;