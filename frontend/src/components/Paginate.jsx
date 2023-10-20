import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({
  numberOfPage,
  page,
  isRestaurantPage = false,
  keyword = "",
  date = "",
}) => {
  return (
    numberOfPage > 1 && (
      <Pagination className="justify-content-center">
        {[...Array(numberOfPage).keys()].map((p) => (
          <LinkContainer
            key={p + 1}
            to={
              !isRestaurantPage
                ? keyword
                  ? `/search/${keyword}/page/${p + 1}`
                  : `/page/${p + 1}`
                : keyword
                ? `/restaurant/reservations/branch/${keyword}/page/${p + 1}`
                : date
                ? `/restaurant/reservations/date/${date}/page/${p + 1}`
                : keyword && date
                ? `/restaurant/reservations/branch/${keyword}/date/${date}/page/${
                    p + 1
                  }`
                : `/restaurant/reservations/page/${p + 1}`
            }
          >
            <Pagination.Item active={p + 1 === page}>{p + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
