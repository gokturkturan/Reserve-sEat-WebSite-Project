import React from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaTimes, FaCheck, FaClock } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetRestaurantReservationsQuery,
  useApproveReservationMutation,
  useDeclineReservationMutation,
} from "../../slices/reservationApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import SearchBox from "../../components/SearchBox";

const Reservations = () => {
  const { pageNumber, keyword, date } = useParams();

  const { data, isLoading, refetch, isError } =
    useGetRestaurantReservationsQuery({
      pageNumber,
      keyword,
      date,
    });

  const [approve, { isLoading: loadingApprove }] =
    useApproveReservationMutation();

  const [decline, { isLoading: loadingDecline }] =
    useDeclineReservationMutation();

  const approveHandler = async (rezId) => {
    try {
      await approve(rezId);
      refetch();
      toast.success("Rezervasyon onaylandı.");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const declineHandler = async (rezId) => {
    try {
      await decline(rezId);
      refetch();
      toast.success("Rezervasyon onaylanmadı.");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Reservasyonlar</h1>
          <SearchBox isReservationPage={true} />
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.error || isError.error}
        </Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Müşteri</th>
                <th>Şube</th>
                <th>Rezervasyon Tarihi</th>
                <th>Rezervasyon Saati</th>
                <th>Not</th>
                <th>Onay Durumu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.reservations.map((rez) => (
                <tr key={rez._id}>
                  <td>{rez._id}</td>
                  <td>{rez.user.name}</td>
                  <td>{rez.branch}</td>
                  <td>
                    {rez.reservationDate ? (
                      rez.reservationDate.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>{rez.reservationTime}</td>
                  <td>{rez.note}</td>
                  <td>
                    {rez.isApproved === "Approved" ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : rez.isApproved === "Pending" ? (
                      <FaClock style={{ color: "orange" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {!(
                      rez.isApproved === "Approved" ||
                      rez.isApproved === "Declined"
                    ) && (
                      <>
                        <Button
                          variant="light"
                          className="btn-sm"
                          onClick={() => approveHandler(rez._id)}
                        >
                          <FaCheck style={{ color: "green" }} />
                          Rezervasyonu Onayla
                        </Button>
                        <Button
                          variant="light"
                          className="btn-sm mt-1"
                          onClick={() => declineHandler(rez._id)}
                        >
                          <FaTimes style={{ color: "red" }} />
                          Rezervasyonu Reddet
                        </Button>
                      </>
                    )}
                  </td>
                  {loadingApprove && <Loader />}
                  {loadingDecline && <Loader />}
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            numberOfPage={data.numberOfPage}
            page={data.page}
            isRestaurantPage={true}
            keyword={keyword}
            date={date}
          />
        </>
      )}
    </>
  );
};

export default Reservations;
