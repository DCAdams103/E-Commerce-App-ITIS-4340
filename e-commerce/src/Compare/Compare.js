import './Compare.css'
import Products from '../db/data';
import {useLocation, useParams} from "react-router-dom";
import {useState} from "react";
import Navigation from "../Navigation/Nav";
import {Link} from "react-router-dom";
import {auth, db} from '../userAuth/userAuth';
import { doc, deleteDoc, getDocs, addDoc, collection } from "firebase/firestore"; 

export default function Compare() {

    const [query, setQuery] = useState("");
    const {id} = useParams();
    const product = Products.find(product => product.id === parseInt(id));
    const [leftImgUrl, setLeftImgUrl] = useState(product.img);
    const [user, setUser] = useState(null);
    const [favText, setFavText] = useState("Favorite");
    const [cartText, setCartText] = useState("Add to Cart");

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const getOptions = (id) => { 
        let product = Products.find(product => product.id === parseInt(id));
        return product;
    }

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

            {/* Main Container */}
            <div className="compare-container">
                <div className="left-product">
                    <div className="left-images">
                        <div className="compare-image-container">
                            <img className="image" src={leftImgUrl} alt={product.title} />
                        </div>

                        <div className="compare-product-details">

                            <h1>{product.title}</h1>

                            <div className="left-category">
                                <h2>{product.category}</h2>
                            </div>
                            <br/>
                            <div className="">
                                <h2 className="left-price">${product.newPrice}</h2>
                            </div>
                            <br/><br/><br/>
                            <div className="description">
                                <h3 className="left-desc-text">{product.description}</h3>
                            </div>
                            
                            <button className="favorite-compare-button" onClick={()=> addToFavorite()}>{favText}</button>
                        </div>
                    </div>

                    <div className="color-options">
                        {product.options.length > 0 && (
                            <>
                                <h2>Color Options:</h2>
                                {product.options.map(img => (
                                    <button className="color-button" onClick={() => {setLeftImgUrl(img); console.log('set')}}>
                                        <div className="color-option">
                                            <img className="option-image" src={img} alt="option" />
                                        </div>
                                    </button>
                                    
                                ))}
                            </>
                        )}
                    </div>
                    
                </div>
                <div className="right-product">
                    <div className="right-options">
                        {Products.filter(product => product.category === getOptions(id).category)
                            .map(product => (
                                <div>
                                    <div className="compare-product">
                                        <img className="compare-image" src={product.img} alt={product.title} />
                                        <h2 className="compare-title">{product.title}</h2>
                                        <h2 className="compare-price">${product.newPrice}</h2>
                                    </div>
                                    <button className="favorite-compare-items-button" onClick={()=> addToFavorite()}>{favText}</button>
                                    <br/><br/><br/><br/><br/>
                                    <hr />
                                </div>
                                
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}