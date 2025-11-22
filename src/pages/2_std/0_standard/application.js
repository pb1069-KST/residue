import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import moment from "moment";
import { customEncrypt } from "../../util";
import _ from "lodash";
// #antd icon
import {
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
} from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../components/template";
//components

//redux
import { setDataSource } from "../../../reducers/std/StdStandardApplication";
import {
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceSchModal,
  setDatasourceRegModal,
  setDatasourceModModal,
  setDatasourceRegDrawer,
  setIsvisibleRegDrawer,
  setSelectedStdValueIdx,
  setDatasourceStdValue,
  setIsvisibleRegDrawerJuso,
  setIsvisibleModDrawerJuso,
} from "../../../reducers/std/StdStandardApplication_modal";
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
import Radio from "antd/es/radio";
import Pagination from "antd/es/pagination";
import Checkbox from "antd/es/checkbox";
import DatePicker from "antd/es/date-picker";
import Divider from "antd/es/divider";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";
import { setDatasourceRegModal2 } from "../../../reducers/std/StdStandardEtc";
import { setIsvisibleRegDrawerStdName } from "../../../reducers/std/StdStandardStatus_modal";

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

function Application() {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.StdStandardApplication);

  const {
    datasource_sch_modal,
    isvisible_search_modal,
    isvisible_modify_modal,
    isvisible_register_modal,
    datasource_reg_modal,
  } = useSelector((state) => state.StdStandardApplication_modal);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  const [filterOwn, setFilterOwn] = useState(false);

  // useEffect 제외
  useEffect(() => {
    fetch("/API/search?TYPE=31211", {
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
          subTitle: "시약신청 및 시약지급현황",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/std/std_req",
              name: "표준품",
            },
            {
              href: "/std/std_req",
              name: "표준품",
            },
            {
              href: "/std/std_req",
              name: "시약신청 및 시약지급현황",
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
          title: "시약신청 지급현황",
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
                  <Option value={0}>시약명</Option>
                  <Option value={1}>소속</Option>
                  <Option value={2}>대표자</Option>
                  <Option value={3}>신청일</Option>
                  <Option value={4}>용도</Option>
                </Select>
              </Col>
              <Col xs={21}>
                {[
                  {
                    num: 0,
                    desc: "시약명을 입력하세요",
                  },
                  {
                    num: 1,
                    desc: "소속을 입력하세요",
                  },
                  {
                    num: 2,
                    desc: "대표자를 입력하세요",
                  },
                  {
                    num: 3,
                    desc: "신청일을 입력하세요",
                  },
                  {
                    num: 4,
                    desc: "용도를 입력하세요",
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
            <Row style={{ width: "100%", paddingBottom: "5px" }}>
              <Col style={{ width: "100%", marginBottom: "5px !important" }}>
                <Checkbox
                  defaultChecked={filterOwn}
                  value={filterOwn}
                  onChange={(e) => {
                    setFilterOwn(e.target.checked);
                  }}
                >
                  내가 신청한 내역
                </Checkbox>
                <Button
                  type="primary"
                  size="small"
                  style={{ background: "green" }}
                  onClick={() => {}}
                  icon={<DownloadOutlined />}
                >
                  엑셀
                </Button>
              </Col>
            </Row>
            <Table
              size="small"
              sticky
              bordered
              rowKey={(item) => {
                return item.STD_NAME_DIV_REQ_NUM;
              }}
              dataSource={dataSource
                .filter((data) => {
                  if (filterOwn) {
                    if (data.USERID === userinfo.USERID) return true;
                    else return false;
                  } else {
                    return true;
                  }
                })
                .filter((val) => {
                  const func = (key) => {
                    if (val[key] !== null && val[key] !== "") {
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
                      return func("PROVINCE_NAME");
                      break;
                    case 2:
                      return func("REQ_NAME");
                      break;
                    case 3:
                      return func("REQ_DATE");
                      break;
                    case 4:
                      return func("USE");
                      break;
                  }
                })}
              columns={[
                {
                  title: "구분",
                  dataIndex: "REQ_DATE",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "GUBUN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    if (row.GUBUN === "PRD") {
                      return <>농약</>;
                    } else {
                      return <>동물용의약품</>;
                    }
                  },
                },
                {
                  title: "신청일",
                  dataIndex: "REQ_DATE",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "REQ_DATE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.REQ_DATE}</>;
                  },
                },
                {
                  title: "소속",
                  dataIndex: "PROVINCE_NAME",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PROVINCE_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.PROVINCE_NAME}</>;
                  },
                },
                {
                  title: "대표자",
                  dataIndex: "REQ_NAME",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "REQ_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "descend",
                  render: (data, row, index) => {
                    return <>{row.REQ_NAME}</>;
                  },
                },
                {
                  title: "시약명",
                  dataIndex: "STD_NAME",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "STD_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <a
                        onClick={() => {
                          fetch(
                            "/API/search?TYPE=31212&STANDARD_NAME_DIV_REQ_NUM=" +
                              row.STANDARD_NAME_DIV_REQ_NUM,
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
                  title: "용도",
                  dataIndex: "USE",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "USE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.USE}</>;
                  },
                },
                {
                  title: "지급여부",
                  dataIndex: "SUPPLY_STATUS",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "6%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "SUPPLY_STATUS"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    if (row.SUPPLY_STATUS === "지급") {
                      return (
                        <span style={{ color: "green" }}>
                          {row.SUPPLY_STATUS}
                        </span>
                      );
                    } else {
                      return (
                        <span style={{ color: "red" }}>
                          {row.SUPPLY_STATUS}
                        </span>
                      );
                    }
                  },
                },
                {
                  title: "수령증여부",
                  dataIndex: "RECEIVE_YN",
                  key: "STD_NAME_DIV_REQ_NUM",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "RECEIVE_YN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    if (row.RECEIVE_YN === "수령") {
                      return (
                        <span style={{ color: "green" }}>{row.RECEIVE_YN}</span>
                      );
                    } else {
                      return (
                        <span style={{ color: "red" }}>{row.RECEIVE_YN}</span>
                      );
                    }
                  },
                },
                {
                  title: (
                    <Button
                      size="small"
                      className="button_reg"
                      onClick={() => {
                        fetch(
                          "/API/search?TYPE=31117&USERID=" + userinfo.USERID,
                          {
                            method: "GET",
                            credentials: "include",
                          }
                        )
                          .then(function (response) {
                            return response.json();
                          })
                          .then((myJson) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                INS_DATE: moment(new Date()).format(
                                  "YYYY-MM-DD"
                                ),
                                REQ_DATE: moment(new Date()).format(
                                  "YYYY-MM-DD"
                                ),
                                GUBUN: "PRD",
                                PROVINCE_NAME: myJson[0].PROVINCE_NAME,
                                PROVINCE_NUM: myJson[0].PROVINCE_NUM,
                                USERNAME: myJson[0].USERNAME,
                                USERID: userinfo.USERID,
                              })
                            );
                          });
                        dispatch(setIsvisibleRegModal(true));
                      }}
                    >
                      신청
                    </Button>
                  ),
                  align: "center",
                  dataIndex: "",
                  key: "FOOD_CODE",
                  flag: "등록",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.FOOD_CODE}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=31212&STANDARD_NAME_DIV_REQ_NUM=" +
                                row.STANDARD_NAME_DIV_REQ_NUM,
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
                                        TABLE: "T_RESI_STANDARD_NAME_DIV_REQ",
                                        KEY: ["STANDARD_NAME_DIV_REQ_NUM"],
                                        NUMERIC_KEY: [
                                          "STANDARD_NAME_DIV_REQ_NUM",
                                        ],
                                        STANDARD_NAME_DIV_REQ_NUM:
                                          row.STANDARD_NAME_DIV_REQ_NUM,
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
                                      "시약신청 관리: " +
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
                              fetch("/API/search?TYPE=31211", {
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
                    userinfo.STD_APPLICATION_SCH === "N" ||
                    userinfo.STD_APPLICATION_REG === "N")
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
      {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>}
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
      {isvisible_search_modal ? <SearchModal></SearchModal> : <></>}
    </div>
  );
}

export default Application;

export const SearchModal = () => {
  const dispatch = useDispatch();
  const { isvisible_search_modal, datasource_sch_modal } = useSelector(
    (state) => state.StdStandardApplication_modal
  ); //수정

  const [stock, setStock] = useState([]);

  useEffect(() => {
    fetch(
      "/API/search?TYPE=31213&STANDARD_NAME_DIV_REQ_NUM=" +
        datasource_sch_modal.STANDARD_NAME_DIV_REQ_NUM,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setStock(myJson);
        console.log(myJson);
      });
  }, []);

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
                    title_1: "소속",
                    data_1: datasource_sch_modal.PROVINCE_NAME,
                    title_2: "대표자",
                    data_2: datasource_sch_modal.REQ_NAME,
                    wide: 0,
                  },
                  {
                    title_1: "신청아이디",
                    data_1: datasource_sch_modal.USERID,
                    title_2: "신청자",
                    data_2: datasource_sch_modal.REQ_DETAIL_NAME,
                    wide: 0,
                  },
                  {
                    title_1: "시약명",
                    data_1: datasource_sch_modal.STD_NAME,
                    wide: 1,
                  },
                  {
                    title_1: "용도",
                    data_1: datasource_sch_modal.USE,
                    wide: 1,
                  },
                  {
                    title_1: "받을주소",
                    data_1: (
                      <span>
                        (우편번호 : {datasource_sch_modal.REQ_ZIP_CODE1}){" "}
                        {datasource_sch_modal.REQ_ADDRESS1}{" "}
                        {datasource_sch_modal.REQ_ADDRESS2}
                      </span>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "전화번호",
                    data_1: datasource_sch_modal.REQ_PHONE,
                    wide: 1,
                  },
                  {
                    title_1: "핸드폰",
                    data_1: datasource_sch_modal.REQ_MOBILE,
                    wide: 1,
                  },
                  {
                    title_1: "이메일",
                    data_1: datasource_sch_modal.REQ_EMAIL,
                    wide: 1,
                  },
                  {
                    title_1: "지급요청일자",
                    data_1: datasource_sch_modal.REQ_DATE,
                    wide: 1,
                  },
                  {
                    title_1: "비고",
                    data_1: datasource_sch_modal.NOTE,
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
            title="▣ 시약지급정보"
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
                    title_1: "지급상태",
                    data_1:
                      datasource_sch_modal.SUPPLY_STATUS1 === "Y" ? (
                        <span style={{ color: "green" }}>지급</span>
                      ) : (
                        <span style={{ color: "red" }}>미지급</span>
                      ),
                    wide: 1,
                  },
                  {
                    title_1: "미지급사유",
                    data_1:
                      datasource_sch_modal.SUPPLY_STATUS1 === "N" ? (
                        <span>
                          {datasource_sch_modal.SUPPLY_STATUS2 ===
                          "no_receipt" ? (
                            <span>미접수</span>
                          ) : (
                            <span>품절</span>
                          )}
                          <span>({datasource_sch_modal.SUUPLY_REASON})</span>
                        </span>
                      ) : (
                        <></>
                      ),
                    wide: 1,
                  },
                  {
                    title_1: "지급일자",
                    data_1: datasource_sch_modal.SUPPLY_DATE,
                    wide: 1,
                  },
                  {
                    title_1: "지급방법",
                    data_1:
                      datasource_sch_modal.SUPPLY_METHOD === "post_1" ? (
                        <span>택배</span>
                      ) : datasource_sch_modal.SUPPLY_METHOD === "direct" ? (
                        <span>직접수령</span>
                      ) : (
                        <></>
                      ),
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
            title="▣ 시약재고현황 및 지급량정보"
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
                pagination={false}
                locale={{
                  emptyText:
                    "미지급 상태이거나, 시약이 배정되지 않은 상태입니다.",
                }}
                columns={[
                  {
                    title: "제조회사",
                    dataIndex: "COMPANY_NAME",
                  },
                  {
                    title: "상태",
                    dataIndex: "STATUS_NAME",
                  },
                  {
                    title: "순도",
                    dataIndex: "",
                    render: (data, row, index) => {
                      return (
                        <>
                          {row.PURITY2}
                          {row.PURITY2_UNIT}
                        </>
                      );
                    },
                  },
                  {
                    title: "포장단위",
                    dataIndex: "",
                    render: (data, row, index) => {
                      return (
                        <>
                          {row.QUANTITY}
                          {row.UNIT_NAME}
                        </>
                      );
                    },
                  },
                  {
                    title: "수량",
                    dataIndex: "ITEM_NUM_RSN",
                  },
                  {
                    title: "유효기간",
                    dataIndex: "EXPIRE_DATE",
                  },
                  {
                    title: "지급량",
                    dataIndex: "ITEM_NUM",
                  },
                ]}
                dataSource={stock}
              />
            </Row>
          </Card>
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 수령증확인정보"
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
                pagination={false}
                locale={{ emptyText: "수령확인 정보가 없습니다." }}
                columns={[
                  {
                    title: "수령일자",
                    dataIndex: "RECEIVE_DATE",
                  },
                  {
                    title: "수령인",
                    dataIndex: "RECEIVE_NAME",
                  },
                  {
                    title: "수령증",
                    dataIndex: "FILE_NAME",
                  },
                ]}
                dataSource={[datasource_sch_modal]}
              />
            </Row>
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
    isvisible_register_drawer,
    datasource_std_value,
    isvisible_register_drawer_juso,
  } = useSelector((state) => state.StdStandardApplication_modal); //수정

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
                onCancel={() => {
                  dispatch(setIsvisibleRegModal(false));
                  dispatch(setDatasourceRegModal({}));
                  dispatch(
                    setDatasourceStdValue([
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },

                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                    ])
                  );
                }}
                onConfirm={() => {
                  fetch("/API/search?TYPE=31215", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((myJson) => {
                      const result = [];

                      const datasourceRegModalTemp =
                        _.cloneDeep(datasource_reg_modal);

                      delete datasourceRegModalTemp.PROVINCE_NAME;
                      datasourceRegModalTemp.REQ_NAME =
                        datasourceRegModalTemp.USERNAME;
                      delete datasourceRegModalTemp.USERNAME;
                      datasourceRegModalTemp.SUPPLY_DATE = "1970-01-01";
                      datasourceRegModalTemp.SUPPLY_STATUS1 = "N";
                      datasourceRegModalTemp.SUPPLY_STATUS2 = "no_receipt";
                      datasourceRegModalTemp.SUPPLY_METHOD = "post_1";
                      datasourceRegModalTemp.RECEIVE_YN = "N";
                      datasourceRegModalTemp.DELETE_FLAG = "N";
                      datasourceRegModalTemp.TABLE =
                        "T_RESI_STANDARD_NAME_DIV_REQ";
                      datasourceRegModalTemp.NUMERIC_KEY = [
                        "STANDARD_NAME_DIV_REQ_NUM",
                        "PROVINCE_NUM",
                        "STD_NAME_NUM",
                      ];

                      datasource_std_value
                        .filter((data) => data.FLAG)
                        .forEach((data, idx) => {
                          result.push({
                            ...datasourceRegModalTemp,
                            STD_NAME_NUM: parseInt(data.STD_NAME_NUM, 10),
                            STANDARD_NAME_DIV_REQ_NUM:
                              parseInt(myJson[0].MAX, 10) + idx,
                          });
                        });

                      console.log(result);
                      var promise_update = new Promise((resolve, reject) => {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: customEncrypt(result) }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          if (response.status === 200) {
                            message.success(
                              "시약신청 및 시약 : 시약" +
                                datasource_std_value.length +
                                "종을 추가하였습니다."
                            );
                            dispatch(setIsvisibleRegModal(false));
                            dispatch(setDatasourceRegModal({}));
                            dispatch(
                              setDatasourceStdValue([
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },

                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                              ])
                            );
                            resolve(1);
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                            dispatch(setIsvisibleRegModal(false));
                            dispatch(setDatasourceRegModal({}));
                            dispatch(
                              setDatasourceStdValue([
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },

                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                                { STD_NUM: null, STD_NAME: null, FLAG: false },
                              ])
                            );
                            resolve(0);
                          }
                        });
                      });

                      Promise.all([promise_update]).then((values) => {
                        fetch("/API/search?TYPE=31211", {
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
                    });
                }}
                okText="확인"
                cancelText="취소"
              >
                <Button type="primary" size="small" disabled={false}>
                  등록
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleRegModal(false));
                  dispatch(setDatasourceRegModal({}));
                  dispatch(
                    setDatasourceStdValue([
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },

                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                      { STD_NUM: null, STD_NAME: null, FLAG: false },
                    ])
                  );
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleRegModal(false));
            dispatch(setDatasourceRegModal({}));
            dispatch(
              setDatasourceStdValue([
                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },

                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },
                { STD_NUM: null, STD_NAME: null, FLAG: false },
              ])
            );
          }}
          width="50vw"
          title={<div>시약 신청</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 시약 신청"
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
              <Col xs={24} style={{ border: "1px dashed black" }}>
                <div style={{ paddingBottom: "5px !important" }}>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 시약지급은{" "}
                    <span style={{ color: "red" }}>식약처 잔류물질과</span>에서
                    보유한 물량에 한해서만 지급합니다.
                    <br />
                  </span>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 재고가 <span style={{ color: "red" }}>없는</span> 물품은
                    신청이 <span style={{ color: "red" }}>불가능</span> 합니다.
                    <br />
                  </span>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 1회 신청가능 건수는 최대 10건입니다.
                    <br />
                  </span>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 동일 아이디로 신청 가능한 건수는{" "}
                    <span style={{ color: "red" }}>최근 30일 이내에 30건</span>
                    입니다.{" "}
                    <span style={{ color: "blue" }}>
                      (현재 0건 신청되었으며, 30건 더 신청하실 수 있습니다.)
                    </span>
                    <br />
                  </span>
                </div>
              </Col>
              <Table
                style={{ marginTop: "5px" }}
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
                    title_2: "대표자",
                    data_2: datasource_reg_modal.USERNAME,
                    wide: 0,
                  },
                  {
                    title_1: "신청아이디",
                    data_1: datasource_reg_modal.USERID,
                    title_2: "신청자",
                    data_2: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.REQ_DETAIL_NAME}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              REQ_DETAIL_NAME: e.target.value,
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
                      <Table
                        style={{ margin: "2px" }}
                        size="small"
                        sticky
                        showHeader={false}
                        pagination={false}
                        columns={[
                          {
                            dataIndex: "data1",
                          },
                          {
                            dataIndex: "data2",
                          },
                        ]}
                        dataSource={[
                          {
                            data1: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[0].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(0));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[0] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                            data2: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[1].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(1));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[1] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                          },
                          {
                            data1: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[2].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(2));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[2] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                            data2: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[3].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(3));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[3] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                          },
                          {
                            data1: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[4].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(4));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[4] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                            data2: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[5].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(5));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[5] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                          },
                          {
                            data1: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[6].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(6));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[6] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                            data2: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[7].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(7));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[7] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                          },
                          {
                            data1: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[8].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(8));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[8] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                            data2: (
                              <Row>
                                <Col xs={16}>
                                  <Input
                                    size="small"
                                    value={datasource_std_value[9].STD_NAME}
                                  />
                                </Col>
                                <Col xs={8} style={{ textAlign: "right" }}>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      dispatch(setSelectedStdValueIdx(9));
                                      dispatch(setIsvisibleRegDrawer(true));
                                    }}
                                  >
                                    조회
                                  </Button>
                                  <Button
                                    size="small"
                                    type="ghost"
                                    onClick={() => {
                                      const temp =
                                        _.cloneDeep(datasource_std_value);
                                      temp[9] = {
                                        STD_NUM: null,
                                        STD_NAME: null,
                                        FLAG: false,
                                      };
                                      dispatch(setDatasourceStdValue(temp));
                                    }}
                                  >
                                    삭제
                                  </Button>
                                </Col>
                              </Row>
                            ),
                          },
                        ]}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "용도",
                    data_1: (
                      <TextArea
                        value={datasource_reg_modal.USE_}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USE_: e.target.value,
                            })
                          );
                        }}
                      ></TextArea>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "받을주소",
                    data_1: (
                      <Row>
                        <Col xs={24}>
                          <Row>
                            <Col xs={7}>
                              <Input
                                size="small"
                                style={{ color: "black" }}
                                disabled
                                value={datasource_reg_modal.REQ_ZIP_CODE1}
                              ></Input>
                            </Col>
                            <Col xs={1} />
                            <Col xs={4} style={{ textAlign: "right" }}>
                              <Button
                                size="small"
                                type="primary"
                                block
                                onClick={() => {
                                  dispatch(setIsvisibleRegDrawerJuso(true));
                                }}
                              >
                                우편번호 검색
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                        <div style={{ height: "5px" }}>　</div>
                        <Col xs={24}>
                          <Row>
                            <Col xs={12}>
                              <Input
                                size="small"
                                style={{ color: "black" }}
                                disabled
                                value={datasource_reg_modal.REQ_ADDRESS1}
                              ></Input>
                            </Col>
                            <Col xs={1} />
                            <Col xs={11}>
                              <Input
                                size="small"
                                style={{ color: "black" }}
                                value={datasource_reg_modal.REQ_ADDRESS2}
                                onChange={(e) => {
                                  dispatch(
                                    setDatasourceRegModal({
                                      ...datasource_reg_modal,
                                      REQ_ADDRESS2: e.target.value,
                                    })
                                  );
                                }}
                              ></Input>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ),

                    wide: 1,
                  },
                  {
                    title_1: "전화번호",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.REQ_PHONE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              REQ_PHONE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "핸드폰번호",
                    data_2: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.REQ_MOBILE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              REQ_MOBILE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "이메일",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.REQ_EMAIL}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              REQ_EMAIL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "지급요청일자",
                    data_2: (
                      <DatePicker
                        size="small"
                        value={moment(
                          datasource_reg_modal.REQ_DATE,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              REQ_DATE: dateString,
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
                        value={datasource_reg_modal.NOTE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              NOTE: e.target.value,
                            })
                          );
                        }}
                      ></TextArea>
                    ),
                    wide: 1,
                  },
                ]}
              />
            </Row>
          </Card>
          {isvisible_register_drawer ? <RegisterDrawerStdName /> : <></>}
          {isvisible_register_drawer_juso ? <RegisterDrawerJuso /> : <></>}
        </Modal>
      </div>
    );
  }
};

export const RegisterDrawerStdName = () => {
  const dispatch = useDispatch();
  const {
    datasource_reg_modal,
    isvisible_register_drawer,
    datasource_std_value,
    selected_std_value_idx,
  } = useSelector((state) => state.StdStandardApplication_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=31214", {
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

  if (!isvisible_register_drawer) {
    return <></>;
  } else {
    return (
      <Drawer
        title="시약명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleRegDrawer(false));
        }}
        visible={isvisible_register_drawer}
        width="50vw"
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
              width: "20%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "STD_NAME"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "제조회사",
              dataIndex: "COMPANY_NAME",
              key: "STD_NUM",
              width: "15%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "COMPANY_NAME"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "상태",
              dataIndex: "STATUS_NAME",
              key: "STD_NUM",
              width: "10%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "STATUS_NAME"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "순도",
              dataIndex: "",
              key: "STD_NUM",
              width: "10%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PURITY2"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
              render: (data, row, index) => {
                return (
                  <>
                    {row.PURITY2}
                    {row.PURITY2_UNIT}
                  </>
                );
              },
            },
            {
              title: "포장단위",
              dataIndex: "",
              key: "STD_NUM",
              width: "10%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "QUANTITY"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
              render: (data, row, index) => {
                return (
                  <>
                    {row.QUANTITY}
                    {row.UNIT_NAME}
                  </>
                );
              },
            },
            {
              title: "수량",
              dataIndex: "ITEM_NUM",
              key: "STD_NUM",
              width: "10%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "ITEM_NUM"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "재고여부",
              dataIndex: "STOCK_YN",
              key: "STD_NUM",
              width: "10%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "STOCK_YN"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
              render: (data, row, index) => {
                return (
                  <>
                    {row.STOCK_YN === "Y" ? (
                      <span style={{ color: "green" }}>있음</span>
                    ) : (
                      <span style={{ color: "red" }}>없음</span>
                    )}
                  </>
                );
              },
            },
            {
              title: "",
              dataIndex: "",
              key: "STD_NUM",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  disabled={row.STOCK_YN === "Y" ? false : true}
                  size="small"
                  block
                  onClick={() => {
                    const temp = _.cloneDeep(datasource_std_value);
                    temp[selected_std_value_idx].STD_NUM = row.STD_NUM;
                    temp[selected_std_value_idx].STD_NAME = row.STD_NAME;
                    temp[selected_std_value_idx].STD_NAME_NUM =
                      row.STD_NAME_NUM;
                    temp[selected_std_value_idx].FLAG = true;
                    dispatch(setDatasourceStdValue(temp));
                    dispatch(setIsvisibleRegDrawer(false));
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
            }
          })}
        ></Table>
      </Drawer>
    );
  }
};

export const RegisterDrawerJuso = () => {
  const dispatch = useDispatch();
  const { isvisible_register_drawer_juso, datasource_reg_modal } = useSelector(
    (state) => state.StdStandardApplication_modal
  );
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [common, setCommon] = useState({});
  const [juso, setJuso] = useState([]);

  const [hstryYn, setHstryYn] = useState("N");
  const [firstSort, setFirstSort] = useState("none");

  const [currentPage, setCurrentPage] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);

  useEffect(() => {}, []);

  if (!isvisible_register_drawer_juso) {
    return <></>;
  } else {
    const URL =
      "https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDI1MDMxMzA5NDUzMDExNTU0Mzg=&keyword=";
    return (
      <Drawer
        title="주소 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleRegDrawerJuso(false));
        }}
        visible={isvisible_register_drawer_juso}
        width="40vw"
      >
        <Search
          placeholder="주소명을 입력하세요"
          enterButton
          onSearch={(e) => {
            setSearchKey(e);

            fetch(
              URL +
                e +
                "&resultType=json" +
                "&addInfoYn=Y" +
                "&currentPage=" +
                currentPage +
                "&countPerPage=" +
                countPerPage +
                "&hstryYn=" +
                hstryYn +
                "&firstSort=" +
                firstSort,
              {
                method: "GET",
              }
            )
              .then(function (response) {
                return response.text();
              })
              .then((myJson) => {
                const results = JSON.parse(myJson).results;
                setCommon(results.common);
                console.log(results);

                if (results.juso !== null && results.length !== 0) {
                  results.juso.forEach((data) => {
                    data.detailFlag = false;
                  });
                  setJuso(results.juso);
                } else {
                  setJuso([]);
                }

                if (results.common.totalCount >= 1000) {
                  message.warning(
                    <>
                      검색 결과가 너무 많습니다(1000건 이상)
                      <br />
                      검색어 예를 참조하여 검색하시기 바랍니다.
                    </>
                  );
                }
              });
          }}
          style={{ marginBottom: "10px" }}
        />
        <Row>
          <Col xs={6}>
            {/* <Checkbox
              onChange={(e) => {
                setHstryYn(e.target.checked ? "Y" : "N");
                fetch(
                  URL +
                    searchKey +
                    "&resultType=json" +
                    "&addInfoYn=Y" +
                    "&currentPage=" +
                    currentPage +
                    "&countPerPage=" +
                    countPerPage +
                    "&hstryYn=" +
                    e.target.checked
                    ? "Y"
                    : "N" + "&firstSort=" + firstSort,
                  {
                    method: "GET",
                  }
                )
                  .then(function (response) {
                    return response.text();
                  })
                  .then((myJson) => {
                    console.log(myJson);
                    const results = JSON.parse(myJson).results;
                    console.log(results);
                    setCommon(results.common);

                    results.juso.forEach((data) => {
                      data.detailFlag = false;
                    });
                    console.log(results.juso);
                    setJuso(results.juso);

                    if (results.common.totalCount >= 1000) {
                      message.warning(
                        <>
                          검색 결과가 너무 많습니다(1000건 이상)
                          <br />
                          검색어 예를 참조하여 검색하시기 바랍니다.
                        </>
                      );
                    }
                  });
              }}
            >
              변동된 주소정보 포함
            </Checkbox> */}
          </Col>
          <Col xs={18} style={{ textAlign: "right" }}>
            <span style={{ color: "#186bb9" }}>
              예시 : 도로명(반포대로 58), 건물명(독립기념관), 지번(삼성동 25)
            </span>
          </Col>
        </Row>
        <Divider></Divider>
        {common.totalCount > 0 ? (
          <>
            <Row>
              <Col xs={10} style={{ textAlign: "left" }}>
                <span>
                  - 도로명주소 검색 결과(
                  <span style={{ color: "blue" }}>{common.totalCount}건</span>)
                </span>
              </Col>
              <Col xs={14} style={{ textAlign: "right" }}>
                <Radio.Group
                  onChange={(e) => {
                    setFirstSort(e.target.value);
                    fetch(
                      URL +
                        searchKey +
                        "&resultType=json" +
                        "&addInfoYn=Y" +
                        "&currentPage=" +
                        currentPage +
                        "&countPerPage=" +
                        countPerPage +
                        "&hstryYn=" +
                        hstryYn +
                        "&firstSort=" +
                        e.target.value,
                      {
                        method: "GET",
                      }
                    )
                      .then(function (response) {
                        return response.text();
                      })
                      .then((myJson) => {
                        const results = JSON.parse(myJson).results;
                        setCommon(results.common);

                        results.juso.forEach((data) => {
                          data.detailFlag = false;
                        });
                        console.log(results.juso);
                        setJuso(results.juso);

                        if (results.common.totalCount >= 1000) {
                          message.warning(
                            <>
                              검색 결과가 너무 많습니다(1000건 이상)
                              <br />
                              검색어 예를 참조하여 검색하시기 바랍니다.
                            </>
                          );
                        }
                      });
                  }}
                  value={firstSort}
                >
                  <Radio value={"none"}>정확도순</Radio>
                  <Radio value={"road"}>도로명 포함</Radio>
                  <Radio value={"location"}>지번 포함</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Table
              style={{ marginBottom: "10px" }}
              size="small"
              sticky
              bordered
              pagination={false}
              dataSource={juso}
              columns={[
                {
                  title: "도로명주소",
                  dataIndex: "roadAddr",
                  key: "roadAddr",
                  width: "70%",
                  render: (data, row, index) => {
                    return (
                      <Row>
                        <Col xs={24}>
                          <>
                            <div>
                              <span
                                style={{ fontSize: "13px", fontWeight: "bold" }}
                              >
                                {row.roadAddr}
                              </span>
                            </div>
                            <div>
                              <span
                                style={{ fontSize: "13px", fontWeight: "" }}
                              >
                                [지번] {row.jibunAddr}
                              </span>
                            </div>
                          </>
                        </Col>
                      </Row>
                    );
                  },
                },
                {
                  title: "우편번호",
                  dataIndex: "STD_NAME",
                  key: "STD_NUM",
                  width: "15%",
                  render: (data, row, index) => {
                    return <>{row.zipNo}</>;
                  },
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
                        dispatch(setIsvisibleRegDrawerJuso(false));
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            REQ_ZIP_CODE1: row.zipNo,
                            REQ_ADDRESS1: row.roadAddr,
                          })
                        );
                      }}
                    >
                      선택
                    </Button>
                  ),
                },
              ]}
            ></Table>

            <Row style={{ textAlign: "center" }}>
              <Col xs={24}>
                <Pagination
                  defaultCurrent={0}
                  total={common.totalCount}
                  onChange={(currentPage, countPerPage) => {
                    setCurrentPage(currentPage);
                    setCountPerPage(countPerPage);
                    fetch(
                      URL +
                        searchKey +
                        "&resultType=json" +
                        "&addInfoYn=Y" +
                        "&currentPage=" +
                        currentPage +
                        "&countPerPage=" +
                        countPerPage +
                        "&hstryYn=" +
                        hstryYn +
                        "&firstSort=" +
                        firstSort,
                      {
                        method: "GET",
                      }
                    )
                      .then(function (response) {
                        return response.text();
                      })
                      .then((myJson) => {
                        const results = JSON.parse(myJson).results;
                        setCommon(results.common);

                        results.juso.forEach((data) => {
                          data.detailFlag = false;
                        });
                        console.log(results.juso);
                        setJuso(results.juso);

                        if (results.common.totalCount >= 1000) {
                          message.warning(
                            <>
                              검색 결과가 너무 많습니다(1000건 이상)
                              <br />
                              검색어 예를 참조하여 검색하시기 바랍니다.
                            </>
                          );
                        }
                      });
                  }}
                  showSizeChanger
                />
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
      </Drawer>
    );
  }
};

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_modify_modal,
    datasource_mod_modal,
    isvisible_modify_drawer_juso,
  } = useSelector((state) => state.StdStandardApplication_modal); //수정
  const { userinfo } = useSelector((state) => state.header);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    fetch(
      "/API/search?TYPE=31216&STANDARD_NAME_DIV_REQ_NUM=" +
        datasource_mod_modal.STANDARD_NAME_DIV_REQ_NUM,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setStock(myJson);
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
                title="등록하시겠습니까?"
                onCancel={() => {
                  dispatch(setIsvisibleModModal(false));
                  dispatch(setDatasourceModModal({}));
                }}
                onConfirm={() => {
                  const promise_stock = new Promise((resolve, reject) => {
                    const stockTemp = _.cloneDeep(
                      stock.filter(
                        (data) =>
                          data.ITEM_NUM !== "" && data.ITEM_NUM !== undefined
                      )
                    );
                    const stockTempFiltered = [];
                    stockTemp.forEach((data, idx) => {
                      const temp = {};
                      temp.STANDARD_NAME_DIV_REQ_NUM =
                        data.STANDARD_NAME_DIV_REQ_NUM;
                      temp.STD_NAME_NUM = data.STD_NAME_NUM;
                      temp.ITEM_NUM = data.ITEM_NUM;
                      temp.TABLE = "T_RESI_STANDARD_NAME_DIV";
                      stockTempFiltered.push(temp);
                    });

                    fetch("/API/insert", {
                      method: "POST",
                      body: JSON.stringify({
                        data: customEncrypt(stockTempFiltered),
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        resolve(1);
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.1");
                        resolve(0);
                      }
                    });
                  });

                  const promise_datasource = new Promise((resolve, reject) => {
                    const datasource_mod_modal_temp =
                      _.cloneDeep(datasource_mod_modal);
                    delete datasource_mod_modal_temp.PROVINCE_NAME;
                    delete datasource_mod_modal_temp.STD_NAME;

                    datasource_mod_modal_temp.TABLE =
                      "T_RESI_STANDARD_NAME_DIV_REQ";
                    datasource_mod_modal_temp.KEY = [
                      "STANDARD_NAME_DIV_REQ_NUM",
                    ];
                    datasource_mod_modal_temp.NUMERIC_KEY = [
                      "STANDARD_NAME_DIV_REQ_NUM",
                      "PROVINCE_NUM",
                      "STD_NUM",
                    ];

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({
                        data: customEncrypt([datasource_mod_modal_temp]),
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        resolve(1);
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.1");
                        resolve(0);
                      }
                    });
                  });

                  Promise.all([promise_datasource]).then((result) => {
                    fetch("/API/search?TYPE=31211", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then(function (response) {
                        return response.json();
                      })
                      .then((myJson) => {
                        dispatch(setIsvisibleModModal(false));
                        dispatch(setDatasourceModModal({}));
                        dispatch(setDataSource(myJson));
                        message.success(
                          "시약 신청 및 지급현황 수정 :" +
                            datasource_mod_modal.STD_NAME +
                            "을 수정하였습니다."
                        );
                      });
                  });

                  // dispatch(setIsvisibleModModal(false))
                  // dispatch(setDatasourceModModal({}))
                }}
                okText="확인"
                cancelText="취소"
              >
                <Button type="primary" size="small" disabled={false}>
                  등록
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
          title={<div>시약 신청</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 시약 신청"
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
              <Col xs={24} style={{ border: "1px dashed black" }}>
                <div style={{ paddingBottom: "5px !important" }}>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 시약지급은{" "}
                    <span style={{ color: "red" }}>식약처 잔류물질과</span>에서
                    보유한 물량에 한해서만 지급합니다.
                    <br />
                  </span>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 재고가 <span style={{ color: "red" }}>없는</span> 물품은
                    신청이 <span style={{ color: "red" }}>불가능</span> 합니다.
                    <br />
                  </span>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 1회 신청가능 건수는 최대 10건입니다.
                    <br />
                  </span>
                  <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                    - 동일 아이디로 신청 가능한 건수는{" "}
                    <span style={{ color: "red" }}>최근 30일 이내에 30건</span>
                    입니다.{" "}
                    <span style={{ color: "blue" }}>
                      (현재 0건 신청되었으며, 30건 더 신청하실 수 있습니다.)
                    </span>
                    <br />
                  </span>
                </div>
              </Col>
              <Table
                style={{ marginTop: "5px" }}
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
                    title_2: "대표자",
                    data_2: datasource_mod_modal.REQ_NAME,
                    wide: 0,
                  },
                  {
                    title_1: "신청아이디",
                    data_1: datasource_mod_modal.USERID,
                    title_2: "신청자",
                    data_2: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.REQ_DETAIL_NAME}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              REQ_DETAIL_NAME: e.target.value,
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
                      <>
                        <span style={{ color: "black" }}>
                          {datasource_mod_modal.STD_NAME}
                        </span>{" "}
                        <span style={{ color: "red" }}>(수정불가)</span>
                      </>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "용도",
                    data_1: (
                      <TextArea
                        value={datasource_mod_modal.USE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              USE: e.target.value,
                            })
                          );
                        }}
                      ></TextArea>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "받을주소",
                    data_1: (
                      <Row>
                        <Col xs={24}>
                          <Row>
                            <Col xs={7}>
                              <Input
                                size="small"
                                style={{ color: "black" }}
                                disabled
                                value={datasource_mod_modal.REQ_ZIP_CODE1}
                              ></Input>
                            </Col>
                            <Col xs={1} />
                            <Col xs={4} style={{ textAlign: "right" }}>
                              <Button
                                size="small"
                                type="primary"
                                block
                                onClick={() => {
                                  dispatch(setIsvisibleModDrawerJuso(true));
                                }}
                              >
                                우편번호 검색
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                        <div style={{ height: "5px" }}>　</div>
                        <Col xs={24}>
                          <Row>
                            <Col xs={12}>
                              <Input
                                size="small"
                                style={{ color: "black" }}
                                disabled
                                value={datasource_mod_modal.REQ_ADDRESS1}
                              ></Input>
                            </Col>
                            <Col xs={1} />
                            <Col xs={11}>
                              <Input
                                size="small"
                                style={{ color: "black" }}
                                value={datasource_mod_modal.REQ_ADDRESS2}
                                onChange={(e) => {
                                  dispatch(
                                    setDatasourceModModal({
                                      ...datasource_mod_modal,
                                      REQ_ADDRESS2: e.target.value,
                                    })
                                  );
                                }}
                              ></Input>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ),

                    wide: 1,
                  },
                  {
                    title_1: "전화번호",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.REQ_PHONE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              REQ_PHONE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "핸드폰번호",
                    data_2: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.REQ_MOBILE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              REQ_MOBILE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "이메일",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.REQ_EMAIL}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              REQ_EMAIL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "지급요청일자",
                    data_2: (
                      <DatePicker
                        size="small"
                        value={moment(
                          datasource_mod_modal.REQ_DATE,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              REQ_DATE: dateString,
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
                        value={datasource_mod_modal.NOTE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              NOTE: e.target.value,
                            })
                          );
                        }}
                      ></TextArea>
                    ),
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
            title="▣ 시약지급정보"
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
              style={{ marginTop: "5px" }}
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
                  title_1: "지급상태",
                  data_1: (
                    <Radio.Group
                      value={datasource_mod_modal.SUPPLY_STATUS1}
                      onChange={(e) => {
                        dispatch(
                          setDatasourceModModal({
                            ...datasource_mod_modal,
                            SUPPLY_STATUS1: e.target.value,
                          })
                        );
                      }}
                    >
                      <Radio size="small" value={"Y"}>
                        지급
                      </Radio>
                      <Radio size="small" value={"N"}>
                        미지급
                      </Radio>
                    </Radio.Group>
                  ),
                  wide: 1,
                },
                {
                  title_1: "지급일자",
                  data_1: (
                    <DatePicker
                      size="small"
                      placeholder="ex)1990-01-01"
                      value={moment(
                        datasource_mod_modal.SUPPLY_DATE,
                        "YYYY-MM-DD"
                      )}
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => {
                        dispatch(
                          setDatasourceModModal({
                            ...datasource_mod_modal,
                            SUPPLY_DATE: dateString,
                          })
                        );
                      }}
                    />
                  ),
                  wide: 1,
                },
                {
                  title_1: "미지급사유",
                  data_1: (
                    <Row>
                      <Col xs={12}>
                        <Radio.Group
                          value={datasource_mod_modal.SUPPLY_STATUS2}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceModModal({
                                ...datasource_mod_modal,
                                SUPPLY_STATUS2: e.target.value,
                              })
                            );
                          }}
                        >
                          <Radio size="small" value={"no_receipt"}>
                            미접수
                          </Radio>
                          <Radio size="small" value={"sold_out"}>
                            품절
                          </Radio>
                          <Radio size="small" value={"etc"}>
                            기타
                          </Radio>
                        </Radio.Group>
                      </Col>
                      <Col xs={12}>
                        <Input
                          size="small"
                          placeholder="기타 사유를 작성해주세요"
                          value={datasource_mod_modal.SUPPLY_REASON}
                          disabled={
                            datasource_mod_modal.SUPPLY_STATUS2 !== "etc"
                          }
                          onChange={(e) => {
                            dispatch(
                              setDatasourceModModal({
                                ...datasource_mod_modal,
                                SUPPLY_REASON: e.target.value,
                              })
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  ),
                  wide: 1,
                },
                {
                  title_1: "지급방법",
                  data_1: (
                    <Radio.Group
                      value={datasource_mod_modal.SUPPLY_METHOD}
                      onChange={(e) => {
                        dispatch(
                          setDatasourceModModal({
                            ...datasource_mod_modal,
                            SUPPLY_METHOD: e.target.value,
                          })
                        );
                      }}
                    >
                      <Radio size="small" value={"post_1"}>
                        택배
                      </Radio>
                      <Radio size="small" value={"direct"}>
                        직접수령
                      </Radio>
                    </Radio.Group>
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 시약재고현황 및 지급량정보"
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
                pagination={false}
                locale={{
                  emptyText:
                    "미지급 상태이거나, 시약이 배정되지 않은 상태입니다.",
                }}
                columns={[
                  {
                    title: "제조회사",
                    dataIndex: "COMPANY_NAME",
                  },
                  {
                    title: "상태",
                    dataIndex: "STATUS_NAME",
                  },
                  {
                    title: "순도",
                    dataIndex: "",
                    render: (data, row, index) => {
                      return (
                        <>
                          {row.PURITY2}
                          {row.PURITY2_UNIT}
                        </>
                      );
                    },
                  },
                  {
                    title: "포장단위",
                    dataIndex: "",
                    render: (data, row, index) => {
                      return (
                        <>
                          {row.QUANTITY}
                          {row.UNIT_NAME}
                        </>
                      );
                    },
                  },
                  {
                    title: "수량",
                    dataIndex: "ITEM_NUM_RSN",
                  },
                  {
                    title: "유효기간",
                    dataIndex: "EXPIRE_DATE",
                  },
                  {
                    title: "지급량",
                    dataIndex: "ITEM_NUM",
                    render: (data, row, idx) => {
                      return (
                        <Input
                          size="small"
                          value={stock.ITEM_NUM}
                          onChange={(e) => {
                            const stockTemp = _.cloneDeep(stock);
                            stockTemp[idx].ITEM_NUM = e.target.value;
                            setStock(stockTemp);
                          }}
                        />
                      );
                    },
                  },
                ]}
                dataSource={stock}
              />
            </Row>
          </Card>
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 수령증확인정보"
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
                pagination={false}
                locale={{ emptyText: "수령확인 정보가 없습니다." }}
                columns={[
                  {
                    title: "수령일자",
                    dataIndex: "RECEIVE_DATE",
                  },
                  {
                    title: "수령인",
                    dataIndex: "RECEIVE_NAME",
                  },
                  {
                    title: "수령확인",
                    dataIndex: "FILE_NAME",
                    render: (data, row, index) => {
                      if (userinfo.USERID === row.USERID) {
                        if (row.RECEIVE_YN === "N") {
                          return (
                            <Button
                              onClick={() => {
                                var result = [
                                  {
                                    TABLE: "T_RESI_STANDARD_NAME_DIV_REQ",
                                    STANDARD_NAME_DIV_REQ_NUM:
                                      row.STANDARD_NAME_DIV_REQ_NUM,
                                    STD_NAME_NUM: row.STD_NAME_NUM,
                                    RECEIVE_YN: "Y",
                                    RECEIVE_NAME: userinfo.USERNAME,
                                    RECEIVE_DATE: moment(new Date()).format(
                                      "YYYY-MM-DD"
                                    ),
                                    KEY: [
                                      "STANDARD_NAME_DIV_REQ_NUM",
                                      "STD_NAME_NUM",
                                    ],
                                    NUMERIC_KEY: [
                                      "STANDARD_NAME_DIV_REQ_NUM",
                                      "STD_NAME_NUM",
                                    ],
                                  },
                                ];

                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt(result),
                                  }),
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  credentials: "include",
                                }).then(function (response) {
                                  fetch(
                                    "/API/search?TYPE=31212&STANDARD_NAME_DIV_REQ_NUM=" +
                                      row.STANDARD_NAME_DIV_REQ_NUM,
                                    {
                                      method: "GET",
                                      credentials: "include",
                                    }
                                  )
                                    .then(function (response) {
                                      return response.json();
                                    })
                                    .then((myJson) => {
                                      dispatch(
                                        setDatasourceModModal(myJson[0])
                                      );
                                      //   dispatch(setIsvisibleSchModal(true));
                                    });
                                  fetch("/API/search?TYPE=31211", {
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
                            >
                              수령확인
                            </Button>
                          );
                        } else {
                          return (
                            <Button
                              danger
                              onClick={() => {
                                var result = [
                                  {
                                    TABLE: "T_RESI_STANDARD_NAME_DIV_REQ",
                                    STANDARD_NAME_DIV_REQ_NUM:
                                      row.STANDARD_NAME_DIV_REQ_NUM,
                                    STD_NAME_NUM: row.STD_NAME_NUM,
                                    RECEIVE_YN: "N",
                                    RECEIVE_NAME: "",
                                    RECEIVE_DATE: null,
                                    KEY: [
                                      "STANDARD_NAME_DIV_REQ_NUM",
                                      "STD_NAME_NUM",
                                    ],
                                    NUMERIC_KEY: [
                                      "STANDARD_NAME_DIV_REQ_NUM",
                                      "STD_NAME_NUM",
                                    ],
                                  },
                                ];

                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt(result),
                                  }),
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  credentials: "include",
                                }).then(function (response) {
                                  fetch(
                                    "/API/search?TYPE=31212&STANDARD_NAME_DIV_REQ_NUM=" +
                                      row.STANDARD_NAME_DIV_REQ_NUM,
                                    {
                                      method: "GET",
                                      credentials: "include",
                                    }
                                  )
                                    .then(function (response) {
                                      return response.json();
                                    })
                                    .then((myJson) => {
                                      dispatch(
                                        setDatasourceModModal(myJson[0])
                                      );
                                      //   dispatch(setIsvisibleSchModal(true));
                                    });
                                  fetch("/API/search?TYPE=31211", {
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
                            >
                              수령확인 취소
                            </Button>
                          );
                        }
                      }
                    },
                  },
                ]}
                dataSource={[datasource_mod_modal]}
              />
            </Row>
          </Card>
          {isvisible_modify_drawer_juso ? <ModifyDrawerJuso /> : <></>}
        </Modal>
      </div>
    );
  }
};

export const ModifyDrawerJuso = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_drawer_juso, datasource_mod_modal } = useSelector(
    (state) => state.StdStandardApplication_modal
  );
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [common, setCommon] = useState({});
  const [juso, setJuso] = useState([]);

  const [hstryYn, setHstryYn] = useState("N");
  const [firstSort, setFirstSort] = useState("none");

  const [currentPage, setCurrentPage] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);

  useEffect(() => {}, []);

  if (!isvisible_modify_drawer_juso) {
    return <></>;
  } else {
    const URL =
      "https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIxMDkxNDIxMzA1OTExMTY2NTQ=&keyword=";
    return (
      <Drawer
        title="주소 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleModDrawerJuso(false));
        }}
        visible={isvisible_modify_drawer_juso}
        width="40vw"
      >
        <Search
          placeholder="주소명을 입력하세요"
          enterButton
          onSearch={(e) => {
            setSearchKey(e);
            fetch(
              URL +
                e +
                searchKey +
                "&resultType=json" +
                "&addInfoYn=Y" +
                "&currentPage=" +
                currentPage +
                "&countPerPage=" +
                countPerPage +
                "&hstryYn=" +
                hstryYn +
                "&firstSort=" +
                firstSort,
              {
                method: "GET",
              }
            )
              .then(function (response) {
                return response.text();
              })
              .then((myJson) => {
                const results = JSON.parse(myJson).results;
                setCommon(results.common);

                results.juso.forEach((data) => {
                  data.detailFlag = false;
                });
                console.log(results.juso);
                setJuso(results.juso);

                if (results.common.totalCount >= 1000) {
                  message.warning(
                    <>
                      검색 결과가 너무 많습니다(1000건 이상)
                      <br />
                      검색어 예를 참조하여 검색하시기 바랍니다.
                    </>
                  );
                }
              });
          }}
          style={{ marginBottom: "10px" }}
        />
        <Row>
          <Col xs={6}>
            <Checkbox
              onChange={(e) => {
                setHstryYn(e.target.checked ? "Y" : "N");
                fetch(
                  URL +
                    searchKey +
                    "&resultType=json" +
                    "&addInfoYn=Y" +
                    "&currentPage=" +
                    currentPage +
                    "&countPerPage=" +
                    countPerPage +
                    "&hstryYn=" +
                    e.target.checked
                    ? "Y"
                    : "N" + "&firstSort=" + firstSort,
                  {
                    method: "GET",
                  }
                )
                  .then(function (response) {
                    return response.text();
                  })
                  .then((myJson) => {
                    const results = JSON.parse(myJson).results;
                    setCommon(results.common);

                    results.juso.forEach((data) => {
                      data.detailFlag = false;
                    });
                    console.log(results.juso);
                    setJuso(results.juso);

                    if (results.common.totalCount >= 1000) {
                      message.warning(
                        <>
                          검색 결과가 너무 많습니다(1000건 이상)
                          <br />
                          검색어 예를 참조하여 검색하시기 바랍니다.
                        </>
                      );
                    }
                  });
              }}
            >
              변동된 주소정보 포함
            </Checkbox>
          </Col>
          <Col xs={18} style={{ textAlign: "right" }}>
            <span style={{ color: "#186bb9" }}>
              예시 : 도로명(반포대로 58), 건물명(독립기념관), 지번(삼성동 25)
            </span>
          </Col>
        </Row>
        <Divider></Divider>
        {common.totalCount > 0 ? (
          <>
            <Row>
              <Col xs={10} style={{ textAlign: "left" }}>
                <span>
                  - 도로명주소 검색 결과(
                  <span style={{ color: "blue" }}>{common.totalCount}건</span>)
                </span>
              </Col>
              <Col xs={14} style={{ textAlign: "right" }}>
                <Radio.Group
                  onChange={(e) => {
                    setFirstSort(e.target.value);
                    fetch(
                      URL +
                        searchKey +
                        "&resultType=json" +
                        "&addInfoYn=Y" +
                        "&currentPage=" +
                        currentPage +
                        "&countPerPage=" +
                        countPerPage +
                        "&hstryYn=" +
                        hstryYn +
                        "&firstSort=" +
                        e.target.value,
                      {
                        method: "GET",
                      }
                    )
                      .then(function (response) {
                        return response.text();
                      })
                      .then((myJson) => {
                        const results = JSON.parse(myJson).results;
                        setCommon(results.common);

                        results.juso.forEach((data) => {
                          data.detailFlag = false;
                        });
                        console.log(results.juso);
                        setJuso(results.juso);

                        if (results.common.totalCount >= 1000) {
                          message.warning(
                            <>
                              검색 결과가 너무 많습니다(1000건 이상)
                              <br />
                              검색어 예를 참조하여 검색하시기 바랍니다.
                            </>
                          );
                        }
                      });
                  }}
                  value={firstSort}
                >
                  <Radio value={"none"}>정확도순</Radio>
                  <Radio value={"road"}>도로명 포함</Radio>
                  <Radio value={"location"}>지번 포함</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Table
              style={{ marginBottom: "10px" }}
              size="small"
              sticky
              bordered
              pagination={false}
              dataSource={juso}
              columns={[
                {
                  title: "도로명주소",
                  dataIndex: "roadAddr",
                  key: "zipNo",
                  width: "70%",
                  render: (data, row, index) => {
                    return (
                      <Row>
                        <Col xs={24}>
                          <>
                            <div>
                              <span
                                style={{ fontSize: "13px", fontWeight: "bold" }}
                              >
                                {row.roadAddr}
                              </span>
                            </div>
                            <div>
                              <span
                                style={{ fontSize: "13px", fontWeight: "" }}
                              >
                                [지번] {row.jibunAddr}
                              </span>
                            </div>
                          </>
                        </Col>
                      </Row>
                    );
                  },
                },
                {
                  title: "우편번호",
                  dataIndex: "zipNo",
                  key: "zipNo",
                  width: "15%",
                  render: (data, row, index) => {
                    return <>{row.zipNo}</>;
                  },
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
                        dispatch(setIsvisibleModDrawerJuso(false));
                        dispatch(
                          setDatasourceModModal({
                            ...datasource_mod_modal,
                            REQ_ZIP_CODE1: row.zipNo,
                            REQ_ADDRESS1: row.roadAddr,
                          })
                        );
                      }}
                    >
                      선택
                    </Button>
                  ),
                },
              ]}
            ></Table>

            <Row style={{ textAlign: "center" }}>
              <Col xs={24}>
                <Pagination
                  defaultCurrent={1}
                  total={common.totalCount}
                  onChange={(currentPage, countPerPage) => {
                    setCurrentPage(currentPage);
                    setCountPerPage(countPerPage);
                    fetch(
                      URL +
                        searchKey +
                        "&resultType=json" +
                        "&addInfoYn=Y" +
                        "&currentPage=" +
                        currentPage +
                        "&countPerPage=" +
                        countPerPage +
                        "&hstryYn=" +
                        hstryYn +
                        "&firstSort=" +
                        firstSort,
                      {
                        method: "GET",
                      }
                    )
                      .then(function (response) {
                        return response.text();
                      })
                      .then((myJson) => {
                        const results = JSON.parse(myJson).results;
                        setCommon(results.common);

                        results.juso.forEach((data) => {
                          data.detailFlag = false;
                        });
                        console.log(results.juso);
                        setJuso(results.juso);

                        if (results.common.totalCount >= 1000) {
                          message.warning(
                            <>
                              검색 결과가 너무 많습니다(1000건 이상)
                              <br />
                              검색어 예를 참조하여 검색하시기 바랍니다.
                            </>
                          );
                        }
                      });
                  }}
                  showSizeChanger
                />
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
      </Drawer>
    );
  }
};
