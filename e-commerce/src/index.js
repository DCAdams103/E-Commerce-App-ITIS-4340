import React from "react";
import ReactDOM from "react-dom/client";
import AppPage from "./App";
import Product from "./Product/Product";
import Login from './Login/Login'
import {BrowserRouter, Routes, Route} from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppPage />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
