import { ErrorBoundary } from 'react-error-boundary'
import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const App = () =>
  <ErrorBoundary FallbackComponent={ErrorFallback}
    onReset={() => {
      // reset the state of your app so the error doesn't happen again
    }}>
    <GameProvider>
      <div className="App">
        <Game />
      </div>
    </GameProvider>
  </ErrorBoundary>;

export default App;
