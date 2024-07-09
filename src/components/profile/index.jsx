import React from 'react';
import './ProfileCard.css'; // Import the CSS file for styling

const ProfileCard = () => {
  return (
    <div className="profile-card">
      <div className="avatar">
        <img src="https://via.placeholder.com/100" alt="Profile Avatar" />
      </div>
      <div className="profile-details">
        <h3>kesahv</h3>
        <p>keshav@gmail.com</p>
      </div>
    </div>
  );
};

export default ProfileCard;
