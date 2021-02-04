import './App.css';
import React from 'react';
import Navigator from '../components/navigator/Navigator';
import Menu from '../components/menu/Menu';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Navigator/>
      <Menu />
    </BrowserRouter>
  );
}

export default App;
