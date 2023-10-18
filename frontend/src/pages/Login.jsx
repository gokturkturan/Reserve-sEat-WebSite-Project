import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.user);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password, type }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={15} md={8} sm={10} lg={4}>
          <h1>Giriş Yap</h1>
          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            disabled={type === "user"}
            onClick={() => setType("user")}
          >
            Kullanıcı Girişi
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            disabled={type === "restaurant"}
            onClick={() => setType("restaurant")}
          >
            Restorant Girişi
          </Button>
          <Form onSubmit={submitHandler}>
            <Form.Group id="email" className="my-2" controlId="email">
              <Form.Label>E-Posta</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="password" className="my-2" controlId="password">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              disabled={isLoading}
            >
              Giriş Yap
            </Button>
            {isLoading && <Loader />}
          </Form>
          <Row className="py-3">
            <Col>
              Henüz kayıt olmadın mı ?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Kayıt Ol!
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
