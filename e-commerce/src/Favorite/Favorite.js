import React, { useState, useEffect } from 'react';
import './Favorite.css'
import Navigation from "../Navigation/Nav";
import {Link} from "react-router-dom";
import {auth, db} from '../userAuth/userAuth';
import { doc, deleteDoc, getDocs, collection } from "firebase/firestore"; 
import Products from '../db/data';

export default function Favorite() {

    const [query, setQuery] = useState("");
    const [user, setUser] = useState(null);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const getOptions = (id) => { 
        let product = Products.find(product => product.id === parseInt(id));
        return product;
    }

    const tempProducts = [];
    const [products, setProducts] = useState([]);

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
                    if(doc.data().uid == user.uid) {
                        tempProducts.push(doc.data().product); 
                    }
                });
                tempProducts.sort();
                setProducts(tempProducts);
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, [user]);

    const removeFavorite = async (id) => {
        if(user) {
                console.log('remove')
                await getDocs(collection(db, "favorites"))
                    .then((docs) => {
                        docs.forEach((result) => {
                            if(result.data().product == id && result.data().uid == user.uid) {
                                deleteDoc(doc(db, "favorites", result.id))
                                let temp = products;
                                if(temp.indexOf(id) > -1){ temp.splice(temp.indexOf(id), 1); }
                                setProducts([...temp])

                            }
                        });
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                
        } else {
            alert("Please sign in first.");
        }
    }

    const FavoriteItmes = () => {
        return (
            <>
            {products.map((product) => (
                        
                <div className="favorite-item">
                    <Link to={{pathname: `/product/${product}`}}>
                        <img src={getOptions(product).img} alt={getOptions(product).title} className="favorite-img" />
                    </Link>
                    <div className="favorite-details">
                        <Link to={{pathname: `/product/${product}`}}>
                            <h2>{getOptions(product).title}</h2>
                            <h3>{getOptions(product).category}</h3>
                            <h3>${getOptions(product).newPrice}.00</h3>
                            <h3>Color: {getOptions(product).color}</h3>
                        </Link>
                        <div className="favorite-options">
                            <h3 style={{cursor: 'pointer'}} onClick={()=>removeFavorite(product)}>Remove</h3>
                            <h3>Add to Cart</h3>
                        </div>
                    </div>
                </div>
                
            ))}
            </>
        )
    } 

    return (
        <div>
            {/* Nav Bar with Logo */}
            <Link to={`/`}>
                <section className="corner-logo">
                    <div className="logo-container">
                        <h1>🛒</h1>
                    </div>
                </section>
            </Link>
            
            <Navigation query={query} handleInputChange={handleInputChange} />

            <div className="favorite-container">
                <h1 className="favorite-title">Your Favorites</h1>
                
                <div className="favorite-items">
                    <FavoriteItmes />
                </div>
            </div>

        </div>
    )
};