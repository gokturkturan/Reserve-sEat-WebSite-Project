import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useGetRestaurantQuery } from "../slices/restaurantsApiSlice";
import { useMakeReservationMutation } from "../slices/reservationApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const ReservationDetails = () => {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);
  const { name, email, phone } = userInfo;

  const { reservationInfos } = useSelector((state) => state.reservation);
  const { restaurantId } = reservationInfos;

  const [makeReservation, { isLoading: loadingMakingReservation, error }] =
    useMakeReservationMutation();

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useGetRestaurantQuery(restaurantId);

  const [userName, setUserName] = useState(name || "");
  const [userEmail, setUserEmail] = useState(email || "");
  const [userPhone, setUserPhone] = useState(phone || "");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  useEffect(() => {
    if (branch) {
      const branchObject = restaurant.branches.find((b) => b.name === branch);
      const workingHours = branchObject.workingHours;
      setWorkingHours(workingHours);
    } else {
      const workingHours = "";
      setWorkingHours(workingHours);
    }
  }, [branch, restaurant]);

  useEffect(() => {
    const today = new Date()
      .toLocaleString("sv-SE", { timeZone: "Europe/Istanbul" })
      .split(" ")[0];

    const currentTime = new Date()
      .toLocaleString("sv-SE", { timeZone: "Europe/Istanbul" })
      .split(" ")[1]
      .slice(0, -3);

    setTime(currentTime);
    setDate(today);
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (selectedDate >= date) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const currentTime = new Date()
      .toLocaleString("sv-SE", { timeZone: "Europe/Istanbul" })
      .split(" ")[1]
      .slice(0, -3);

    if (
      date ===
        new Date()
          .toLocaleString("sv-SE", { timeZone: "Europe/Istanbul" })
          .split(" ")[0] &&
      selectedTime <= currentTime
    ) {
      setTime(currentTime);
    } else {
      setTime(selectedTime);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await makeReservation({
        userName,
        userEmail,
        userPhone,
        restaurantId,
        branch,
        date,
        time,
        note: note ? note : "",
      }).unwrap();
      toast.success(res);
      navigate(`/profile`);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={15} md={12} sm={10} lg={7}>
          <h1>Rezervasyon Sahibinin Bilgileri</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group id="name" className="my-2" controlId="name">
              <Form.Label>İsim:</Form.Label>
              <Form.Control
                type="text"
                value={userName}
                required
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="email" className="my-2" controlId="email">
              <Form.Label>E-Posta:</Form.Label>
              <Form.Control
                type="text"
                value={userEmail}
                required
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="tel" className="my-2" controlId="tel">
              <Form.Label>Telefon:</Form.Label>
              <Form.Control
                type="tel"
                value={userPhone}
                required
                onChange={(e) => {
                  setUserPhone(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group id="branch" className="my-2" controlId="branch">
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <Message variant="danger">
                  {isError?.data?.message || isError.error}
                </Message>
              ) : (
                <>
                  <Form.Label>Şube:</Form.Label>
                  <Form.Control
                    as="select"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option key="" value="">
                      Seçiniz...
                    </option>
                    {restaurant.branches.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} - {b.address}
                      </option>
                    ))}
                  </Form.Control>
                </>
              )}
            </Form.Group>
            <Form.Group id="date" className="my-2" controlId="date">
              <Form.Label>Tarih:</Form.Label>
              <Form.Control
                type="date"
                value={date}
                required
                onChange={handleDateChange}
              />
            </Form.Group>
            <Form.Group id="time" className="my-2" controlId="time">
              <Form.Label>
                Saat: {branch && "(Çalışma Saatlerimiz " + workingHours + ")"}
              </Form.Label>
              <Form.Control
                type="time"
                value={time}
                required
                onChange={handleTimeChange}
              />
            </Form.Group>
            <Form.Group id="note" className="my-2" controlId="note">
              <Form.Label>Not:</Form.Label>
              <Form.Control
                type="text"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">
              Rezervasyon Yap
            </Button>
            {loadingMakingReservation && <Loader />}
            {error && (
              <Message variant="danger">
                {error?.data?.error || error.error}
              </Message>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ReservationDetails;
