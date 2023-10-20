import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { clearCredentials } from "../slices/authSlice";
import logo from "../assets/logo.png";
import SearchBox from "./SearchBox";

const Header = () => {
  const { userInfo } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header>
      <Navbar expand="md" collapseOnSelect className="border">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="SkyShop" className="logo"></img>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox isReservationPage={false} />
              {userInfo && userInfo.type === "restaurant" && (
                <NavDropdown
                  title="Restorant İşlemleri"
                  id="adminMenu"
                  style={{ fontWeight: "600" }}
                >
                  <LinkContainer to="/restaurant/branches">
                    <NavDropdown.Item>Şubeler</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/restaurant/reservations">
                    <NavDropdown.Item>Rezervasyonlar</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id="username"
                  style={{ fontWeight: "600" }}
                >
                  <LinkContainer
                    to={
                      userInfo.type === "user"
                        ? "/profile"
                        : "restaurantprofile"
                    }
                  >
                    <NavDropdown.Item>Profil</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Çıkış Yap
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser style={{ marginBottom: "4px" }} />
                    <span style={{ marginLeft: "5px" }}>Giriş Yap</span>
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
