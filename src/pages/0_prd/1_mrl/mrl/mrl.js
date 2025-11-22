import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
import moment from "moment";
import CrytoJS from "crypto-js";
// #antd icon
import { EditOutlined, HomeFilled } from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../../components/template";
//components

//redux
import {
  setDataSource,
  setDataSourceFood,
} from "../../../../reducers/prd/prdMrlMrl";
import {
  setSelectedData,
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleSchModalFood,
  setDatasourceModModal,
  setIsvisibleModModalAddInfo,
} from "../../../../reducers/prd/prdMrlMrl_modal";

//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Popconfirm from "antd/es/popconfirm";
import Drawer from "antd/es/drawer";
import message from "antd/es/message";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
// import Select from "antd/es/select"
import Switch from "antd/es/switch";
import DatePicker from "antd/es/date-picker";
import Tabs from "antd/es/tabs";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Divider } from "antd";
import { customEncrypt, CustomInput } from "../../../../components/util";
// import { setIsvisibleModDrawerStdName } from "../../../reducers/std/StdStandardStatus_modal";

const { Search, TextArea } = Input;
// const { Option } = Select;
const statuteList = [
  "농산물의 농약 잔류허용기준은 [별표 4]와 같다. 단, 개별 기준과 그룹 기준이 있을 경우에는 개별 기준을 우선 적용한다.",
  "농산물에 잔류한 농약에 대하여 [별표 4]에 별도로 잔류허용기준을 정하지 않는 경우 0.01 mg/kg이하를 적용한다.",
];
export const Mrl = () => {
  const dispatch = useDispatch();
  const { dataSource, dataSourceFood } = useSelector(
    (state) => state.prdMrlMrl
  );
  const {
    isvisible_modify_modal,
    isvisible_modify_modal_add_info,
    isvisible_search_modal,

    isvisible_search_modal_food,
  } = useSelector((state) => state.prdMrlMrl_modal);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  const [add_info, setAdd_info] = useState([]);
  const [menuFlag, setMenuFlag] = useState(1);

  const [mrlCount, setMrlCount] = useState(0);

  useEffect(() => {
    fetch("/API/search?TYPE=12111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSource(myJson));
      });

    fetch("/API/search?TYPE=12121", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSourceFood(myJson));
      });
    fetch("/API/search?TYPE=12123", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setMrlCount(myJson[0].CNT);
      });

    fetch("/API/search?TYPE=91111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setAdd_info(myJson);
      });
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "농약",
          subTitle: "농약잔류허용기준",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/mrl",
              name: "농약",
            },
            {
              href: "/prd/mrl",
              name: "잔류허용기준",
            },
            {
              href: "/prd/mrl",
              name: "농약잔류허용기준",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 1,
          defaultActiveKey: 1,
        }}
        //카드
        main_card={{
          title: "농약잔류허용기준 검색",
        }}
        content_card={
          <div>
            {menuFlag === 1 ? (
              <Search
                placeholder="농약명을 입력하세요"
                enterButton
                onSearch={(e) => {
                  setSearchKey(e);
                }}
              />
            ) : (
              <Search
                placeholder="식품명을 입력하세요"
                enterButton
                onSearch={(e) => {
                  setSearchKey(e);
                }}
              />
            )}
          </div>
        }
        content_header={
          <Tabs
            defaultActiveKey={2}
            onChange={(e) => {
              setMenuFlag(parseInt(e, 10));
            }}
          >
            <Tabs.TabPane tab="농약명" key={1}></Tabs.TabPane>
            <Tabs.TabPane tab="식품명" key={2}></Tabs.TabPane>
          </Tabs>
        }
        content={
          <div>
            {menuFlag === 1 ? (
              <>
                {userinfo.PRD_MRL_MOD === "Y" ? (
                  <Row>
                    <Col
                      style={{
                        textAlign: "right",
                        width: "100%",
                        color: "#808080",
                      }}
                    >
                      <span>▣ 등록된 잔류허용기준 : {mrlCount}건</span>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}

                <Table
                  size="small"
                  sticky
                  bordered
                  rowKey={(item) => {
                    return item.PESTICIDE_CODE;
                  }}
                  dataSource={dataSource.filter((val) => {
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
                  })}
                  columns={[
                    {
                      title: "농약 국문명",
                      dataIndex: "PESTICIDE_NAME_KR",
                      key: "PESTICIDE_CODE",
                      width: "35%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      defaultSortOrder: "ascend",
                      render: (data, row, index) => (
                        <Row key={row.PESTICIDE_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=12112&PESTICIDE_CODE=" +
                                    row.PESTICIDE_CODE,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setSelectedData(row));
                                    dispatch(setDatasourceModModal(myJson));
                                    dispatch(setIsvisibleSchModal(true));
                                  });
                              }}
                            >
                              {data}
                            </Button>
                          </Col>
                        </Row>
                      ),
                    },
                    {
                      title: "농약 영문명",
                      dataIndex: "PESTICIDE_NAME_EN",
                      key: "PESTICIDE_CODE",
                      width: "35%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      render: (data, row, index) => (
                        <Row key={row.PESTICIDE_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=12112&PESTICIDE_CODE=" +
                                    row.PESTICIDE_CODE,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    console.log(response);
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setSelectedData(row));
                                    dispatch(setDatasourceModModal(myJson));
                                    dispatch(setIsvisibleSchModal(true));
                                  });
                              }}
                            >
                              {data}
                            </Button>
                          </Col>
                        </Row>
                      ),
                    },
                    {
                      title: "",
                      align: "center",
                      dataIndex: "",
                      key: "PESTICIDE_CODE",
                      flag: "등록",
                      width: "7%",
                      render: (data, row, index) => (
                        <Row key={row.PESTICIDE_CODE}>
                          <Col xs={24}>
                            <Button
                              size="small"
                              className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=12112&PESTICIDE_CODE=" +
                                    row.PESTICIDE_CODE,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    myJson = myJson.map((obj) => ({
                                      ...obj,
                                      IS_NEW: "N",
                                      IS_DELETE: "N",
                                    }));
                                    myJson = myJson.map(
                                      ({ IS_EXPANDED: _, ...rest }) => rest
                                    );
                                    myJson = myJson.map(
                                      ({ IS_MODIFIED: _, ...rest }) => rest
                                    );
                                    dispatch(setSelectedData(row));
                                    dispatch(setDatasourceModModal(myJson));
                                    dispatch(setIsvisibleModModal(true));
                                  });
                              }}
                            >
                              <EditOutlined />
                            </Button>
                          </Col>
                        </Row>
                      ),
                    },
                  ].filter((data) => {
                    if (
                      data.flag === "등록" &&
                      (userinfo.USERID === undefined ||
                        userinfo.PRD_MRL_MOD === "N")
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  })}
                ></Table>
              </>
            ) : (
              <>
                <Table
                  size="small"
                  sticky
                  bordered
                  rowKey={(item) => {
                    return item.FOOD_CODE;
                  }}
                  dataSource={dataSourceFood.filter((val) => {
                    if (val.FOOD_NAME_KR !== null) {
                      var word_str = "";
                      Hangul.disassemble(val.FOOD_NAME_KR, true).forEach(
                        (word, index) => {
                          word_str += word[0];
                        }
                      );
                      return (
                        word_str.indexOf(searchKey) !== -1 ||
                        Hangul.disassemble(
                          val.FOOD_NAME_KR,
                          true
                        )[0][0].indexOf(searchKey) > -1 ||
                        val.FOOD_NAME_KR.indexOf(searchKey) >= 0 ||
                        (val.FOOD_NAME_EN !== "" && val.FOOD_NAME_EN !== null
                          ? val.FOOD_NAME_EN.toLowerCase().indexOf(
                              searchKey.toLowerCase()
                            ) > -1
                          : null)
                      );
                    } else {
                      // return true
                      return (
                        val.FOOD_NAME_EN.toLowerCase().indexOf(
                          searchKey.toLowerCase()
                        ) > -1
                      );
                    }
                  })}
                  columns={[
                    {
                      title: "식품 국문명",
                      dataIndex: "FOOD_NAME_KR",
                      key: "FOOD_CODE",
                      width: "35%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "FOOD_NAME_KR"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      defaultSortOrder: "ascend",
                      render: (data, row, index) => (
                        <Row key={row.PESTICIDE_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=12122&FOOD_CODE=" +
                                    row.FOOD_CODE,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    console.log(response);
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setSelectedData(row));
                                    dispatch(setDatasourceModModal(myJson));
                                    dispatch(setIsvisibleSchModalFood(true));
                                  });
                              }}
                            >
                              {data}
                            </Button>
                          </Col>
                        </Row>
                      ),
                    },
                    {
                      title: "식품 영문명",
                      dataIndex: "FOOD_NAME_EN",
                      key: "FOOD_NAME_EN",
                      width: "35%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      render: (data, row, index) => (
                        <Row key={row.PESTICIDE_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=12122&FOOD_CODE=" +
                                    row.FOOD_CODE,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    console.log(response);
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setSelectedData(row));
                                    dispatch(setDatasourceModModal(myJson));
                                    dispatch(setIsvisibleSchModalFood(true));
                                  });
                              }}
                            >
                              {data}
                            </Button>
                          </Col>
                        </Row>
                      ),
                    },
                  ].filter((data) => {
                    if (
                      data.flag === "등록" &&
                      (userinfo.USERID === undefined ||
                        userinfo.PRD_MRL_MOD === "N")
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  })}
                ></Table>
              </>
            )}
            <Card
              size="small"
              bordered={false}
              style={{ textAlign: "left" }}
              title={
                <div>
                  ▣ 농산물의 농약 잔류허용기준 적용{" "}
                  {userinfo.USERID === undefined ||
                  userinfo.PRD_MRL_MOD === "N" ? (
                    <></>
                  ) : (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        dispatch(setIsvisibleModModalAddInfo(true));
                      }}
                    >
                      수정
                    </Button>
                  )}
                </div>
              }
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
              <Col xs={24} style={{ border: "1px #d0d0d0", color: "#767676" }}>
                <span style={{ fontSize: "13px", paddingLeft: "10px" }}>
                  ◎ 관련 법령: 「식품의 기준 및 규격」의 제2. 3. 7) 농약의
                  잔류허용기준{" "}
                </span>
              </Col>
              <div style={{ marginBottom: "10px" }}></div>
              <Col
                xs={24}
                style={{ border: "1px dashed #d0d0d0", background: "#fafafa" }}
              >
                <div style={{ paddingBottom: "5px !important" }}>
                  <>
                    {statuteList.map((data) => (
                      <>
                        <span
                          style={{
                            fontSize: "13px",
                            paddingLeft: "10px",
                            color: "#767676",
                          }}
                        >
                          <span
                            style={{ fontSize: "10px", fontWeight: "bold" }}
                          >
                            ·
                          </span>{" "}
                          {data}
                        </span>
                        <br />
                      </>
                    ))}
                  </>
                </div>
              </Col>
              <div style={{ marginBottom: "10px" }}></div>
              <Table
                size="small"
                sticky
                bordered
                pagination={false}
                columns={[
                  {
                    title: "대분류",
                    dataIndex: "CLASS_L",
                    render: (text, row, index) => {
                      return {
                        children: <span>{text}</span>,
                        props: {
                          rowSpan: row.ROW_SPAN,
                        },
                      };
                    },
                    width: "20%",
                  },
                  {
                    title: "소분류",
                    dataIndex: "CLASS_S",
                    width: "20%",
                  },
                  {
                    title: "품목",
                    dataIndex: "ITEM",
                    width: "60%",
                  },
                ]}
                dataSource={add_info}
              ></Table>
            </Card>
          </div>
        }
      ></Template>
    </div>
  );
};
