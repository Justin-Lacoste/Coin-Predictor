import logo from './logo.svg';
import './App.css';
import Dashboard from './dashboard.js';

var reactLogoColor = "#61DBFB"

function App() {
  return (
    <div className="App">
    {/*}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    */}
      <Dashboard />
    </div>
  );
}

export default App;
