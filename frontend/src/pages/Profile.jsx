import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { useGetMyReservationsQuery } from "../slices/reservationApiSlice";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const {
    data: myReservations,
    isLoading: loadingMyOrders,
    isError,
  } = useGetMyReservationsQuery();

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Şifreler uyuşmuyor.");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          phone,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Bilgileriniz başarılı bir şekilde güncellendi.");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <Row>
      <Col md={4}>
        <h2>Profil</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>İsim</Form.Label>
            <Form.Control
              type="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="email" className="my-2">
            <Form.Label>E-Posta</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Group>
          {userInfo.type === "user" && (
            <Form.Group controlId="tel" className="my-2">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </Form.Group>
          )}
          <Form.Group controlId="password" className="my-2">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Şifre Tekrar</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </Form.Group>
          <Button type="submit" className="my-2" variant="primary">
            Bilgilerimi Güncelle
          </Button>
          {isLoading && <Loader />}
        </Form>
      </Col>
      <Col md={8}>
        <h2>Rezervasyonlarım</h2>
        {loadingMyOrders ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tarih</th>
                <th>Toplam</th>
                <th>Ödenme Tarihi</th>
                <th>Teslim Edilme Tarigi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myReservations.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice} TL</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Detaylar
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default Profile;
