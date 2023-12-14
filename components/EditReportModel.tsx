import React, { useEffect, useState } from "react";
import { Button, DatePicker, Divider, Form, Input, Modal, Space } from "antd";
import { gql, useMutation } from "@apollo/client";
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

const UpdateInjuryListMutation = gql`
  mutation updateInjuryList(
    $injuryListId: String!
    $reporter: String!
    $date: String!
  ) {
    updateInjuryList(
      reporter: $reporter
      date: $date
      injuryListId: $injuryListId
    ) {
      id
      reporter
      date
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
const UpdateInjuryMutation = gql`
  mutation updateInjury(
    $injuryId: String!
    $area: String!
    $description: String!
  ) {
    updateInjury(injuryId: $injuryId, area: $area, description: $description) {
      id
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
interface injuryListInjuries {
  id: string;
  area: string;
  description: string;
}

interface EditReportModelProps {
  isOpened: boolean;
  isClosed: () => void;
  injuryList: any;
}
const EditReportModel: React.FC<EditReportModelProps> = ({
  isOpened,
  isClosed,
  injuryList,
}) => {
  const [injuryLists, setInjuryLists] = useState({
    id: "",
    reporter: "",
    date: "",
    injuries: [{ id: "", area: "", description: "" }],
  });
  const [isCreate, setIsCreate] = useState(false);
  const [injuries, setInjuries] = useState([
    { id: "", area: "", description: "" },
  ]);
  const [clickedPoints, setClickedPoints] = useState<
    { x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (injuryList && injuryList.injuries) {
      setInjuryLists({
        id: injuryList.id,
        reporter: injuryList.reporter,
        date: injuryList.date,
        injuries: injuryList.injuries,
      });
    }
  }, [injuryList, injuries]);
  const [updateInjuryList, { loading, error }] = useMutation(
    UpdateInjuryListMutation,
    {
      refetchQueries: [user],
    }
  );

  const [updateInjury] = useMutation(UpdateInjuryMutation, {
    refetchQueries: [user],
  });

  const [createInjury] = useMutation(CreateInjuryMutation, {
    onCompleted: () => setInjuries([{ id: "", area: "", description: "" }]),

    refetchQueries: [user],
  });
  const addInjuryFields = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!isCreate) {
      setIsCreate(true);
      setClickedPoints([...clickedPoints, { x, y }]);
      setInjuries([...injuries]);
    } else {
      setClickedPoints([...clickedPoints, { x, y }]);
      setInjuries([...injuries, { id: "", area: "", description: "" }]);
    }
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
  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    isForInjuryList: boolean = false
  ) => {
    if (isForInjuryList) {
      const updatedInjuryLists = [...injuryLists.injuries];
      updatedInjuryLists[index][event.target.name as keyof Injury] =
        event.target.value;
      setInjuryLists({
        ...injuryLists,
        injuries: updatedInjuryLists,
      });
    } else {
      const values: Injury[] = [...injuries];
      values[index][event.target.name as keyof Injury] = event.target.value;
      setInjuries(values);
    }
  };

  const onSubmit = async () => {
    const variables = {
      reporter: injuryLists.reporter,
      date: injuryLists.date,
      injuryListId: injuryLists.id,
    };

    if (!variables.reporter || !variables.date) {
      console.error("You must fill the form");
      return;
    }

    try {
      const result = await updateInjuryList({ variables });

      const promises = injuryLists.injuries.map(({ id, area, description }) => {
        if (!area || !description) {
          console.error("Add area and description");
        } else {
          return updateInjury({
            variables: { injuryId: id, area, description },
          });
        }
      });

      await Promise.all(promises);

      if (isCreate) {
        const createPromises = injuries.map(({ area, description }) => {
          if (!area || !description) {
            console.error("Add area and description");
          } else {
            return createInjury({
              variables: { injuryListId: injuryLists.id, area, description },
            });
          }
        });

        await Promise.all(createPromises);
      }

      setClickedPoints([]);
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    setIsCreate(false);
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
        title="Edit Report"
        centered
        open={isOpened}
        maskClosable={false}
        width={1000}
        onCancel={onCancel}
        destroyOnClose={true}
        footer={null}
      >
        <Divider />
        <Form {...layout} onFinish={onSubmit}>
          <Form.Item label="Reporter Name" required>
            <Input
              name="reporter"
              className="w-1/2 max-md:w-full"
              placeholder="Reporter Name"
              value={injuryLists.reporter}
              onChange={(e) =>
                setInjuryLists({ ...injuryLists, reporter: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item name="date" label="Date" required>
            <DatePicker
              className="w-1/2 max-md:w-full"
              placeholder={injuryLists.date}
              onChange={(date, dateString) =>
                setInjuryLists({ ...injuryLists, date: dateString })
              }
            />
          </Form.Item>
          <Divider />

          <div className="">
            {isCreate ? (
              <div className="flex max-md:flex-col">
                <div
                  style={{
                    position: "relative",
                    width: "100%"
                  }}
                >
                  <img
                    src="body.png"
                    alt=""
                    width={"100%"}
                    height={"100%"}
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
                        width: "20px", // Adjust the circle size as needed
                        height: "20px",
                        borderRadius: "50%",
                        background: "red", // Change the circle color
                      }}
                    ></div>
                  ))}
                </div>
                <div className="border w-1/2 max-md:w-full h-96 flex flex-col items-start justify-start overflow-auto rounded">
                  <InjuryListFields
                    injuries={injuries}
                    handleInputChange={handleInputChange}
                    handleRemove={removeInjuryFields}
                    isDelete={false}
                  />
                </div>
              </div>
            ) : (
              <div className="flex max-md:flex-col">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <img
                    src="body.png"
                    alt=""
                    width={"100%"}
                    height={"100%"}
                    style={{ position: "relative" }}
                    onClick={addInjuryFields}
                  />
                </div>
                {injuryLists.injuries.length > 0 ? (
                  <div className="border max-md:w-full w-1/2 h-96 flex flex-col items-start justify-start overflow-auto rounded">
                    <InjuryListFields
                      injuries={injuryLists.injuries}
                      handleInputChange={(index, event) =>
                        handleInputChange(index, event, true)
                      }
                      handleRemove={() => null}
                      isDelete={true}
                    />
                  </div>
                ) : (
                  <div className="border w-1/2  h-96 flex items-center justify-center overflow-auto rounded">
                    <p className=" font-sans font-medium text-gray-500">
                      There is no injuries to Edit, Click on photo to create
                      injury.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Divider />
            <Space style={{ float: "right" }}>
              <Button
                danger
                style={{ color: "black", border: "none" }}
                className="px-5  bg-red-400 hover:bg-red-500"
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
                Edit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditReportModel;
