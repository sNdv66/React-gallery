import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaExpand, FaCompress } from "react-icons/fa";
import CrowImage from "./assets/crow2.jpg";
import "./Header.css"; // Pastikan ada file CSS

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Saat pertama kali halaman dimuat, cek tema dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  return (
    <header className={`header ${darkMode ? "dark-mode" : ""}`}>
      <div className="logo">
        <img src={CrowImage} alt="Crow Logo" />
        <h1>Gallery Crow</h1>
      </div>
      <div className="buttons">
        <button onClick={toggleDarkMode} title="Toggle Theme">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
    </header>
  );
};

export default Header;