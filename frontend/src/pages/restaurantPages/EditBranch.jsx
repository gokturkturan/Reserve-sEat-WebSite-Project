import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useUpdateBranchMutation,
  useGetBranchQuery,
} from "../../slices/restaurantsApiSlice";

const EditBranch = () => {
  const { id: branchId } = useParams();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  const {
    data: branch,
    isLoading: getBranchLoading,
    refetch,
    isError: getBranchError,
  } = useGetBranchQuery(branchId);

  const [updateBranch, { isLoading: updateLoading }] =
    useUpdateBranchMutation();

  const navigate = useNavigate();

  const updateBranchHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedBranch = {
        branchId,
        name,
        address,
        phoneNumber,
        workingHours,
      };
      await updateBranch(updatedBranch).unwrap();
      toast.success("Şube Güncellendi.");
      refetch();
      navigate("/restaurant/branches");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (branch) {
      setName(branch.name);
      setAddress(branch.address);
      setPhoneNumber(branch.phoneNumber);
      setWorkingHours(branch.workingHours);
    }
  }, [branch]);

  return (
    <>
      <Link to="/restaurant/branches" className="btn btn-light my-3">
        Geri
      </Link>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <h1>Şube Güncelle</h1>
            {updateLoading && <Loader />}
            {getBranchLoading ? (
              <Loader />
            ) : getBranchError ? (
              <Message variant="danger">
                {getBranchError?.data?.error || getBranchError.error}
              </Message>
            ) : (
              <Form onSubmit={updateBranchHandler}>
                <Form.Group controlId="name" className="my-2">
                  <Form.Label>İsim</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="address" className="my-2">
                  <Form.Label>Adres</Form.Label>
                  <Form.Control
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="phone" className="my-2">
                  <Form.Label>Şube Telefon</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="workingHours" className="my-2">
                  <Form.Label>Çalışma Saatleri</Form.Label>
                  <Form.Control
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="my-2">
                  Şube Bilgilerini Güncelle
                </Button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditBranch;
