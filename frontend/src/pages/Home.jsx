import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Restaurant from "../components/Restaurant";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetRestaurantsQuery } from "../slices/restaurantsApiSlice";
import Paginate from "../components/Paginate";

const Home = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetRestaurantsQuery({
    pageNumber,
    keyword,
  });

  return (
    <>
      {keyword && (
        <Link to={"/"} className="btn btn-light mb-2">
          Geri
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <h1>Restorantlar</h1>
          <Row>
            {data.restaurants.map(
              (restaurant) =>
                restaurant.name !== "Ürün" && (
                  <Col key={restaurant._id} sm={12} md={6} lg={4} xl={3}>
                    <Restaurant restaurant={restaurant} />
                  </Col>
                )
            )}
          </Row>
          <Paginate
            numberOfPage={data.numberOfPage}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default Home;
