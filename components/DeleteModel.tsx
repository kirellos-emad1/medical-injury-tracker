import React from "react";
import { useMutation, gql } from "@apollo/client";
import { Modal, Form, Button, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const RefetchInjuryList = gql`
  query {
    getUserData {
      id
      injuryLists {
        id
        reporter
        date
        injuries {
          id
          area
          description
        }
      }
    }
  }
`;

const DeleteInjuryListMutation = gql`
  mutation deleteInjuryList($injuryListId: String!) {
    deleteInjuryList(injuryListId: $injuryListId) {
      id
      reporter
    }
  }
`;
const DeleteInjury = gql`
  mutation deleteInjury($injuryId: String!) {
    deleteInjury(injuryId: $injuryId) {
      id
    }
  }
`;

const DeleteModel: React.FC<{
  id: string;
  isOpened: boolean;
  isClosed: () => void;
  injury: boolean;
  message: string;
}> = ({ id, isClosed, isOpened, injury, message }) => {
  const [deleteInjuryList] = useMutation(DeleteInjuryListMutation, {
    refetchQueries: [RefetchInjuryList],
  });
  const [deleteInjury] = useMutation(DeleteInjury, {
    refetchQueries: [RefetchInjuryList],
  });
  const removeInjuryList = (id: string) => {
    if (!injury) {
      deleteInjuryList({ variables: { injuryListId: id } });
    }
    if (injury) {
      deleteInjury({ variables: { injuryId: id } });
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <>
      <Modal
        title="Delete Report"
        centered
        open={isOpened}
        maskClosable={false}
        width={400}
        onCancel={isClosed}
        destroyOnClose={true}
        footer={null}
      >
        <Divider />
        <Form {...layout} onFinish={() => removeInjuryList(id)}>
          <div className=" flex justify-center flex-col">
            <DeleteOutlined style={{ fontSize: "26px", color: "red" }} />
            <p className=" text-red-600 font-sans font-medium text-md">
              {message}
            </p>
          </div>
          <Divider />
          <div className="flex items-center justify-end">
            <Button
              style={{ color: "black", border: "none", margin: "0 5px" }}
              className="px-5 bg-teal-400 hover:bg-teal-300"
              onClick={isClosed}
              size="large"
            >
              Cancel
            </Button>
            <Button
              style={{ color: "black", border: "none", margin: "0 5px" }}
              className="px-5 bg-red-400 hover:bg-red-500"
              onClick={isClosed}
              htmlType="submit"
              size="large"
            >
              Delete
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default DeleteModel;
