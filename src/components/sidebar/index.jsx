import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageContext } from '../../context/PackageContext';
import { FaImage, FaPlusCircle, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import { FaUpload } from "react-icons/fa6";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import './Sidebar.css';

const Sidebar = () => {
  const { selectedPackage, setSelectedPackage } = useContext(PackageContext);
  const [collapsed, setCollapsed] = useState(false);

  const handlePackageChange = (e) => {
    setSelectedPackage(e.target.value);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    // Initialize selected package from localStorage on component mount
    const storedPackage = localStorage.getItem('selectedPackage');
    if (storedPackage) {
      setSelectedPackage(storedPackage);
    }
  }, []);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="package-selector">
        <select
          value={selectedPackage}
          className="package-dropdown"
          onChange={handlePackageChange}
        >
          <option value="">Select Package</option>
          <option value="package_1">Package 1</option>
          <option value="package_2">Package 2</option>
          <option value="package_3">Package 3</option>
        </select>
      </div>
      <ul className="menu-items">
        <li>
          <Link to="/" className={!selectedPackage ? 'disabled-link' : ''} style={{justifyContent:collapsed?"center":""}} onClick={(e) => !selectedPackage && e.preventDefault()}>
            {collapsed ? <FaUpload className="icon"  /> : <><FaUpload className="icon" /> Upload Creatives</>}
          </Link>
        </li>
        <li>
          <Link to="/creatives" className={!selectedPackage ? 'disabled-link' : ''} style={{justifyContent:collapsed?"center":""}} onClick={(e) => !selectedPackage && e.preventDefault()}>
            {collapsed ? <FaImage className="icon" /> : <><FaImage className="icon" /> Creatives List</>}
          </Link>
        </li>
        <li>
          <Link to="/trackers" className={!selectedPackage ? 'disabled-link' : ''} style={{justifyContent:collapsed?"center":""}} onClick={(e) => !selectedPackage && e.preventDefault()}>
            {collapsed ? <FaListAlt className="icon" /> : <><FaListAlt className="icon" /> Trackers</>}
          </Link>
        </li>
      </ul>
      <div className="toggle-sidebar" onClick={toggleSidebar}>
        {collapsed ? <TbLayoutSidebarRightCollapse className="toggle-icon" /> : <TbLayoutSidebarLeftCollapse className="toggle-icon" />}
      </div>
    </div>
  );
};

export default Sidebar;
