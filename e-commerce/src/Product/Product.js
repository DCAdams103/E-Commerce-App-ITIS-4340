import React, {useEffect, useState} from "react"
import {useLocation, useParams} from "react-router-dom";
import Products from '../db/data';
import Navigation from "../Navigation/Nav";
import './Product.css';
import {Link} from "react-router-dom";
import {auth, db} from '../userAuth/userAuth';
import { doc, deleteDoc, getDocs, addDoc, collection } from "firebase/firestore"; 

export default function Product() {

    const {state} = useLocation();
    const {id} = useParams();
    const product = Products.find(product => product.id === parseInt(id));
    const [imgUrl, setImgUrl] = useState(product.img);
    const [selectedSize, setSelectSize] = useState("");
    const [user, setUser] = useState(null);
    const [favText, setFavText] = useState("Favorite");
    const [cartText, setCartText] = useState("Add to Cart");

    // ----------- Input Filter -----------
    const [query, setQuery] = useState("");

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };
    
    useEffect(() => { 
        setImgUrl(product.img);
    }, [product]);

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
          if (user) {
            setUser(user);
          }
        });
      }, []);

    useEffect( () => {
        if(user) {

            getDocs(collection(db, "favorites"))
            .then((docs) => {
                docs.forEach((doc) => {
                    if(doc.data().product == product.id && doc.data().uid == user.uid) {
                        setFavText("Favorited");
                    }
                });
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            getDocs(collection(db, "cart"))
            .then((docs) => {
                docs.forEach((doc) => {
                    if(doc.data().product == product.id && doc.data().uid == user.uid) {
                        setCartText("Added to Cart");
                    }
                });
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

        }
    }, [user]);
    

    const availableSizes = ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0"];

    const getOptions = (id) => { 
        let product = Products.find(product => product.id === parseInt(id));
        return product;
    }

    const sizeSelected = (eId) => {
        if(selectedSize != eId) {
            
            if(selectedSize != "") {
                let element = document.getElementById(selectedSize);
                element.style.backgroundColor = "#E0E0E0";
            }

            let element = document.getElementById(eId);
            element.style.backgroundColor = "#838383";
            setSelectSize(eId);

        }
    };

    const addToCart = async () => {
        if(user != null) {
            if(cartText == "Added to Cart") {
                {
                    await getDocs(collection(db, "cart"))
                    .then((docs) => {
                        docs.forEach((result) => {
                            if(result.data().product == product.id && result.data().uid == user.uid) {
                                deleteDoc(doc(db, "cart", result.id))
                            }
                        });
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                    setCartText("Add to Cart");
                }
            } else if(selectedSize != "") {
                if(cartText == "Add to Cart") {

                    await addDoc(collection(db, "cart"), {
                        product: product.id,
                        size: selectedSize,
                        uid: user.uid,
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });

                    setCartText("Added to Cart");
                }
            } else {
                alert("Please select a size first.");
            }
        } else {
            alert("Please sign in first.");
        }

    };

    const addToFavorite = async () => {
        if(user) {
            if(favText == "Favorited") {
                
                await getDocs(collection(db, "favorites"))
                    .then((docs) => {
                        docs.forEach((result) => {
                            if(result.data().product == product.id && result.data().uid == user.uid) {
                                deleteDoc(doc(db, "favorites", result.id))
                            }
                        });
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                    
                setFavText("Favorite");
                
            } else {
            
                await addDoc(collection(db, "favorites"), {
                    product: product.id,
                    uid: user.uid,
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
                
                setFavText("Favorited");

            }
        } else {
            alert("Please sign in first.");
        }
    };

    const compareAction = () => {
        if(user) {
            console.log("Added to Compare");
        } else {
            alert("Please sign in first.");
        }
    };

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
                            <button className="size-button" id={size} onClick={()=>{sizeSelected(size);}}>{size}</button>
                        ))}
                    </div>
                        
                    <div className="button-container">
                        <button className="add-to-cart" onClick={()=>addToCart()}>{cartText}</button>
                        <button className="favorite-button" onClick={()=> addToFavorite()}>{favText}</button>
                        <button className="compare-button" onClick={()=>compareAction()}>Compare</button>
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