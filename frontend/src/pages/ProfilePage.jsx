import { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null); // Initially null to handle loading state
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get("http://localhost:5000/api/user/profile", { // Fixed endpoint URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        setUser(userData);
        setUpdatedUser(userData); // Initialize updatedUser for editing
      } catch (err) {
        setError(err.message || "Failed to fetch user profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/user/profile", // Fixed endpoint URL
        {
          name: updatedUser.name,
          phone: updatedUser.phone,
          address: updatedUser.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save profile changes.");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="profile-container"><p style={{ color: "red" }}>{error}</p></div>;
  }

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
            <p className="white-bg">{user.name}</p>
          )}
        </div>
        <div className="profile-info">
          <label>Email:</label>
          <p className="white-bg">{user.email}</p>
        </div>
        <div className="profile-info">
          <label>Phone:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedUser.phone || ''} // Handle null/undefined
              onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
            />
          ) : (
            <p className="white-bg">{user.phone || 'Not provided'}</p>
          )}
        </div>
        <div className="profile-info">
          <label>Address:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedUser.address || ''} // Handle null/undefined
              onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
            />
          ) : (
            <p className="white-bg">{user.address || 'Not provided'}</p>
          )}
        </div>
        <div className="profile-buttons">
          {isEditing ? (
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}