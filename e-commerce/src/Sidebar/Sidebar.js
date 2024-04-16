import Category from "./Category/Category";
import Price from "./Price/Price";
import Colors from "./Colors/Colors";
import "./Sidebar.css";
import {Link} from "react-router-dom";

const Sidebar = ({ handleChange }) => {
  return (
    <>
      <section className="sidebar">
        <Link to={'/'}>
          <div className="logo-container">
            <h1>🛒</h1>
          </div>
        </Link>
        <Category handleChange={handleChange} />
        <Price handleChange={handleChange} />
        <Colors handleChange={handleChange} />
      </section>
    </>
  );
};

export default Sidebar;
