import Navigator from "../components/navigator/Navigator";
import Menu from "../components/menu/Menu";
import { BrowserRouter } from "react-router-dom";
import React from "react";

function App () {
  return (
    <BrowserRouter>
      <Menu />
      <Navigator/>
    </BrowserRouter>
  );
}

export default App;
