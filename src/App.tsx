import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';

const App = () =>
  <GameProvider>
    <div className="App">
      <Game />
    </div>
  </GameProvider>;

export default App;
