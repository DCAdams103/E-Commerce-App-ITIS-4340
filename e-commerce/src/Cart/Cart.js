import './Cart.css'
import React, {useState, useEffect} from 'react'
import Navigation from "../Navigation/Nav";
import {Link} from "react-router-dom";
import {auth, db} from '../userAuth/userAuth';
import { doc, deleteDoc, getDocs, addDoc, collection } from "firebase/firestore"; 
import Products from '../db/data';

export default function Cart() {

    const [query, setQuery] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };
    
    const getOptions = (id) => { 
        let product = Products.find(product => product.id === parseInt(id));
        return product;
    }

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
          if (user) {
            setUser(user);
          }
        });
      }, []);

    useEffect( () => {
        if(user) {
            getDocs(collection(db, "cart"))
                .then((docs) => {
                    let count = 0;
                    let tempProducts = [];
                    let tempTotal = 0;
                    docs.forEach((doc) => {
                        if(doc.data().uid == user.uid) {
                            count += 1;
                            tempProducts.push({id: doc.data().product, size: doc.data().size});
                            tempTotal += getOptions(doc.data().product).newPrice;
                        }
                    });
                    setTotalItems(count);
                    setProducts([...tempProducts]);
                    setTotalPrice(tempTotal);  
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });

        }
    }, [user]);

    const removeFromCart = async (id) => {
        if(user) {
            await getDocs(collection(db, "cart"))
            .then((docs) => {
                docs.forEach((result) => {
                    if(result.data().product == id && result.data().uid == user.uid) {
                        deleteDoc(doc(db, "cart", result.id))
                        let temp = products;
                        let filtered = temp.filter(item => item.id !== id);
                        setProducts([...filtered])
                        setTotalItems(totalItems - 1);
                    }
                });
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }

    const CartItems = () => {
        return (
            <>
                {Object.entries(products).map(([index, product]) => {
                    return (
                        <div className="cart-item">
                            <div>
                                <img className="cart-image" src={getOptions(product.id).img} alt={getOptions(product.id).name} />
                                <h3>{getOptions(product.id).title}</h3>
                                <div className="price">
                                    <h3>${getOptions(product.id).newPrice}</h3>
                                </div>
                                <h3>Size {product.size}</h3>
                                <p onClick={()=>removeFromCart(product.id)}>Remove</p>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    };

    return (
        <div className="cart-container">
            {/* Nav Bar with Logo */}
            <Link to={`/`}>
                <section className="corner-logo">
                    <div className="logo-container">
                        <h1>🛒</h1>
                    </div>
                </section>
            </Link>
            
            <Navigation query={query} handleInputChange={handleInputChange} />

            <div className="cart-container">
                <div className="left-side">
                    <div className="top-row">
                        <h1 className='cart-title'>Shopping Cart</h1>
                        <h1 className='total-items-title'>Total Items: {totalItems}</h1>
                    </div>
                    <br/>
                    <div className='headers-container'>
                        <h3 className="headers-details">Product Details</h3>
                        <h3 className="headers-price">Price</h3>
                    </div>
                    <div className="cart-items">
                        <CartItems />
                        
                    </div>
                </div>
                
                <div className="right-side">

                </div>

            </div>

        </div>
    )
}