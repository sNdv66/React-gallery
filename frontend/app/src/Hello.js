import React from 'react';
import './App.css';
import 'normalize.css';
const user = {
    name: 'handy',
    age: '26',
    address :'jakarta'
}


function Hello(){
    
    return (
        <div>
        <p>Nama : {user.name}</p>
        <p>umur :{user.age}</p>
        <p>alamat : {user.address}</p>
        </div>
    );
    
}

export default Hello;