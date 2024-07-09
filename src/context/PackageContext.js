import React, { createContext, useState, useEffect } from 'react';

export const PackageContext = createContext();

export const PackageProvider = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState(
    localStorage.getItem('selectedPackage') || ''
  );

  useEffect(() => {
    localStorage.setItem('selectedPackage', selectedPackage);
  }, [selectedPackage]);

  return (
    <PackageContext.Provider value={{ selectedPackage, setSelectedPackage }}>
      {children}
    </PackageContext.Provider>
  );
};
