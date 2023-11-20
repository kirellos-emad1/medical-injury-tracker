import React, { useState } from "react";
import { Form, Input, Button, Divider } from "antd";
import DeleteModel from "./DeleteModel";
import { useRouter } from "next/router";

interface InjuryFormFieldsProps {
  index: number;
  isDelete: boolean;
  injury: { id: string; area: string; description: string };
  handleInputChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const InjuryFormFields: React.FC<InjuryFormFieldsProps> = ({
  index,
  injury,
  handleInputChange,
  isDelete,
}) => {
  const router = useRouter();
  const [deleteModel, setDeleteModel] = useState(false);
  const [selectedInjuryId, setSelectedInjuryId] = useState<string>("");

  const handleDeleteModelOpen = (injuryId: string) => {
    setSelectedInjuryId(injuryId);
    setDeleteModel(true);
  };
  const isDeleteModelClosed = () => {
    setDeleteModel(false);
    router.reload();
  };

  return (
    <div key={index} className="w-full ">
      <Form.Item label={`Area`} required>
        <Input
          name={`area`}
          placeholder={`Area`}
          value={injury.area}
          onChange={(e) => handleInputChange(index, e)}
        />
      </Form.Item>
      <Form.Item label={`Description`} required>
        <Input
          name={`description`}
          placeholder={`Description`}
          value={injury.description}
          onChange={(e) => handleInputChange(index, e)}
        />
      </Form.Item>
      <Divider/>
      {isDelete && (
        <div>
          <DeleteModel
            id={injury.id}
            injury={true}
            isClosed={isDeleteModelClosed}
            isOpened={deleteModel}
            message="Are You Sure To Delete The Injury"
          />

          <Button
            className="font-medium text-red-600 hover:underline float-right mr-10 mb-4"
            style={{ border: "1px solid red", color: "red" }}
            onClick={() => handleDeleteModelOpen(injury.id)}
          >
            Delete Injury
          </Button>
        </div>
      )}
    </div>
  );
};

export default InjuryFormFields;
