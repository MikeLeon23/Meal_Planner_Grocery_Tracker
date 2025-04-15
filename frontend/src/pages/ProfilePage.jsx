import { useState } from "react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    address: "123 Main Street, City, Country"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        <div className="profile-info">
          <label>Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedUser.name}
              onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
            />
          ) : (
            <p class="white-bg">{user.name}</p>
          )}
        </div>
        <div className="profile-info">
          <label>Email:</label>
          <p class="white-bg">{user.email}</p>
        </div>
        <div className="profile-info">
          <label>Phone:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedUser.phone}
              onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
            />
          ) : (
            <p class="white-bg">{user.phone}</p>
          )}
        </div>
        <div className="profile-info">
          <label>Address:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedUser.address}
              onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
            />
          ) : (
            <p class="white-bg">{user.address}</p>
          )}
        </div>
        <div className="profile-buttons">
          {isEditing ? (
            <button className="save-button" onClick={handleSave}>Save</button>
          ) : (
            <button className="edit-button" onClick={handleEdit}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}
