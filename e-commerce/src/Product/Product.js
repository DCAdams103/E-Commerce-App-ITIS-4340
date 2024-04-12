import React, {useEffect, useState} from "react"
import {useLocation, useParams} from "react-router-dom";
import Products from '../db/data';
import Card from "../components/Card";
import Navigation from "../Navigation/Nav";
import Sidebar from "../Sidebar/Sidebar";
import './Product.css';
import {Link} from "react-router-dom";

export default function Product() {

    const {state} = useLocation();
    const {id} = useParams();
    const [imgUrl, setImgUrl] = useState("");

    // ----------- Input Filter -----------
    const [query, setQuery] = useState("");

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    let product = Products.find(product => product.id === parseInt(id));
    
    useEffect(() => { 
        setImgUrl(product.img);
    }, []);

    const availableSizes = ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0"];

    const getOptions = (id) => { 
        let product = Products.find(product => product.id === parseInt(id));
        return product;
    }

    // return (
    //     <Card
    //         key={Math.random()}
    //         img={product.img}
    //         title={product.title}
    //         star={product.star}
    //         reviews={product.reviews}
    //         prevPrice={product.prevPrice}
    //         newPrice={product.newPrice}
    //   />
    // );

    return (
        <div>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&display=swap')
            </style>
            {/* Nav Bar with Logo */}
            <Link to={`/`}>
                <section className="corner-logo">
                    <div className="logo-container">
                        <h1>🛒</h1>
                    </div>
                </section>
            </Link>

            
            <Navigation query={query} handleInputChange={handleInputChange} />

            {/* Main Container */}
            <div className="main-container">
                <div className="options-container">
                    <div className="image-container">
                        <img className="image" src={imgUrl} alt={product.title} />
                    </div>
                    {product.options.length > 0 && (
                        <>
                            <h2>Color Options:</h2>
                            {product.options.map(img => (
                                <button className="color-button" onClick={() => {setImgUrl(img); console.log('set')}}>
                                    <div className="color-option">
                                        <img className="option-image" src={img} alt="option" />
                                    </div>
                                </button>
                                
                            ))}
                        </>
                    )}
                </div>

                <div className="product-details">
                    <h1>{product.title}</h1>

                    <div className="details-grid-container">
                        <div className="other-details">

                            <div className="category">
                                <h2>{product.category}</h2>
                            </div>

                            <div className="price">
                                <span className="new-price">${product.newPrice}</span>
                            </div>

                        </div>
                        
                        <div className="description">
                            <h3 className="desc-text">{product.description}</h3>
                        </div>

                    </div>

                    <h2 className="select-size-title">Select a Size:</h2>
                    <div className="size-container">
                        {availableSizes.map(size => (
                            <button className="size-button" key={size}>{size}</button>
                        ))}
                    </div>
                        
                    <div className="button-container">
                        <button className="add-to-cart">Add to Cart</button>
                        <button className="favorite-button">Favorite</button>
                        <button className="compare-button">Compare</button>
                    </div>
                    
                </div>
            </div>

            <div className="recommended-container">
                <h3 className="recommend-text">You Might Also Like</h3>
                <div className="recommended-products">
                    {Products.filter(productFilter => productFilter.category == product.category).slice(0,4).map(productResult => (
                        <Link to={`/product/${productResult.id}`}>
                        <div className="color-option" key={id}>
                            <img className="option-image" src={getOptions(productResult.id).img} alt={getOptions(productResult.id).color} />
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
            
        </div>
    )
}