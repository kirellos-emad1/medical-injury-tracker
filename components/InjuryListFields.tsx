import React from "react";
import InjuryFormFields from "./InjuryFormFields";
interface InjuryListFieldsProps {
  injuries: { id: string; area: string; description: string }[];
  isDelete: boolean;
  handleInputChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleRemove: (index: number) => void;
}

const InjuryListFields: React.FC<InjuryListFieldsProps> = ({
  injuries,
  isDelete,
  handleInputChange,
  handleRemove,
}) => {
  return (
    <>
      {injuries.map((injury, index) => (
        <div key={index} className="w-full ">
          <InjuryFormFields
            index={index}
            injury={injury}
            isDelete={isDelete}
            handleInputChange={handleInputChange}
          />
        </div>
      ))}
    </>
  );
};

export default InjuryListFields;
