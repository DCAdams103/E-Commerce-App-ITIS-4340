import React from "react";
import ReactDOM from "react-dom/client";
import AppPage from "./App";
import Product from "./Product/Product";
import Login from './Login/Login'
import Favorite from './Favorite/Favorite'
import Cart from './Cart/Cart'
import {BrowserRouter, Routes, Route} from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppPage />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/login" element={<Login />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </BrowserRouter>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
