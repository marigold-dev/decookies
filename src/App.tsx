import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';
import Footer from './components/footer';
import { BrowserRouter as Router,Routes ,Route } from 'react-router-dom';
import  Rules  from './pages/rules';
import Header from './components/header';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './theme';


const App = () =>
  <Router>
    <ThemeProvider theme={defaultTheme}>
      <GameProvider>
        <Header />
        <Routes>
          <Route path='/' element={<Game />} />
          <Route path='/rules' element={<Rules />} />
        </Routes>
        <Footer/>
      </GameProvider>
    </ThemeProvider>
  </Router>
  

export default App;
