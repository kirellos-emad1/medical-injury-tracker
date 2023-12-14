import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Table,
  Input,
  Button,
  Space,
  DatePicker,

} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import Loading from "./Loading";
import CreateReportModel from "./CreateReportModel";
import EditReportModel from "./EditReportModel";
import DeleteModel from "./DeleteModel";
import { SyncOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const AllInjuryListQuery = gql`
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

const InjuryListTable: React.FC = () => {
  const { data, loading, error: dataError } = useQuery(AllInjuryListQuery);
  const [isCreateReportModel, setCreateReportModel] = useState(false);
  const [isEditReportModel, setIsEditReportModel] = useState(false);
  const [isDeleteModel, setDeleteModel] = useState(false);
  const [selectedInjuryId, setSelectedInjuryId] = useState<string>("");
  const [selectedInjury, setSelectedInjury] = useState({});
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<string[] | null>(null);

  const isCreateModelOpened = () => {
    setCreateReportModel(true);
  };

  const isCreateModelClosed = () => {
    setCreateReportModel(false);
  };

  const handleDeleteModelOpen = (injuryId: string) => {
    setSelectedInjuryId(injuryId);
    setDeleteModel(true);
  };

  const isDeleteModelClosed = () => {
    setDeleteModel(false);
  };

  const handleEditModelOpen = (injury: any) => {
    setSelectedInjury(injury);
    setIsEditReportModel(true);
  };

  const isEditModelClosed = () => {
    setIsEditReportModel(false);
  };

  if (loading) return <Loading />;

  const injuryList: any[] | undefined = data?.getUserData?.injuryLists;

  const updateQuery = (q: string) => {
    setQuery(q);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Reporter",
      dataIndex: "reporter",
      key: "reporter",
      sorter: (a: any, b: any) => a.reporter.localeCompare(b.reporter),
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: any, b: any) => moment(a.date).unix() - moment(b.date).unix(),
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Injury Areas",
      dataIndex: "injuries",
      key: "injuries",
      render: (injuries: any[]) => (
        <ul>
          {injuries.map((injury, index) => (
            <li key={index}>{injury.area}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Injury Description",
      dataIndex: "injuries",
      key: "injuries",
      render: (injuries: any[]) => (
        <ul>
          {injuries.map((injury, index) => (
            <li key={index}>{injury.description}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleEditModelOpen(record)}
            className="bg-blue-400 font-medium hover:bg-blue-500"
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteModelOpen(record.id)}
            style={{ color: "black", border: "none" }}
            className="bg-red-400 font-medium hover:bg-red-500"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredList =
    injuryList &&
    injuryList.filter((item) =>
      item.reporter.toLowerCase().includes(query.toLowerCase())
    );

  const searchedAndFiltered = filteredList?.filter((item) => {
    const momentDate = moment(item.date);
    return (
      (!dateRange ||
        (momentDate.isSameOrAfter(dateRange[0]) &&
          momentDate.isSameOrBefore(dateRange[1]))) &&
      item.reporter.toLowerCase().includes(query.toLowerCase())
    );
  });

  const dataForTable = searchedAndFiltered || injuryList || [];

  const handleDatePickerChange = (dates: any, dateStrings: string[]) => {
    setDateRange(dateStrings);
  };
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <title>Injury List</title>

      <button
        className=" bg-teal-300 text-lg font-normal hover:bg-teal-400  px-3 py-1 rounded"
        onClick={isCreateModelOpened}
      >
        {" "}
        create
      </button>
      <CreateReportModel
        isOpened={isCreateReportModel}
        isClosed={isCreateModelClosed}
      />

      <div className=" w-full my-4 flex items-center justify-center flex-col">
        <Input
          className=" w-2/5 max-md:w-full "
          placeholder="Search by Reporter name"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
        />
        <RangePicker
          className="max-md:w-1/2"          
          onChange={handleDatePickerChange}
          style={{width:"50px"}}
          value={
            dateRange
              ? [
                  dayjs(dateRange[0] as string), 
                  dayjs(dateRange[1] as string),
                ]
              : [null, null]
          }
        
          clearIcon={<SyncOutlined onClick={() => setDateRange(null)} />}
        />
      </div>

      {dataForTable.length > 0 ? (
        <Table
          className="w-full h-1/2 overflow-auto"
          columns={columns}
          dataSource={dataForTable}
        />
      ) : (
        <p className=" text-gray-500 mt-10 font-medium">
          No injury lists found.
        </p>
      )}

      <DeleteModel
        id={selectedInjuryId}
        isOpened={isDeleteModel}
        isClosed={isDeleteModelClosed}
        injury={false}
        message={"Are you sure you want to delete the report"}
      />
      <EditReportModel
        injuryList={selectedInjury}
        isClosed={isEditModelClosed}
        isOpened={isEditReportModel}
      />
    </div>
  );
};
export default InjuryListTable;
