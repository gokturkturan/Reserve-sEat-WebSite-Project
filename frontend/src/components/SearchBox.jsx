import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = ({ isReservationPage = false }) => {
  const navigate = useNavigate();
  const { keyword: urlKeyword, date: urlDate } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const [date, setDate] = useState(urlDate || "");

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate(`/`);
      setKeyword("");
    }
  };

  const searchHandlerReservationPage = (e) => {
    e.preventDefault();
    if (keyword.trim() && date) {
      navigate(`/restaurant/reservations/branch/${keyword}/date/${date}`);
      setKeyword("");
      setDate("");
    } else if (keyword.trim()) {
      navigate(`/restaurant/reservations/branch/${keyword}`);
      setKeyword("");
      setDate("");
    } else if (date) {
      navigate(`/restaurant/reservations/date/${date}`);
      setKeyword("");
      setDate("");
    } else {
      navigate(`/restaurant/reservations`);
      setKeyword("");
      setDate("");
    }
  };

  return (
    <Form
      onSubmit={
        !isReservationPage ? searchHandler : searchHandlerReservationPage
      }
      className="d-flex my-1"
    >
      <Form.Control
        type="text"
        name="branch"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder={
          !isReservationPage ? "Restorant ismi giriniz" : "Şube ismi giriniz"
        }
        style={{ height: "30px" }}
      ></Form.Control>
      {isReservationPage && (
        <Form.Control
          type="date"
          name="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          style={{ height: "30px" }}
        ></Form.Control>
      )}
      <Button
        type="submit"
        variant="primary"
        style={{ height: "30px", padding: "2px 10px" }}
        className=" mx-1"
      >
        Ara
      </Button>
    </Form>
  );
};

export default SearchBox;
