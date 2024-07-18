import React from 'react';
// import { PackageContext } from '../../context/PackageContext';
import './Navbar.css';
import logo from '../../assets/logoWhite.png'
import ProfileCard from '../profile';

const Navbar = () => {
  // const { selectedPackage, setSelectedPackage } = useContext(PackageContext);

  // const handlePackageChange = (e) => {
  //   setSelectedPackage(e.target.value);
  // };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="logo" width="150px" src={logo} alt='mfilter logo'/>
      </div>
      <ProfileCard/>
      {/* <div className="navbar-content">
        <h1 className="title">Package Manager</h1>
        <select value={selectedPackage} onChange={handlePackageChange} className="package-dropdown">
          <option value="">Select Package</option>
          <option value="package1">Package 1</option>
          <option value="package2">Package 2</option>
          <option value="package3">Package 3</option>
        </select>
      </div> */}
    </nav>
  );
};

export default Navbar;
