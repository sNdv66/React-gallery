import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const Content = () => {
  //const [images,setImages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState(""); // Simpan nama gambar
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("http://192.168.0.102:8080/api/images/")
      .then((res) => res.json())
      .then((data) => {
        //setImages(data.images || []);
        setSearchResults(data.images || []); // Pastikan searchResults diisi saat gambar dimuat
      })
      .catch((err) => {
        console.error("Gagal mengambil gambar:", err);
        toast.error("Server Crow offline. Gagal mengambil gambar.");
      });
  }, []);
  

  const openModal = (image, name) => {
    setSelectedImage(image);
    setSelectedName(name);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setSelectedName(""); // Reset nama gambar
  };

  return (
    <div>
      <ToastContainer />
      <div className="gallery">
        {searchResults.length > 0 ? (
          searchResults.map((image, index) => {
            const imageUrl = `http://192.168.0.102:8080/api/image/${image}`;
            return (
              <div key={index} className="image-container">
                <img
                  src={imageUrl}
                  alt={image}
                  className="thumbnail"
                  onClick={() => openModal(imageUrl, image)}
                />
                <p className="image-name" style={{ fontSize: '10px', color: 'green', fontWeight: 'bold' }}>
                  {image}
                </p>
              </div>
            );
          })
        ) : (
          <p>Gagal memuat gambar</p>
        )}
      </div>

      {/* Modal untuk melihat gambar lebih besar */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="ReactModal__Overlay"
        closeTimeoutMS={300}
      >
        <button onClick={closeModal} className="close-btn">✖</button>
        {selectedImage && (
          <div className="modal-content">
            <img src={selectedImage} alt="Gambar besar" className="full-image" />
            <p className="image-name">{selectedName}</p> {/* Menampilkan nama di modal */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Content;