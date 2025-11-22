import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _, { reject } from "lodash";
import moment from "moment";
// #antd icon
import { customEncrypt } from "../../util";

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
import {
  setDataSource,
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceSchModal,
  setDatasourceRegModal,
  setDatasourceModModal,
  setDatasourceRegModalMrl,
  setDatasourceSchModalMRL,
  setDatasourceSchModalMRLCurrent,
  setDatasourceSchModalTest,
  setIsvisibleRegDrawerPesticideName,
  setIsvisibleRegDrawerFoodName,
  setIsvisibleRegDrawerADI,
  setIsvisibleRegDrawerMrlNation,
  setIsvisibleRegDrawerMrlStep,
  setSelectedMrlNationIdx,
  setSelectedMrlStepIdx,
  setDatasourceRegModalMrlNation,
  setDatasourceRegModalMrlStep,
} from "../../../reducers/prd/prdPropProp";
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
import Tabs from "antd/es/tabs";
import Tag from "antd/es/tag";
import Drawer from "antd/es/drawer";
import List from "antd/es/list";
import DatePicker from "antd/es/date-picker";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { rename } from "fs";
import { render } from "@testing-library/react";
import { Checkbox } from "antd";
import { resolve } from "path";

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

function Proposal() {
  const dispatch = useDispatch();
  const {
    dataSource,
    isvisible_search_modal,
    isvisible_modify_modal,
    isvisible_register_modal,
    datasource_reg_modal_mrl_nation,
    datasource_reg_modal_mrl_step,
  } = useSelector((state) => state.prdPropProp);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  const [searchFlag, setSearchFlag] = useState(0);

  useEffect(() => {
    fetch("/API/search?TYPE=13111", {
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
          subTitle: "농약 잔류허용기준 제안서",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/proposal",
              name: "농약",
            },
            {
              href: "/prd/proposal",
              name: "잔류허용기준 제안서",
            },
            {
              href: "/prd/proposal",
              name: "농약 잔류허용기준 제안서",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 1,
          defaultActiveKey: 2,
        }}
        //카드
        main_card={{
          title: "농약용도 검색",
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
                  <Option value={1}>공전번호</Option>
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
                return item.IDX;
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
                  if (val.STD_PROPOSAL_NUM !== null) {
                    var word_str = "";
                    Hangul.disassemble(val.STD_PROPOSAL_NUM, true).forEach(
                      (word, index) => {
                        word_str += word[0];
                      }
                    );
                    return (
                      word_str.indexOf(searchKey) !== -1 ||
                      Hangul.disassemble(
                        val.STD_PROPOSAL_NUM,
                        true
                      )[0][0].indexOf(searchKey) > -1 ||
                      val.STD_PROPOSAL_NUM.indexOf(searchKey) >= 0 ||
                      (val.STD_PROPOSAL_NUM !== "" &&
                      val.STD_PROPOSAL_NUM !== null
                        ? val.STD_PROPOSAL_NUM.toLowerCase().indexOf(
                            searchKey.toLowerCase()
                          ) > -1
                        : null)
                    );
                  }
                }
              })}
              columns={[
                {
                  title: "공개여부",
                  dataIndex: "PUBLIC_FLAG",
                  key: "IDX",
                  width: "8%",

                  filters: [
                    { text: "공개", value: "Y" },
                    { text: "비공개", value: "N" },
                  ],
                  onFilter: (value, record) =>
                    record.PUBLIC_FLAG.indexOf(value) === 0,
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PUBLIC_FLAG"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return data === "N" ? (
                      <Tag color="red">비공개</Tag>
                    ) : (
                      <Tag color="green">공개</Tag>
                    );
                  },
                },
                {
                  title: "기준 제안번호",
                  dataIndex: "STD_PROPOSAL_NUM",
                  key: "IDX",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "STD_PROPOSAL_NUM"),
                  },
                  showSorterTooltip: false,
                  defaultSortOrder: "descend",
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "공전번호",
                  dataIndex: "PESTICIDE_NUM",
                  key: "IDX",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NUM"),
                  },
                  showSorterTooltip: false,
                  defaultSortOrder: "descend",
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "농약명",
                  dataIndex: "PESTICIDE_NAME_KR",
                  key: "IDX",
                  width: "35%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    if (
                      row.PESTICIDE_NAME_KR === undefined ||
                      row.PESTICIDE_NAME_KR === "" ||
                      row.PESTICIDE_NAME_KR === null
                    )
                      return (
                        <>
                          <Button
                            type="link"
                            onClick={() => {
                              const promise_2 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13112&IDX=" + row.IDX,
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
                                      resolve(1);
                                    });
                                }
                              );

                              const promise_3 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13113&IDX=" + row.IDX,
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
                                        setDatasourceSchModalMRL(myJson)
                                      );
                                      resolve(1);
                                    });
                                }
                              );

                              const promise_4 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13114&IDX=" + row.IDX,
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
                                        setDatasourceSchModalMRLCurrent(myJson)
                                      );
                                      resolve(1);
                                    });
                                }
                              );

                              const promise_5 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13115&IDX=" + row.IDX,
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
                                        setDatasourceSchModalTest(myJson)
                                      );
                                      resolve(1);
                                    });
                                }
                              );

                              Promise.all([
                                promise_2,
                                promise_3,
                                promise_4,
                                promise_5,
                              ]).then((data) => {
                                dispatch(setIsvisibleSchModal(true));
                              });
                            }}
                          >
                            {row.PESTICIDE_NAME_EN}
                          </Button>
                        </>
                      );
                    else if (
                      row.PESTICIDE_NAME_EN === undefined ||
                      row.PESTICIDE_NAME_EN === "" ||
                      row.PESTICIDE_NAME_EN === null
                    )
                      <>
                        <Button
                          type="link"
                          onClick={() => {
                            const promise_2 = new Promise((resolve, reject) => {
                              fetch("/API/search?TYPE=13112&IDX=" + row.IDX, {
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
                            });

                            const promise_3 = new Promise((resolve, reject) => {
                              fetch("/API/search?TYPE=13113&IDX=" + row.IDX, {
                                method: "GET",
                                credentials: "include",
                              })
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(setDatasourceSchModalMRL(myJson));
                                  resolve(1);
                                });
                            });

                            const promise_4 = new Promise((resolve, reject) => {
                              fetch("/API/search?TYPE=13114&IDX=" + row.IDX, {
                                method: "GET",
                                credentials: "include",
                              })
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(
                                    setDatasourceSchModalMRLCurrent(myJson)
                                  );
                                  resolve(1);
                                });
                            });

                            const promise_5 = new Promise((resolve, reject) => {
                              fetch("/API/search?TYPE=13115&IDX=" + row.IDX, {
                                method: "GET",
                                credentials: "include",
                              })
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(setDatasourceSchModalTest(myJson));
                                  resolve(1);
                                });
                            });

                            Promise.all([
                              promise_2,
                              promise_3,
                              promise_4,
                              promise_5,
                            ]).then((data) => {
                              dispatch(setIsvisibleSchModal(true));
                            });
                          }}
                        >
                          {row.PESTICIDE_NAME_KR}
                        </Button>
                      </>;
                    else {
                      return (
                        <>
                          <Button
                            type="link"
                            onClick={() => {
                              const promise_2 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13112&IDX=" + row.IDX,
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
                                      resolve(1);
                                    });
                                }
                              );

                              const promise_3 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13113&IDX=" + row.IDX,
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
                                        setDatasourceSchModalMRL(myJson)
                                      );
                                      resolve(1);
                                    });
                                }
                              );

                              const promise_4 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13114&IDX=" + row.IDX,
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
                                        setDatasourceSchModalMRLCurrent(myJson)
                                      );
                                      resolve(1);
                                    });
                                }
                              );

                              const promise_5 = new Promise(
                                (resolve, reject) => {
                                  fetch(
                                    "/API/search?TYPE=13115&IDX=" + row.IDX,
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
                                        setDatasourceSchModalTest(myJson)
                                      );
                                      resolve(1);
                                    });
                                }
                              );

                              Promise.all([
                                promise_2,
                                promise_3,
                                promise_4,
                                promise_5,
                              ]).then((data) => {
                                dispatch(setIsvisibleSchModal(true));
                              });
                            }}
                          >
                            {row.PESTICIDE_NAME_KR}(
                            <span style={{ fontStyle: "italic" }}>
                              {row.PESTICIDE_NAME_EN}
                            </span>
                            )
                          </Button>
                        </>
                      );
                    }
                  },
                },
                {
                  title: "작물명",
                  dataIndex: "FARM_PRODUCTS_NAME",
                  key: "IDX",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "FARM_PRODUCTS_NAME"),
                  },
                  showSorterTooltip: false,
                  defaultSortOrder: "descend",
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title:
                    userinfo.USERID === undefined ||
                    userinfo.PRD_PROPOSAL_REG === "N" ? (
                      <></>
                    ) : (
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
                  key: "IDX",
                  flag: "등록",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.USING_NUM}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            const temp_promise_level0_0 = new Promise(
                              (resolve, reject) => {
                                fetch("/API/search?TYPE=13120&IDX=" + row.IDX, {
                                  method: "GET",
                                  credentials: "include",
                                })
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setDatasourceRegModal(myJson[0]));
                                    resolve(1);
                                  });
                              }
                            );

                            const temp_promise_level0_1 = new Promise(
                              (resolve1, reject) => {
                                fetch(
                                  "/API/search?TYPE=13121&PROP_IDX=" + row.IDX,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson_mrl) => {
                                    // console.log(myJson)
                                    const promise_arr_mrl_nation = [];
                                    const promise_arr_mrl_step = [];

                                    const temp_mrl_nation = [];

                                    myJson_mrl.forEach(
                                      (data_mrl_rel, idx_mrl_rel) => {
                                        data_mrl_rel.DELETE_FLAG = "N";
                                        data_mrl_rel.NO = parseInt(
                                          data_mrl_rel.NO,
                                          10
                                        );

                                        const promise_mrl_nation = new Promise(
                                          (resolve, reject) => {
                                            fetch(
                                              "/API/search?TYPE=13122&PROP_MRL_IDX=" +
                                                data_mrl_rel.IDX,
                                              {
                                                method: "GET",
                                                credentials: "include",
                                              }
                                            )
                                              .then(function (response) {
                                                return response.json();
                                              })
                                              .then((myJson_mrl_nation) => {
                                                const temp_mrl_nation = [
                                                  {
                                                    COUNTRY_CODE: "KR",
                                                    COUNTRY_NAME: "한국",
                                                    MRL_VALUE: "",
                                                  },
                                                  {
                                                    COUNTRY_CODE: "CD",
                                                    COUNTRY_NAME: "코덱스",
                                                    MRL_VALUE: "",
                                                  },
                                                  {
                                                    COUNTRY_CODE: "US",
                                                    COUNTRY_NAME: "미국",
                                                    MRL_VALUE: "",
                                                  },
                                                  {
                                                    COUNTRY_CODE: "JP",
                                                    COUNTRY_NAME: "일본",
                                                    MRL_VALUE: "",
                                                  },
                                                  {
                                                    COUNTRY_CODE: "EU",
                                                    COUNTRY_NAME: "유럽",
                                                    MRL_VALUE: "",
                                                  },
                                                  {
                                                    COUNTRY_CODE: "CN",
                                                    COUNTRY_NAME: "중국",
                                                    MRL_VALUE: "",
                                                  },
                                                  {
                                                    COUNTRY_CODE: "AU",
                                                    COUNTRY_NAME: "호주",
                                                    MRL_VALUE: "",
                                                  },
                                                  {
                                                    COUNTRY_CODE: "TW",
                                                    COUNTRY_NAME: "대만",
                                                    MRL_VALUE: "",
                                                  },
                                                ];

                                                myJson_mrl_nation.forEach(
                                                  (data1) => {
                                                    temp_mrl_nation.forEach(
                                                      (data2) => {
                                                        if (
                                                          data1.COUNTRY_CODE ===
                                                          data2.COUNTRY_CODE
                                                        ) {
                                                          data2.MRL_VALUE =
                                                            data1.MRL_VALUE;
                                                        }
                                                      }
                                                    );
                                                  }
                                                );
                                                resolve(temp_mrl_nation);
                                              });
                                          }
                                        );
                                        promise_arr_mrl_nation.push(
                                          promise_mrl_nation
                                        );

                                        const promise_mrl_step = new Promise(
                                          (resolve, reject) => {
                                            fetch(
                                              "/API/search?TYPE=13123&PROP_MRL_IDX=" +
                                                data_mrl_rel.IDX,
                                              {
                                                method: "GET",
                                                credentials: "include",
                                              }
                                            )
                                              .then(function (response) {
                                                return response.json();
                                              })
                                              .then((myJson_mrl_step) => {
                                                if (
                                                  myJson_mrl_step.length > 0
                                                ) {
                                                  const temp_mrl_step = [
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_1_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_1_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_1",
                                                      TITLE: "기준안작성",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_2_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_2_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_2",
                                                      TITLE: "위해평가",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_3_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_3_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_3",
                                                      TITLE:
                                                        "잔류농약전문위원회1차",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_4_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_4_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_4",
                                                      TITLE: "행정예고",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_5_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_5_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_5",
                                                      TITLE:
                                                        "잔류농약전문위원회2차",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_6_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_6_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_6",
                                                      TITLE:
                                                        "식품위생심의위원회",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_7_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_7_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_7",
                                                      TITLE: "규제심사",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_8_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_8_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_8",
                                                      TITLE: "개정고시",
                                                    },

                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_LAST_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_LAST_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_LAST",
                                                      TITLE: "시행시점",
                                                    },
                                                    {
                                                      BIGO: myJson_mrl_step[0]
                                                        .STEP_EXCP_BIGO,
                                                      DATE: myJson_mrl_step[0]
                                                        .STEP_EXCP_DATE,
                                                      IS_FOCUSED_DATE: false,
                                                      KEY: "STEP_EXCP",
                                                      TITLE: "제외",
                                                    },
                                                  ];
                                                  resolve(temp_mrl_step);
                                                } else {
                                                  resolve([
                                                    {
                                                      KEY: "STEP_1",
                                                      TITLE: "기준안작성",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_2",
                                                      TITLE: "위해평가",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_3",
                                                      TITLE:
                                                        "잔류농약전문위원회 1차",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_4",
                                                      TITLE: "행정예고",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_5",
                                                      TITLE:
                                                        "잔류농약전문위원회 2차",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_6",
                                                      TITLE:
                                                        "식품위생심의위원회",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_7",
                                                      TITLE: "규제심사",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_8",
                                                      TITLE: "개정고시",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_LAST",
                                                      TITLE: "시행시점",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                    {
                                                      KEY: "STEP_EXCP",
                                                      TITLE: "제외",
                                                      BIGO: "",
                                                      DATE: "",
                                                      IS_FOCUSED_DATE: false,
                                                    },
                                                  ]);
                                                }
                                              });
                                          }
                                        );
                                        promise_arr_mrl_step.push(
                                          promise_mrl_step
                                        );
                                      }
                                    );

                                    const promise_temp1 = new Promise(
                                      (resolve, reject) => {
                                        Promise.all(
                                          promise_arr_mrl_nation
                                        ).then((data) => {
                                          dispatch(
                                            setDatasourceRegModalMrlNation(data)
                                          );
                                          resolve(1);
                                        });
                                      }
                                    );

                                    const promise_temp2 = new Promise(
                                      (resolve, reject) => {
                                        Promise.all(promise_arr_mrl_step).then(
                                          (data) => {
                                            dispatch(
                                              setDatasourceRegModalMrlStep(data)
                                            );
                                            resolve(1);
                                          }
                                        );
                                      }
                                    );

                                    dispatch(
                                      setDatasourceRegModalMrl(myJson_mrl)
                                    );

                                    Promise.all([
                                      promise_temp1,
                                      promise_temp2,
                                    ]).then((data) => {
                                      resolve1(1);
                                    });
                                  });
                              }
                            );

                            Promise.all([
                              temp_promise_level0_0,
                              temp_promise_level0_1,
                            ]).then((data) => {
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
                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        TABLE: "T_RESI_PESTICIDE_PROPOSAL",
                                        KEY: ["IDX"],
                                        NUMERIC_KEY: ["IDX"],
                                        IDX: row.IDX,
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
                                      "제안서: " +
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
                              fetch("/API/search?TYPE=13111", {
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
                    userinfo.PRD_PROPOSAL_MOD === "N")
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

export default Proposal;

export const SearchModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_search_modal,
    datasource_sch_modal,
    datasource_sch_modal_mrl,
    datasource_sch_modal_mrl_current,
    datasource_sch_modal_test,
  } = useSelector((state) => state.prdPropProp);
  const { userinfo } = useSelector((state) => state.header);
  const xs_title = 5;
  const xs_input = 18;

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
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleSchModal(false));
            dispatch(setDatasourceSchModal({}));
          }}
          width="80vw"
          title={
            <div>
              잔류허용기준 제안서 조회 :{" "}
              {datasource_sch_modal.PESTICIDE_NAME_KR ||
                datasource_sch_modal.PESTICIDE_NAME_EN}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 제안서 정보"
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
                  title_2: "기준제안번호",
                  data_2: datasource_sch_modal.STD_PROPOSAL_NUM,
                  wide: 0,
                },
                {
                  title_1: "공전번호",
                  data_1: datasource_sch_modal.PESTICIDE_NUM,
                  title_2: "등록일",
                  data_2: datasource_sch_modal.REG_DATE,
                  wide: 0,
                },
                {
                  title_1: "농약용도",
                  data_1: datasource_sch_modal.USING_NAME,
                  wide: 1,
                },
                {
                  title_1: "ADI",
                  data_1: datasource_sch_modal.PESTICIDE_ADI,
                  wide: 1,
                },
                {
                  title_1: "1인 1일 섭취허융량",
                  data_1: (
                    <span>
                      {datasource_sch_modal.INTAKE_MG}
                      <span style={{ fontStyle: "italic" }}>mg</span> *{" "}
                      {datasource_sch_modal.INTAKE_KG}
                      <span style={{ fontStyle: "italic" }}>Kg</span> ={" "}
                      {datasource_sch_modal.INTAKE_KG *
                        datasource_sch_modal.INTAKE_MG}
                      <span style={{ fontStyle: "italic" }}>mg</span>
                    </span>
                  ),
                  wide: 1,
                },
                {
                  title_1: "적용대상작물",
                  data_1: datasource_sch_modal.FOOD_NAME,
                  wide: 1,
                },
                {
                  title_1: "작물명",
                  data_1: datasource_sch_modal.FARM_PRODUCTS_NAME,
                  wide: 1,
                },
              ]}
            />
          </Card>
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
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
            <Tabs defaultActiveKey="1">
              <TabPane tab="농약잔류허용기준(안)" key="1">
                <Table
                  size="small"
                  bordered
                  sticky
                  rowKey={(row) => row.IDX}
                  pagination={false}
                  columns={[
                    {
                      title: "식품명",
                      dataIndex: "FOOD_NAME_KR",
                      key: "IDX",
                      width: "10%",
                      render: (data, row, index) => {
                        if (row.BOLD_FLAG === 1) {
                          return (
                            <span
                              style={{ color: "black", fontWeight: "bold" }}
                            >
                              {row.FOOD_NAME_KR}(
                              <span style={{ fontStyle: "italic" }}>
                                {row.FOOD_NAME_EN}
                              </span>
                              )
                            </span>
                          );
                        } else {
                          return (
                            <span style={{ color: "gray" }}>
                              {row.FOOD_NAME_KR}(
                              <span style={{ fontStyle: "italic" }}>
                                {row.FOOD_NAME_EN}
                              </span>
                              )
                            </span>
                          );
                        }
                      },
                    },
                    {
                      title: "식품섭취량",
                      dataIndex: "FOOD_INTAKE",
                      key: "IDX",
                      width: "5%",
                      render: (data, row, index) => {
                        if (row.BOLD_FLAG === 1) {
                          return (
                            <span
                              style={{ color: "black", fontWeight: "bold" }}
                            >
                              {row.FOOD_INTAKE}
                            </span>
                          );
                        } else {
                          return (
                            <span style={{ color: "gray" }}>
                              {row.FOOD_INTAKE}
                            </span>
                          );
                        }
                      },
                    },
                    {
                      title: "현재기준",
                      children: [
                        {
                          title: "MRL(mg/kg)",
                          dataIndex: "MRL_VALUE",
                          key: "IDX",
                          width: "8%",
                          render: (data, row, index) => {
                            if (row.BOLD_FLAG === 1) {
                              return (
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {row.MRL_VALUE}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ color: "gray" }}>
                                  {row.MRL_VALUE}
                                </span>
                              );
                            }
                          },
                        },
                        {
                          title: "농약섭취량(mg)/일",
                          dataIndex: "RDA_MRL_VALUE",
                          key: "IDX",
                          width: "8%",
                          render: (data, row, index) => {
                            if (row.BOLD_FLAG === 1) {
                              return (
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {isNaN(
                                    (
                                      (parseFloat(row.FOOD_INTAKE) *
                                        parseFloat(row.MRL_VALUE)) /
                                      1000
                                    ).toFixed(10)
                                  )
                                    ? ""
                                    : (
                                        (parseFloat(row.FOOD_INTAKE) *
                                          parseFloat(row.MRL_VALUE)) /
                                        1000
                                      ).toFixed(10)}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ color: "gray" }}>
                                  {isNaN(
                                    (
                                      (parseFloat(row.FOOD_INTAKE) *
                                        parseFloat(row.MRL_VALUE)) /
                                      1000
                                    ).toFixed(10)
                                  )
                                    ? ""
                                    : (
                                        (parseFloat(row.FOOD_INTAKE) *
                                          parseFloat(row.MRL_VALUE)) /
                                        1000
                                      ).toFixed(10)}
                                </span>
                              );
                            }
                          },
                        },
                      ],
                    },
                    {
                      title: "농진청요구안",
                      children: [
                        {
                          title: "MRL(mg/kg)",
                          dataIndex: "RDA_MRL_VALUE",
                          key: "IDX",
                          width: "8%",
                          render: (data, row, index) => {
                            if (row.BOLD_FLAG === 1) {
                              return (
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {row.RDA_MRL_VALUE}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ color: "gray" }}>
                                  {row.RDA_MRL_VALUE}
                                </span>
                              );
                            }
                          },
                        },
                        {
                          title: "농약섭취량(mg/일)",
                          key: "IDX",
                          width: "8%",
                          render: (data, row, index) => {
                            if (row.BOLD_FLAG === 1) {
                              return (
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {isNaN(
                                    (
                                      (parseFloat(row.FOOD_INTAKE) *
                                        parseFloat(row.RDA_MRL_VALUE)) /
                                      1000
                                    ).toFixed(10)
                                  )
                                    ? ""
                                    : (
                                        (parseFloat(row.FOOD_INTAKE) *
                                          parseFloat(row.RDA_MRL_VALUE)) /
                                        1000
                                      ).toFixed(10)}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ color: "gray" }}>
                                  {isNaN(
                                    (
                                      (parseFloat(row.FOOD_INTAKE) *
                                        parseFloat(row.RDA_MRL_VALUE)) /
                                      1000
                                    ).toFixed(10)
                                  )
                                    ? ""
                                    : (
                                        (parseFloat(row.FOOD_INTAKE) *
                                          parseFloat(row.RDA_MRL_VALUE)) /
                                        1000
                                      ).toFixed(10)}
                                </span>
                              );
                            }
                          },
                        },
                      ],
                    },
                    {
                      title: "식약처검토안",
                      children: [
                        {
                          title: "MRL(mg/kg)",
                          key: "IDX",
                          dataIndex: "KFDA_MRL_VALUE",
                          width: "8%",
                          render: (data, row, index) => {
                            if (row.BOLD_FLAG === 1) {
                              return (
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {row.KFDA_MRL_VALUE}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ color: "gray" }}>
                                  {row.KFDA_MRL_VALUE}
                                </span>
                              );
                            }
                          },
                        },
                        {
                          title: "농약섭취량(mg)/일",
                          key: "IDX",
                          width: "8%",
                          render: (data, row, index) => {
                            if (row.BOLD_FLAG === 1) {
                              return (
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {isNaN(
                                    (
                                      (parseFloat(row.FOOD_INTAKE) *
                                        parseFloat(row.KFDA_MRL_VALUE)) /
                                      1000
                                    ).toFixed(10)
                                  )
                                    ? ""
                                    : (
                                        (parseFloat(row.FOOD_INTAKE) *
                                          parseFloat(row.KFDA_MRL_VALUE)) /
                                        1000
                                      ).toFixed(10)}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ color: "gray" }}>
                                  {isNaN(
                                    (
                                      (parseFloat(row.FOOD_INTAKE) *
                                        parseFloat(row.KFDA_MRL_VALUE)) /
                                      1000
                                    ).toFixed(10)
                                  )
                                    ? ""
                                    : (
                                        (parseFloat(row.FOOD_INTAKE) *
                                          parseFloat(row.KFDA_MRL_VALUE)) /
                                        1000
                                      ).toFixed(10)}
                                </span>
                              );
                            }
                          },
                        },
                      ],
                    },
                    {
                      title: "외국 농약잔류 허용기준(mg/kg)",
                      dataIndex: "NATION_MRL_VALUE",
                      key: "IDX",
                      render: (data, row, index) => {
                        if (data === undefined || data === null) return "";
                        else if (data.length === 3) {
                          return "";
                        } else {
                          return data.split(";").map((mrl) => {
                            return (
                              <div>
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {mrl}
                                </span>
                              </div>
                            );
                          });
                        }
                      },
                    },
                    {
                      title: "진행상태",
                    },
                  ]}
                  // dataSource={[...datasource_sch_modal_mrl]}
                  dataSource={[
                    ...datasource_sch_modal_mrl,
                    ...datasource_sch_modal_mrl_current,
                  ]}
                ></Table>
              </TabPane>
              <TabPane tab="작물잔류시험성적" key="2">
                <Table
                  size="small"
                  bordered
                  sticky
                  rowKey={(row) => row.IDX}
                  pagination={false}
                  columns={[
                    {
                      title: "작물명",
                      dataIndex: "FARM_PRODUCTS_NAME",
                      key: "IDX",
                      width: "8%",
                      render: (data, row, index) => {
                        return <>{row.FARM_PRODUCTS_NAME}</>;
                      },
                    },
                    {
                      title: "시험제형",
                      dataIndex: "TEST_SHAPE",
                      key: "IDX",
                      width: "10%",
                    },
                    {
                      title: "적용 병해충",
                      dataIndex: "APP_BUG",
                      key: "IDX",
                      width: "5%",
                    },
                    {
                      title: "시험년도",
                      dataIndex: "TEST_YEAR",
                      key: "IDX",
                      width: "3%",
                      align: "center",
                    },
                    {
                      title: "작물 잔류성 데이터",
                      children: [
                        {
                          title: "약제처리 후 경과일수",
                          dataIndex: "",
                          key: "IDX",
                          width: "3%",
                          align: "center",
                        },
                        {
                          title: "사용 횟수",
                          dataIndex: "",
                          key: "IDX",
                          width: "3%",
                          align: "center",
                        },
                        {
                          title: "최대잔류량(ppm)",
                          dataIndex: "",
                          key: "IDX",
                          width: "3%",
                          align: "center",
                        },
                      ],
                    },
                    {
                      title: "안전사용기준",
                      children: [
                        {
                          title: "수확전 사용주기",
                          dataIndex: "USE_PERIOD",
                          key: "IDX",
                          width: "3%",
                          align: "center",
                        },
                        {
                          title: "사용 횟수",
                          dataIndex: "USE_COUNT",
                          key: "IDX",
                          width: "3%",
                          align: "center",
                        },
                      ],
                    },
                    {
                      title: "검토",
                      dataIndex: "OPINION",
                      key: "IDX",
                      width: "15%",
                    },
                  ]}
                  dataSource={datasource_sch_modal_test}
                ></Table>
              </TabPane>
              <TabPane tab="의견쓰기" key="3"></TabPane>
            </Tabs>
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
    isvisible_register_drawer_pesticide_name,
    isvisible_register_drawer_food_name,
    isvisible_register_drawer_mrl_nation,
    isvisible_register_drawer_mrl_step,
    selected_mrl_nation_idx,
    selected_mrl_step_idx,
    datasource_reg_modal_mrl_nation,
    datasource_reg_modal_mrl_step,
  } = useSelector((state) => state.prdPropProp);
  const { userinfo } = useSelector((state) => state.header);
  const xs_title = 5;
  const xs_input = 18;

  const [directInput, setDirectInput] = useState(false);

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
                  console.log("datasource_reg_modal", datasource_reg_modal);
                  console.log(
                    "datasource_reg_modal_mrl",
                    datasource_reg_modal_mrl
                  );
                  console.log(
                    "datasource_reg_modal_mrl_nation",
                    datasource_reg_modal_mrl_nation
                  );
                  console.log(
                    "datasource_reg_modal_mrl_step",
                    datasource_reg_modal_mrl_step
                  );

                  fetch("/API/search?TYPE=13118", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((myJson_13118) => {
                      const temp = {};
                      //
                      temp.TABLE = "T_RESI_PESTICIDE_PROPOSAL";
                      temp.NUMERIC_KEY = ["IDX"];
                      temp.IDX = myJson_13118[0].MAX;
                      temp.PRO_NO = moment(new Date()).format("YYYY") + "-100";
                      temp.PESTICIDE_CODE = datasource_reg_modal.PESTICIDE_CODE;
                      temp.PESTICIDE_ADI = datasource_reg_modal.PESTICIDE_ADI;
                      temp.ADI_INPUT_TYPE = _.isNil(
                        datasource_reg_modal.ADI_INPUT_TYPE
                      )
                        ? "N"
                        : datasource_reg_modal.ADI_INPUT_TYPE;
                      temp.INTAKE_MG = datasource_reg_modal.INTAKE_MG;
                      temp.INTAKE_KG = datasource_reg_modal.INTAKE_KG;
                      temp.DELETE_FLAG = "N";
                      temp.REG_USER_ID = userinfo.USERID;
                      temp.REG_DATE = moment(new Date()).format("YYYY-MM-DD");
                      temp.FARM_PRODUCTS_NAME =
                        datasource_reg_modal.FARM_PRODUCTS_NAME;
                      temp.BIGO = datasource_reg_modal.BIGO;
                      temp.STD_PROPOSAL_NUM =
                        datasource_reg_modal.STD_PROPOSAL_NUM;
                      temp.PUBLIC_FLAG = "N";
                      temp.HISTORY_FLAG = _.isNil(
                        datasource_reg_modal.HISTORY_FLAG
                      )
                        ? "N"
                        : datasource_reg_modal.HISTORY_FLAG;
                      //

                      fetch("/API/search?TYPE=13119", {
                        method: "GET",
                        credentials: "include",
                      })
                        .then(function (response) {
                          return response.json();
                        })
                        .then((myJson_13119) => {
                          const temp_mrl_rel = _.cloneDeep(
                            datasource_reg_modal_mrl
                          );
                          const temp_mrl_nation = [];
                          const temp_mrl_step = [];

                          temp_mrl_rel
                            .filter((data) => data.DELETE_FLAG === "N")
                            .forEach((data_mrl_rel, idx) => {
                              data_mrl_rel.TABLE =
                                "T_RESI_PESTICIDE_PROPOSAL_MRL_REL";
                              data_mrl_rel.NUMERIC_KEY = ["IDX", "PROP_IDX"];
                              data_mrl_rel.IDX = myJson_13119[0].MAX + idx;
                              data_mrl_rel.PROP_IDX = temp.IDX;

                              delete data_mrl_rel.FOOD_NAME_KR;
                              delete data_mrl_rel.FOOD_NAME_EN;
                              delete data_mrl_rel.FOOD_INTAKE;
                              delete data_mrl_rel.NO;
                              delete data_mrl_rel.DELETE_FLAG;

                              datasource_reg_modal_mrl_nation[idx]
                                .filter(
                                  (data_mrl_nation) =>
                                    data_mrl_nation.MRL_VALUE !== ""
                                )
                                .forEach((data_mrl_nation) => {
                                  temp_mrl_nation.push({
                                    TABLE:
                                      "T_RESI_PESTICIDE_PROPOSAL_NATION_REL",
                                    NUMERIC_KEY: ["PROP_MRL_IDX"],
                                    PROP_MRL_IDX: data_mrl_rel.IDX,
                                    COUNTRY_CODE: data_mrl_nation.COUNTRY_CODE,
                                    MRL_VALUE: data_mrl_nation.MRL_VALUE,
                                  });
                                });

                              temp_mrl_step.push({
                                TABLE: "T_RESI_PESTICIDE_PROPOSAL_STEP_REL",
                                NUMERIC_KEY: ["PROP_MRL_IDX"],
                                PROP_MRL_IDX: data_mrl_rel.IDX,

                                STEP_1_DATE:
                                  datasource_reg_modal_mrl_step[idx][0].DATE,
                                STEP_1_BIGO:
                                  datasource_reg_modal_mrl_step[idx][0].BIGO,

                                STEP_2_DATE:
                                  datasource_reg_modal_mrl_step[idx][1].DATE,
                                STEP_2_BIGO:
                                  datasource_reg_modal_mrl_step[idx][1].BIGO,

                                STEP_3_DATE:
                                  datasource_reg_modal_mrl_step[idx][2].DATE,
                                STEP_3_BIGO:
                                  datasource_reg_modal_mrl_step[idx][2].BIGO,

                                STEP_4_DATE:
                                  datasource_reg_modal_mrl_step[idx][3].DATE,
                                STEP_4_BIGO:
                                  datasource_reg_modal_mrl_step[idx][3].BIGO,

                                STEP_5_DATE:
                                  datasource_reg_modal_mrl_step[idx][4].DATE,
                                STEP_5_BIGO:
                                  datasource_reg_modal_mrl_step[idx][4].BIGO,

                                STEP_6_DATE:
                                  datasource_reg_modal_mrl_step[idx][5].DATE,
                                STEP_6_BIGO:
                                  datasource_reg_modal_mrl_step[idx][5].BIGO,

                                STEP_7_DATE:
                                  datasource_reg_modal_mrl_step[idx][6].DATE,
                                STEP_7_BIGO:
                                  datasource_reg_modal_mrl_step[idx][6].BIGO,

                                STEP_8_DATE:
                                  datasource_reg_modal_mrl_step[idx][7].DATE,
                                STEP_8_BIGO:
                                  datasource_reg_modal_mrl_step[idx][7].BIGO,

                                STEP_LAST_DATE:
                                  datasource_reg_modal_mrl_step[idx][8].DATE,
                                STEP_LAST_BIGO:
                                  datasource_reg_modal_mrl_step[idx][8].BIGO,

                                STEP_EXCP_DATE:
                                  datasource_reg_modal_mrl_step[idx][9].DATE,
                                STEP_EXCP_BIGO:
                                  datasource_reg_modal_mrl_step[idx][9].BIGO,
                              });
                            });

                          const promise_prop = new Promise(
                            (resolve, reject) => {
                              fetch("/API/insert", {
                                method: "POST",
                                body: JSON.stringify({
                                  data: customEncrypt([temp]),
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                              }).then(function (response) {
                                if (response.status === 200) {
                                  message.success(
                                    "농약제안서 : " +
                                      datasource_reg_modal.PESTICIDE_NAME_KR ||
                                      datasource_reg_modal.PESTICIDE_NAME_EN +
                                        "을 추가하였습니다."
                                  );
                                  resolve(1);
                                } else if (response.status === 401) {
                                  message.error("권한이 없습니다.");

                                  resolve(0);
                                }
                              });
                            }
                          );

                          const promise_prop_mrl_rel = new Promise(
                            (resolve, reject) => {
                              fetch("/API/insert", {
                                method: "POST",
                                body: JSON.stringify({
                                  data: customEncrypt(temp_mrl_rel),
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                              }).then(function (response) {
                                if (response.status === 200) {
                                  message.success(
                                    "농약제안서 : 잔류허용기준 " +
                                      temp_mrl_rel.length +
                                      "종을 추가하였습니다."
                                  );
                                  resolve(1);
                                } else if (response.status === 401) {
                                  message.error("권한이 없습니다.");
                                  resolve(0);
                                }
                              });
                            }
                          );

                          const promise_prop_nation_rel = new Promise(
                            (resolve, reject) => {
                              fetch("/API/insert", {
                                method: "POST",
                                body: JSON.stringify({
                                  data: customEncrypt(temp_mrl_nation),
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                              }).then(function (response) {
                                if (response.status === 200) {
                                  message.success(
                                    "농약제안서 : 외국 잔류허용기준 " +
                                      temp_mrl_nation.length +
                                      "개를 추가하였습니다."
                                  );

                                  resolve(1);
                                } else if (response.status === 401) {
                                  message.error("권한이 없습니다.");
                                  resolve(0);
                                }
                              });
                            }
                          );

                          const promise_prop_step_rel = new Promise(
                            (resolve, reject) => {
                              fetch("/API/insert", {
                                method: "POST",
                                body: JSON.stringify({
                                  data: customEncrypt(temp_mrl_step),
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                              }).then(function (response) {
                                if (response.status === 200) {
                                  message.success(
                                    "농약제안서 : 진행상태 " +
                                      temp_mrl_step.length +
                                      "종을 추가하였습니다."
                                  );
                                  resolve(1);
                                } else if (response.status === 401) {
                                  message.error("권한이 없습니다.");
                                  resolve(0);
                                }
                              });
                            }
                          );

                          Promise.all([
                            promise_prop,
                            promise_prop_mrl_rel,
                            promise_prop_nation_rel,
                            promise_prop_step_rel,
                          ]).then((result) => {
                            fetch("/API/search?TYPE=13111", {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDataSource(myJson));
                                dispatch(setIsvisibleRegModal(false));
                                dispatch(setDatasourceRegModal({}));
                                dispatch(setDatasourceRegModalMrl([]));
                                dispatch(setDatasourceRegModalMrlNation([]));
                                dispatch(setDatasourceRegModalMrlStep([]));
                              });
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
                    (datasource_reg_modal.USING_NAME_KR === undefined ||
                      datasource_reg_modal.USING_NAME_KR === "" ||
                      datasource_reg_modal.USING_NAME_KR === null) &&
                    (datasource_reg_modal.USING_NAME_EN === "" ||
                      datasource_reg_modal.USING_NAME_EN === undefined ||
                      datasource_reg_modal.USING_NAME_EN === null)
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
                  dispatch(setDatasourceRegModalMrl([]));
                  dispatch(setDatasourceRegModalMrlNation([]));
                  dispatch(setDatasourceRegModalMrlStep([]));
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
            dispatch(setDatasourceRegModalMrlNation([]));
            dispatch(setDatasourceRegModalMrlStep([]));
          }}
          width="70vw"
          title={<div>농약용도 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약제안서 등록"
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
                  title_1: "과거자료 여부",
                  data_1: (
                    <Select
                      defaultValue={"N"}
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            HISTORY_FLAG: e,
                          })
                        );
                      }}
                    >
                      <Select.Option value={"N"}>신규제안서</Select.Option>
                      <Select.Option value={"Y"}>과거자료</Select.Option>
                    </Select>
                  ),
                  title_2: "기준제안번호",
                  data_2: (
                    <Input
                      prefix={<span style={{ color: "red" }}>*</span>}
                      size="small"
                      // value={datasource_reg_modal.STD_PROPOSAL_NUM}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            STD_PROPOSAL_NUM: e.target.value,
                          })
                        );
                      }}
                    ></Input>
                  ),
                  wide: 0,
                },
                {
                  title_1: "농약명",
                  data_1: (
                    <Row>
                      <Col xs={22}>
                        <Input
                          prefix={<span style={{ color: "red" }}>*</span>}
                          value={
                            _.isNil(datasource_reg_modal.PESTICIDE_NAME_KR)
                              ? _.isNil(datasource_reg_modal.PESTICIDE_NAME_EN)
                                ? ""
                                : datasource_reg_modal.PESTICIDE_NAME_EN
                              : _.isNil(datasource_reg_modal.PESTICIDE_NAME_EN)
                              ? datasource_reg_modal.PESTICIDE_NAME_KR
                              : datasource_reg_modal.PESTICIDE_NAME_KR +
                                "(" +
                                datasource_reg_modal.PESTICIDE_NAME_EN +
                                ")"
                          }
                          size="small"
                        ></Input>
                      </Col>
                      <Col xs={2} style={{ textAlign: "right" }}>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            dispatch(setIsvisibleRegDrawerPesticideName(true));
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
                  title_1: "공전번호",
                  data_1: <span>{datasource_reg_modal.PESTICIDE_NUM}</span>,
                  title_2: "농약용도",
                  data_2: (
                    <span>
                      {_.isNil(datasource_reg_modal.USING_NAME_KR)
                        ? _.isNil(datasource_reg_modal.USING_NAME_EN)
                          ? ""
                          : datasource_reg_modal.USING_NAME_EN
                        : _.isNil(datasource_reg_modal.USING_NAME_EN)
                        ? datasource_reg_modal.USING_NAME_KR
                        : datasource_reg_modal.USING_NAME_KR +
                          "(" +
                          datasource_reg_modal.USING_NAME_EN +
                          ")"}
                    </span>
                  ),
                  wide: 0,
                },
                {
                  title_1: "ADI",
                  data_1: (
                    <Row>
                      <Col xs={8}>
                        <Input
                          disabled={!directInput}
                          size="small"
                          value={datasource_reg_modal.PESTICIDE_ADI}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                PESTICIDE_ADI: e.target.value,
                              })
                            );
                          }}
                        ></Input>
                      </Col>
                      <Col xs={4} style={{ textAlign: "center" }}>
                        <Checkbox
                          value={directInput}
                          onChange={(e) => {
                            setDirectInput(e.target.checked);
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                ADI_INPUT_TYPE: e.target.checked ? "Y" : "N",
                              })
                            );
                          }}
                        >
                          직접입력
                        </Checkbox>
                      </Col>
                      <Col xs={12} style={{ textAlign: "right" }}>
                        <Select
                          size="small"
                          disabled={!directInput}
                          style={{ width: "100%" }}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                PESTICIDE_ADI: e,
                              })
                            );
                          }}
                        >
                          {[
                            {
                              value: datasource_reg_modal.ADI_KR,
                              name: "한국",
                            },
                            { value: datasource_reg_modal.ADI, name: "코덱스" },
                            {
                              value: datasource_reg_modal.ADI_US,
                              name: "미국",
                            },
                            {
                              value: datasource_reg_modal.ADI_JP,
                              name: "일본",
                            },
                            {
                              value: datasource_reg_modal.ADI_EU,
                              name: "유럽",
                            },
                            {
                              value: datasource_reg_modal.ADI_CN,
                              name: "중국",
                            },
                            {
                              value: datasource_reg_modal.ADI_AU,
                              name: "호주",
                            },
                            {
                              value: datasource_reg_modal.ADI_TW,
                              name: "대만",
                            },
                          ].map((data) => {
                            return (
                              <Select.Option key={data.name} value={data.value}>
                                <Row>
                                  <Col xs={6} style={{ textAlign: "left" }}>
                                    {data.name} :
                                  </Col>
                                  <Col xs={18} style={{ textAlign: "right" }}>
                                    <span style={{ color: "green" }}>
                                      {data.value}
                                    </span>
                                  </Col>
                                </Row>
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                  ),
                  wide: 1,
                },
                {
                  title_1: "1인 1일 섭취허용량",
                  data_1: (
                    <Row>
                      <Col xs={3}>
                        <Input
                          size="small"
                          onBlur={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                INTAKE_MG: e.target.value,
                              })
                            );
                          }}
                        ></Input>
                      </Col>
                      <Col xs={1} style={{ textAlign: "left" }}>
                        <span style={{ fontStyle: "italic" }}>mg * </span>{" "}
                      </Col>
                      <Col xs={3}>
                        <Input
                          size="small"
                          onBlur={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                INTAKE_KG: e.target.value,
                              })
                            );
                          }}
                        ></Input>
                      </Col>
                      <Col xs={1} style={{ textAlign: "left" }}>
                        <span style={{ fontStyle: "italic" }}>kg = </span>{" "}
                      </Col>
                      <Col xs={3}>
                        <Input
                          disabled
                          size="small"
                          value={
                            _.isNaN(
                              datasource_reg_modal.INTAKE_KG *
                                datasource_reg_modal.INTAKE_MG
                            )
                              ? 0
                              : datasource_reg_modal.INTAKE_KG *
                                datasource_reg_modal.INTAKE_MG
                          }
                        ></Input>
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
                      // value={datasource_reg_modal.FARM_PRODUCTS_NAME}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            FARM_PRODUCTS_NAME: e.target.value,
                          })
                        );
                      }}
                    ></Input>
                  ),
                  wide: 1,
                },
                {
                  title_1: "비고",
                  data_1: (
                    <Input.TextArea
                      size="small"
                      // value={datasource_reg_modal.BIGO}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            BIGO: e.target.value,
                          })
                        );
                      }}
                    ></Input.TextArea>
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
            title="▣ 농약잔류허용기준(안)"
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
              bordered
              sticky
              columns={[
                {
                  title: "식품명",
                  dataIndex: "FOOD_NAME_KR",
                  width: "20%",
                  key: "NO",
                },
                {
                  title: (
                    <span>
                      식품섭취량
                      <br />
                      (g/일)
                    </span>
                  ),
                  dataIndex: "FOOD_INTAKE",
                  key: "NO",
                  width: "10%",
                },
                {
                  title: (
                    <span>
                      농진청 요구안
                      <br />
                      MRL(mg/kg)
                    </span>
                  ),
                  key: "NO",
                  width: "10%",
                  render: (data, row, index) => {
                    return (
                      <Input
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_reg_modal_mrl);
                          temp[row.NO].RDA_MRL_VALUE = e.target.value;
                          dispatch(setDatasourceRegModalMrl(temp));
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: (
                    <span>
                      식약처 검토
                      <br />
                      MRL(mg/kg)
                    </span>
                  ),
                  key: "NO",
                  width: "10%",
                  render: (data, row, index) => {
                    return (
                      <Input
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_reg_modal_mrl);
                          temp[row.NO].KFDA_MRL_VALUE = e.target.value;
                          dispatch(setDatasourceRegModalMrl(temp));
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: (
                    <span>
                      외국의 농약잔류허용기준
                      <br />
                      MRL(mg/kg)
                    </span>
                  ),
                  key: "NO",
                  width: "25%",
                  render: (data, row, index) => {
                    return (
                      <Row justify="space-between" align="middle">
                        <Col xs={18}>
                          <List
                            size="small"
                            dataSource={datasource_reg_modal_mrl_nation[
                              row.NO
                            ].filter(
                              (data) =>
                                !(
                                  _.isNil(data.MRL_VALUE) ||
                                  data.MRL_VALUE === ""
                                )
                            )}
                            locale={{
                              emptyText: (
                                <span style={{ fontSize: "12px" }}>
                                  잔류허용기준을 추가하세요
                                </span>
                              ),
                            }}
                            renderItem={(item) => (
                              <List.Item>
                                <Row style={{ width: "100%" }}>
                                  <Col xs={6} style={{ textAlign: "left" }}>
                                    {item.COUNTRY_NAME}
                                  </Col>
                                  <Col xs={18} style={{ textAlign: "right" }}>
                                    {item.MRL_VALUE}
                                  </Col>
                                </Row>
                              </List.Item>
                            )}
                          />
                        </Col>
                        <Col xs={2}></Col>
                        <Col xs={4} style={{ textAlign: "right" }}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              console.log("asdf");
                              dispatch(setIsvisibleRegDrawerMrlNation(true));
                              dispatch(setSelectedMrlNationIdx(row.NO));
                            }}
                          >
                            수정
                          </Button>
                        </Col>
                      </Row>
                    );
                  },
                },
                {
                  title: <span>진행상태</span>,
                  key: "NO",
                  width: "20%",
                  render: (data, row, index) => {
                    return (
                      <Row justify="space-between" align="middle">
                        <Col xs={18}>
                          <List
                            size="small"
                            dataSource={
                              datasource_reg_modal_mrl_step[row.NO].filter(
                                (data) =>
                                  !(_.isNil(data.DATE) || data.DATE === "")
                              ).length > 0
                                ? [
                                    datasource_reg_modal_mrl_step[row.NO]
                                      .filter(
                                        (data) =>
                                          !(
                                            _.isNil(data.DATE) ||
                                            data.DATE === ""
                                          )
                                      )
                                      .at(-1),
                                  ]
                                : []
                            }
                            locale={{
                              emptyText: (
                                <span style={{ fontSize: "12px" }}>
                                  진행상태를 추가하세요
                                </span>
                              ),
                            }}
                            renderItem={(item) => (
                              <List.Item>
                                <Row style={{ width: "100%" }}>
                                  <Col xs={12} style={{ textAlign: "left" }}>
                                    {item.TITLE}
                                  </Col>
                                  <Col xs={12} style={{ textAlign: "right" }}>
                                    {item.DATE}
                                  </Col>
                                </Row>
                              </List.Item>
                            )}
                          />
                        </Col>
                        <Col xs={2}></Col>
                        <Col xs={4} style={{ textAlign: "right" }}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              dispatch(setIsvisibleRegDrawerMrlStep(true));
                              dispatch(setSelectedMrlStepIdx(row.NO));
                            }}
                          >
                            수정
                          </Button>
                        </Col>
                      </Row>
                    );
                  },
                },
                {
                  title: (
                    <Button
                      size="small"
                      className="button_reg"
                      onClick={() => {
                        dispatch(setIsvisibleRegDrawerFoodName(true));
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  ),
                  align: "center",
                  dataIndex: "",
                  key: "IDX",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row>
                      <Button
                        size="small"
                        className="button_del"
                        onClick={() => {
                          const temp = _.cloneDeep(datasource_reg_modal_mrl);
                          temp[row.NO].DELETE_FLAG = "Y";
                          dispatch(setDatasourceRegModalMrl(temp));
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Row>
                  ),
                },
              ]}
              dataSource={datasource_reg_modal_mrl.filter(
                (data) => data.DELETE_FLAG === "N"
              )}
            ></Table>
          </Card>
        </Modal>
        {isvisible_register_drawer_pesticide_name ? (
          <RegisterDrawerPesticideName />
        ) : (
          <></>
        )}
        {isvisible_register_drawer_food_name ? (
          <RegisterDrawerFoodName />
        ) : (
          <></>
        )}
        {isvisible_register_drawer_mrl_nation ? (
          <RegisterDrawerMrlNation />
        ) : (
          <></>
        )}
        {isvisible_register_drawer_mrl_step ? <RegisterDrawerMrlStep /> : <></>}
      </div>
    );
  }
};

export const RegisterDrawerPesticideName = () => {
  const dispatch = useDispatch();
  const { datasource_reg_modal, isvisible_register_drawer_pesticide_name } =
    useSelector((state) => state.prdPropProp);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=13116", {
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

  if (!isvisible_register_drawer_pesticide_name) {
    return <></>;
  } else {
    return (
      <Drawer
        title="농약명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleRegDrawerPesticideName(false));
        }}
        visible={isvisible_register_drawer_pesticide_name}
        width="40vw"
      >
        <Search
          placeholder="농약명을 입력하세요"
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
              title: "공전번호",
              dataIndex: "PESTICIDE_NUM",
              key: "PESTICIDE_CODE",
              width: "30%",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "PESTICIDE_NUM"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "농약 국문명",
              dataIndex: "PESTICIDE_NAME_KR",
              key: "PESTICIDE_CODE",
              width: "30%",
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
              width: "30%",
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
                    dispatch(
                      setDatasourceRegModal({
                        ...datasource_reg_modal,
                        PESTICIDE_NAME_KR: row.PESTICIDE_NAME_KR,
                        PESTICIDE_NAME_EN: row.PESTICIDE_NAME_KR,
                        PESTICIDE_CODE: row.PESTICIDE_CODE,
                        PESTICIDE_NUM: row.PESTICIDE_NUM,
                        USING_NAME_KR: row.USING_NAME_KR,
                        USING_NAME_KR: row.USING_NUM,
                        USING_NAME_KR: row.USING_NAME_EN,
                        PESTICIDE_ADI: row.ADI_KR,
                        ADI_KR: row.ADI_KR,
                        ADI: row.ADI,
                        ADI_US: row.ADI_US,
                        ADI_JP: row.ADI_JP,
                        ADI_EU: row.ADI_EU,
                        ADI_CN: row.ADI_CN,
                        ADI_AU: row.ADI_AU,
                        ADI_TW: row.ADI_TW,
                      })
                    );
                    dispatch(setIsvisibleRegDrawerPesticideName(false));
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

export const RegisterDrawerFoodName = () => {
  const dispatch = useDispatch();
  const {
    datasource_reg_modal,
    isvisible_register_drawer_food_name,
    datasource_reg_modal_mrl,
    datasource_reg_modal_mrl_nation,
    datasource_reg_modal_mrl_step,
  } = useSelector((state) => state.prdPropProp);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=13117", {
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

  if (!isvisible_register_drawer_food_name) {
    return <></>;
  } else {
    return (
      <Drawer
        title="식품명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleRegDrawerFoodName(false));
        }}
        visible={isvisible_register_drawer_food_name}
        width="40vw"
      >
        <Search
          placeholder="식품명을 입력하세요"
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
              title: "식품 국문명",
              dataIndex: "FOOD_NAME_KR",
              key: "FOOD_CODE",
              width: "30%",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "FOOD_NAME_KR"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "식품 영문명",
              dataIndex: "FOOD_NAME_EN",
              key: "FOOD_CODE",
              width: "30%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "FOOD_NAME_EN"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "식품 섭취량",
              dataIndex: "FOOD_INTAKE",
              key: "FOOD_CODE",
              width: "30%",
              defaultSortOrder: "ascend",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "FOOD_INTAKE"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "FOOD_CODE",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    dispatch(
                      setDatasourceRegModalMrl([
                        ...datasource_reg_modal_mrl,
                        {
                          NO: datasource_reg_modal_mrl.length,
                          FOOD_CODE: row.FOOD_CODE,
                          FOOD_NAME_KR: row.FOOD_NAME_KR,
                          FOOD_NAME_EN: row.FOOD_NAME_EN,
                          FOOD_INTAKE: row.FOOD_INTAKE,
                          KFDA_MRL_VALUE: 0,
                          RDA_MRL_VALUE: 0,
                          DELETE_FLAG: "N",
                        },
                      ])
                    );
                    dispatch(
                      setDatasourceRegModalMrlNation([
                        ...datasource_reg_modal_mrl_nation,
                        [
                          {
                            COUNTRY_CODE: "KR",
                            COUNTRY_NAME: "한국",
                            MRL_VALUE: "",
                          },
                          {
                            COUNTRY_CODE: "CD",
                            COUNTRY_NAME: "코덱스",
                            MRL_VALUE: "",
                          },
                          {
                            COUNTRY_CODE: "US",
                            COUNTRY_NAME: "미국",
                            MRL_VALUE: "",
                          },
                          {
                            COUNTRY_CODE: "JP",
                            COUNTRY_NAME: "일본",
                            MRL_VALUE: "",
                          },
                          {
                            COUNTRY_CODE: "EU",
                            COUNTRY_NAME: "유럽",
                            MRL_VALUE: "",
                          },
                          {
                            COUNTRY_CODE: "CN",
                            COUNTRY_NAME: "중국",
                            MRL_VALUE: "",
                          },
                          {
                            COUNTRY_CODE: "AU",
                            COUNTRY_NAME: "호주",
                            MRL_VALUE: "",
                          },
                          {
                            COUNTRY_CODE: "TW",
                            COUNTRY_NAME: "대만",
                            MRL_VALUE: "",
                          },
                        ],
                      ])
                    );
                    dispatch(
                      setDatasourceRegModalMrlStep([
                        ...datasource_reg_modal_mrl_step,
                        [
                          {
                            KEY: "STEP_1",
                            TITLE: "기준안작성",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_2",
                            TITLE: "위해평가",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_3",
                            TITLE: "잔류농약전문위원회 1차",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_4",
                            TITLE: "행정예고",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_5",
                            TITLE: "잔류농약전문위원회 2차",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_6",
                            TITLE: "식품위생심의위원회",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_7",
                            TITLE: "규제심사",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_8",
                            TITLE: "개정고시",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_LAST",
                            TITLE: "시행시점",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                          {
                            KEY: "STEP_EXCP",
                            TITLE: "제외",
                            BIGO: "",
                            DATE: "",
                            IS_FOCUSED_DATE: false,
                          },
                        ],
                      ])
                    );
                    dispatch(setIsvisibleRegDrawerFoodName(false));
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data.filter((val) => {
            if (val.FOOD_NAME_KR !== null) {
              var word_str = "";
              Hangul.disassemble(val.FOOD_NAME_KR, true).forEach(
                (word, index) => {
                  word_str += word[0];
                }
              );
              return (
                word_str.indexOf(searchKey) !== -1 ||
                Hangul.disassemble(val.FOOD_NAME_KR, true)[0][0].indexOf(
                  searchKey
                ) > -1 ||
                val.FOOD_NAME_KR.indexOf(searchKey) >= 0 ||
                (val.FOOD_NAME_EN !== "" && val.FOOD_NAME_EN !== null
                  ? val.FOOD_NAME_EN.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  : null)
              );
            } else {
              return (
                val.FOOD_NAME_EN.toLowerCase().indexOf(
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

export const RegisterDrawerMrlNation = () => {
  const dispatch = useDispatch();
  const {
    datasource_reg_modal,
    isvisible_register_drawer_mrl_nation,
    datasource_reg_modal_mrl_nation,
    selected_mrl_nation_idx,
  } = useSelector((state) => state.prdPropProp);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  if (!isvisible_register_drawer_mrl_nation) {
    return <></>;
  } else {
    return (
      <Drawer
        title="외국 잔류허용기준"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleRegDrawerMrlNation(false));
        }}
        visible={isvisible_register_drawer_mrl_nation}
        width="30vw"
      >
        <Table
          style={{ marginTop: "5px" }}
          size="small"
          sticky
          bordered
          className="table-search"
          // showHeader={false}
          pagination={false}
          columns={[
            {
              title: "국가명",
              dataIndex: "title_1",
              width: "15%",
              className: "table-title",
            },
            {
              title: "잔류허용기준(mg/kg)",
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
              title_1: "한국",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][0]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    console.log(
                      datasource_reg_modal_mrl_nation[selected_mrl_nation_idx]
                    );
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][0].MRL_VALUE = e.target.value;
                    temp[selected_mrl_nation_idx][0].COUNTRY_NAME = "한국";
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
            {
              title_1: "코덱스",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][1]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][1].MRL_VALUE = e.target.value;
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
            {
              title_1: "미국",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][2]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][2].MRL_VALUE = e.target.value;
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
            {
              title_1: "일본",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][3]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][3].MRL_VALUE = e.target.value;
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
            {
              title_1: "유럽",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][4]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][4].MRL_VALUE = e.target.value;
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
            {
              title_1: "중국",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][5]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][5].MRL_VALUE = e.target.value;
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
            {
              title_1: "호주",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][6]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][6].MRL_VALUE = e.target.value;
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
            {
              title_1: "대만",
              data_1: (
                <Input
                  size="small"
                  value={
                    datasource_reg_modal_mrl_nation[selected_mrl_nation_idx][7]
                      .MRL_VALUE
                  }
                  onChange={(e) => {
                    const temp = _.cloneDeep(datasource_reg_modal_mrl_nation);
                    temp[selected_mrl_nation_idx][7].MRL_VALUE = e.target.value;
                    dispatch(setDatasourceRegModalMrlNation(temp));
                  }}
                ></Input>
              ),
              wide: 1,
            },
          ]}
        />
      </Drawer>
    );
  }
};

export const RegisterDrawerMrlStep = () => {
  const dispatch = useDispatch();
  const {
    datasource_reg_modal,
    isvisible_register_drawer_mrl_step,
    datasource_reg_modal_mrl_step,
    selected_mrl_step_idx,
  } = useSelector((state) => state.prdPropProp);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  if (!isvisible_register_drawer_mrl_step) {
    return <></>;
  } else {
    return (
      <Drawer
        title="진행상태 입력"
        placement="right"
        onClose={() => {
          console.log(datasource_reg_modal_mrl_step);
          dispatch(setIsvisibleRegDrawerMrlStep(false));
        }}
        visible={isvisible_register_drawer_mrl_step}
        width="40vw"
      >
        <Table
          style={{ marginTop: "5px" }}
          size="small"
          sticky
          bordered
          className="table-search"
          // showHeader={false}
          pagination={false}
          columns={[
            {
              title: "진행상태구분",
              dataIndex: "title_1",
              width: "15%",
              className: "table-title",
            },
            {
              title: "처리일자",
              dataIndex: "data_1",
              width: "25%",
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
              title: "비고",
              dataIndex: "title_2",
              width: "60%",
              // className: "table-title",
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
            ...datasource_reg_modal_mrl_step[selected_mrl_step_idx].map(
              (data, idx) => {
                const getDateFormat = (date) => {
                  var d = moment(date);
                  console.log(d, date, d.isValid());
                  return date && d.isValid() ? d : undefined;
                };
                return {
                  title_1: data.TITLE,
                  data_1: (
                    <DatePicker
                      size="small"
                      value={getDateFormat(
                        datasource_reg_modal_mrl_step[selected_mrl_step_idx][
                          idx
                        ].DATE
                      )}
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => {
                        const temp = _.cloneDeep(datasource_reg_modal_mrl_step);
                        temp[selected_mrl_step_idx][idx].DATE = dateString;
                        temp[selected_mrl_step_idx][
                          idx
                        ].IS_FOCUSED_DATE = false;
                        dispatch(setDatasourceRegModalMrlStep(temp));
                      }}
                    />
                  ),
                  title_2: (
                    <Input.TextArea
                      size="small"
                      value={
                        datasource_reg_modal_mrl_step[selected_mrl_step_idx][
                          idx
                        ].BIGO
                      }
                      onChange={(e) => {
                        const temp = _.cloneDeep(datasource_reg_modal_mrl_step);
                        temp[selected_mrl_step_idx][idx].BIGO = e.target.value;
                        dispatch(setDatasourceRegModalMrlStep(temp));
                      }}
                    ></Input.TextArea>
                  ),
                  wide: 0,
                };
              }
            ),
          ]}
        />
      </Drawer>
    );
  }
};

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_modify_modal,
    datasource_reg_modal,
    datasource_reg_modal_mrl,
    isvisible_register_drawer_pesticide_name,
    isvisible_register_drawer_food_name,
    isvisible_register_drawer_mrl_nation,
    isvisible_register_drawer_mrl_step,
    selected_mrl_nation_idx,
    selected_mrl_step_idx,
    datasource_reg_modal_mrl_nation,
    datasource_reg_modal_mrl_step,
  } = useSelector((state) => state.prdPropProp);
  const { userinfo } = useSelector((state) => state.header);
  const xs_title = 5;
  const xs_input = 18;

  const [directInput, setDirectInput] = useState(false);

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
                  console.log("datasource_reg_modal", datasource_reg_modal);
                  console.log(
                    "datasource_reg_modal_mrl",
                    datasource_reg_modal_mrl
                  );
                  console.log(
                    "datasource_reg_modal_mrl_nation",
                    datasource_reg_modal_mrl_nation
                  );
                  console.log(
                    "datasource_reg_modal_mrl_step",
                    datasource_reg_modal_mrl_step
                  );

                  const temp_prop = _.cloneDeep(datasource_reg_modal);
                  const temp_prop_mrl = _.cloneDeep(datasource_reg_modal_mrl);
                  const temp_prop_nation = _.cloneDeep(
                    datasource_reg_modal_mrl_nation
                  );
                  const temp_prop_step = _.cloneDeep(
                    datasource_reg_modal_mrl_step
                  );

                  const promise_prop = new Promise((resolve_prop, reject) => {
                    delete temp_prop.ADI_KR;
                    delete temp_prop.ADI;
                    delete temp_prop.ADI_US;
                    delete temp_prop.ADI_JP;
                    delete temp_prop.ADI_EU;
                    delete temp_prop.ADI_CN;
                    delete temp_prop.ADI_AU;
                    delete temp_prop.ADI_TW;

                    delete temp_prop.PESTICIDE_NAME_KR;
                    delete temp_prop.PESTICIDE_NAME_EN;
                    delete temp_prop.PESTICIDE_NUM;

                    delete temp_prop.USING_NAME_KR;
                    delete temp_prop.USING_NAME_EN;
                    delete temp_prop.USING_NUM;

                    temp_prop.MOD_DATE = moment(new Date()).format(
                      "YYYY-MM-DD"
                    );
                    temp_prop.MOD_USER_ID = userinfo.USERID;

                    temp_prop.TABLE = "T_RESI_PESTICIDE_PROPOSAL";
                    temp_prop.KEY = ["IDX"];
                    temp_prop.NUMERIC_KEY = ["IDX", "FILE_SIZE"];

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({
                        data: customEncrypt([temp_prop]),
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        message.success(
                          "농약제안서 : 제안서 " +
                            (datasource_reg_modal.PESTICIDE_NAME_KR ||
                              datasource_reg_modal.PESTICIDE_NAME_EN) +
                            "를 수정하였습니다."
                        );
                        resolve_prop(1);
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.");
                        resolve_prop(0);
                      }
                    });
                  });

                  const promise_prop_mrl = new Promise(
                    (resolve_prop_mrl, reject) => {
                      fetch("/API/search?TYPE=13119", {
                        method: "GET",
                        credentials: "include",
                      })
                        .then(function (response) {
                          return response.json();
                        })
                        .then((myJson) => {
                          temp_prop_mrl
                            .filter((data) => data.DELETE_FLAG === "N")
                            .forEach((data_mrl_rel, idx) => {
                              data_mrl_rel.TABLE =
                                "T_RESI_PESTICIDE_PROPOSAL_MRL_REL";
                              data_mrl_rel.NUMERIC_KEY = ["IDX", "PROP_IDX"];
                              data_mrl_rel.IDX = myJson[0].MAX + idx;
                              data_mrl_rel.PROP_IDX = datasource_reg_modal.IDX;

                              delete data_mrl_rel.FOOD_NAME_KR;
                              delete data_mrl_rel.FOOD_NAME_EN;
                              delete data_mrl_rel.FOOD_INTAKE;
                              delete data_mrl_rel.NO;
                              delete data_mrl_rel.DELETE_FLAG;

                              const temp_mrl_nation = [];
                              const temp_mrl_step = [];

                              datasource_reg_modal_mrl_nation[idx]
                                .filter(
                                  (data_mrl_nation) =>
                                    data_mrl_nation.MRL_VALUE !== ""
                                )
                                .forEach((data_mrl_nation) => {
                                  temp_mrl_nation.push({
                                    TABLE:
                                      "T_RESI_PESTICIDE_PROPOSAL_NATION_REL",
                                    NUMERIC_KEY: ["PROP_MRL_IDX"],
                                    PROP_MRL_IDX: data_mrl_rel.IDX,
                                    COUNTRY_CODE: data_mrl_nation.COUNTRY_CODE,
                                    MRL_VALUE: data_mrl_nation.MRL_VALUE,
                                  });
                                });

                              const promise_prop_nation_rel = new Promise(
                                (resolve_prop_nation, reject) => {
                                  fetch("/API/delete", {
                                    method: "POST",
                                    body: JSON.stringify({
                                      data: customEncrypt([
                                        {
                                          TABLE:
                                            "T_RESI_PESTICIDE_PROPOSAL_NATION_REL",
                                          KEY: ["PROP_MRL_IDX"],
                                          NUMERIC_KEY: ["PROP_MRL_IDX"],
                                          PROP_MRL_IDX: data_mrl_rel.IDX,
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
                                          data: customEncrypt(temp_mrl_nation),
                                        }),
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        credentials: "include",
                                      }).then(function (response) {
                                        if (response.status === 200) {
                                          message.success(
                                            "농약제안서 : 외국잔류허용기준 " +
                                              temp_mrl_nation.length +
                                              "종을 수정하였습니다."
                                          );
                                          resolve_prop_nation(1);
                                        } else if (response.status === 401) {
                                          message.error("권한이 없습니다.");
                                          resolve_prop_nation(0);
                                        }
                                      });
                                    } else if (response.status === 401) {
                                      message.error("권한이 없습니다.");
                                      resolve_prop_nation(0);
                                    }
                                  });
                                }
                              );

                              if (
                                datasource_reg_modal_mrl_nation[idx].length > 0
                              ) {
                                temp_mrl_step.push({
                                  TABLE: "T_RESI_PESTICIDE_PROPOSAL_STEP_REL",
                                  NUMERIC_KEY: ["PROP_MRL_IDX"],
                                  PROP_MRL_IDX: data_mrl_rel.IDX,

                                  STEP_1_DATE:
                                    datasource_reg_modal_mrl_step[idx][0].DATE,
                                  STEP_1_BIGO:
                                    datasource_reg_modal_mrl_step[idx][0].BIGO,

                                  STEP_2_DATE:
                                    datasource_reg_modal_mrl_step[idx][1].DATE,
                                  STEP_2_BIGO:
                                    datasource_reg_modal_mrl_step[idx][1].BIGO,

                                  STEP_3_DATE:
                                    datasource_reg_modal_mrl_step[idx][2].DATE,
                                  STEP_3_BIGO:
                                    datasource_reg_modal_mrl_step[idx][2].BIGO,

                                  STEP_4_DATE:
                                    datasource_reg_modal_mrl_step[idx][3].DATE,
                                  STEP_4_BIGO:
                                    datasource_reg_modal_mrl_step[idx][3].BIGO,

                                  STEP_5_DATE:
                                    datasource_reg_modal_mrl_step[idx][4].DATE,
                                  STEP_5_BIGO:
                                    datasource_reg_modal_mrl_step[idx][4].BIGO,

                                  STEP_6_DATE:
                                    datasource_reg_modal_mrl_step[idx][5].DATE,
                                  STEP_6_BIGO:
                                    datasource_reg_modal_mrl_step[idx][5].BIGO,

                                  STEP_7_DATE:
                                    datasource_reg_modal_mrl_step[idx][6].DATE,
                                  STEP_7_BIGO:
                                    datasource_reg_modal_mrl_step[idx][6].BIGO,

                                  STEP_8_DATE:
                                    datasource_reg_modal_mrl_step[idx][7].DATE,
                                  STEP_8_BIGO:
                                    datasource_reg_modal_mrl_step[idx][7].BIGO,

                                  STEP_LAST_DATE:
                                    datasource_reg_modal_mrl_step[idx][8].DATE,
                                  STEP_LAST_BIGO:
                                    datasource_reg_modal_mrl_step[idx][8].BIGO,

                                  STEP_EXCP_DATE:
                                    datasource_reg_modal_mrl_step[idx][9].DATE,
                                  STEP_EXCP_BIGO:
                                    datasource_reg_modal_mrl_step[idx][9].BIGO,
                                });
                              }

                              const promise_prop_step_rel = new Promise(
                                (resolve_prop_step, reject) => {
                                  fetch("/API/delete", {
                                    method: "POST",
                                    body: JSON.stringify({
                                      data: customEncrypt([
                                        {
                                          TABLE:
                                            "T_RESI_PESTICIDE_PROPOSAL_STEP_REL",
                                          KEY: ["PROP_MRL_IDX"],
                                          NUMERIC_KEY: ["PROP_MRL_IDX"],
                                          PROP_MRL_IDX: data_mrl_rel.IDX,
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
                                          data: customEncrypt(temp_mrl_step),
                                        }),
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        credentials: "include",
                                      }).then(function (response) {
                                        if (response.status === 200) {
                                          message.success(
                                            "농약제안서 : 진행상태 " +
                                              temp_mrl_step.length +
                                              "종을 수정하였습니다."
                                          );
                                          resolve_prop_step(1);
                                        } else if (response.status === 401) {
                                          message.error("권한이 없습니다.");
                                          resolve_prop_step(0);
                                        }
                                      });
                                    } else if (response.status === 401) {
                                      message.error("권한이 없습니다.");
                                      resolve_prop_step(0);
                                    }
                                  });
                                }
                              );

                              Promise.all([
                                promise_prop_nation_rel,
                                promise_prop_step_rel,
                              ]).then((result) => {
                                resolve_prop_mrl(1);
                              });
                            });

                          fetch("/API/delete", {
                            method: "POST",
                            body: JSON.stringify({
                              data: customEncrypt([
                                {
                                  TABLE: "T_RESI_PESTICIDE_PROPOSAL_MRL_REL",
                                  KEY: ["PROP_IDX"],
                                  NUMERIC_KEY: ["PROP_IDX"],
                                  PROP_IDX: datasource_reg_modal.IDX,
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
                                  data: customEncrypt(temp_prop_mrl),
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                              }).then(function (response) {
                                if (response.status === 200) {
                                  message.success(
                                    "농약제안서 : 잔류허용기준 " +
                                      temp_prop_mrl.length +
                                      "종을 수정하였습니다."
                                  );
                                  resolve_prop_mrl(1);
                                } else if (response.status === 401) {
                                  message.error("권한이 없습니다.");
                                  resolve_prop_mrl(0);
                                }
                              });
                            } else if (response.status === 401) {
                              message.error("권한이 없습니다.");
                              resolve_prop_mrl(0);
                            }
                          });
                        });
                    }
                  );

                  Promise.all([promise_prop, promise_prop_mrl]).then(
                    (result) => {
                      fetch("/API/search?TYPE=13111", {
                        method: "GET",
                        credentials: "include",
                      })
                        .then(function (response) {
                          return response.json();
                        })
                        .then((myJson) => {
                          dispatch(setDataSource(myJson));
                          dispatch(setIsvisibleModModal(false));
                        });
                    }
                  );
                }}
                okText="확인"
                cancelText="취소"
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={
                    (datasource_reg_modal.USING_NAME_KR === undefined ||
                      datasource_reg_modal.USING_NAME_KR === "" ||
                      datasource_reg_modal.USING_NAME_KR === null) &&
                    (datasource_reg_modal.USING_NAME_EN === "" ||
                      datasource_reg_modal.USING_NAME_EN === undefined ||
                      datasource_reg_modal.USING_NAME_EN === null)
                  }
                >
                  등록
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleModModal(false));
                  dispatch(setDatasourceRegModal({}));
                  dispatch(setDatasourceRegModalMrl([]));
                  dispatch(setDatasourceRegModalMrlNation([]));
                  dispatch(setDatasourceRegModalMrlStep([]));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModal(false));
            dispatch(setDatasourceRegModal({}));
            dispatch(setDatasourceRegModalMrl([]));
            dispatch(setDatasourceRegModalMrlNation([]));
            dispatch(setDatasourceRegModalMrlStep([]));
          }}
          width="70vw"
          title={<div>농약용도 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약제안서 수정"
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
                  title_1: "과거자료 여부",
                  data_1: (
                    <Select
                      defaultValue={"N"}
                      style={{ width: "100%" }}
                      size="small"
                      value={datasource_reg_modal.HISTORY_FLAG}
                      onChange={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            HISTORY_FLAG: e,
                          })
                        );
                      }}
                    >
                      <Select.Option value={"N"}>신규제안서</Select.Option>
                      <Select.Option value={"Y"}>과거자료</Select.Option>
                    </Select>
                  ),
                  title_2: "기준제안번호",
                  data_2: (
                    <Input
                      prefix={<span style={{ color: "red" }}>*</span>}
                      size="small"
                      defaultValue={datasource_reg_modal.STD_PROPOSAL_NUM}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            STD_PROPOSAL_NUM: e.target.value,
                          })
                        );
                      }}
                    ></Input>
                  ),
                  wide: 0,
                },
                {
                  title_1: "농약명",
                  data_1: (
                    <Row>
                      <Col xs={22}>
                        <Input
                          prefix={<span style={{ color: "red" }}>*</span>}
                          value={
                            _.isNil(datasource_reg_modal.PESTICIDE_NAME_KR)
                              ? _.isNil(datasource_reg_modal.PESTICIDE_NAME_EN)
                                ? ""
                                : datasource_reg_modal.PESTICIDE_NAME_EN
                              : _.isNil(datasource_reg_modal.PESTICIDE_NAME_EN)
                              ? datasource_reg_modal.PESTICIDE_NAME_KR
                              : datasource_reg_modal.PESTICIDE_NAME_KR +
                                "(" +
                                datasource_reg_modal.PESTICIDE_NAME_EN +
                                ")"
                          }
                          size="small"
                        ></Input>
                      </Col>
                      <Col xs={2} style={{ textAlign: "right" }}>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            dispatch(setIsvisibleRegDrawerPesticideName(true));
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
                  title_1: "공전번호",
                  data_1: <span>{datasource_reg_modal.PESTICIDE_NUM}</span>,
                  title_2: "농약용도",
                  data_2: (
                    <span>
                      {_.isNil(datasource_reg_modal.USING_NAME_KR)
                        ? _.isNil(datasource_reg_modal.USING_NAME_EN)
                          ? ""
                          : datasource_reg_modal.USING_NAME_EN
                        : _.isNil(datasource_reg_modal.USING_NAME_EN)
                        ? datasource_reg_modal.USING_NAME_KR
                        : datasource_reg_modal.USING_NAME_KR +
                          "(" +
                          datasource_reg_modal.USING_NAME_EN +
                          ")"}
                    </span>
                  ),
                  wide: 0,
                },
                {
                  title_1: "ADI",
                  data_1: (
                    <Row>
                      <Col xs={8}>
                        <Input
                          disabled={datasource_reg_modal.ADI_INPUT_TYPE === "N"}
                          size="small"
                          value={datasource_reg_modal.PESTICIDE_ADI}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                PESTICIDE_ADI: e.target.value,
                              })
                            );
                          }}
                        ></Input>
                      </Col>
                      <Col xs={4} style={{ textAlign: "center" }}>
                        <Checkbox
                          checked={
                            datasource_reg_modal.ADI_INPUT_TYPE === "Y"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setDirectInput(e.target.checked);
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                ADI_INPUT_TYPE: e.target.checked ? "Y" : "N",
                              })
                            );
                          }}
                        >
                          직접입력
                        </Checkbox>
                      </Col>
                      <Col xs={12} style={{ textAlign: "right" }}>
                        <Select
                          size="small"
                          disabled={datasource_reg_modal.ADI_INPUT_TYPE === "N"}
                          style={{ width: "100%" }}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                PESTICIDE_ADI: e,
                              })
                            );
                          }}
                        >
                          {[
                            {
                              value: datasource_reg_modal.ADI_KR,
                              name: "한국",
                            },
                            { value: datasource_reg_modal.ADI, name: "코덱스" },
                            {
                              value: datasource_reg_modal.ADI_US,
                              name: "미국",
                            },
                            {
                              value: datasource_reg_modal.ADI_JP,
                              name: "일본",
                            },
                            {
                              value: datasource_reg_modal.ADI_EU,
                              name: "유럽",
                            },
                            {
                              value: datasource_reg_modal.ADI_CN,
                              name: "중국",
                            },
                            {
                              value: datasource_reg_modal.ADI_AU,
                              name: "호주",
                            },
                            {
                              value: datasource_reg_modal.ADI_TW,
                              name: "대만",
                            },
                          ].map((data) => {
                            return (
                              <Select.Option key={data.name} value={data.value}>
                                <Row>
                                  <Col xs={6} style={{ textAlign: "left" }}>
                                    {data.name} :
                                  </Col>
                                  <Col xs={18} style={{ textAlign: "right" }}>
                                    <span style={{ color: "green" }}>
                                      {data.value}
                                    </span>
                                  </Col>
                                </Row>
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                  ),
                  wide: 1,
                },
                {
                  title_1: "1인 1일 섭취허용량",
                  data_1: (
                    <Row>
                      <Col xs={3}>
                        <Input
                          size="small"
                          defaultValue={datasource_reg_modal.INTAKE_MG}
                          onBlur={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                INTAKE_MG: e.target.value,
                              })
                            );
                          }}
                        ></Input>
                      </Col>
                      <Col xs={1} style={{ textAlign: "left" }}>
                        <span style={{ fontStyle: "italic" }}>mg * </span>{" "}
                      </Col>
                      <Col xs={3}>
                        <Input
                          defaultValue={datasource_reg_modal.INTAKE_KG}
                          size="small"
                          onBlur={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                INTAKE_KG: e.target.value,
                              })
                            );
                          }}
                        ></Input>
                      </Col>
                      <Col xs={1} style={{ textAlign: "left" }}>
                        <span style={{ fontStyle: "italic" }}>kg = </span>{" "}
                      </Col>
                      <Col xs={3}>
                        <Input
                          disabled
                          size="small"
                          value={
                            _.isNaN(
                              datasource_reg_modal.INTAKE_KG *
                                datasource_reg_modal.INTAKE_MG
                            )
                              ? 0
                              : datasource_reg_modal.INTAKE_KG *
                                datasource_reg_modal.INTAKE_MG
                          }
                        ></Input>
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
                    ></Input>
                  ),
                  wide: 1,
                },
                {
                  title_1: "비고",
                  data_1: (
                    <Input.TextArea
                      size="small"
                      defaultValue={datasource_reg_modal.BIGO}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            BIGO: e.target.value,
                          })
                        );
                      }}
                    ></Input.TextArea>
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
            title="▣ 농약잔류허용기준(안)"
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
              bordered
              sticky
              pagination={false}
              columns={[
                {
                  title: "식품명",
                  dataIndex: "FOOD_NAME_KR",
                  width: "20%",
                  key: "NO",
                },
                {
                  title: (
                    <span>
                      식품섭취량
                      <br />
                      (g/일)
                    </span>
                  ),
                  dataIndex: "FOOD_INTAKE",
                  key: "NO",
                  width: "10%",
                },
                {
                  title: (
                    <span>
                      농진청 요구안
                      <br />
                      MRL(mg/kg)
                    </span>
                  ),
                  key: "NO",
                  width: "10%",
                  render: (data, row, index) => {
                    return (
                      <Input
                        size="small"
                        defaultValue={
                          datasource_reg_modal_mrl[row.NO].RDA_MRL_VALUE
                        }
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_reg_modal_mrl);
                          temp[row.NO].RDA_MRL_VALUE = e.target.value;
                          dispatch(setDatasourceRegModalMrl(temp));
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: (
                    <span>
                      식약처 검토
                      <br />
                      MRL(mg/kg)
                    </span>
                  ),
                  key: "NO",
                  width: "10%",
                  render: (data, row, index) => {
                    return (
                      <Input
                        size="small"
                        defaultValue={
                          datasource_reg_modal_mrl[row.NO].KFDA_MRL_VALUE
                        }
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_reg_modal_mrl);
                          temp[row.NO].KFDA_MRL_VALUE = e.target.value;
                          dispatch(setDatasourceRegModalMrl(temp));
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: (
                    <span>
                      외국의 농약잔류허용기준
                      <br />
                      MRL(mg/kg)
                    </span>
                  ),
                  key: "NO",
                  width: "25%",
                  render: (data, row, index) => {
                    return (
                      <Row justify="space-between" align="middle">
                        <Col xs={18}>
                          <List
                            size="small"
                            dataSource={datasource_reg_modal_mrl_nation[
                              row.NO
                            ].filter(
                              (data) =>
                                !(
                                  _.isNil(data.MRL_VALUE) ||
                                  data.MRL_VALUE === ""
                                )
                            )}
                            // dataSource={datasource_reg_modal_mrl_nation[row.NO]}
                            locale={{
                              emptyText: (
                                <span style={{ fontSize: "12px" }}>
                                  잔류허용기준을 추가하세요
                                </span>
                              ),
                            }}
                            renderItem={(item) => (
                              <List.Item>
                                <Row style={{ width: "100%" }}>
                                  <Col xs={6} style={{ textAlign: "left" }}>
                                    {item.COUNTRY_NAME}
                                  </Col>
                                  <Col xs={18} style={{ textAlign: "right" }}>
                                    {item.MRL_VALUE}
                                  </Col>
                                </Row>
                              </List.Item>
                            )}
                          />
                        </Col>
                        <Col xs={2}></Col>
                        <Col xs={4} style={{ textAlign: "right" }}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              console.log("asdf");
                              dispatch(setIsvisibleRegDrawerMrlNation(true));
                              dispatch(setSelectedMrlNationIdx(row.NO));
                            }}
                          >
                            수정
                          </Button>
                        </Col>
                      </Row>
                    );
                  },
                },
                {
                  title: <span>진행상태</span>,
                  key: "NO",
                  width: "20%",
                  render: (data, row, index) => {
                    return (
                      <Row justify="space-between" align="middle">
                        <Col xs={18}>
                          <List
                            size="small"
                            dataSource={
                              datasource_reg_modal_mrl_step[row.NO].filter(
                                (data) =>
                                  !(_.isNil(data.DATE) || data.DATE === "")
                              ).length > 0
                                ? [
                                    datasource_reg_modal_mrl_step[row.NO]
                                      .filter(
                                        (data) =>
                                          !(
                                            _.isNil(data.DATE) ||
                                            data.DATE === ""
                                          )
                                      )
                                      .at(-1),
                                  ]
                                : []
                            }
                            // dataSource={datasource_reg_modal_mrl_step[row.NO]}
                            locale={{
                              emptyText: (
                                <span style={{ fontSize: "12px" }}>
                                  진행상태를 추가하세요
                                </span>
                              ),
                            }}
                            renderItem={(item) => (
                              <List.Item>
                                <Row style={{ width: "100%" }}>
                                  <Col xs={12} style={{ textAlign: "left" }}>
                                    {item.TITLE}
                                  </Col>
                                  <Col xs={12} style={{ textAlign: "right" }}>
                                    {item.DATE}
                                  </Col>
                                </Row>
                              </List.Item>
                            )}
                          />
                        </Col>
                        <Col xs={2}></Col>
                        <Col xs={4} style={{ textAlign: "right" }}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              dispatch(setIsvisibleRegDrawerMrlStep(true));
                              dispatch(setSelectedMrlStepIdx(row.NO));
                            }}
                          >
                            수정
                          </Button>
                        </Col>
                      </Row>
                    );
                  },
                },
                {
                  title: (
                    <Button
                      size="small"
                      className="button_reg"
                      onClick={() => {
                        dispatch(setIsvisibleRegDrawerFoodName(true));
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  ),
                  align: "center",
                  dataIndex: "",
                  key: "IDX",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row>
                      <Button
                        size="small"
                        className="button_del"
                        onClick={() => {
                          const temp = _.cloneDeep(datasource_reg_modal_mrl);
                          temp[row.NO].DELETE_FLAG = "Y";
                          dispatch(setDatasourceRegModalMrl(temp));
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Row>
                  ),
                },
              ]}
              dataSource={datasource_reg_modal_mrl.filter(
                (data) => data.DELETE_FLAG === "N"
              )}
            ></Table>
          </Card>
        </Modal>
        {isvisible_register_drawer_pesticide_name ? (
          <RegisterDrawerPesticideName />
        ) : (
          <></>
        )}
        {isvisible_register_drawer_food_name ? (
          <RegisterDrawerFoodName />
        ) : (
          <></>
        )}
        {isvisible_register_drawer_mrl_nation ? (
          <RegisterDrawerMrlNation />
        ) : (
          <></>
        )}
        {isvisible_register_drawer_mrl_step ? <RegisterDrawerMrlStep /> : <></>}
      </div>
    );
  }
};
