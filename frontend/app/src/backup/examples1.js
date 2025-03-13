import React, { useEffect, useState } from 'react';
import './.css';
// example get data dan variable
function App() {
    const [data, setData] = useState({ nama: [], jumlah: 0 });
    useEffect(() => {
        fetch('http://192.168.0.106:8080/api/data')
            .then((response) => response.json())
            .then((data) => {
                setData({
                    nama: data.nama,
                    jumlah: data.jumlah,
                });
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);
    return (
        <div>
            <h1>Bio Data</h1>
            <p>Jumlah: {data.jumlah}</p>
            <ul>
                {data.nama.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;