import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageContext } from '../../context/PackageContext';
import { FaImage, FaListAlt } from 'react-icons/fa';
import { FaUpload } from "react-icons/fa6";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const { selectedPackage, setSelectedPackage } = useContext(PackageContext);
  const [collapsed, setCollapsed] = useState(false);
  const [packages, setPackages] = useState([]);

  const handlePackageChange = (e) => {
    console.log(e.target.value)
    setSelectedPackage(e.target.value);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // Fetch packages from the API
    const fetchPackages = async () => {
      try {
        const response = await axios.get('https://qt8flde415.execute-api.ap-south-1.amazonaws.com/get_packages');
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();

    const storedPackage = localStorage.getItem('selectedPackage');
    if (storedPackage) {
      setSelectedPackage(storedPackage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {packages.map(pkg => (
            <option key={pkg.id} value={pkg.package_name}>{pkg.package_name}</option>
          ))}
        </select>
      </div>
      <ul className="menu-items">
        <li>
          <Link to="/" className={!selectedPackage ? 'disabled-link' : ''} style={{ justifyContent: collapsed ? "center" : "" }} onClick={(e) => !selectedPackage && e.preventDefault()}>
            {collapsed ? <FaUpload className="icon" /> : <><FaUpload className="icon" /> Upload Creatives</>}
          </Link>
        </li>
        <li>
          <Link to="/creatives" className={!selectedPackage ? 'disabled-link' : ''} style={{ justifyContent: collapsed ? "center" : "" }} onClick={(e) => !selectedPackage && e.preventDefault()}>
            {collapsed ? <FaImage className="icon" /> : <><FaImage className="icon" /> Creatives List</>}
          </Link>
        </li>
        <li>
          <Link to="/trackers" className={!selectedPackage ? 'disabled-link' : ''} style={{ justifyContent: collapsed ? "center" : "" }} onClick={(e) => !selectedPackage && e.preventDefault()}>
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
