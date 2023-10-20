import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateRestaurantProfileMutation } from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import { setCredentials } from "../../slices/authSlice";
import { useUploadRestaurantImageMutation } from "../../slices/restaurantsApiSlice";

const RestaurantProfile = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newImage, setNewImage] = useState("");

  const dispatch = useDispatch();

  const [updateProfile, { isLoading }] = useUpdateRestaurantProfileMutation();

  const [uploadRestaurantImage, { isLoading: uploadLoading }] =
    useUploadRestaurantImageMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setImage(userInfo.image);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Şifreler uyuşmuyor.");
    } else {
      try {
        const updatedRestaurant = {
          _id: userInfo._id,
          name,
          email,
          image,
          password,
          type: "restaurant",
        };
        if (newImage) {
          const formData = new FormData();
          formData.append("image", newImage);
          const res = await uploadRestaurantImage(formData).unwrap();
          updatedRestaurant.image = res.image;
        }
        const res = await updateProfile(updatedRestaurant).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Bilgileriniz başarılı bir şekilde güncellendi.");
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <Row>
      <h2>Profil</h2>
      <Col md={4}>
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
          <Form.Group controlId="image" className="my-2">
            <Form.Label>Resim</Form.Label>
            <Form.Control
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Form.Control
              type="file"
              label="Fotoğraf seçiniz"
              onChange={(e) => setNewImage(e.target.files[0])}
            ></Form.Control>
            {uploadLoading && <Loader />}
          </Form.Group>
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
        <>
          <div>Profil Resmi</div>
          <Image
            src={userInfo.image}
            alt={userInfo.name}
            roundedCircle
            style={{ height: 200 }}
          />
        </>
      </Col>
    </Row>
  );
};

export default RestaurantProfile;
