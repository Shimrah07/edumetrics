import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes.jsx';
import './App.css';

/**
 * Top-level application component with single router provider.
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
