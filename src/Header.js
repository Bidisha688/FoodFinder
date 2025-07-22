import { logoLink } from "./Utils/constants";
const Header = () => (
    <div className="header">
      <div className="logocontainer">
        <img
          className="logo"
          src={logoLink}
          alt="logo"
        />
      </div>
      <div className="nav-items">
        <ul>
          <li>Home</li>
          <li>About Us</li>
          <li>Contact</li>
          <li>Cart</li>
        </ul>
      </div>
    </div>
  );
  export default Header;