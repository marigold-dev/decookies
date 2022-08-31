import './App.css';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/headet';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';

const App = () =>
  <GameProvider>
    <Header/>
    <div className="App">
      <Game />
    </div>
    <Footer/>
  </GameProvider>;

export default App;
