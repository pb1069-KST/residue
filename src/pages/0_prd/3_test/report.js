import React, { useState, useEffect, useRef } from "react";
import Hangul from "hangul-js";
import _, { size } from "lodash";
import moment from "moment";
import { customEncrypt } from "../../util";
// #antd icon
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
  RedoOutlined,
} from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../components/template";
//components

//redux
import { setDataSource } from "../../../reducers/prd/prdTestReport";
import {
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceSchModal,
  setDatasourceSchModalMrl,
  setDatasourceRegModal,
  setDatasourceRegModalMrl,
  setDatasourceModModal,
  setDatasourceModModalMrl,
  setDatasourceRegDrawer,
  setIsvisibleRegDrawer,
  setDatasourceModDrawer,
  setIsvisibleModDrawer,
} from "../../../reducers/prd/prdTestReport_modal";
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
import Tag from "antd/es/tag";
import List from "antd/es/list";

// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";

const { Option } = Select;
const { Search, TextArea } = Input;

function Report() {
  const dispatch = useDispatch();
  // 수정
  const { dataSource } = useSelector((state) => state.prdTestReport);
  const {
    isvisible_search_modal,
    isvisible_modify_modal,
    isvisible_register_modal,
  } = useSelector((state) => state.prdTestReport_modal);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  // useEffect 제외
  useEffect(() => {
    fetch("/API/search?TYPE=14111", {
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
          title: "농약",
          subTitle: "작물잔류시험성적서",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/exam",
              name: "농약",
            },
            {
              href: "/prd/exam",
              name: "작물잔류시험성적서",
            },
            {
              href: "/prd/exam",
              name: "작물잔류시험성적서",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 1,
          defaultActiveKey: 3,
        }}
        //카드
        main_card={{
          title: "작물잔류시험성적서 목록 검색",
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
                  <Option value={0}>농약명</Option>
                  <Option value={1}>작물명</Option>
                  <Option value={2}>회사명</Option>
                  <Option value={3}>등록인</Option>
                  <Option value={4}>아이디</Option>
                </Select>
              </Col>
              <Col xs={21}>
                {[
                  {
                    num: 0,
                    desc: "농약명을 입력하세요",
                  },
                  {
                    num: 1,
                    desc: "작물명을 입력하세요",
                  },
                  {
                    num: 2,
                    desc: "회사명을 입력하세요",
                  },
                  {
                    num: 3,
                    desc: "등록인을 입력하세요",
                  },
                  {
                    num: 4,
                    desc: "아이디를 입력하세요",
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
                return item.NUM;
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
                    return func("PESTICIDE_NAME_KR");
                    break;
                  case 1:
                    return func("FARM_PRODUCTS_NAME");
                    break;
                  case 2:
                    return func("COMPANY_NAME");
                    break;
                  case 3:
                    return func("REG_ID");
                    break;
                  case 4:
                    return func("USERNAME");
                    break;
                }
              })}
              columns={[
                {
                  title: "농약명",
                  dataIndex: "PESTICIDE_NAME_KR",
                  key: "NUM",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          const promise_info = new Promise(
                            (resolve, reject) => {
                              fetch("/API/search?TYPE=14113&NUM=" + row.NUM, {
                                method: "GET",
                                credentials: "include",
                              })
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(setDatasourceSchModal(myJson[0]));
                                  resolve(1);
                                });
                            }
                          );
                          const promise_mrl = new Promise((resolve, reject) => {
                            fetch("/API/search?TYPE=14114&NUM=" + row.NUM, {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                myJson.forEach((item, idx) => {
                                  item.IS_FOCUSED_MAX_REMAIN = false;
                                  item.IS_FOCUSED_PASSAGE_DAYS = false;
                                  item.IS_FOCUSED_USE_COUNT = false;
                                  item.NUM = idx;
                                  item.DELETE_FLAG = "N";
                                });
                                dispatch(setDatasourceSchModalMrl(myJson));
                                resolve(1);
                              });
                          });

                          Promise.all([promise_info, promise_mrl]).then(
                            (data) => {
                              dispatch(setIsvisibleSchModal(true));
                            }
                          );
                        }}
                      >
                        {row.PESTICIDE_NAME_KR}
                      </Button>
                    );
                  },
                },
                {
                  title: "대상식품",
                  dataIndex: "FARM_PRODUCTS_NAME",
                  key: "NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "FARM_PRODUCTS_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.FARM_PRODUCTS_NAME}</>;
                  },
                },
                {
                  title: "회사명",
                  dataIndex: "COMPANY_NAME",
                  key: "NUM",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "COMPANY_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "descend",
                  render: (data, row, index) => {
                    return <>{row.COMPANY_NAME}</>;
                  },
                },
                {
                  title: "아이디",
                  dataIndex: "REG_ID",
                  key: "NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "REG_ID"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return <>{row.REG_ID}</>;
                  },
                },
                {
                  title: "등록인",
                  dataIndex: "USERNAME",
                  key: "NUM",
                  width: "8%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "USERNAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.USERNAME}</>;
                  },
                },
                {
                  title: "등록일",
                  dataIndex: "REG_DATE",
                  key: "NUM",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "REG_DATE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return <>{row.REG_DATE.match(/[\d*/]*/g, "*")[0]}</>;
                  },
                },
                {
                  title: "확인",
                  dataIndex: "CONFIRM_FLAG",
                  key: "NUM",
                  width: "5%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "CONFIRM_FLAG"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    if (row.CONFIRM_FLAG === "Y") {
                      return <Tag color={"green"}>{"확인"}</Tag>;
                    } else {
                      return <Tag color={"red"}>{"미확인"}</Tag>;
                    }
                  },
                },
                {
                  title: "공개",
                  dataIndex: "OPEN_FLAG",
                  key: "NUM",
                  width: "5%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "OPEN_FLAG"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    if (row.OPEN_FLAG === "Y") {
                      return <Tag color={"green"}>{"공개"}</Tag>;
                    } else {
                      return <Tag color={"red"}>{"비공개"}</Tag>;
                    }
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
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.FOOD_CODE}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            const promise_info = new Promise(
                              (resolve, reject) => {
                                fetch("/API/search?TYPE=14113&NUM=" + row.NUM, {
                                  method: "GET",
                                  credentials: "include",
                                })
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setDatasourceModModal(myJson[0]));
                                    resolve(1);
                                  });
                              }
                            );
                            const promise_mrl = new Promise(
                              (resolve, reject) => {
                                fetch("/API/search?TYPE=14114&NUM=" + row.NUM, {
                                  method: "GET",
                                  credentials: "include",
                                })
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    myJson.forEach((item, idx) => {
                                      item.IS_FOCUSED_MAX_REMAIN = false;
                                      item.IS_FOCUSED_PASSAGE_DAYS = false;
                                      item.IS_FOCUSED_USE_COUNT = false;
                                      item.NUM = idx;
                                      item.DELETE_FLAG = "N";
                                    });
                                    dispatch(setDatasourceModModalMrl(myJson));
                                    resolve(1);
                                  });
                              }
                            );

                            Promise.all([promise_info, promise_mrl]).then(
                              (data) => {
                                dispatch(setIsvisibleModModal(true));
                              }
                            );
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
                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        TABLE: "T_RESI_CROPS_TEST_RESULT",
                                        KEY: ["NUM"],
                                        NUMERIC_KEY: ["NUM"],
                                        NUM: row.NUM,
                                        DELETE_FLAG: "Y",
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
                                      "작물잔류시험성적서: " +
                                        (row.PESTICIDE_NAME_KR ||
                                          row.PESTICIDE_NAME_EN) +
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
                              fetch("/API/search?TYPE=14111", {
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

export default Report;

export const SearchModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_search_modal,
    datasource_sch_modal,
    datasource_sch_modal_mrl,
  } = useSelector((state) => state.prdTestReport_modal);

  const { userinfo } = useSelector((state) => state.header);
  const xs_title = 7;
  const xs_input = 16;

  const [userinfo_detail, setUserinfo_detail] = useState({});

  if (!isvisible_search_modal) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_search_modal}
          footer={
            <div>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleSchModal(false));
                  dispatch(setDatasourceSchModal({}));
                  dispatch(setDatasourceSchModalMrl([]));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleSchModal(false));
            dispatch(setDatasourceSchModal({}));
            dispatch(setDatasourceSchModalMrl([]));
          }}
          width="70vw"
          title={<div>작물잔류시험성적서 조회</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 작물잔류시험성적서 조회"
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
                    title_1: "회사명",
                    data_1: datasource_sch_modal.COMPANY_NAME,
                    title_2: "등록인",
                    data_2:
                      datasource_sch_modal.USERNAME +
                      "(" +
                      datasource_sch_modal.REG_ID +
                      ")",
                    wide: 0,
                  },
                  {
                    title_1: "연락처",
                    data_1: datasource_sch_modal.PHONE,
                    title_2: "이메일",
                    data_2: datasource_sch_modal.EMAIL,
                    wide: 0,
                  },
                  {
                    title_1: "등록인 ID",
                    data_1: datasource_sch_modal.REG_ID,
                    title_2: "등록 날짜",
                    data_2: datasource_sch_modal.REG_DATE,
                    wide: 0,
                  },
                  {
                    title_1: "수정인 ID",
                    data_1: datasource_sch_modal.MOD_ID,
                    title_2: "수정 날짜",
                    data_2: datasource_sch_modal.MOD_DATE,
                    wide: 0,
                  },
                  {
                    title_1: "식약처 확인여부",
                    data_1: (
                      <Row justify="space-between">
                        <Col xs={12}>
                          {datasource_sch_modal.CONFIRM_FLAG === "N" ? (
                            <Tag color={"red"}>{"미확인"}</Tag>
                          ) : (
                            <Tag color={"green"}>{"확인"}</Tag>
                          )}
                        </Col>
                        <Col xs={12} style={{ textAlign: "right" }}>
                          {datasource_sch_modal.CONFIRM_FLAG === "N" ? (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => {
                                const temp = _.cloneDeep(datasource_sch_modal);

                                delete temp.PESTICIDE_NAME_KR;
                                delete temp.PESTICIDE_NAME_EN;
                                delete temp.PESTICIDE_CODE;

                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        ...temp,
                                        CONFIRM_FLAG: "Y",
                                        TABLE: "T_RESI_CROPS_TEST_RESULT",
                                        KEY: ["NUM"],
                                        NUMERIC_KEY: ["NUM"],
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
                                      "작물잔류시험성적서를 확인 상태로 변경했습니다."
                                    );
                                    fetch("/API/search?TYPE=14111", {
                                      method: "GET",
                                      credentials: "include",
                                    })
                                      .then(function (response) {
                                        return response.json();
                                      })
                                      .then((myJson) => {
                                        dispatch(setDataSource(myJson));
                                      });
                                    fetch(
                                      "/API/search?TYPE=14113&NUM=" + temp.NUM,
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
                                          setDatasourceSchModal(myJson[0])
                                        );
                                      });
                                  } else if (response.status === 401) {
                                    message.error("권한이 없습니다.");
                                  }
                                });
                              }}
                            >
                              <RedoOutlined />
                              확인
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => {
                                const temp = _.cloneDeep(datasource_sch_modal);

                                delete temp.PESTICIDE_NAME_KR;
                                delete temp.PESTICIDE_NAME_EN;
                                delete temp.PESTICIDE_CODE;

                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        ...temp,
                                        CONFIRM_FLAG: "N",
                                        TABLE: "T_RESI_CROPS_TEST_RESULT",
                                        KEY: ["NUM"],
                                        NUMERIC_KEY: ["NUM"],
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
                                      "작물잔류시험성적서를 미확인 상태로 변경했습니다."
                                    );
                                    fetch("/API/search?TYPE=14111", {
                                      method: "GET",
                                      credentials: "include",
                                    })
                                      .then(function (response) {
                                        return response.json();
                                      })
                                      .then((myJson) => {
                                        dispatch(setDataSource(myJson));
                                      });
                                    fetch(
                                      "/API/search?TYPE=14113&NUM=" + temp.NUM,
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
                                          setDatasourceSchModal(myJson[0])
                                        );
                                      });
                                  } else if (response.status === 401) {
                                    message.error("권한이 없습니다.");
                                  }
                                });
                              }}
                            >
                              <RedoOutlined />
                              미확인
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ),

                    title_2: "정보 공개여부",
                    data_2: (
                      <Row justify="space-between">
                        <Col xs={12}>
                          {datasource_sch_modal.OPEN_FLAG === "N" ? (
                            <Tag color={"red"}>{"비공개"}</Tag>
                          ) : (
                            <Tag color={"green"}>{"공개"}</Tag>
                          )}
                        </Col>
                        <Col xs={12} style={{ textAlign: "right" }}>
                          {datasource_sch_modal.OPEN_FLAG === "N" ? (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => {
                                const temp = _.cloneDeep(datasource_sch_modal);

                                delete temp.PESTICIDE_NAME_KR;
                                delete temp.PESTICIDE_NAME_EN;
                                delete temp.PESTICIDE_CODE;

                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        ...temp,
                                        OPEN_FLAG: "Y",
                                        TABLE: "T_RESI_CROPS_TEST_RESULT",
                                        KEY: ["NUM"],
                                        NUMERIC_KEY: ["NUM"],
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
                                      "작물잔류시험성적서를 공개 상태로 변경했습니다."
                                    );
                                    fetch("/API/search?TYPE=14111", {
                                      method: "GET",
                                      credentials: "include",
                                    })
                                      .then(function (response) {
                                        return response.json();
                                      })
                                      .then((myJson) => {
                                        dispatch(setDataSource(myJson));
                                      });
                                    fetch(
                                      "/API/search?TYPE=14113&NUM=" + temp.NUM,
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
                                          setDatasourceSchModal(myJson[0])
                                        );
                                      });
                                  } else if (response.status === 401) {
                                    message.error("권한이 없습니다.");
                                  }
                                });
                              }}
                            >
                              <RedoOutlined />
                              공개
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => {
                                const temp = _.cloneDeep(datasource_sch_modal);

                                delete temp.PESTICIDE_NAME_KR;
                                delete temp.PESTICIDE_NAME_EN;
                                delete temp.PESTICIDE_CODE;

                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        ...temp,
                                        OPEN_FLAG: "N",
                                        TABLE: "T_RESI_CROPS_TEST_RESULT",
                                        KEY: ["NUM"],
                                        NUMERIC_KEY: ["NUM"],
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
                                      "작물잔류시험성적서를 비공개 상태로 변경했습니다."
                                    );
                                    fetch("/API/search?TYPE=14111", {
                                      method: "GET",
                                      credentials: "include",
                                    })
                                      .then(function (response) {
                                        return response.json();
                                      })
                                      .then((myJson) => {
                                        dispatch(setDataSource(myJson));
                                      });
                                    fetch(
                                      "/API/search?TYPE=14113&NUM=" + temp.NUM,
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
                                          setDatasourceSchModal(myJson[0])
                                        );
                                      });
                                  } else if (response.status === 401) {
                                    message.error("권한이 없습니다.");
                                  }
                                });
                              }}
                            >
                              <RedoOutlined />
                              비공개
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "메모",
                    data_1: datasource_sch_modal.MEMO,
                    wide: 1,
                  },
                  {
                    title_1: "농약명",
                    data_1: _.isNil(datasource_sch_modal.PESTICIDE_NAME_KR)
                      ? _.isNil(datasource_sch_modal.PESTICIDE_NAME_EN)
                        ? ""
                        : datasource_sch_modal.PESTICIDE_NAME_EN
                      : _.isNil(datasource_sch_modal.PESTICIDE_NAME_EN)
                      ? datasource_sch_modal.PESTICIDE_NAME_KR
                      : datasource_sch_modal.PESTICIDE_NAME_KR +
                        "(" +
                        datasource_sch_modal.PESTICIDE_NAME_EN +
                        ")",
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
            title="▣ 작물잔류성 데이터"
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
                style={{ marginTop: "5px" }}
                size="small"
                sticky
                bordered
                className="table-search"
                pagination={false}
                columns={[
                  {
                    title: "작물명",
                    dataIndex: "",
                    key: "NUM",
                    render: (data, row) =>
                      datasource_sch_modal.FARM_PRODUCTS_NAME,
                  },
                  {
                    title: "시험제형",
                    dataIndex: "",
                    key: "NUM",
                    render: (data, row) => datasource_sch_modal.TEST_SHAPE,
                  },
                  {
                    title: "적용병해충",
                    dataIndex: "",
                    key: "NUM",
                    render: (data, row) => datasource_sch_modal.APP_BUG,
                  },
                  {
                    title: "시험년도",
                    dataIndex: "",
                    key: "NUM",
                    render: (data, row) => datasource_sch_modal.TEST_YEAR,
                  },
                  {
                    title: "작물잔류성 데이터",
                    children: [
                      {
                        title: "약제처리후 경과일수",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <List
                            size="small"
                            dataSource={datasource_sch_modal_mrl}
                            renderItem={(item) => (
                              <List.Item
                                style={{
                                  fontWeight:
                                    item.B_PASSAGE_DAYS_FLAG === "Y"
                                      ? "bold"
                                      : "",
                                  textDecoration:
                                    item.B_PASSAGE_DAYS_FLAG === "Y"
                                      ? "underline"
                                      : "",
                                }}
                              >
                                {item.PASSAGE_DAYS}
                              </List.Item>
                            )}
                          />
                        ),
                      },
                      {
                        title: "사용횟수",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <List
                            size="small"
                            dataSource={datasource_sch_modal_mrl}
                            renderItem={(item) => (
                              <List.Item
                                style={{
                                  fontWeight:
                                    item.B_PASSAGE_DAYS_FLAG === "Y"
                                      ? "bold"
                                      : "",
                                  textDecoration:
                                    item.B_PASSAGE_DAYS_FLAG === "Y"
                                      ? "underline"
                                      : "",
                                }}
                              >
                                {item.USE_COUNT}
                              </List.Item>
                            )}
                          />
                        ),
                      },
                      {
                        title: "최대잔류량(ppm)",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <List
                            size="small"
                            dataSource={datasource_sch_modal_mrl}
                            renderItem={(item) => (
                              <List.Item
                                style={{
                                  fontWeight:
                                    item.B_PASSAGE_DAYS_FLAG === "Y"
                                      ? "bold"
                                      : "",
                                  textDecoration:
                                    item.B_PASSAGE_DAYS_FLAG === "Y"
                                      ? "underline"
                                      : "",
                                }}
                              >
                                {item.MAX_REMAIN}
                              </List.Item>
                            )}
                          />
                        ),
                      },
                    ],
                  },
                  {
                    title: "안전사용기준",
                    children: [
                      {
                        title: "수확전 사용주기",
                        dataIndex: "USE_PERIOD",
                        key: "NUM",
                      },
                      {
                        title: "사용횟수",
                        dataIndex: "USE_COUNT",
                        key: "NUM",
                      },
                    ],
                  },
                  {
                    title: "농진청 적용 MRL",
                    dataIndex: "RDA_MRL",
                    key: "NUM",
                  },
                  {
                    title: "식약처 검토안",
                    dataIndex: "KFDA_MRL",
                    key: "NUM",
                  },
                  {
                    title: "검토 의견",
                    dataIndex: "OPINION",
                    key: "NUM",
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
    datasource_reg_modal_mrl,
    isvisible_register_drawer,
  } = useSelector((state) => state.prdTestReport_modal);

  const { userinfo } = useSelector((state) => state.header);
  const xs_title = 7;
  const xs_input = 16;

  const [userinfo_detail, setUserinfo_detail] = useState({});

  if (!isvisible_register_modal) {
    return <></>;
  } else {
    console.log(datasource_reg_modal_mrl);
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
                  dispatch(setDatasourceRegModalMrl([]));
                }}
                onConfirm={() => {
                  fetch("/API/search?TYPE=14112", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((myjson) => {
                      const temp = _.cloneDeep(datasource_reg_modal);
                      const temp_mrl = _.cloneDeep(datasource_reg_modal_mrl);

                      var promise_info = new Promise((resolve, reject) => {
                        const temp = _.cloneDeep(datasource_reg_modal);

                        temp.NUM = parseInt(myjson[0].MAX, 10);
                        temp.TABLE = "T_RESI_CROPS_TEST_RESULT";
                        temp.COMPANY_NAME = userinfo.COMPANY_NAME;
                        temp.PHONE = userinfo.PHONE;
                        temp.EMAIL = userinfo.EMAIL;
                        temp.EMAIL = userinfo.EMAIL;
                        temp.DELETE_FLAG = "N";
                        temp.REG_ID = userinfo.USERID;
                        temp.REG_DATE = moment(new Date()).format(
                          "YYYY/MM/DD HH:mm:ss"
                        );
                        temp.CONFIRM_FLAG = "N";
                        temp.OPEN_FLAG = "N";

                        delete temp.PESTICIDE_NAME_EN;
                        delete temp.PESTICIDE_NAME_KR;

                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: customEncrypt([temp]) }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          if (response.status === 200) {
                            message.success(
                              "작물잔류시험성적서: " +
                                (datasource_reg_modal.PESTICIDE_NAME_KR ||
                                  datasource_reg_modal.PESTICIDE_NAME_EN) +
                                "을 등록하였습니다."
                            );
                            // dispatch(setIsvisibleRegModal(false))
                            // dispatch(setDatasourceRegModal({}))
                            // dispatch(setDatasourceRegModalMrl([]))
                            resolve(1);
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                            // dispatch(setIsvisibleRegModal(false))
                            // dispatch(setDatasourceRegModal({}))
                            // dispatch(setDatasourceRegModalMrl([]))
                            resolve(0);
                          }
                        });
                      });

                      const promise_mrl = new Promise((resolve, reject) => {
                        if (
                          temp_mrl.filter((item) => item.DELETE_FLAG === "N")
                            .length === 0
                        ) {
                          resolve(1);
                        }

                        temp_mrl
                          .filter((item) => item.DELETE_FLAG === "N")
                          .forEach((item, idx) => {
                            item.CROPS_IDX = parseInt(myjson[0].MAX, 10);
                            item.TABLE = "T_RESI_CROPS_T_TEST_RESULT";
                            item.ORDER_NUM = idx;

                            delete item.IS_FOCUSED_MAX_REMAIN;
                            delete item.IS_FOCUSED_PASSAGE_DAYS;
                            delete item.IS_FOCUSED_USE_COUNT;
                            delete item.NUM;
                            delete item.DELETE_FLAG;
                          });

                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({
                            data: customEncrypt(temp_mrl),
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log("asdf", response);
                          if (response.status === 200) {
                            message.success(
                              "잔류성데이터 " +
                                temp_mrl.filter(
                                  (data) => data.DELETE_FLAG === "N"
                                ).length +
                                "건을 등록하였습니다."
                            );
                            // dispatch(setIsvisibleRegModal(false))
                            // dispatch(setDatasourceRegModal({}))
                            // dispatch(setDatasourceRegModalMrl([]))
                            resolve(1);
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                            // dispatch(setIsvisibleRegModal(false))
                            // dispatch(setDatasourceRegModal({}))
                            // dispatch(setDatasourceRegModalMrl([]))
                            resolve(0);
                          }
                        });
                      });

                      Promise.all([promise_info, promise_mrl]).then(
                        (values) => {
                          fetch("/API/search?TYPE=14111", {
                            method: "GET",
                            credentials: "include",
                          })
                            .then(function (response) {
                              return response.json();
                            })
                            .then((myJson) => {
                              dispatch(setIsvisibleRegModal(false));
                              dispatch(setDatasourceRegModal({}));
                              dispatch(setDatasourceRegModalMrl([]));
                              dispatch(setDataSource(myJson));
                            });
                        }
                      );
                    });
                }}
                okText="확인"
                cancelText="취소"
                disabled={_.isNil(datasource_reg_modal.PESTICIDE_CODE)}
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={_.isNil(datasource_reg_modal.PESTICIDE_CODE)}
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
                  dispatch(setDatasourceRegModalMrl([]));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleRegModal(false));
            dispatch(setDatasourceRegModal({}));
            dispatch(setDatasourceRegModalMrl([]));
          }}
          width="50vw"
          title={<div>작물잔류시험성적서 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 작물잔류시험성적서 등록"
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
                    title_1: "회사명",
                    data_1: userinfo.COMPANY_NAME,
                    title_2: "등록인(ID)",
                    data_2: userinfo.USERID,
                    wide: 0,
                  },
                  {
                    title_1: "연락처",
                    data_1: userinfo.PHONE,
                    title_2: "이메일",
                    data_2: userinfo.EMAIL,
                    wide: 0,
                  },
                  {
                    title_1: "메모",
                    data_1: (
                      <TextArea
                        defaultValue={datasource_reg_modal.MEMO}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              MEMO: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "농약명",
                    data_1: (
                      <Row>
                        <Col xs={20}>
                          <Input
                            size="small"
                            value={
                              _.isNil(datasource_reg_modal.PESTICIDE_NAME_KR)
                                ? _.isNil(
                                    datasource_reg_modal.PESTICIDE_NAME_EN
                                  )
                                  ? ""
                                  : datasource_reg_modal.PESTICIDE_NAME_EN
                                : _.isNil(
                                    datasource_reg_modal.PESTICIDE_NAME_EN
                                  )
                                ? datasource_reg_modal.PESTICIDE_NAME_KR
                                : datasource_reg_modal.PESTICIDE_NAME_KR +
                                  "(" +
                                  datasource_reg_modal.PESTICIDE_NAME_EN +
                                  ")"
                            }
                          />
                        </Col>
                        <Col xs={4}>
                          <Button
                            type="primary"
                            size="small"
                            block
                            onClick={() => {
                              dispatch(setIsvisibleRegDrawer(true));
                            }}
                          >
                            조회
                          </Button>
                        </Col>
                      </Row>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "작물명",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.FARM_PRODUCTS_NAME}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              FARM_PRODUCTS_NAME: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "시험제형",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.TEST_SHAPE}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              TEST_SHAPE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "적용병해충",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.APP_BUG}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              APP_BUG: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "시험년도",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.TEST_YEAR}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              TEST_YEAR: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "농진청 적용 MRL",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.RDA_MRL}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              RDA_MRL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "수확전 사용주기",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.USE_PERIOD}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USE_PERIOD: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "식약처 검토안",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.KFDA_MRL}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              KFDA_MRL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "사용횟수",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.USE_COUNT}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USE_COUNT: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "검토의견",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_reg_modal.OPINION}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              OPINION: e.target.value,
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
                        defaultValue={datasource_reg_modal.BIGO}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              BIGO: e.target.value,
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
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 작물잔류성 데이터"
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
                style={{ marginTop: "5px" }}
                size="small"
                sticky
                bordered
                className="table-search"
                pagination={false}
                locale={{ emptyText: "작물잔류성 데이터를 추가해주세요." }}
                columns={[
                  {
                    title: "작물잔류성 데이터",
                    children: [
                      {
                        title: "약제처리후 경과일수",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <Input
                            size="small"
                            onFocus={() => {
                              const temp = _.cloneDeep(
                                datasource_reg_modal_mrl
                              );
                              temp[row.NUM].IS_FOCUSED_PASSAGE_DAYS = true;
                              dispatch(setDatasourceRegModalMrl(temp));
                            }}
                            {...(!datasource_reg_modal_mrl[row.NUM]
                              .IS_FOCUSED_PASSAGE_DAYS
                              ? {
                                  value:
                                    datasource_reg_modal_mrl[row.NUM]
                                      .PASSAGE_DAYS,
                                }
                              : {})}
                            onBlur={(e) => {
                              const temp = _.cloneDeep(
                                datasource_reg_modal_mrl
                              );
                              temp[row.NUM].PASSAGE_DAYS = e.target.value;
                              temp[row.NUM].IS_FOCUSED_PASSAGE_DAYS = false;
                              dispatch(setDatasourceRegModalMrl(temp));
                            }}
                          />
                        ),
                      },
                      {
                        title: "사용횟수",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <Input
                            size="small"
                            onFocus={() => {
                              const temp = _.cloneDeep(
                                datasource_reg_modal_mrl
                              );
                              temp[row.NUM].IS_FOCUSED_USE_COUNT = true;
                              dispatch(setDatasourceRegModalMrl(temp));
                            }}
                            {...(!datasource_reg_modal_mrl[row.NUM]
                              .IS_FOCUSED_USE_COUNT
                              ? {
                                  value:
                                    datasource_reg_modal_mrl[row.NUM].USE_COUNT,
                                }
                              : {})}
                            onBlur={(e) => {
                              const temp = _.cloneDeep(
                                datasource_reg_modal_mrl
                              );
                              temp[row.NUM].USE_COUNT = e.target.value;
                              temp[row.NUM].IS_FOCUSED_USE_COUNT = false;
                              dispatch(setDatasourceRegModalMrl(temp));
                            }}
                          />
                        ),
                      },
                      {
                        title: "최대잔류량(ppm)",
                        dataIndex: "",
                        key: "",
                        render: (data, row) => (
                          <Input
                            size="small"
                            defaultValue={
                              datasource_reg_modal_mrl[row.NUM].MAX_REMAIN
                            }
                            onFocus={(e) => {
                              const temp = _.cloneDeep(
                                datasource_reg_modal_mrl
                              );
                              temp[row.NUM].IS_FOCUSED_MAX_REMAIN = true;
                              dispatch(setDatasourceRegModalMrl(temp));
                            }}
                            {...(!datasource_reg_modal_mrl[row.NUM]
                              .IS_FOCUSED_MAX_REMAIN
                              ? {
                                  value:
                                    datasource_reg_modal_mrl[row.NUM]
                                      .MAX_REMAIN,
                                }
                              : {})}
                            onBlur={(e) => {
                              const temp = _.cloneDeep(
                                datasource_reg_modal_mrl
                              );
                              temp[row.NUM].MAX_REMAIN = e.target.value;
                              temp[row.NUM].IS_FOCUSED_MAX_REMAIN = false;
                              dispatch(setDatasourceRegModalMrl(temp));
                            }}
                          />
                        ),
                      },
                      {
                        title: "강조",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <Switch
                            checked={
                              datasource_reg_modal_mrl[row.NUM]
                                .B_PASSAGE_DAYS_FLAG === "Y"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              const temp = _.cloneDeep(
                                datasource_reg_modal_mrl
                              );
                              temp[row.NUM].B_PASSAGE_DAYS_FLAG = e ? "Y" : "N";
                              temp[row.NUM].B_USE_COUNT_FLAG = e ? "Y" : "N";
                              temp[row.NUM].B_MAX_REMAIN_FLAG = e ? "Y" : "N";
                              temp[row.NUM].L_PASSAGE_DAYS_FLAG = e ? "Y" : "N";
                              temp[row.NUM].L_USE_COUNT_FLAG = e ? "Y" : "N";
                              temp[row.NUM].L_MAX_REMAIN_FLAG = e ? "Y" : "N";

                              dispatch(setDatasourceRegModalMrl(temp));
                            }}
                          ></Switch>
                        ),
                      },
                    ],
                  },
                  {
                    title: (
                      <Button
                        type="text"
                        size="small"
                        className="button_reg"
                        onClick={() => {
                          dispatch(
                            setDatasourceRegModalMrl([
                              ...datasource_reg_modal_mrl,
                              {
                                NUM: datasource_reg_modal_mrl.length,
                                CROPS_IDX: "",
                                PASSAGE_DAYS: "",
                                USE_COUNT: "",
                                MAX_REMAIN: "",
                                B_PASSAGE_DAYS_FLAG: "N",
                                B_USE_COUNT_FLAG: "N",
                                B_MAX_REMAIN_FLAG: "N",
                                L_PASSAGE_DAYS_FLAG: "N",
                                L_USE_COUNT_FLAG: "N",
                                L_MAX_REMAIN_FLAG: "N",
                                ORDER_NUM: datasource_reg_modal_mrl.length,
                                DELETE_FLAG: "N",
                                IS_FOCUSED_PASSAGE_DAYS: false,
                                IS_FOCUSED_USE_COUNT: false,
                                IS_FOCUSED_MAX_REMAIN: false,
                              },
                            ])
                          );
                        }}
                      >
                        <PlusOutlined />
                      </Button>
                    ),
                    dataIndex: "",
                    key: "NUM",
                    align: "center",
                    width: "10%",
                    render: (data, row, index) => (
                      <Button
                        type="text"
                        size="small"
                        className="button_del"
                        onClick={() => {
                          const temp = _.cloneDeep(datasource_reg_modal_mrl);
                          temp[row.NUM].DELETE_FLAG = "Y";

                          dispatch(setDatasourceRegModalMrl(temp));
                        }}
                      >
                        <DeleteOutlined></DeleteOutlined>
                      </Button>
                    ),
                  },
                ]}
                dataSource={datasource_reg_modal_mrl.filter(
                  (data) => data.DELETE_FLAG === "N"
                )}
              />
            </Row>
          </Card>
        </Modal>
        {isvisible_register_drawer ? <RegisterDrawer /> : null}
      </div>
    );
  }
};

export const RegisterDrawer = () => {
  const dispatch = useDispatch();
  const {
    datasource_reg_modal,
    isvisible_register_drawer,
    datasource_std_value,
    selected_std_value_idx,
  } = useSelector((state) => state.prdTestReport_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=11111", {
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
        width="40vw"
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
              title: "농약 국문먕",
              dataIndex: "PESTICIDE_NAME_KR",
              key: "PESTICIDE_CODE",
              width: "40%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "농약 영문명",
              dataIndex: "PESTICIDE_NAME_EN",
              key: "PESTICIDE_CODE",
              width: "40%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "PESTICIDE_CODE",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    // const temp = _.cloneDeep(datasource_std_value)
                    // temp[selected_std_value_idx].STD_NUM = row.STD_NUM
                    // temp[selected_std_value_idx].STD_NAME = row.STD_NAME
                    // temp[selected_std_value_idx].FLAG = true
                    // dispatch(setDatasourceStdValue(temp))
                    dispatch(
                      setDatasourceRegModal({
                        ...datasource_reg_modal,
                        PESTICIDE_CODE: row.PESTICIDE_CODE,
                        PESTICIDE_NAME_KR: row.PESTICIDE_NAME_KR,
                        PESTICIDE_NAME_EN: row.PESTICIDE_NAME_EN,
                      })
                    );
                    dispatch(setIsvisibleRegDrawer(false));
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data.filter((val) => {
            if (val.PESTICIDE_NAME_KR !== null) {
              var word_str = "";
              Hangul.disassemble(val.PESTICIDE_NAME_KR, true).forEach(
                (word, index) => {
                  word_str += word[0];
                }
              );
              return (
                word_str.indexOf(searchKey) !== -1 ||
                Hangul.disassemble(val.PESTICIDE_NAME_KR, true)[0][0].indexOf(
                  searchKey
                ) > -1 ||
                val.PESTICIDE_NAME_KR.indexOf(searchKey) >= 0 ||
                (val.PESTICIDE_NAME_EN !== "" && val.PESTICIDE_NAME_EN !== null
                  ? val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  : null)
              );
            } else {
              return (
                val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
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
    datasource_mod_modal_mrl,
    isvisible_modify_drawer,
  } = useSelector((state) => state.prdTestReport_modal);

  const { userinfo } = useSelector((state) => state.header);
  const xs_title = 7;
  const xs_input = 16;

  const [userinfo_detail, setUserinfo_detail] = useState({});

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
                onCancel={() => {
                  dispatch(setIsvisibleModModal(false));
                  dispatch(setDatasourceModModal({}));
                  dispatch(setDatasourceModModalMrl([]));
                }}
                onConfirm={() => {
                  const temp = _.cloneDeep(datasource_mod_modal);
                  const temp_mrl = _.cloneDeep(datasource_mod_modal_mrl);

                  var promise_info = new Promise((resolve, reject) => {
                    const temp = _.cloneDeep(datasource_mod_modal);

                    temp.TABLE = "T_RESI_CROPS_TEST_RESULT";
                    temp.KEY = ["NUM"];
                    temp.NUMERIC_KEY = ["NUM"];
                    temp.DELETE_FLAG = "N";
                    temp.MOD_ID = userinfo.USERID;
                    temp.MOD_DATE = moment(new Date()).format(
                      "YYYY/MM/DD HH:mm:SS"
                    );

                    delete temp.PESTICIDE_NAME_EN;
                    delete temp.PESTICIDE_NAME_KR;

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({ data: customEncrypt([temp]) }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      console.log(response);
                      if (response.status === 200) {
                        message.success(
                          "작물잔류시험성적서: " +
                            (datasource_mod_modal.PESTICIDE_NAME_KR ||
                              datasource_mod_modal.PESTICIDE_NAME_EN) +
                            "을 수정하였습니다."
                        );
                        // dispatch(setIsvisibleRegModal(false))
                        // dispatch(setDatasourceRegModal({}))
                        // dispatch(setDatasourceRegModalMrl([]))
                        resolve(1);
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.");
                        // dispatch(setIsvisibleRegModal(false))
                        // dispatch(setDatasourceRegModal({}))
                        // dispatch(setDatasourceRegModalMrl([]))
                        resolve(0);
                      }
                    });
                  });

                  const promise_mrl = new Promise((resolve, reject) => {
                    temp_mrl
                      .filter((item) => item.DELETE_FLAG === "N")
                      .forEach((item, idx) => {
                        item.TABLE = "T_RESI_CROPS_T_TEST_RESULT";
                        item.ORDER_NUM = idx;
                        item.CROPS_IDX = temp.NUM;

                        delete item.IS_FOCUSED_MAX_REMAIN;
                        delete item.IS_FOCUSED_PASSAGE_DAYS;
                        delete item.IS_FOCUSED_USE_COUNT;
                        delete item.NUM;
                        delete item.DELETE_FLAG;
                      });

                    fetch("/API/delete", {
                      method: "POST",
                      body: JSON.stringify({
                        data: customEncrypt([
                          {
                            TABLE: "T_RESI_CROPS_T_TEST_RESULT",
                            KEY: ["CROPS_IDX"],
                            NUMERIC_KEY: ["CROPS_IDX"],
                            CROPS_IDX: temp.NUM,
                          },
                        ]),
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({
                            data: customEncrypt(temp_mrl),
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            message.success(
                              "잔류성데이터 " +
                                datasource_mod_modal_mrl.filter(
                                  (data) => data.DELETE_FLAG === "N"
                                ).length +
                                "건을 수정하였습니다."
                            );
                            // dispatch(setIsvisibleRegModal(false))
                            // dispatch(setDatasourceRegModal({}))
                            // dispatch(setDatasourceRegModalMrl([]))
                            resolve(1);
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                            // dispatch(setIsvisibleRegModal(false))
                            // dispatch(setDatasourceRegModal({}))
                            // dispatch(setDatasourceRegModalMrl([]))
                            resolve(0);
                          }
                        });
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.");
                        resolve(0);
                      }
                    });
                  });

                  Promise.all([promise_info, promise_mrl]).then((values) => {
                    fetch("/API/search?TYPE=14111", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then(function (response) {
                        return response.json();
                      })
                      .then((myJson) => {
                        dispatch(setIsvisibleModModal(false));
                        dispatch(setDatasourceModModal({}));
                        dispatch(setDatasourceModModalMrl([]));
                        dispatch(setDataSource(myJson));
                      });
                  });
                }}
                okText="확인"
                cancelText="취소"
                disabled={_.isNil(datasource_mod_modal.PESTICIDE_CODE)}
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={_.isNil(datasource_mod_modal.PESTICIDE_CODE)}
                >
                  등록
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleModModal(false));
                  dispatch(setDatasourceModModal({}));
                  dispatch(setDatasourceModModalMrl([]));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModal(false));
            dispatch(setDatasourceModModal({}));
            dispatch(setDatasourceModModalMrl([]));
          }}
          width="50vw"
          title={<div>작물잔류시험성적서 수정</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 작물잔류시험성적서 수정"
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
                    title_1: "회사명",
                    data_1: datasource_mod_modal.COMPANY_NAME,
                    title_2: "등록인",
                    data_2:
                      datasource_mod_modal.USERNAME +
                      "(" +
                      datasource_mod_modal.REG_ID +
                      ")",
                    wide: 0,
                  },
                  {
                    title_1: "연락처",
                    data_1: datasource_mod_modal.PHONE,
                    title_2: "이메일",
                    data_2: datasource_mod_modal.EMAIL,
                    wide: 0,
                  },
                  {
                    title_1: "등록인 ID",
                    data_1: datasource_mod_modal.REG_ID,
                    title_2: "등록 날짜",
                    data_2: datasource_mod_modal.REG_DATE,
                    wide: 0,
                  },
                  {
                    title_1: "수정인 ID",
                    data_1: datasource_mod_modal.MOD_ID,
                    title_2: "수정 날짜",
                    data_2: datasource_mod_modal.MOD_DATE,
                    wide: 0,
                  },
                  {
                    title_1: "메모",
                    data_1: (
                      <TextArea
                        defaultValue={datasource_mod_modal.MEMO}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              MEMO: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "농약명",
                    data_1: (
                      <Row>
                        <Col xs={20}>
                          <Input
                            size="small"
                            value={
                              _.isNil(datasource_mod_modal.PESTICIDE_NAME_KR)
                                ? _.isNil(
                                    datasource_mod_modal.PESTICIDE_NAME_EN
                                  )
                                  ? ""
                                  : datasource_mod_modal.PESTICIDE_NAME_EN
                                : _.isNil(
                                    datasource_mod_modal.PESTICIDE_NAME_EN
                                  )
                                ? datasource_mod_modal.PESTICIDE_NAME_KR
                                : datasource_mod_modal.PESTICIDE_NAME_KR +
                                  "(" +
                                  datasource_mod_modal.PESTICIDE_NAME_EN +
                                  ")"
                            }
                          />
                        </Col>
                        <Col xs={4}>
                          <Button
                            type="primary"
                            size="small"
                            block
                            onClick={() => {
                              dispatch(setIsvisibleModDrawer(true));
                            }}
                          >
                            조회
                          </Button>
                        </Col>
                      </Row>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "작물명",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.FARM_PRODUCTS_NAME}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              FARM_PRODUCTS_NAME: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "시험제형",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.TEST_SHAPE}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              TEST_SHAPE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "적용병해충",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.APP_BUG}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              APP_BUG: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "시험년도",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.TEST_YEAR}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              TEST_YEAR: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "농진청 적용 MRL",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.RDA_MRL}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              RDA_MRL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "수확전 사용주기",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.USE_PERIOD}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              USE_PERIOD: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "식약처 검토안",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.KFDA_MRL}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              KFDA_MRL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "사용횟수",
                    data_1: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.USE_COUNT}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              USE_COUNT: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "검토의견",
                    data_2: (
                      <Input
                        size="small"
                        defaultValue={datasource_mod_modal.OPINION}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              OPINION: e.target.value,
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
                        defaultValue={datasource_mod_modal.BIGO}
                        onBlur={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              BIGO: e.target.value,
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
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 작물잔류성 데이터"
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
                style={{ marginTop: "5px" }}
                size="small"
                sticky
                bordered
                className="table-search"
                pagination={false}
                locale={{ emptyText: "작물잔류성 데이터를 추가해주세요." }}
                columns={[
                  {
                    title: "작물잔류성 데이터",
                    children: [
                      {
                        title: "약제처리후 경과일수",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <Input
                            {...(row.B_PASSAGE_DAYS_FLAG === "Y"
                              ? { style: { fontWeight: "bold" } }
                              : {})}
                            size="small"
                            onFocus={() => {
                              const temp = _.cloneDeep(
                                datasource_mod_modal_mrl
                              );
                              temp[row.NUM].IS_FOCUSED_PASSAGE_DAYS = true;
                              dispatch(setDatasourceModModalMrl(temp));
                            }}
                            {...(!datasource_mod_modal_mrl[row.NUM]
                              .IS_FOCUSED_PASSAGE_DAYS
                              ? {
                                  value:
                                    datasource_mod_modal_mrl[row.NUM]
                                      .PASSAGE_DAYS,
                                }
                              : {})}
                            onBlur={(e) => {
                              const temp = _.cloneDeep(
                                datasource_mod_modal_mrl
                              );
                              temp[row.NUM].PASSAGE_DAYS = e.target.value;
                              temp[row.NUM].IS_FOCUSED_PASSAGE_DAYS = false;
                              dispatch(setDatasourceModModalMrl(temp));
                            }}
                          />
                        ),
                      },
                      {
                        title: "사용횟수",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <Input
                            size="small"
                            {...(row.B_PASSAGE_DAYS_FLAG === "Y"
                              ? { style: { fontWeight: "bold" } }
                              : {})}
                            onFocus={() => {
                              const temp = _.cloneDeep(
                                datasource_mod_modal_mrl
                              );
                              temp[row.NUM].IS_FOCUSED_USE_COUNT = true;
                              dispatch(setDatasourceModModalMrl(temp));
                            }}
                            {...(!datasource_mod_modal_mrl[row.NUM]
                              .IS_FOCUSED_USE_COUNT
                              ? {
                                  value:
                                    datasource_mod_modal_mrl[row.NUM].USE_COUNT,
                                }
                              : {})}
                            onBlur={(e) => {
                              const temp = _.cloneDeep(
                                datasource_mod_modal_mrl
                              );
                              temp[row.NUM].USE_COUNT = e.target.value;
                              temp[row.NUM].IS_FOCUSED_USE_COUNT = false;
                              dispatch(setDatasourceModModalMrl(temp));
                            }}
                          />
                        ),
                      },
                      {
                        title: "최대잔류량(ppm)",
                        dataIndex: "",
                        key: "",
                        render: (data, row) => (
                          <Input
                            {...(row.B_PASSAGE_DAYS_FLAG === "Y"
                              ? { style: { fontWeight: "bold" } }
                              : {})}
                            size="small"
                            defaultValue={
                              datasource_mod_modal_mrl[row.NUM].MAX_REMAIN
                            }
                            onFocus={(e) => {
                              const temp = _.cloneDeep(
                                datasource_mod_modal_mrl
                              );
                              temp[row.NUM].IS_FOCUSED_MAX_REMAIN = true;
                              dispatch(setDatasourceModModalMrl(temp));
                            }}
                            {...(!datasource_mod_modal_mrl[row.NUM]
                              .IS_FOCUSED_MAX_REMAIN
                              ? {
                                  value:
                                    datasource_mod_modal_mrl[row.NUM]
                                      .MAX_REMAIN,
                                }
                              : {})}
                            onBlur={(e) => {
                              const temp = _.cloneDeep(
                                datasource_mod_modal_mrl
                              );
                              temp[row.NUM].MAX_REMAIN = e.target.value;
                              temp[row.NUM].IS_FOCUSED_MAX_REMAIN = false;
                              dispatch(setDatasourceModModalMrl(temp));
                            }}
                          />
                        ),
                      },
                      {
                        title: "강조",
                        dataIndex: "",
                        key: "NUM",
                        render: (data, row) => (
                          <Switch
                            checked={
                              datasource_mod_modal_mrl[row.NUM]
                                .B_PASSAGE_DAYS_FLAG === "Y"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              const temp = _.cloneDeep(
                                datasource_mod_modal_mrl
                              );
                              temp[row.NUM].B_PASSAGE_DAYS_FLAG = e ? "Y" : "N";
                              temp[row.NUM].B_USE_COUNT_FLAG = e ? "Y" : "N";
                              temp[row.NUM].B_MAX_REMAIN_FLAG = e ? "Y" : "N";
                              temp[row.NUM].L_PASSAGE_DAYS_FLAG = e ? "Y" : "N";
                              temp[row.NUM].L_USE_COUNT_FLAG = e ? "Y" : "N";
                              temp[row.NUM].L_MAX_REMAIN_FLAG = e ? "Y" : "N";

                              dispatch(setDatasourceModModalMrl(temp));
                            }}
                          ></Switch>
                        ),
                      },
                    ],
                  },
                  {
                    title: (
                      <Button
                        type="text"
                        size="small"
                        className="button_reg"
                        onClick={() => {
                          dispatch(
                            setDatasourceModModalMrl([
                              ...datasource_mod_modal_mrl,
                              {
                                NUM: datasource_mod_modal_mrl.length,
                                CROPS_IDX: "",
                                PASSAGE_DAYS: "",
                                USE_COUNT: "",
                                MAX_REMAIN: "",
                                B_PASSAGE_DAYS_FLAG: "N",
                                B_USE_COUNT_FLAG: "N",
                                B_MAX_REMAIN_FLAG: "N",
                                L_PASSAGE_DAYS_FLAG: "N",
                                L_USE_COUNT_FLAG: "N",
                                L_MAX_REMAIN_FLAG: "N",
                                ORDER_NUM: datasource_mod_modal_mrl.length,
                                DELETE_FLAG: "N",
                                IS_FOCUSED_PASSAGE_DAYS: false,
                                IS_FOCUSED_USE_COUNT: false,
                                IS_FOCUSED_MAX_REMAIN: false,
                              },
                            ])
                          );
                        }}
                      >
                        <PlusOutlined />
                      </Button>
                    ),
                    dataIndex: "",
                    key: "NUM",
                    align: "center",
                    width: "10%",
                    render: (data, row, index) => (
                      <Button
                        type="text"
                        size="small"
                        className="button_del"
                        onClick={() => {
                          const temp = _.cloneDeep(datasource_mod_modal_mrl);
                          temp[row.NUM].DELETE_FLAG = "Y";

                          dispatch(setDatasourceModModalMrl(temp));
                        }}
                      >
                        <DeleteOutlined></DeleteOutlined>
                      </Button>
                    ),
                  },
                ]}
                dataSource={datasource_mod_modal_mrl.filter(
                  (data) => data.DELETE_FLAG === "N"
                )}
              />
            </Row>
          </Card>
        </Modal>
        {isvisible_modify_drawer ? <ModifyDrawer /> : null}
      </div>
    );
  }
};

export const ModifyDrawer = () => {
  const dispatch = useDispatch();
  const {
    datasource_mod_modal,
    isvisible_modify_drawer,
    datasource_std_value,
    selected_std_value_idx,
  } = useSelector((state) => state.prdTestReport_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=11111", {
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

  if (!isvisible_modify_drawer) {
    return <></>;
  } else {
    return (
      <Drawer
        title="시약명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleModDrawer(false));
        }}
        visible={isvisible_modify_drawer}
        width="40vw"
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
              title: "농약 국문먕",
              dataIndex: "PESTICIDE_NAME_KR",
              key: "PESTICIDE_CODE",
              width: "40%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "농약 영문명",
              dataIndex: "PESTICIDE_NAME_EN",
              key: "PESTICIDE_CODE",
              width: "40%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "PESTICIDE_CODE",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    // const temp = _.cloneDeep(datasource_std_value)
                    // temp[selected_std_value_idx].STD_NUM = row.STD_NUM
                    // temp[selected_std_value_idx].STD_NAME = row.STD_NAME
                    // temp[selected_std_value_idx].FLAG = true
                    // dispatch(setDatasourceStdValue(temp))
                    dispatch(
                      setDatasourceModModal({
                        ...datasource_mod_modal,
                        PESTICIDE_CODE: row.PESTICIDE_CODE,
                        PESTICIDE_NAME_KR: row.PESTICIDE_NAME_KR,
                        PESTICIDE_NAME_EN: row.PESTICIDE_NAME_EN,
                      })
                    );
                    dispatch(setIsvisibleModDrawer(false));
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data.filter((val) => {
            if (val.PESTICIDE_NAME_KR !== null) {
              var word_str = "";
              Hangul.disassemble(val.PESTICIDE_NAME_KR, true).forEach(
                (word, index) => {
                  word_str += word[0];
                }
              );
              return (
                word_str.indexOf(searchKey) !== -1 ||
                Hangul.disassemble(val.PESTICIDE_NAME_KR, true)[0][0].indexOf(
                  searchKey
                ) > -1 ||
                val.PESTICIDE_NAME_KR.indexOf(searchKey) >= 0 ||
                (val.PESTICIDE_NAME_EN !== "" && val.PESTICIDE_NAME_EN !== null
                  ? val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  : null)
              );
            } else {
              return (
                val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
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
