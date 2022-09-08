import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

const App = () =>
  <GameProvider>
    <Header />
    <div className="App">
      <Game />
    </div>
    <Footer />
  </GameProvider>;

export default App;
