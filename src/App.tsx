import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import AddProperty from './pages/AddProperty';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

function App() {
  return (
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/add" element={<AddProperty />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
  );
}

export default App;