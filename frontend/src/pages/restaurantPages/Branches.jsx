import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useDeleteBranchMutation,
} from "../../slices/restaurantsApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";

const Branches = () => {
  const navigate = useNavigate();

  const { data, isLoading, refetch, isError } = useGetBranchesQuery();
  const [createBranch, { isLoading: createBranchLoading }] =
    useCreateBranchMutation();
  const [deleteBranch, { isLoading: deleteBranchLoading }] =
    useDeleteBranchMutation();

  const deleteBranchHandler = async (branchId) => {
    if (window.confirm("Bir şubeyi silmek üzeresiniz!")) {
      try {
        await deleteBranch(branchId);
        refetch();
        toast.success("Branch başarıyla silindi.");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Yeni bir şube oluşturmak üzeresiniz!")) {
      try {
        const { data } = await createBranch();
        console.log(data);
        navigate(`/restaurant/editBranch/${data._id}`);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Şubeler</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={() => createProductHandler()}>
            <FaEdit />
            Şube Ekle
          </Button>
        </Col>
      </Row>
      {createBranchLoading && <Loader />}
      {deleteBranchLoading && <Loader />}
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
                <th>Şube</th>
                <th>Adres</th>
                <th>Telefon</th>
                <th>Çalışma Saatleri</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.branches.map((branch) => (
                <tr key={branch._id}>
                  <td>{branch._id}</td>
                  <td>{branch.name}</td>
                  <td>{branch.address}</td>
                  <td>{branch.phoneNumber}</td>
                  <td>{branch.workingHours}</td>
                  <td>
                    <LinkContainer to={`/restaurant/editBranch/${branch._id}`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteBranchHandler(branch._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default Branches;
