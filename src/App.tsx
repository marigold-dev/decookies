import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';
import { Footer } from './components/footer/footer';
import { BrowserRouter as Router,Routes ,Route } from 'react-router-dom';
import  Rules  from './pages/rules';
import Header from './components/header/header';


const App = () =>
<Router>
  <GameProvider>
    <Header />
    <Routes>
      <Route path='/' element={<Game/>} />
      <Route path='/rules' element={<Rules/>} />
    </Routes>
  </GameProvider>
</Router>
  

export default App;
