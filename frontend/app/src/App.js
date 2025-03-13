import React from "react";
import Header from "./Header";
import "./App.css";
import "./Header.css";
import "./BottomNav.css";
import BottomNav from "./BottomNav";
//import axios from 'axios';
import Content from "./Content"

function App() {
    
    return (
     <div>
      <Header />
       <Content />
      <BottomNav />
     </div>
  );
}

export default App;