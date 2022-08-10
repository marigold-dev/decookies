import './App.css';

import { Game, ConnectWallet } from './pages/game';
import { GameProvider } from './store/provider';

const App = () =>
  <GameProvider>
    <div className="App">
      <ConnectWallet />
      <Game />
    </div>
  </GameProvider>;

export default App;
