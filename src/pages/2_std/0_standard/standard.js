import React, { useState, useEffect } from "react";
import Hangul, { search } from "hangul-js";
import moment from "moment";
import { cloneDeep } from "lodash";
// #antd icon
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
  PropertySafetyFilled,
} from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../components/template";
//components

//redux
import { setDataSource } from "../../../reducers/std/StdStandardStatus";
import {
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceSchModal,
  setDatasourceSchModalDivReq,
  setDatasourceRegModal,
  setDatasourceModModal,
  setDatasourceRegDrawer,
  setIsvisibleRegDrawer,
  setIsvisibleModDrawerStdName,
  setIsvisibleModDrawerCompanyName,
  setIsvisibleRegDrawerStdName,
  setIsvisibleRegDrawerCompanyName,
} from "../../../reducers/std/StdStandardStatus_modal";
//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Popconfirm from "antd/es/popconfirm";
import message from "antd/es/message";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
import Select from "antd/es/select";
import Drawer from "antd/es/drawer";
import DatePicker from "antd/es/date-picker";
import Radio from "antd/es/radio";
import Tag from "antd/es/tag";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";
import { customEncrypt } from "../../util";

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

function Standard() {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.StdStandardStatus);
  const {
    isvisible_search_modal,
    isvisible_modify_modal,
    isvisible_register_modal,
    datasource_sch_modal,
  } = useSelector((state) => state.StdStandardStatus_modal);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  // useEffect 제외
  useEffect(() => {
    fetch("/API/search?TYPE=31111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSource(myJson));
      });
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "표준품",
          subTitle: "시약현황 조회",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/std/standard",
              name: "표준품",
            },
            {
              href: "/std/standard",
              name: "시약현황 조회",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 3,
          defaultActiveKey: 1,
        }}
        //카드
        main_card={{
          title: "표준품 검색",
        }}
        content_card={
          <>
            <Row>
              <Col xs={3}>
                <Select
                  style={{ width: "100%" }}
                  defaultValue={0}
                  onChange={(e) => {
                    setSearchFlag(e);
                  }}
                >
                  <Option value={0}>시약</Option>
                  <Option value={1}>제조회사</Option>
                  <Option value={2}>유효기간</Option>
                  <Option value={3}>카탈로그번호</Option>
                </Select>
              </Col>
              <Col xs={21}>
                {[
                  {
                    num: 0,
                    desc: "시약을 입력하세요",
                  },
                  {
                    num: 1,
                    desc: "제조회사를 입력하세요",
                  },
                  {
                    num: 2,
                    desc: "유효기간을 입력하세요",
                  },
                  {
                    num: 3,
                    desc: "카탈로그번호를 입력하세요",
                  },
                ].map((data) => {
                  if (data.num === searchFlag) {
                    return (
                      <Search
                        placeholder={data.desc}
                        enterButton
                        onSearch={(e) => {
                          setSearchKey(e);
                        }}
                      />
                    );
                  }
                })}
              </Col>
            </Row>
          </>
        }
        content={
          <div>
            <Table
              size="small"
              sticky
              bordered
              rowKey={(item) => {
                return item.STD_NAME_NUM;
              }}
              dataSource={dataSource.filter((val) => {
                const func = (key) => {
                  if (val[key] !== null) {
                    var word_str = "";
                    Hangul.disassemble(val[key], true).forEach(
                      (word, index) => {
                        word_str += word[0];
                      }
                    );
                    return (
                      word_str.indexOf(searchKey) !== -1 ||
                      Hangul.disassemble(val[key], true)[0][0].indexOf(
                        searchKey
                      ) > -1 ||
                      val[key].indexOf(searchKey) >= 0 ||
                      (val[key] !== "" && val[key] !== null
                        ? val[key]
                            .toLowerCase()
                            .indexOf(searchKey.toLowerCase()) > -1
                        : null)
                    );
                  }
                };

                switch (searchFlag) {
                  case 0:
                    return func("STD_NAME");
                    break;
                  case 1:
                    return func("COMPANY_NAME");
                    break;
                  case 2:
                    return func("EXPIRE_DATE");
                    break;
                  case 3:
                    return func("CATALOGUE_NUM");
                    break;
                }
              })}
              columns={[
                {
                  title: "구분",
                  dataIndex: "GUBUN",
                  key: "STD_NAME_NUM",
                  width: "12%",
                  align: "center",
                  filters: [
                    {
                      text: "농약",
                      value: "PRD",
                    },
                    {
                      text: "동물용의약품",
                      value: "VD",
                    },
                  ],
                  onFilter: (value, record) =>
                    record.GUBUN.indexOf(value) === 0,
                  render: (data, row, index) => {
                    return (
                      <>
                        {row.GUBUN === "PRD" ? (
                          <Tag color={"green"}>{"농약"}</Tag>
                        ) : (
                          <Tag color={"blue"}>{"동물용의약품"}</Tag>
                        )}
                      </>
                    );
                  },
                },
                {
                  title: "시약번호",
                  dataIndex: "STD_NO",
                  key: "STD_NAME_NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "STD_NO"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.STD_NO}</>;
                  },
                },
                {
                  title: "시약명",
                  dataIndex: "STD_NAME",
                  key: "STD_NAME_NUM",
                  width: "24%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "STD_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <a
                        onClick={() => {
                          var promise_1 = new Promise((resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=31112&STD_NAME_NUM=" +
                                row.STD_NAME_NUM,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceSchModal(myJson[0]));
                                fetch(
                                  "/API/search?TYPE=31120&STD_NAME_NUM=" +
                                    myJson[0].STD_NAME_NUM,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson2) => {
                                    fetch(
                                      "/API/search?TYPE=31120&STD_NAME_NUM=" +
                                        myJson[0].STD_NAME_NUM,
                                      {
                                        method: "GET",
                                        credentials: "include",
                                      }
                                    )
                                      .then(function (response) {
                                        return response.json();
                                      })
                                      .then((myJson2) => {
                                        dispatch(
                                          setDatasourceSchModalDivReq(myJson2)
                                        );
                                        resolve(1);
                                      });
                                  });
                              });
                          });

                          Promise.all([promise_1]).then((values) => {
                            dispatch(setIsvisibleSchModal(true));
                          });
                        }}
                      >
                        {row.STD_NAME}
                      </a>
                    );
                  },
                },
                {
                  title: "카탈로그번호",
                  dataIndex: "CATALOGUE_NUM",
                  key: "STD_NAME_NUM",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "CATALOGUE_NUM"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.CATALOGUE_NUM}</>;
                  },
                },
                {
                  title: "제조회사",
                  dataIndex: "COMPANY_NAME",
                  key: "STD_NAME_NUM",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "COMPANY_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.COMPANY_NAME}</>;
                  },
                },
                {
                  title: "상태",
                  dataIndex: "STATUS_NAME",
                  key: "STD_NAME_NUM",
                  width: "8%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "STATUS_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "descend",
                  render: (data, row, index) => {
                    return <>{row.STATUS_NAME}</>;
                  },
                },
                {
                  title: "순도",
                  dataIndex: "PURITY",
                  key: "STD_NAME_NUM",
                  width: "8%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PURITY"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return <>{row.PURITY}</>;
                  },
                },
                {
                  title: "포장단위",
                  dataIndex: "QUNATITY",
                  key: "STD_NAME_NUM",
                  width: "8%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "QUNATITY"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.QUNATITY}</>;
                  },
                },
                {
                  title: "수량",
                  dataIndex: "ITEM_NUM",
                  key: "STD_NAME_NUM",
                  width: "8%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ITEM_NUM"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return <>{row.ITEM_NUM}</>;
                  },
                },
                {
                  title: "유효기간",
                  dataIndex: "EXPIRE_DATE",
                  key: "STD_NAME_NUM",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "EXPIRE_DATE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <>
                        {moment(new Date()).format("YYYY-MM-DD") >
                        row.EXPIRE_DATE ? (
                          <span style={{ color: "#FF0000" }}>
                            {row.EXPIRE_DATE}
                          </span>
                        ) : (
                          row.EXPIRE_DATE
                        )}
                      </>
                    );
                  },
                },
                {
                  title: "재고여부",
                  dataIndex: "STOCK_YN",
                  key: "STD_NAME_NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "STOCK_YN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  align: "center",
                  render: (data, row, index) => {
                    return (
                      <>
                        {row.STOCK_YN === "있음" ? (
                          moment(new Date()).format("YYYY-MM-DD") >
                          row.EXPIRE_DATE ? (
                            <Tag color={"red"}>{"신청불가"}</Tag>
                          ) : (
                            <Tag color={"green"}>{"있음"}</Tag>
                          )
                        ) : moment(new Date()).format("YYYYMM") >
                          row.EXPIRE_DATE ? (
                          <Tag color={"red"}>{"신청불가"}</Tag>
                        ) : (
                          <Tag color={"red"}>{"없음"}</Tag>
                        )}
                      </>
                    );
                  },
                },
                {
                  title: (
                    <Button
                      size="small"
                      className="button_reg"
                      onClick={() => {
                        dispatch(setIsvisibleRegModal(true));
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  ),
                  align: "center",
                  dataIndex: "",
                  key: "FOOD_CODE",
                  flag: "등록",
                  width: "10%",
                  render: (data, row, index) => (
                    <Row key={row.FOOD_CODE}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=31113&STD_NAME_NUM=" +
                                row.STD_NAME_NUM,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceModModal(myJson[0]));
                                dispatch(setIsvisibleModModal(true));
                              });
                          }}
                        >
                          <EditOutlined />
                        </Button>
                      </Col>
                      <Col xs={12}>
                        <Popconfirm
                          title="정말 삭제하시겠습니까?"
                          onConfirm={() => {
                            var promise_delete = new Promise(
                              (resolve, reject) => {
                                fetch("/API/delete", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        TABLE: "T_RESI_STANDARD_NAME",
                                        KEY: ["STD_NAME_NUM"],
                                        NUMERIC_KEY: ["STD_NAME_NUM"],
                                        STD_NAME_NUM: row.STD_NAME_NUM,
                                      },
                                    ]),
                                  }),
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  credentials: "include",
                                }).then(function (response) {
                                  if (response.status === 200) {
                                    message.success(
                                      "시약현황 관리: " +
                                        (row.STD_NAME || row.STD_NAME) +
                                        "을 삭제하였습니다."
                                    );
                                    resolve(1);
                                  } else if (response.status === 401) {
                                    message.error("권한이 없습니다.");
                                    resolve(0);
                                  }
                                });
                              }
                            );

                            Promise.all([promise_delete]).then((values) => {
                              fetch("/API/search?TYPE=31111", {
                                method: "GET",
                                credentials: "include",
                              })
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(setDataSource(myJson));
                                });
                            });
                          }}
                          onCancel={false}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button size="small" className="button_del">
                            <DeleteOutlined />
                          </Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                  ),
                },
              ].filter((data) => {
                if (
                  data.flag === "등록" &&
                  (userinfo.USERID === undefined ||
                    userinfo.PRD_ANALYSIS_MOD === "N")
                ) {
                  return false;
                } else {
                  return true;
                }
              })}
            ></Table>
          </div>
        }
      ></Template>
      {isvisible_search_modal ? <SearchModal></SearchModal> : <></>}
      {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>}
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
    </div>
  );
}

export default Standard;

export const SearchModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_search_modal,
    datasource_sch_modal,
    datasource_sch_modal_div_req,
  } = useSelector((state) => state.StdStandardStatus_modal); //수정
  const xs_title = 7;
  const xs_input = 16;

  useEffect(() => {}, [dispatch]);

  if (!isvisible_search_modal) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_search_modal}
          onCancel={() => {
            dispatch(setIsvisibleSchModal(false));
            // dispatch(setDatasourceRegModal({}))
          }}
          footer={<></>}
          width="50vw"
          title={<div>표준품 조회</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 표준품 정보"
            headStyle={{
              padding: "0px !important",
              color: "#2a538b",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            bodyStyle={{
              padding: "20px 20px 20px 20px",
            }}
          >
            <Row>
              <Table
                size="small"
                sticky
                bordered
                className="table-search"
                showHeader={false}
                pagination={false}
                columns={[
                  {
                    dataIndex: "title_1",
                    width: "15%",
                    className: "table-title",
                  },
                  {
                    dataIndex: "data_1",
                    render: (text, row, index) => {
                      if (row.wide === 0) {
                        return {
                          children: <>{text}</>,
                        };
                      }
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 3,
                          },
                        };
                      }
                    },
                  },
                  {
                    dataIndex: "title_2",
                    width: "15%",
                    className: "table-title",
                    render: (text, row, index) => {
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 0,
                          },
                        };
                      } else {
                        return <>{text}</>;
                      }
                    },
                  },
                  {
                    dataIndex: "data_2",
                    render: (text, row, index) => {
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 0,
                          },
                        };
                      } else {
                        return <>{text}</>;
                      }
                    },
                  },
                ]}
                dataSource={[
                  {
                    title_1: "소속",
                    data_1: datasource_sch_modal.PROVINCE_NAME,
                    title_2: "성명",
                    data_2: datasource_sch_modal.INS_NAME,
                    wide: 0,
                  },
                  {
                    title_1: "연락처",
                    data_1: datasource_sch_modal.INS_PHONE,
                    title_2: "이메일",
                    data_2: datasource_sch_modal.INS_EMAIL,
                    wide: 0,
                  },
                  {
                    title_1: "시약명",
                    data_1: datasource_sch_modal.STD_NAME,
                    title_2: "제조회사",
                    data_2: datasource_sch_modal.COMPANY_NAME,
                    wide: 0,
                  },
                  {
                    title_1: "시약번호",
                    data_1: datasource_sch_modal.STD_NO,
                    title_2: "카탈로그번호",
                    data_2: datasource_sch_modal.CATALOGUE_NUM,
                    wide: 0,
                  },
                  {
                    title_1: "상태",
                    data_1: datasource_sch_modal.STATUS_NAME,
                    title_2: "순도",
                    data_2: datasource_sch_modal.PURITY,
                    wide: 0,
                  },
                  {
                    title_1: "포장단위",
                    data_1: datasource_sch_modal.QUANTITY,
                    title_2: "보관상태",
                    data_2: datasource_sch_modal.ITEM_NUM,
                    wide: 0,
                  },
                  {
                    title_1: "수량",
                    data_1: datasource_sch_modal.ITEM_NUM,
                    title_2: "재고여부",
                    data_2: datasource_sch_modal.STOCK_YN,
                    wide: 0,
                  },
                  {
                    title_1: "유효기간",
                    data_1: datasource_sch_modal.EXPIRE_DATE,
                    title_2: "입고일",
                    data_2: datasource_sch_modal.ENTER_DATE,
                    wide: 0,
                  },
                  {
                    title_1: "비고",
                    data_1: datasource_sch_modal.BIGO,
                    wide: 1,
                  },
                ]}
              />
            </Row>
          </Card>
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 시약지급량 정보"
            headStyle={{
              padding: "0px !important",
              color: "#2a538b",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            bodyStyle={{
              padding: "20px 20px 20px 20px",
            }}
          >
            <Table
              size="small"
              sticky
              bordered
              className="table-search"
              pagination={false}
              columns={[
                {
                  title: "지급일자",
                  dataIndex: "SUPPLY_DATE",
                },
                {
                  title: "소속",
                  dataIndex: "PROVINCE_NAME",
                },
                {
                  title: "지급량",
                  dataIndex: "ITEM_NUM",
                },
              ]}
              dataSource={datasource_sch_modal_div_req}
            ></Table>
          </Card>
        </Modal>
      </div>
    );
  }
};

export const RegisterModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_register_modal,
    datasource_reg_modal,
    isvisible_register_drawer_std_name,
    isvisible_register_drawer_company_name,
  } = useSelector((state) => state.StdStandardStatus_modal); //수정
  const xs_title = 7;
  const xs_input = 16;
  const { userinfo } = useSelector((state) => state.header);
  const [Unit, setUnit] = useState([]);
  const [Status, setStatus] = useState([]);

  useEffect(() => {
    fetch("/API/search?TYPE=31114", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setUnit(myJson);
      });
    fetch("/API/search?TYPE=31118", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setStatus(myJson);
      });
    fetch("/API/search?TYPE=31117&USERID=" + userinfo.USERID, {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(
          setDatasourceRegModal({
            ...datasource_reg_modal,
            EXPIRE_DATE: moment(new Date()).format("YYYY-MM-DD"),
            ENTER_DATE: moment(new Date()).format("YYYY-MM-DD"),
            INS_DATE: moment(new Date()).format("YYYY-MM-DD"),
            GUBUN: "PRD",
            STOCK_YN: "Y",
            PURITY2_UNIT: "%",
            INS_NAME: myJson[0].USERNAME,
            PROVINCE_NAME: myJson[0].PROVINCE_NAME,
            PROVINCE_NUM: myJson[0].PROVINCE_NUM,
          })
        );
      });
  }, []);

  if (!isvisible_register_modal) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_register_modal}
          footer={
            <div>
              <Popconfirm
                title="등록하시겠습니까?"
                onCancel={() => {}}
                onConfirm={() => {
                  var promise_update = new Promise((resolve, reject) => {
                    datasource_reg_modal.TABLE = "T_RESI_STANDARD_NAME";
                    datasource_reg_modal.KEY = ["STD_NAME_NUM"];
                    datasource_reg_modal.NUMERIC_KEY = [
                      "STD_NAME_NUM",
                      "STD_NUM",
                      "PROVINCE_NUM",
                      "COMPANY_NUM",
                      "STATUS_NUM",
                      "PURITY",
                      //   "QUANTITY",
                      //   "UNIT_NUM",
                    ];

                    const temp_mod_modal = cloneDeep(datasource_reg_modal);
                    // temp_mod_modal.STD_NAME;
                    delete temp_mod_modal.PROVINCE_NAME;
                    delete temp_mod_modal.COMPANY_NAME;
                    delete temp_mod_modal.UNIT_NAME;
                    delete temp_mod_modal.STATUS_NAME;

                    console.log(temp_mod_modal);

                    fetch("/API/search?TYPE=31119", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then(function (response) {
                        return response.json();
                      })
                      .then((myJson) => {
                        temp_mod_modal.STD_NAME_NUM = myJson[0].MAX;
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({
                            data: customEncrypt([temp_mod_modal]),
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          if (response.status === 200) {
                            message.success(
                              "시약현황 관리 : " +
                                (datasource_reg_modal.STD_NAME ||
                                  datasource_reg_modal.STD_NAME) +
                                "을 추가하였습니다."
                            );
                            dispatch(setIsvisibleRegModal(false));
                            dispatch(setDatasourceRegModal({}));
                            resolve(1);
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                            dispatch(setIsvisibleRegModal(false));
                            dispatch(setDatasourceRegModal({}));
                            resolve(0);
                          }
                        });
                      });
                  });

                  Promise.all([promise_update]).then((values) => {
                    fetch("/API/search?TYPE=31111", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then(function (response) {
                        return response.json();
                      })
                      .then((myJson) => {
                        console.log(myJson);
                        dispatch(setDataSource(myJson));
                      });
                  });
                }}
                okText="등록"
                cancelText="취소"
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={
                    (datasource_reg_modal.PESTICIDE_NAME === "" ||
                      datasource_reg_modal.PESTICIDE_NAME === null) &&
                    (datasource_reg_modal.FOOD_NAME === "" ||
                      datasource_reg_modal.FOOD_NAME === null)
                  }
                >
                  등록
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleRegModal(false));
                  dispatch(setDatasourceRegModal({}));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleRegModal(false));
            dispatch(setDatasourceRegModal({}));
          }}
          width="50vw"
          title={
            <div>
              표준품 관리{" "}
              {!(
                datasource_reg_modal.STD_NAME === null ||
                datasource_reg_modal.STD_NAME === undefined ||
                datasource_reg_modal.STD_NAME === ""
              ) ? (
                <>{datasource_reg_modal.STD_NAME}</>
              ) : (
                <>{datasource_reg_modal.STD_NAME}</>
              )}{" "}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 표준품 등록"
            headStyle={{
              padding: "0px !important",
              color: "#2a538b",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            bodyStyle={{
              padding: "20px 20px 20px 20px",
            }}
          >
            <Row>
              <Table
                size="small"
                sticky
                bordered
                className="table-search"
                showHeader={false}
                pagination={false}
                columns={[
                  {
                    dataIndex: "title_1",
                    width: "15%",
                    className: "table-title",
                  },
                  {
                    dataIndex: "data_1",
                    render: (text, row, index) => {
                      if (row.wide === 0) {
                        return {
                          children: <>{text}</>,
                        };
                      }
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 3,
                          },
                        };
                      }
                    },
                  },
                  {
                    dataIndex: "title_2",
                    width: "15%",
                    className: "table-title",
                    render: (text, row, index) => {
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 0,
                          },
                        };
                      } else {
                        return <>{text}</>;
                      }
                    },
                  },
                  {
                    dataIndex: "data_2",
                    render: (text, row, index) => {
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 0,
                          },
                        };
                      } else {
                        return <>{text}</>;
                      }
                    },
                  },
                ]}
                dataSource={[
                  {
                    title_1: "구분",
                    data_1: (
                      <Radio.Group
                        value={datasource_reg_modal.GUBUN}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              GUBUN: e.target.value,
                            })
                          );
                        }}
                      >
                        <Radio size="small" value={"PRD"}>
                          농약
                        </Radio>
                        <Radio size="small" value={"VD"}>
                          동물용의약품
                        </Radio>
                      </Radio.Group>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "소속",
                    data_1: datasource_reg_modal.PROVINCE_NAME,
                    title_2: "성명",
                    data_2: datasource_reg_modal.INS_NAME,
                    wide: 0,
                  },
                  {
                    title_1: "연락처",
                    data_1: (
                      <Input
                        placeholder="연락처를 입력하세요"
                        size="small"
                        value={datasource_reg_modal.INS_PHONE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              INS_PHONE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "이메일",
                    data_2: (
                      <Input
                        placeholder="이메일을 입력하세요"
                        size="small"
                        value={datasource_reg_modal.INS_EMAIL}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              INS_EMAIL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "시약명",
                    data_1: (
                      <Input
                        placeholder="시약명을 입력하세요"
                        size="small"
                        value={datasource_reg_modal.STD_NAME}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              STD_NAME: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "제조회사",
                    data_2: (
                      <Row>
                        <Col xs={18}>
                          <Input
                            size="small"
                            placeholder="제조회사를 선택하세요"
                            value={datasource_reg_modal.COMPANY_NAME}
                          />
                        </Col>
                        <Col push={1} xs={5} align="right">
                          {isvisible_register_drawer_company_name ? (
                            <RegisterDrawerCompanyName />
                          ) : (
                            <></>
                          )}
                          <Button
                            type="primary"
                            size="small"
                            block
                            onClick={() => {
                              dispatch(setIsvisibleRegDrawerCompanyName(true));
                            }}
                          >
                            변경
                          </Button>
                        </Col>
                      </Row>
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "시약번호",
                    data_1: (
                      <Input
                        placeholder="시약번호를 입력하세요"
                        size="small"
                        value={datasource_reg_modal.STD_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              STD_NUM: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "카탈로그번호",
                    data_2: (
                      <Input
                        placeholder="카탈로그번호를 입력하세요"
                        size="small"
                        value={datasource_reg_modal.CATALOGUE_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              CATALOGUE_NUM: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "상태",
                    data_1: (
                      <Select
                        placeholder="상태를 선택하세요"
                        size="small"
                        style={{ width: "100%" }}
                        value={datasource_reg_modal.STATUS_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              STATUS_NUM: e,
                            })
                          );
                        }}
                      >
                        {Status.map((data) => {
                          return (
                            <Option value={data.STATUS_NUM}>
                              {data.STATUS_NAME}
                            </Option>
                          );
                        })}
                      </Select>
                    ),
                    title_2: "순도",
                    data_2: (
                      <Input
                        placeholder="순도를 입력하세요"
                        size="small"
                        value={datasource_reg_modal.PURITY2}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              PURITY2: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "포장단위",
                    data_1: (
                      <Input
                        placeholder="포장단위를 입력하세요"
                        size="small"
                        value={datasource_reg_modal.QUANTITY}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              QUANTITY: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "보관상태",
                    data_2: (
                      <Input
                        placeholder="보관상태를 입력하세요"
                        size="small"
                        value={datasource_reg_modal.SAVE_STATUS}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              SAVE_STATUS: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "수량",
                    data_1: (
                      <Input
                        placeholder="수량을 입력하세요"
                        size="small"
                        value={datasource_reg_modal.ITEM_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              ITEM_NUM: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "재고여부",
                    data_2: (
                      <Radio.Group
                        value={datasource_reg_modal.STOCK_YN}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              STOCK_YN: e.target.value,
                            })
                          );
                        }}
                      >
                        <Radio size="small" value={"Y"}>
                          Y
                        </Radio>
                        <Radio size="small" value={"N"}>
                          N
                        </Radio>
                      </Radio.Group>
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "유효기간",
                    data_1: (
                      <DatePicker
                        // picker="month"
                        size="small"
                        value={moment(
                          datasource_reg_modal.EXPIRE_DATE,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              EXPIRE_DATE: dateString,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "입고날짜",
                    data_2: (
                      <DatePicker
                        // picker="month"
                        size="small"
                        value={moment(
                          datasource_reg_modal.ENTER_DATE,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              ENTER_DATE: dateString,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "비고",
                    data_1: (
                      <TextArea
                        size="small"
                        rows={3}
                        value={datasource_reg_modal.NOTE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              NOTE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                ]}
              />
            </Row>
          </Card>
        </Modal>
      </div>
    );
  }
};

export const RegisterDrawerStdName = () => {
  const dispatch = useDispatch();
  const { datasource_reg_modal, isvisible_register_drawer_std_name } =
    useSelector((state) => state.StdStandardStatus_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=31115", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setModify_drawer_data(myJson);
      });
  }, []);

  if (!isvisible_register_drawer_std_name) {
    return <></>;
  } else {
    return (
      <Drawer
        title="시약명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleRegDrawerStdName(false));
        }}
        visible={isvisible_register_drawer_std_name}
        width="30vw"
      >
        <Search
          placeholder="시약명을 입력하세요"
          onSearch={(e) => {
            setSearchKey(e);
          }}
          style={{ marginBottom: "10px" }}
        />
        <Table
          size="small"
          sticky
          bordered
          columns={[
            {
              title: "시약명",
              dataIndex: "STD_NAME",
              key: "STD_NUM",
              width: "85%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "STD_NAME"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "STD_NUM",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    dispatch(
                      setDatasourceRegModal({
                        ...datasource_reg_modal,
                        STD_NUM: row.STD_NUM,
                        STD_NAME: row.STD_NAME,
                      })
                    );
                    dispatch(setIsvisibleRegDrawerStdName(false));
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data.filter((val) => {
            if (val.STD_NAME !== null && val.STD_NAME !== "") {
              var word_str = "";
              Hangul.disassemble(val.STD_NAME, true).forEach((word, index) => {
                word_str += word[0];
              });
              return (
                word_str.indexOf(searchKey) !== -1 ||
                Hangul.disassemble(val.STD_NAME, true)[0][0].indexOf(
                  searchKey
                ) > -1 ||
                val.STD_NAME.indexOf(searchKey) >= 0 ||
                (val.STD_NAME !== "" && val.STD_NAME !== null
                  ? val.STD_NAME.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  : null)
              );
            } else {
              return (
                val.STD_NAME.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
              );
            }
          })}
        ></Table>
      </Drawer>
    );
  }
};

export const RegisterDrawerCompanyName = () => {
  const dispatch = useDispatch();
  const { datasource_reg_modal, isvisible_register_drawer_company_name } =
    useSelector((state) => state.StdStandardStatus_modal);

  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=31116", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setModify_drawer_data(myJson);
      });
  }, []);

  if (!isvisible_register_drawer_company_name) {
    return <></>;
  } else {
    return (
      <Drawer
        title="제조회사 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleRegDrawerCompanyName(false));
        }}
        visible={isvisible_register_drawer_company_name}
        width="30vw"
      >
        <Search
          placeholder="제조회사명을 입력하세요"
          onSearch={(e) => {
            setSearchKey(e);
          }}
          style={{ marginBottom: "10px" }}
        />

        <Table
          size="small"
          sticky
          bordered
          columns={[
            {
              title: "회사명",
              dataIndex: "COMPANY_NAME",
              key: "COMPANY_NUM",
              width: "85%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "COMPANY_NAME"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "COMPANY_NUM",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    dispatch(
                      setDatasourceRegModal({
                        ...datasource_reg_modal,
                        COMPANY_NUM: row.COMPANY_NUM,
                        COMPANY_NAME: row.COMPANY_NAME,
                      })
                    );
                    dispatch(setIsvisibleRegDrawerCompanyName(false));
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data.filter((val) => {
            if (val.COMPANY_NAME !== null) {
              var word_str = "";
              Hangul.disassemble(val.COMPANY_NAME, true).forEach(
                (word, index) => {
                  word_str += word[0];
                }
              );
              return (
                word_str.indexOf(searchKey) !== -1 ||
                Hangul.disassemble(val.COMPANY_NAME, true)[0][0].indexOf(
                  searchKey
                ) > -1 ||
                val.COMPANY_NAME.indexOf(searchKey) >= 0 ||
                (val.COMPANY_NAME !== "" && val.COMPANY_NAME !== null
                  ? val.COMPANY_NAME.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  : null)
              );
            } else {
              return (
                val.COMPANY_NAME.toLowerCase().indexOf(
                  searchKey.toLowerCase()
                ) > -1
              );
            }
          })}
        ></Table>
      </Drawer>
    );
  }
};

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_modify_modal,
    datasource_mod_modal,
    isvisible_modify_drawer_std_name,
    isvisible_modify_drawer_company_name,
  } = useSelector((state) => state.StdStandardStatus_modal); //수정
  const xs_title = 7;
  const xs_input = 16;

  const [status, setStatus] = useState([{}]);
  const [Unit, setUnit] = useState([{}]);

  useEffect(() => {
    fetch("/API/search?TYPE=31118", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setStatus(myJson);
      });
    fetch("/API/search?TYPE=31114", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        setUnit(myJson);
      });
  }, []);

  if (!isvisible_modify_modal) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_modify_modal}
          footer={
            <div>
              <Popconfirm
                title="수정하시겠습니까?"
                onCancel={() => {}}
                onConfirm={() => {
                  var promise_update = new Promise((resolve, reject) => {
                    datasource_mod_modal.TABLE = "T_RESI_STANDARD_NAME";
                    datasource_mod_modal.KEY = ["STD_NAME_NUM"];
                    datasource_mod_modal.NUMERIC_KEY = [
                      "STD_NAME_NUM",
                      "STD_NUM",
                      "PROVINCE_NUM",
                      "COMPANY_NUM",
                      "STATUS_NUM",
                      "PURITY",
                      //   "QUANTITY",
                      //   "UNIT_NUM",
                    ];

                    const temp_mod_modal = cloneDeep(datasource_mod_modal);
                    delete temp_mod_modal.STD_NAME;
                    delete temp_mod_modal.PROVINCE_NAME;
                    delete temp_mod_modal.COMPANY_NAME;
                    delete temp_mod_modal.UNIT_NAME;
                    delete temp_mod_modal.STATUS_NAME;

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({
                        data: customEncrypt([temp_mod_modal]),
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        message.success(
                          "시약현황 관리 : " +
                            (datasource_mod_modal.STD_NAME ||
                              datasource_mod_modal.STD_NAME) +
                            "을 수정하였습니다."
                        );
                        dispatch(setIsvisibleModModal(false));
                        dispatch(setDatasourceModModal({}));
                        resolve(1);
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.");
                        dispatch(setIsvisibleModModal(false));
                        dispatch(setDatasourceModModal({}));
                        resolve(0);
                      }
                    });
                  });

                  Promise.all([promise_update]).then((values) => {
                    fetch("/API/search?TYPE=31111", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then(function (response) {
                        return response.json();
                      })
                      .then((myJson) => {
                        console.log(myJson);
                        dispatch(setDataSource(myJson));
                      });
                  });
                }}
                okText="수정"
                cancelText="취소"
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={
                    (datasource_mod_modal.PESTICIDE_NAME === "" ||
                      datasource_mod_modal.PESTICIDE_NAME === null) &&
                    (datasource_mod_modal.FOOD_NAME === "" ||
                      datasource_mod_modal.FOOD_NAME === null)
                  }
                >
                  수정
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleModModal(false));
                  dispatch(setDatasourceModModal({}));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModal(false));
            dispatch(setDatasourceModModal({}));
          }}
          width="50vw"
          title={
            <div>
              표준품 관리 -{" "}
              {!(
                datasource_mod_modal.STD_NAME === null ||
                datasource_mod_modal.STD_NAME === undefined ||
                datasource_mod_modal.STD_NAME === ""
              ) ? (
                <>{datasource_mod_modal.STD_NAME}</>
              ) : (
                <>{datasource_mod_modal.STD_NAME}</>
              )}{" "}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 표준품 수정" //수정
            headStyle={{
              padding: "0px !important",
              color: "#2a538b",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            bodyStyle={{
              padding: "20px 20px 20px 20px",
            }}
          >
            <Row>
              <Table
                size="small"
                sticky
                bordered
                className="table-search"
                showHeader={false}
                pagination={false}
                columns={[
                  {
                    dataIndex: "title_1",
                    width: "15%",
                    className: "table-title",
                  },
                  {
                    dataIndex: "data_1",
                    render: (text, row, index) => {
                      if (row.wide === 0) {
                        return {
                          children: <>{text}</>,
                        };
                      }
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 3,
                          },
                        };
                      }
                    },
                  },
                  {
                    dataIndex: "title_2",
                    width: "15%",
                    className: "table-title",
                    render: (text, row, index) => {
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 0,
                          },
                        };
                      } else {
                        return <>{text}</>;
                      }
                    },
                  },
                  {
                    dataIndex: "data_2",
                    render: (text, row, index) => {
                      if (row.wide === 1) {
                        return {
                          children: <>{text}</>,
                          props: {
                            colSpan: 0,
                          },
                        };
                      } else {
                        return <>{text}</>;
                      }
                    },
                  },
                ]}
                dataSource={[
                  {
                    title_1: "구분",
                    data_1: (
                      <Radio.Group
                        value={datasource_mod_modal.GUBUN}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              GUBUN: e.target.value,
                            })
                          );
                        }}
                      >
                        <Radio size="small" value={"PRD"}>
                          농약
                        </Radio>
                        <Radio size="small" value={"VD"}>
                          동물용의약품
                        </Radio>
                      </Radio.Group>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "소속",
                    data_1: datasource_mod_modal.PROVINCE_NAME,
                    title_2: "성명",
                    data_2: datasource_mod_modal.INS_NAME,
                    wide: 0,
                  },
                  {
                    title_1: "연락처",
                    data_1: (
                      <Input
                        placeholder="연락처를 입력하세요"
                        size="small"
                        value={datasource_mod_modal.INS_PHONE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              INS_PHONE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "이메일",
                    data_2: (
                      <Input
                        placeholder="이메일을 입력하세요"
                        size="small"
                        value={datasource_mod_modal.INS_EMAIL}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              INS_EMAIL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "시약명",
                    data_1: (
                      <Input
                        placeholder="시약명을 입력하세요"
                        size="small"
                        value={datasource_mod_modal.STD_NAME}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              STD_NAME: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "제조회사",
                    data_2: (
                      <Row>
                        <Col xs={18}>
                          <Input
                            size="small"
                            placeholder="제조회사를 선택하세요"
                            value={datasource_mod_modal.COMPANY_NAME}
                          />
                        </Col>
                        <Col push={1} xs={5} align="right">
                          {isvisible_modify_drawer_company_name ? (
                            <ModifyDrawerCompanyName />
                          ) : (
                            <></>
                          )}
                          <Button
                            type="primary"
                            size="small"
                            block
                            onClick={() => {
                              dispatch(setIsvisibleModDrawerCompanyName(true));
                            }}
                          >
                            변경
                          </Button>
                        </Col>
                      </Row>
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "시약번호",
                    data_1: (
                      <Input
                        placeholder="시약번호를 입력하세요"
                        size="small"
                        value={datasource_mod_modal.STD_NO}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              STD_NO: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "카탈로그번호",
                    data_2: (
                      <Input
                        placeholder="카탈로그번호를 입력하세요"
                        size="small"
                        value={datasource_mod_modal.CATALOGUE_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              CATALOGUE_NUM: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "상태",
                    data_1: (
                      <Select
                        placeholder="상태를 선택하세요"
                        size="small"
                        style={{ width: "100%" }}
                        value={datasource_mod_modal.STATUS_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              STATUS_NUM: e,
                            })
                          );
                        }}
                      >
                        {status.map((data) => {
                          return (
                            <Option value={data.STATUS_NUM}>
                              {data.STATUS_NAME}
                            </Option>
                          );
                        })}
                      </Select>
                    ),
                    title_2: "순도",
                    data_2: (
                      <Input
                        placeholder="순도를 입력하세요"
                        size="small"
                        value={datasource_mod_modal.PURITY2}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              PURITY2: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "포장단위",
                    data_1: (
                      <Input
                        placeholder="포장단위를 입력하세요"
                        size="small"
                        value={datasource_mod_modal.QUANTITY}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              QUANTITY: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "보관상태",
                    data_2: (
                      <Input
                        placeholder="보관상태를 입력하세요"
                        size="small"
                        value={datasource_mod_modal.SAVE_STATUS}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              SAVE_STATUS: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "수량",
                    data_1: (
                      <Input
                        placeholder="수량을 입력하세요"
                        size="small"
                        value={datasource_mod_modal.ITEM_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              ITEM_NUM: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "재고여부",
                    data_2: (
                      <Radio.Group
                        value={datasource_mod_modal.STOCK_YN}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              STOCK_YN: e.target.value,
                            })
                          );
                        }}
                      >
                        <Radio size="small" value={"Y"}>
                          Y
                        </Radio>
                        <Radio size="small" value={"N"}>
                          N
                        </Radio>
                      </Radio.Group>
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "유효기간",
                    data_1: (
                      <DatePicker
                        // picker="month"
                        size="small"
                        value={moment(
                          datasource_mod_modal.EXPIRE_DATE,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              EXPIRE_DATE: dateString,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "입고날짜",
                    data_2: (
                      <DatePicker
                        // picker="month"
                        size="small"
                        value={moment(
                          datasource_mod_modal.ENTER_DATE,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              ENTER_DATE: dateString,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "비고",
                    data_1: (
                      <TextArea
                        size="small"
                        rows={3}
                        value={datasource_mod_modal.NOTE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              NOTE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                ]}
              />
            </Row>
          </Card>
        </Modal>
      </div>
    );
  }
};

export const ModifyDrawerStdName = () => {
  const dispatch = useDispatch();
  const { datasource_mod_modal, isvisible_modify_drawer_std_name } =
    useSelector((state) => state.StdStandardStatus_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=31115", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setModify_drawer_data(myJson);
      });
  }, []);

  if (!isvisible_modify_drawer_std_name) {
    return <></>;
  } else {
    return (
      <Drawer
        title="시약명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleModDrawerStdName(false));
        }}
        visible={isvisible_modify_drawer_std_name}
        width="30vw"
      >
        <Search
          placeholder="시약명을 입력하세요"
          onSearch={(e) => {
            setSearchKey(e);
          }}
          style={{ marginBottom: "10px" }}
        />
        <Table
          size="small"
          sticky
          bordered
          columns={[
            {
              title: "시약명",
              dataIndex: "STD_NAME",
              key: "STD_NUM",
              width: "85%",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "STD_NAME"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "STD_NUM",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    dispatch(
                      setDatasourceModModal({
                        ...datasource_mod_modal,
                        STD_NUM: row.STD_NUM,
                        STD_NAME: row.STD_NAME,
                      })
                    );
                    dispatch(setIsvisibleModDrawerStdName(false));
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data.filter((val) => {
            if (val.STD_NAME !== null) {
              var word_str = "";
              Hangul.disassemble(val.STD_NAME, true).forEach((word, index) => {
                word_str += word[0];
              });
              return (
                word_str.indexOf(searchKey) !== -1 ||
                Hangul.disassemble(val.STD_NAME, true)[0][0].indexOf(
                  searchKey
                ) > -1 ||
                val.STD_NAME.indexOf(searchKey) >= 0 ||
                (val.STD_NAME !== "" && val.STD_NAME !== null
                  ? val.STD_NAME.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  : null)
              );
            } else {
              return (
                val.STD_NAME.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
              );
            }
          })}
        ></Table>
      </Drawer>
    );
  }
};

export const ModifyDrawerCompanyName = () => {
  const dispatch = useDispatch();
  const { datasource_mod_modal, isvisible_modify_drawer_company_name } =
    useSelector((state) => state.StdStandardStatus_modal);

  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=31116", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setModify_drawer_data(myJson);
      });
  }, []);

  if (!isvisible_modify_drawer_company_name) {
    return <></>;
  } else {
    return (
      <Drawer
        title="제조회사 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleModDrawerCompanyName(false));
        }}
        visible={isvisible_modify_drawer_company_name}
        width="30vw"
      >
        <Search
          placeholder="제조회사명을 입력하세요"
          onSearch={(e) => {
            setSearchKey(e);
          }}
          style={{ marginBottom: "10px" }}
        />

        <Table
          size="small"
          sticky
          bordered
          columns={[
            {
              title: "회사명",
              dataIndex: "COMPANY_NAME",
              key: "COMPANY_NUM",
              width: "85%",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "COMPANY_NAME"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "COMPANY_NUM",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    dispatch(
                      setDatasourceModModal({
                        ...datasource_mod_modal,
                        COMPANY_NUM: row.COMPANY_NUM,
                        COMPANY_NAME: row.COMPANY_NAME,
                      })
                    );
                    dispatch(setIsvisibleModDrawerCompanyName(false));
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data.filter((val) => {
            if (val.COMPANY_NAME !== null) {
              var word_str = "";
              Hangul.disassemble(val.COMPANY_NAME, true).forEach(
                (word, index) => {
                  word_str += word[0];
                }
              );
              return (
                word_str.indexOf(searchKey) !== -1 ||
                Hangul.disassemble(val.COMPANY_NAME, true)[0][0].indexOf(
                  searchKey
                ) > -1 ||
                val.COMPANY_NAME.indexOf(searchKey) >= 0 ||
                (val.COMPANY_NAME !== "" && val.COMPANY_NAME !== null
                  ? val.COMPANY_NAME.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  : null)
              );
            } else {
              return (
                val.COMPANY_NAME.toLowerCase().indexOf(
                  searchKey.toLowerCase()
                ) > -1
              );
            }
          })}
        ></Table>
      </Drawer>
    );
  }
};
