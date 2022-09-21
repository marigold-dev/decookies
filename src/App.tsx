import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { DekuToolkit } from 'deku-toolkit';
import { useEffect } from 'react';

const deku = new DekuToolkit({ dekuRpc: "http://localhost:8080" });

const App = () => {
  useEffect(() => {
    const id = setInterval(() => {
      deku.level()
        .then(level => console.log(`The level of the chain is: ${level}`))
        .catch(console.error);
    }, 4000);
    return () => {
      clearInterval(id);
    }
  }, [])


  return <GameProvider>
    <Header />
    <div className="App">
      <Game />
    </div>
    <Footer />
  </GameProvider>;
}


export default App;
