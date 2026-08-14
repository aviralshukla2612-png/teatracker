import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MonthlySummary from './pages/MonthlySummary';
import DailyEntry from './pages/DailyEntry';
import RatesSettings from './pages/RatesSettings';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Loader from './components/Loader';
import Login from './components/Login';

// Services
import authService from './services/authService';
import entryService from './services/entryService';
import rateService from './services/rateService';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // App state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [entries, setEntries] = useState([]);
  const [teaRate, setTeaRate] = useState(0);
  const [coffeeRate, setCoffeeRate] = useState(0);

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        if (authService.isLoggedIn()) {
          const user = await authService.me();
          setCurrentUser(user.role === 'super_admin' ? 'Super Admin' : user.name);
          await loadAppData();
        }
      } catch (err) {
        authService.logout();
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    initApp();
  }, []);

  const loadAppData = async () => {
    try {
      const [entriesRes, ratesRes] = await Promise.all([
        entryService.getAll(),
        rateService.get()
      ]);
      
      // Laravel returns a flat array of entries in data.data or just data depending on pagination
      // Our API returns { success: true, data: [...] }
      if (entriesRes.success) {
        // Map backend fields to frontend expectations
        const mappedEntries = entriesRes.data.map(e => ({
          id: e.id,
          date: new Date(e.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          tea: e.tea_quantity,
          coffee: e.coffee_quantity,
          totalCups: e.total_cups,
          amount: e.total_expense,
          addedBy: e.added_by
        }));
        setEntries(mappedEntries);
      }

      if (ratesRes.success) {
        setTeaRate(ratesRes.data.teaRate);
        setCoffeeRate(ratesRes.data.coffeeRate);
      }
    } catch (err) {
      console.error('Failed to load app data', err);
    }
  };

  const handleLogin = async (email, password) => {
    // Login component handles the actual api call and storage
    const user = await authService.me();
    setCurrentUser(user.role === 'super_admin' ? 'Super Admin' : user.name);
    await loadAppData();
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setEntries([]);
  };

  const addEntry = async (newEntry) => {
    try {
      // Backend expects YYYY-MM-DD
      const d = new Date(newEntry.date);
      const isoDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      await entryService.create(isoDate, newEntry.tea, newEntry.coffee);
      await loadAppData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add entry');
    }
  };

  const editEntry = async (updatedEntry) => {
    try {
      await entryService.update(updatedEntry.id, updatedEntry.tea, updatedEntry.coffee);
      await loadAppData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update entry');
    }
  };

  const deleteEntry = async (id) => {
    try {
      await entryService.delete(id);
      await loadAppData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete entry');
    }
  };

  // For dashboard/settings rate updates
  const updateRatesGlobal = async () => {
    await loadAppData();
  };

  return (
    <>
      {isLoading && <Loader onComplete={() => {}} />}

      {!isLoading && !currentUser && (
        <Login onLoginSuccess={handleLogin} />
      )}

      {!isLoading && currentUser && (
        <div className="app-container">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onLogout={handleLogout}
            currentUser={currentUser}
          />

          <main className="main-content">
            {currentView === 'dashboard' && (
              <Dashboard
                entries={entries}
                onAddEntry={addEntry}
                onEditEntry={editEntry}
                onDeleteEntry={deleteEntry}
                teaRate={teaRate}
                coffeeRate={coffeeRate}
                setTeaRate={setTeaRate}
                setCoffeeRate={setCoffeeRate}
                currentUser={currentUser}
                setCurrentView={setCurrentView}
                onLogout={handleLogout}
                refreshData={updateRatesGlobal}
              />
            )}
            {currentView === 'dailyEntry' && (
              <DailyEntry 
                entries={entries} 
                onAddEntry={addEntry} 
                onEditEntry={editEntry}
                onDeleteEntry={deleteEntry}
                teaRate={teaRate}
                coffeeRate={coffeeRate}
                currentUser={currentUser} 
              />
            )}
            {currentView === 'monthly' && (
              <MonthlySummary entries={entries} teaRate={teaRate} coffeeRate={coffeeRate} />
            )}
            {currentView === 'rates' && (
              <RatesSettings
                teaRate={teaRate} setTeaRate={setTeaRate}
                coffeeRate={coffeeRate} setCoffeeRate={setCoffeeRate}
                refreshData={updateRatesGlobal}
              />
            )}
            {currentView === 'users' && <UserManagement currentUser={currentUser} />}
            {currentView === 'reports' && <Reports entries={entries} />}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
