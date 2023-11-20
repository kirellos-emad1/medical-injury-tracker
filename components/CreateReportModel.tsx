import React, { useState } from "react";
import { Button, DatePicker, Divider, Form, Input, Modal, Space } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-hot-toast";
import InjuryListFields from "./InjuryListFields";
const user = gql`
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

type FormValues = {
  reporter: string;
  date: string;
  userId: string;
};

const CreateInjuryListMutation = gql`
  mutation createInjuryList(
    $reporter: String!
    $date: String!
    $userId: String!
  ) {
    createInjuryList(reporter: $reporter, date: $date, userId: $userId) {
      id
      reporter
      date
      userId
    }
  }
`;
const CreateInjuryMutation = gql`
  mutation createInjury(
    $injuryListId: String!
    $area: String!
    $description: String!
  ) {
    createInjury(
      injuryListId: $injuryListId
      area: $area
      description: $description
    ) {
      area
      description
    }
  }
`;
interface Injury {
  id: string;
  area: string;
  description: string;
}
interface CreateReportModelProps {
  isOpened: boolean;
  isClosed: () => void;
}

const CreateReportModel: React.FC<CreateReportModelProps> = ({
  isOpened,
  isClosed,
}) => {
  const { data } = useQuery(user);
  const userId = data?.getUserData?.id || null;
  const [clickedPoints, setClickedPoints] = useState<
    { x: number; y: number }[]
  >([]);
  const [date, setDate] = useState("");
  const [injuries, setInjuries] = useState<Injury[]>([
    { id: "", area: "", description: "" },
  ]);
  const [showInjuries, setShowInjuries] = useState(false);

  const [createInjuryList, { loading }] = useMutation(
    CreateInjuryListMutation,
    {
      onCompleted: () => setDate(""),
      refetchQueries: [user],
    }
  );

  const [createInjury] = useMutation(CreateInjuryMutation, {
    onCompleted: () => setInjuries([{ id: "", area: "", description: "" }]),
    refetchQueries: [user],
  });

  const addInjuryFields = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!showInjuries) {
      setShowInjuries(true);

      setClickedPoints([...clickedPoints, { x, y }]);
      return;
    }
    e.preventDefault();

    // Store the clicked point
    setClickedPoints([...clickedPoints, { x, y }]);
    setInjuries([...injuries, { id: "", area: "", description: "" }]);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInjuries((prevInjuries) => {
      const updatedInjuries = [...prevInjuries];
      updatedInjuries[index][event.target.name as keyof Injury] =
        event.target.value;
      return updatedInjuries;
    });
  };

  const removeInjuryFields = (index: number) => {
    setInjuries((prevInjuries) => [
      ...prevInjuries.slice(0, index),
      ...prevInjuries.slice(index + 1),
    ]);
    setClickedPoints((prevInjuries) => [
      ...prevInjuries.slice(0, index),
      ...prevInjuries.slice(index + 1),
    ]);
  };

  const onSubmit = async (values: FormValues) => {
    const { reporter } = values;
    const variables = { reporter, date: date, userId: userId };
    if (!reporter || !date) {
      console.log("you must fill the form");
    } else {
      try {
        toast
          .promise(createInjuryList({ variables }), {
            loading: "Creating injury list...",
            success: "Injury list successfully created! 🎉",
            error: "Failed to create injury list. Please try again.",
          })
          .then((result) => {
            const promises = injuries.map(({ area, description }) => {
              if (!area || !description) {
                console.log("add area and description");
              } else {
                createInjury({
                  variables: {
                    injuryListId: result.data.createInjuryList.id,
                    area,
                    description,
                  },
                });
              }
            });
            toast.promise(Promise.all(promises), {
              loading: "Creating new injuries...",
              success: "Injuries successfully created! 🎉",
              error: "Failed to create injuries. Please try again.",
            });
            isClosed();
            setClickedPoints([]);
          });
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  const onCancel = () => {
    setInjuries([{ id: "", area: "", description: "" }]);
    setDate("");
    setShowInjuries(false);
    isClosed();
    setClickedPoints([]);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <>
      <Modal
        title="Create Report"
        centered
        open={isOpened}
        maskClosable={false}
        width={1000}
        onCancel={onCancel}
        destroyOnClose={true}
        footer={null}
      >
        <Divider />
        <Form {...layout} name="control-hooks" onFinish={onSubmit}>
          <Form.Item name="reporter" label="Reporter Name" required>
            <Input placeholder="Reporter Name" />
          </Form.Item>
          <Form.Item name="date" label="Date" required>
            <DatePicker
              placeholder="yyyy-mm-dd"
              onChange={(date, dateString) => setDate(dateString)}
            />
          </Form.Item>
          <Divider />
          <div className="flex">
            <div
              style={{ position: "relative", width: "500px", height: "500px" }}
            >
              <img
                src="body.png"
                alt=""
                width={500}
                height={500}
                onClick={addInjuryFields}
                style={{ position: "relative" }}
              />
              {clickedPoints.map((point, index) => (
                <div
                  onClick={() => removeInjuryFields(index)}
                  key={index}
                  style={{
                    position: "absolute",
                    top: `${point.y}px`,
                    left: `${point.x}px`,
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "red",
                  }}
                ></div>
              ))}
            </div>
            {showInjuries ? (
              <div className="border w-1/2 h-96 flex flex-col items-start justify-start overflow-auto rounded">
                <InjuryListFields
                  injuries={injuries}
                  handleInputChange={handleInputChange}
                  handleRemove={removeInjuryFields}
                  isDelete={false}
                />
              </div>
            ) : (
              <div className="border w-1/2 h-96 flex items-center justify-center overflow-auto rounded">
                <p className=" font-sans font-medium text-gray-500">
                  Click on photo to create injury.
                </p>
              </div>
            )}
          </div>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ float: "right" }}>
              <Button
                danger
                className="px-5 bg-red-400 hover:bg-red-500"
                style={{ color: "black", border: "none" }}
                onClick={onCancel}
                size="large"
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                className=" bg-teal-300 px-5 hover:border-none hover:bg-teal-400"
                htmlType="submit"
                size="large"
                style={{ color: "black", border: "none", padding: "0 40px" }}
              >
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateReportModel;
