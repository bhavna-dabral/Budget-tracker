import React, { useContext } from "react";
import styled from "styled-components";
import avatarPlaceholder from "../../img/avatar1.jpg";
import { signout } from "../../utils/Icons";
import { menuItems } from "../../utils/menuItems";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navigation({ active, setActive }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  return (
    <NavStyled>
      {/* MOBILE PROFILE */}
      <div className="mobile-profile">
        <img src={avatarPlaceholder} alt="user" />
        <div>
          <h3>{userName}</h3>
          <p>{userEmail}</p>
        </div>
      </div>

      {/* DESKTOP PROFILE */}
      <div className="user-con">
        <img src={avatarPlaceholder} alt="user" />
        <div className="text">
          <h2>{userName}</h2>
          <p>{userEmail}</p>
        </div>
      </div>

      {/* MENU */}
      <ul className="menu-items">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActive(item.id)}
            className={active === item.id ? "active" : ""}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
      </ul>

      {/* LOGOUT */}
      <div className="bottom-nav">
        <li onClick={handleLogout}>
          {signout}
          <span>Sign Out</span>
        </li>
      </div>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  padding: 1.5rem;
  width: 320px;
  min-width: 320px;
  height: 100%;
  background: rgba(252, 246, 249, 0.78);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  /* DESKTOP ONLY */
  .mobile-profile {
    display: none !important;
  }

  .user-con {
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      object-fit: cover;
    }

    h2 {
      margin: 0;
      color: #222260;
      font-size: 1.4rem;
    }

    p {
      margin: 0;
      color: gray;
      font-size: 0.9rem;
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      cursor: pointer;
      color: #6b6b8d;
      transition: 0.3s;
    }

    li:hover {
      background: rgba(108, 99, 255, 0.08);
    }

    .active {
      background: #6c63ff;
      color: white;
    }
  }

  .bottom-nav li {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: red;
    font-weight: 600;
  }

  /* MOBILE */
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    padding: 1rem;
    gap: 1rem;

    /* HIDE DESKTOP PROFILE */
    .user-con {
      display: none !important;
    }

    /* SHOW MOBILE PROFILE */
    .mobile-profile {
      display: flex !important;
      align-items: center;
      gap: 12px;
      justify-content: center;

      img {
        width: 55px;
        height: 55px;
        border-radius: 50%;
      }

      h3 {
        margin: 0;
        color: #222260;
        font-size: 1rem;
      }

      p {
        margin: 0;
        font-size: 0.75rem;
        color: gray;
      }
    }

    .menu-items {
      flex-direction: row;
      justify-content: space-around;
      gap: 0;

      li {
        padding: 10px;
      }

      li span {
        display: none;
      }
    }

    .bottom-nav li span {
      display: none;
    }
  }
`;

export default Navigation;


