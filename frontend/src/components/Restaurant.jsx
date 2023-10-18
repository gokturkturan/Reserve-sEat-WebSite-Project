import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ restaurant }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/restaurant/${restaurant._id}`}>
        <Card.Img src={restaurant.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/restaurant/${restaurant._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{restaurant.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={restaurant.rating}
            text={`(${restaurant.numReviews})`}
          />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
