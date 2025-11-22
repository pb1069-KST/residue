import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
// #antd icon
import {
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
import { setDataSource } from "../../../reducers/prd/prdAnalysisAnalysis";
import {
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceRegModal,
  setDatasourceModModal,
  setDatasourceRegDrawer,
  setIsvisibleRegDrawer,
} from "../../../reducers/prd/prdAnalysisAnalysis_modal";
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
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import { customEncrypt, CustomInput } from "../../../components/util";
// import { Switch } from "antd";
// import { render } from "@testing-library/react";

const { Option } = Select;
const { Search } = Input;

function Food() {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.prdAnalysisAnalysis);
  const {
    isvisible_modify_modal,
    isvisible_register_modal,
    // datasource_class_L,
    // datasource_mod_modal
  } = useSelector((state) => state.prdAnalysisAnalysis_modal);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  useEffect(() => {
    fetch("/API/search?TYPE=11521", {
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
          subTitle: "축산물 시험법",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/food",
              name: "농약",
            },
            {
              href: "/prd/food",
              name: "농·축산물 시험법",
            },
            {
              href: "/prd/food",
              name: "축산물 시험법",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 1,
          defaultActiveKey: 4,
        }}
        //카드
        main_card={{
          title: "시험법 검색",
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
                  {/* <Option value={1}>공전번호</Option> */}
                </Select>
              </Col>
              <Col xs={21}>
                {searchFlag === 0 ? (
                  <Search
                    placeholder="농약명을 입력하세요"
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                ) : (
                  <Search
                    placeholder="공전번호를 입력하세요"
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                )}
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
                if (searchFlag === 0) {
                  if (val.PESTICIDE_NAME_KR !== null) {
                    var word_str = "";
                    Hangul.disassemble(val.PESTICIDE_NAME_KR, true).forEach(
                      (word, index) => {
                        word_str += word[0];
                      }
                    );
                    return (
                      word_str.indexOf(searchKey) !== -1 ||
                      Hangul.disassemble(
                        val.PESTICIDE_NAME_KR,
                        true
                      )[0][0].indexOf(searchKey) > -1 ||
                      val.PESTICIDE_NAME_KR.indexOf(searchKey) >= 0 ||
                      (val.PESTICIDE_NAME_EN !== "" &&
                      val.PESTICIDE_NAME_EN !== null
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
                } else {
                  if (val.PESTICIDE_NUM !== null) {
                    Hangul.disassemble(val.PESTICIDE_NUM, true).forEach(
                      (word, index) => {
                        word_str += word[0];
                      }
                    );
                    return (
                      word_str.indexOf(searchKey) !== -1 ||
                      Hangul.disassemble(val.PESTICIDE_NUM, true)[0][0].indexOf(
                        searchKey
                      ) > -1 ||
                      val.PESTICIDE_NUM.indexOf(searchKey) >= 0 ||
                      (val.PESTICIDE_NUM !== "" && val.PESTICIDE_NUM !== null
                        ? val.PESTICIDE_NUM.toLowerCase().indexOf(
                            searchKey.toLowerCase()
                          ) > -1
                        : null)
                    );
                  }
                }
              })}
              columns={[
                // {
                //   title: "공전번호",
                //   dataIndex: "PESTICIDE_NUM",
                //   key: "PESTICIDE_CODE",
                //   width: "15%",
                //   sorter: {
                //     compare: (a, b, sortOrder) =>
                //       customSorter(a, b, sortOrder, "PESTICIDE_NUM"),
                //   },
                //   showSorterTooltip: false,
                //   sortDirections: ["ascend", "descend", "ascend"],
                //   defaultSortOrder: "ascend",
                //   render: (data, row, index) => {
                //     return <>{row.PESTICIDE_NUM}</>;
                //   },
                // },

                {
                  title: "농약명",
                  dataIndex: "PESTICIDE_NAME_KR",
                  key: "PESTICIDE_CODE",
                  width: "40%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <>
                        {row.PESTICIDE_NAME_KR}(
                        <span style={{ fontStyle: "italic" }}>
                          {row.PESTICIDE_NAME_EN}
                        </span>
                        )
                      </>
                    );
                  },
                },
                {
                  title: "다성분",
                  dataIndex: "QUALITATIVE_NUM",
                  key: "PESTICIDE_CODE",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "QUALITATIVE_NUM"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <a
                        target="_blank"
                        href={
                          "https://www.foodsafetykorea.go.kr/foodcode/" +
                          row.QUALITATIVE_URL
                        }
                      >
                        {row.QUALITATIVE_NUM}
                      </a>
                    );
                  },
                },
                {
                  title: "단성분",
                  dataIndex: "QUANTITATIVE_NUM",
                  key: "PESTICIDE_CODE",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "QUANTITATIVE_NUM"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <a
                        target="_blank"
                        href={
                          "https://www.foodsafetykorea.go.kr/foodcode/" +
                          row.QUANTITATIVE_URL
                        }
                      >
                        {row.QUANTITATIVE_NUM}
                      </a>
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
                              "/API/search?TYPE=11522&PESTICIDE_CODE=" +
                                row.PESTICIDE_CODE +
                                "&NUM=" +
                                row.NUM,
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
                                        TABLE:
                                          "T_RESI_PESTICIDE_ANALYSIS_URL_A",
                                        KEY: ["NUM", "PESTICIDE_CODE"],
                                        NUMERIC_KEY: ["NUM"],
                                        NUM: row.NUM,
                                        PESTICIDE_CODE: row.PESTICIDE_CODE,
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
                                      "분석법: " +
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
                              fetch("/API/search?TYPE=11521", {
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
      {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>}
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
    </div>
  );
}

export default Food;

export const RegisterModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_register_modal,
    datasource_reg_modal,
    isvisible_register_drawer,
  } = useSelector((state) => state.prdAnalysisAnalysis_modal);
  // const xs_title = 7
  // const xs_input = 16

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
                }}
                onConfirm={() => {
                  fetch("/API/search?TYPE=11523", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((data) => {
                      var promise_using = new Promise((resolve, reject) => {
                        datasource_reg_modal.NUM =
                          parseInt(data[0].NUM, 10) + 1;
                        datasource_reg_modal.TABLE =
                          "T_RESI_PESTICIDE_ANALYSIS_URL_A";
                        delete datasource_reg_modal.PESTICIDE_NAME_KR;
                        delete datasource_reg_modal.PESTICIDE_NAME_EN;

                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({
                            data: customEncrypt([datasource_reg_modal]),
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            message.success(
                              "시험법: " +
                                (datasource_reg_modal.FOOD_NAME_KR ||
                                  datasource_reg_modal.FOOD_NAME_EN) +
                                "을 등록하였습니다."
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

                      Promise.all([promise_using]).then((values) => {
                        fetch("/API/search?TYPE=11521", {
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
                    });
                }}
                okText="확인"
                cancelText="취소"
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={
                    (datasource_reg_modal.PESTICIDE_NAME_KR === undefined ||
                      datasource_reg_modal.PESTICIDE_NAME_KR === "" ||
                      datasource_reg_modal.PESTICIDE_NAME_KR === null) &&
                    (datasource_reg_modal.PESTICIDE_NAME_EN === "" ||
                      datasource_reg_modal.PESTICIDE_NAME_EN === undefined ||
                      datasource_reg_modal.PESTICIDE_NAME_EN === null)
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
          width="40vw"
          title={<div>시험법 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 시험법 등록"
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
                    width: "30%",
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
                    title_1: "농약명",
                    data_1: (
                      <Row>
                        <Col xs={20}>
                          <Input
                            size="small"
                            value={
                              datasource_reg_modal.PESTICIDE_NAME_KR ||
                              datasource_reg_modal.PESTICIDE_NAME_EN ||
                              ""
                            }
                          />
                        </Col>
                        <Col push={1} xs={3} align="right">
                          {isvisible_register_drawer ? <DrawerReg /> : <></>}
                          <Button
                            block
                            type="primary"
                            size="small"
                            onClick={() => {
                              fetch("/API/search?TYPE=11111", {
                                method: "GET",
                                credentials: "include",
                              })
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(setDatasourceRegDrawer(myJson));
                                  dispatch(setIsvisibleRegDrawer(true));
                                });
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
                    title_1: "다성분 시험법 번호",
                    data_1: CustomInput(
                      setDatasourceRegModal,
                      datasource_reg_modal,
                      "QUALITATIVE_NUM",
                      false
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "다성분 시험법 URL",
                    data_1: CustomInput(
                      setDatasourceRegModal,
                      datasource_reg_modal,
                      "QUALITATIVE_URL",
                      false
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "단성분 시험법 번호",
                    data_1: CustomInput(
                      setDatasourceRegModal,
                      datasource_reg_modal,
                      "QUANTITATIVE_NUM",
                      false
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "단성분 시험법 URL",
                    data_1: CustomInput(
                      setDatasourceRegModal,
                      datasource_reg_modal,
                      "QUANTITATIVE_URL",
                      false
                    ),
                    wide: 1,
                  },
                ]}
              />
            </Row>
          </Card>
        </Modal>
        <DrawerReg></DrawerReg>
      </div>
    );
  }
};

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal, datasource_mod_modal } = useSelector(
    (state) => state.prdAnalysisAnalysis_modal
  );
  // const xs_title = 7
  // const xs_input = 16

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
                }}
                onConfirm={() => {
                  var promise_update = new Promise((resolve, reject) => {
                    datasource_mod_modal.TABLE =
                      "T_RESI_PESTICIDE_ANALYSIS_URL_A";
                    datasource_mod_modal.KEY = ["NUM", "PESTICIDE_CODE"];
                    datasource_mod_modal.NUMERIC_KEY = ["NUM"];

                    var PESTICIDE_NAME_KR_TEMP =
                      datasource_mod_modal.PESTICIDE_NAME_KR;
                    var PESTICIDE_NAME_EN_TEMP =
                      datasource_mod_modal.PESTICIDE_NAME_EN;

                    delete datasource_mod_modal.PESTICIDE_NAME_KR;
                    delete datasource_mod_modal.PESTICIDE_NAME_EN;

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({
                        data: customEncrypt([datasource_mod_modal]),
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        message.success(
                          "농약 시험법: " +
                            (PESTICIDE_NAME_KR_TEMP || PESTICIDE_NAME_EN_TEMP) +
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
                    fetch("/API/search?TYPE=11521", {
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
                  // disabled={
                  //     ((
                  //         datasource_mod_modal.FOOD_NAME_KR === "" ||
                  //         datasource_mod_modal.FOOD_NAME_KR === null) &&
                  //         (datasource_mod_modal.FOOD_NAME_EN === "" ||
                  //         datasource_mod_modal.FOOD_NAME_EN === null))
                  // }
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
          width="40vw"
          title={
            <div>
              URL 수정 -{" "}
              {!(
                datasource_mod_modal.PESTICIDE_NAME_KR === null ||
                datasource_mod_modal.PESTICIDE_NAME_KR === undefined ||
                datasource_mod_modal.PESTICIDE_NAME_KR === ""
              ) ? (
                <>
                  {datasource_mod_modal.PESTICIDE_NAME_KR}(
                  {datasource_mod_modal.PESTICIDE_NAME_EN})
                </>
              ) : (
                <>{datasource_mod_modal.PESTICIDE_NAME_EN}</>
              )}{" "}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 다성분 시험법 수정"
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
                    width: "25%",
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
                    title_1: "시험법 번호",
                    data_1: CustomInput(
                      setDatasourceModModal,
                      datasource_mod_modal,
                      "QUALITATIVE_NUM",
                      false
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "시험법 URL",
                    data_1: CustomInput(
                      setDatasourceModModal,
                      datasource_mod_modal,
                      "QUALITATIVE_URL",
                      false
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
            title="▣ 단성분 시험법 수정"
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
                    width: "25%",
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
                    title_1: "시험법 번호",
                    data_1: CustomInput(
                      setDatasourceModModal,
                      datasource_mod_modal,
                      "QUANTITATIVE_NUM",
                      false
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "시험법 URL",
                    data_1: CustomInput(
                      setDatasourceModModal,
                      datasource_mod_modal,
                      "QUANTITATIVE_URL",
                      false
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
            title="▣ 기타"
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
                    width: "25%",
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
                    title_1: "비고",
                    data_1: (
                      <Input
                        size="small"
                        placeholder="내용을 입력하세요"
                        value={datasource_mod_modal.BIGO}
                        onChange={(e) => {
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
        </Modal>
      </div>
    );
  }
};

export const DrawerReg = () => {
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState("");
  const { customSorter } = useSelector((state) => state.util);
  const {
    datasource_reg_modal,
    isvisible_register_drawer,
    datasource_reg_drawer,
  } = useSelector((state) => state.prdAnalysisAnalysis_modal);
  if (!isvisible_register_drawer) return <></>;
  else {
    return (
      <Drawer
        title={<span style={{ color: "white" }}>농약 조회</span>}
        // footer={
        //     <div>
        //         <Button
        //             size="small"
        //             type="primary"
        //             onClick={() => {
        //                 dispatch(setIsvisibleRegDrawer(false))
        //             }}
        //         >
        //             등록
        //         </Button>
        //         <Button size="small" type="ghost" onClick={() => {
        //             dispatch(setIsvisibleRegDrawer(false))
        //         }}>
        //             취소
        //         </Button>
        //     </div>
        // }
        onClose={() => {
          dispatch(setIsvisibleRegDrawer(false));
        }}
        headerStyle={{ background: "black", color: "white" }}
        footerStyle={{ textAlign: "right" }}
        width={512}
        visible={isvisible_register_drawer}
      >
        <>
          <Row>
            <Search
              className="modal-input"
              placeholder="농약명을 입력하세요"
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />
          </Row>
        </>
        <Table
          size="small"
          bordered
          sticky
          columns={[
            {
              title: "농약 국문명",
              dataIndex: "PESTICIDE_NAME_KR",
              key: "PESTICIDE_CODE",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
              defaultSortOrder: "ascend",
              render: (data, row, index) => {
                return <>{row.PESTICIDE_NAME_KR}</>;
              },
            },
            {
              title: "농약 영문명",
              dataIndex: "PESTICIDE_NAME_EN",
              key: "PESTICIDE_CODE",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
              defaultSortOrder: "ascend",
              render: (data, row, index) => {
                return <>{row.PESTICIDE_NAME_EN}</>;
              },
            },
            {
              title: "",
              dataIndex: "",
              key: "PESTICIDE_CODE",
              width: "20%",
              align: "center",
              render: (data, row) => (
                <Button
                  size="small"
                  type="ghost"
                  onClick={() => {
                    dispatch(
                      setDatasourceRegModal({
                        ...datasource_reg_modal,
                        PESTICIDE_NAME_KR: row.PESTICIDE_NAME_KR,
                        PESTICIDE_NAME_EN: row.PESTICIDE_NAME_EN,
                        PESTICIDE_CODE: row.PESTICIDE_CODE,
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
          dataSource={datasource_reg_drawer.filter((val) => {
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
