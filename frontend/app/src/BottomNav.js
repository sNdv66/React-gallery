import React, { useState, useEffect } from "react";
import { FaSearch, FaUpload, FaHome } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal"; // Import Modal
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BottomNav.css";
import "./Toast.css";

Modal.setAppElement("#root");

const BottomNav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalImage, setModalImage] = useState(null); // Untuk menyimpan gambar yang diperbesar
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk kontrol modal

  useEffect(() => {
    fetch("http://192.168.0.102:8080/api/images/")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
      })
      .catch((err) => console.error("Gambar tidak ditemukan:", err));
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowUploadMenu(false);
  };

  const toggleUpload = () => {
    setShowUploadMenu(!showUploadMenu);
    setShowMenu(false);
  };

  const closeMenus = () => {
    setShowMenu(false);
    setShowUploadMenu(false);
  };

  const preventClose = (e) => {
    e.stopPropagation();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Pilih file terlebih dahulu!", { position: "top-right" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://192.168.0.102:8080/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Upload berhasil!", { position: "top-right" });
      setSelectedFile(null);
      return response;
    } catch (error) {
      toast.error("Upload gagal, coba lagi!", { position: "bottom-right" });
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(images);
      return;
    }

    const results = images.filter((image) =>
      image.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    
    if (results.length === 0) {
      toast.error("Gambar tidak ditemukan", { position: "top-right" });
    }
  };

  // Fungsi untuk membuka modal gambar
  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal gambar
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  return (
    <>
      <nav className="bottom-nav">
        <button className="nav-item" onClick={toggleMenu}>
          <FaSearch />
          <span>Search</span>
        </button>
        <button className="nav-item" onClick={toggleUpload}>
          <FaUpload />
          <span>Upload</span>
        </button>
        <button className="nav-item">
          <FaHome />
          <span>Beranda</span>
        </button>
      </nav>

      {/* Floating Menu Pencarian */}
      {showMenu && (
        <div className="floating-menu" onClick={closeMenus}>
          <div className="menu-content" onClick={preventClose}>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Jelajahi gambar menarik ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button className="search-btn" onClick={handleSearch}>
                Cari
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                <h4>Hasil Pencarian:</h4>
                <div className="search-gallery">
                  {searchResults.map((result, index) => {
                    const imageUrl = `http://192.168.0.102:8080/api/image/${result}`;
                    return (
                      <div key={index} className="image-container">
                        <img
                          src={imageUrl}
                          alt={result}
                          className="thumbnail"
                          onClick={() => openModal(imageUrl)} // Klik untuk memperbesar
                        />
                        <p className="image-name">{result}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Menu Upload */}
      {showUploadMenu && (
        <div className="floating-menu" onClick={closeMenus}>
          <div className="menu-content" onClick={preventClose}>
            <h3>Upload Gambar</h3>
            <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} />
            <button className="upload-btn" onClick={handleUpload}>Upload</button>
          </div>
        </div>
      )}

      {/* Modal untuk menampilkan gambar lebih besar */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="ReactModal__Overlay"
        closeTimeoutMS={300}
      >
        <button onClick={closeModal} className="close-btn">✖</button>
        {modalImage && (
          <div className="modal-content">
            <img src={modalImage} alt="Gambar besar" className="full-image" />
          </div>
        )}
      </Modal>
    </>
  );
};

export default BottomNav;