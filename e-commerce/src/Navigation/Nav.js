import { FiHeart } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineUserAdd } from "react-icons/ai";
import "./Nav.css";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import { signOut } from "firebase/auth";
import {auth} from '../userAuth/userAuth';

const Nav = ({ handleInputChange, query }) => {
 
  const [user, setUser] = useState(null);  

  const signOutUser = () => {
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        setUser(user);
      }
    });
  }, []);
  
  return (
    <nav>
      <div className="nav-container">
        <input
          className="search-input"
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Enter your search shoes."
        />
      </div>
      <div className="profile-container">
        {user && (
          <a href="#">
          
            <Link to={'/favorite'}>
              <FiHeart className="nav-icons" />
            </Link>
          </a>
        )}
        {user && (
          <a href="">
            <Link to={'/cart'}>
              <AiOutlineShoppingCart className="nav-icons" />
            </Link>
          </a>
        )}
        <a href="">
          {!user ? (
            <Link to={'/login'}>
              <AiOutlineUserAdd className="nav-icons" />
            </Link>
          ) : 
            <h3 className="signout" onClick={()=> signOutUser()}>Sign Out</h3>
          }
          
        </a>
      </div>
    </nav>
  );
};

export default Nav;
