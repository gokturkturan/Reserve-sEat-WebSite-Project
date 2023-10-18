import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetRestaurantQuery } from "../slices/restaurantsApiSlice";
import { useSendRestaurantReviewMutation } from "../slices/restaurantsApiSlice";
import { saveReservationInfos } from "../slices/reservationSlice";

const RestaurantDetails = () => {
  const { id: restaurantId } = useParams();
  const { userInfo } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: restaurant,
    refetch,
    isLoading,
    isError,
  } = useGetRestaurantQuery(restaurantId);
  const [sendRestaurantReview, { isLoading: sendReviewLoading }] =
    useSendRestaurantReviewMutation();

  const reservationHandler = () => {
    if (userInfo) {
      dispatch(saveReservationInfos({ restaurantId }));
      navigate(`/selectReservationDetails`);
    } else {
      navigate(`/login?redirect=/selectReservationDetails`);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await sendRestaurantReview({ restaurantId, rating, comment }).unwrap();
      refetch();
      toast.success("Ürün başarıyla değerlendirildi.");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const reviewLoginHandler = () => {
    navigate(`/login?redirect=/restaurant/${restaurant._id}`);
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Geri
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={restaurant.image} alt={restaurant.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{restaurant.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={restaurant.rating}
                    text={`${restaurant.numReviews} Değerlendirme`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>{restaurant.description}</ListGroup.Item>
                <ListGroup.Item>
                  <Col>
                    <Card>
                      <ListGroup variant="flush">
                        <Button
                          type="submit"
                          variant="primary"
                          onClick={reservationHandler}
                        >
                          Rezervasyon Yap
                        </Button>
                      </ListGroup>
                    </Card>
                  </Col>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="review my-4">
            <Col md={6}>
              <h2>Değerlendirmeler</h2>
              {restaurant.reviews.length === 0 && (
                <Message>
                  Bu ürün değerlendirilmemiş. İlk değerlendiren sen ol.
                </Message>
              )}
              <ListGroup variant="flush">
                {restaurant.reviews.map((review) => (
                  <ListGroup key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup>
                ))}
              </ListGroup>
            </Col>
            <Col>
              {userInfo && userInfo.type === "user" && (
                <ListGroup>
                  <h2>Değerlendir</h2>
                  {sendReviewLoading && <Loader />}
                  {userInfo && (
                    <Form onSubmit={submitReview}>
                      <Form.Group controlId="rating">
                        <Form.Label>Puan</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Seçiniz...</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Yorum</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={sendReviewLoading}
                        type="submit"
                        variant="primary"
                      >
                        Değerlendir
                      </Button>
                    </Form>
                  )}
                </ListGroup>
              )}
              {!userInfo && (
                <Button onClick={reviewLoginHandler}>
                  Yorum Yapmak İçin Giriş Yap
                </Button>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default RestaurantDetails;
