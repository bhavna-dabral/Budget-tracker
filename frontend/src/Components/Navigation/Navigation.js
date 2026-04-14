import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import avatarPlaceholder from "../../img/avatar1.jpg";
import { signout } from "../../utils/Icons";
import { menuItems } from "../../utils/menuItems";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

function Navigation({ active, setActive }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(avatarPlaceholder);
  const [userName, setUserName] = useState("User");
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // ✅ Toggle mobile menu
  const handleToggleMenu = () => setMenuOpen(!menuOpen);

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success && data.user) {
          setUserName(data.user.name || "User");
          if (data.user.avatar) {
            const avatarPath = data.user.avatar.startsWith("http")
              ? data.user.avatar
              : `${backendUrl}${data.user.avatar}`;
            setUserAvatar(avatarPath);
          } else {
            setUserAvatar(avatarPlaceholder);
          }
        } else {
          toast.error(data.message || "Unable to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchUserProfile();
  }, [token, backendUrl]);

  // ✅ Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file); // ✅ corrected key

      const { data } = await axios.post(
        `${backendUrl}/api/user/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success && data.avatar) {
        const avatarPath = data.avatar.startsWith("http")
          ? data.avatar
          : `${backendUrl}${data.avatar}`;
        setUserAvatar(avatarPath);
        toast.success("Avatar updated successfully");
      } else {
        toast.error(data.message || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Error uploading avatar");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  if (!token) return null;

  return (
    <NavStyled menuOpen={menuOpen}>
      {/* === User Section === */}
      <div className="user-con">
        <div className="avatar-con">
          <label htmlFor="avatar-upload">
            <img src={userAvatar} alt="User Avatar" />
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </div>

        <div className="text">
          <h2>{userName}</h2>
          <p>Your Money</p>
        </div>

        <div className="menu-toggle" onClick={handleToggleMenu}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {/* === Menu Items === */}
      <ul className={`menu-items ${menuOpen ? "show" : ""}`}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={active === item.id ? "active" : ""}
            onClick={() => {
              setActive(item.id);
              navigate(item.link);
              setMenuOpen(false);
            }}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
      </ul>

      {/* === Logout === */}
      <div className="bottom-nav">
        <ul>
          <li onClick={handleLogout}>
            {signout}
            <span>Sign Out</span>
          </li>
        </ul>
      </div>
    </NavStyled>
  );
}


const NavStyled = styled.nav`
  width: 260px;
  height: 100vh;
  padding: 2rem 1.5rem;
  background: rgba(252, 246, 249, 0.9);
  border: 3px solid #ffffff;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease-in-out;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-radius: 0;
    padding: 1rem;
    position: relative;
  }

  .user-con {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    @media (max-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .avatar-con {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-con img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(34, 34, 96, 0.2);
  }

  input[type="file"] {
    display: none;
  }

  .text h2 {
    font-size: 1.3rem;
    color: #222260;
    margin-top: 0.4rem;
  }

  .menu-toggle {
    display: none;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
      color: #222260;
    }
  }

  .menu-items {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0;

    li {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      margin: 1rem 0;
      cursor: pointer;
      color: rgba(34, 34, 96, 0.7);
      font-weight: 500;
      transition: color 0.3s;

      &.active,
      &:hover {
        color: rgba(34, 34, 96, 1);
      }
    }
  }

  @media (max-width: 768px) {
    .menu-items {
      display: none;
      flex-direction: column;
      background: #fff;
      border-radius: 12px;
      padding: 1rem;
      position: absolute;
      top: 90px;
      left: 0;
      right: 0;
      z-index: 20;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

      &.show {
        display: flex;
      }
    }
  }

  .bottom-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: rgba(34, 34, 96, 0.7);
      font-weight: 500;
      transition: color 0.3s;

      &:hover {
        color: rgba(34, 34, 96, 1);
      }
    }
  }
`;

export default Navigation;
