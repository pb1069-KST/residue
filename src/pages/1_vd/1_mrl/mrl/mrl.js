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
} from "../../../../reducers/vd/VdMrlMrl";
import {
  setSelectedData,
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleSchModalFood,
  setDatasourceModModal,
  setIsvisibleModModalAddInfo,
  setIsvisibleModModalAddInfo2,
} from "../../../../reducers/vd/VdMrlMrl_modal";

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
  "※ 식용동물 등에 대해 『식품의 기준 및 규격』에 별도로 잔류허용기준이 정해지지 아니한 경우 다음 각 항의 기준을 순차적으로 적용한다.",
  "※ 참고 : 동물용의약품의 잔류허용기준에서 따로 식품명이 정해져 있지 않은 식용동물의 부산물(내장, 뼈, 머리, 꼬리, 발, 껍질, 혈액 등 식용이 가능한 부위)의 축산물의 경우 해당동물의 '근육(고기)', 수산물의 경우 '어류'에 준하여 기준을 적용한다.",
];
export const Mrl = () => {
  const dispatch = useDispatch();
  const { dataSource, dataSourceFood } = useSelector((state) => state.VdMrlMrl);

  const {
    isvisible_modify_modal,
    isvisible_modify_modal_add_info,
    isvisible_search_modal,
    isvisible_search_modal_food,
  } = useSelector((state) => state.VdMrlMrl_modal);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  const [add_info, setAdd_info] = useState([]);
  const [add_info2, setAdd_info2] = useState([]);

  const [menuFlag, setMenuFlag] = useState(1);
  const [mrlCount, setMrlCount] = useState(0);

  useEffect(() => {
    fetch("/API/search?TYPE=22111", {
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

    fetch("/API/search?TYPE=22121", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        dispatch(setDataSourceFood(myJson));
      });

    fetch("/API/search?TYPE=22123", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setMrlCount(myJson[0].CNT);
      });

    fetch("/API/search?TYPE=92111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setAdd_info(myJson);
      });

    fetch("/API/search?TYPE=92211", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setAdd_info2(myJson);
      });
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "동물용의약품",
          subTitle: "동물용의약품 잔류허용기준",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/vd/mrl",
              name: "동물용의약품",
            },
            {
              href: "/vd/mrl",
              name: "동물용의약품 잔류허용기준",
            },
            {
              href: "/vd/mrl",
              name: "동물용의약품 잔류허용기준",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 2,
          defaultActiveKey: 1,
        }}
        //카드
        main_card={{
          title: "동물용의약품 잔류허용기준 검색",
        }}
        content_card={
          <div>
            {menuFlag === 1 ? (
              <Search
                placeholder="동물용의약품명을 입력하세요"
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
            <Tabs.TabPane tab="동물용의약품명" key={1}></Tabs.TabPane>
            <Tabs.TabPane tab="식품명" key={2}></Tabs.TabPane>
          </Tabs>
        }
        content={
          <div>
            {menuFlag === 1 ? (
              <>
                {userinfo.VD_MRL_MOD === "Y" ? (
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
                    return item.VDRUG_CODE;
                  }}
                  dataSource={dataSource.filter((val) => {
                    if (val.VDRUG_NAME_KR !== null) {
                      var word_str = "";
                      Hangul.disassemble(val.VDRUG_NAME_KR, true).forEach(
                        (word, index) => {
                          word_str += word[0];
                        }
                      );
                      return (
                        word_str.indexOf(searchKey) !== -1 ||
                        Hangul.disassemble(
                          val.VDRUG_NAME_KR,
                          true
                        )[0][0].indexOf(searchKey) > -1 ||
                        val.VDRUG_NAME_KR.indexOf(searchKey) >= 0 ||
                        (val.VDRUG_NAME_EN !== "" && val.VDRUG_NAME_EN !== null
                          ? val.VDRUG_NAME_EN.toLowerCase().indexOf(
                              searchKey.toLowerCase()
                            ) > -1
                          : null)
                      );
                    } else {
                      return (
                        val.VDRUG_NAME_EN.toLowerCase().indexOf(
                          searchKey.toLowerCase()
                        ) > -1
                      );
                    }
                  })}
                  columns={[
                    {
                      title: "동물용의약품 국문명",
                      dataIndex: "VDRUG_NAME_KR",
                      key: "VDRUG_CODE",
                      width: "35%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "VDRUG_NAME_KR"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      defaultSortOrder: "ascend",
                      render: (data, row, index) => (
                        <Row key={row.VDRUG_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=22112&VDRUG_CODE=" +
                                    row.VDRUG_CODE,
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
                      title: "동물용의약품 영문명",
                      dataIndex: "VDRUG_NAME_EN",
                      key: "VDRUG_CODE",
                      width: "35%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "VDRUG_NAME_EN"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      render: (data, row, index) => (
                        <Row key={row.VDRUG_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=22112&VDRUG_CODE=" +
                                    row.VDRUG_CODE,
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
                      key: "VDRUG_CODE",
                      flag: "등록",
                      width: "7%",
                      render: (data, row, index) => (
                        <Row key={row.VDRUG_CODE}>
                          <Col xs={24}>
                            <Button
                              size="small"
                              className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=22112&VDRUG_CODE=" +
                                    row.VDRUG_CODE,
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
                        <Row key={row.VDRUG_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=22122&FOOD_CODE=" +
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
                          customSorter(a, b, sortOrder, "VDRUG_NAME_EN"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      render: (data, row, index) => (
                        <Row key={row.VDRUG_CODE}>
                          <Col xs={24}>
                            <Button
                              type="link"
                              size="small"
                              // className="button_mod"
                              onClick={() => {
                                fetch(
                                  "/API/search?TYPE=22122&FOOD_CODE=" +
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
                    // {
                    //     title: "",
                    //     align: "center",
                    //     dataIndex: "",
                    //     key: "FOOD_CODE",
                    //     flag: "등록",
                    //     width: "7%",
                    //     render: (data, row, index) =>
                    //         <Row key={row.VDRUG_CODE}>
                    //             <Col xs={24}>
                    //                 <Button
                    //                     size="small"
                    //                     className="button_mod"
                    //                     onClick={() => {
                    //                         fetch('/API/search?TYPE=12112&VDRUG_CODE=' + row.VDRUG_CODE, {
                    //                             method: 'GET',
                    //                             credentials: 'include',
                    //                         }).then(function (response) {
                    //                             console.log(response)
                    //                             return response.json();
                    //                         }).then(myJson => {
                    //                             dispatch(setSelectedData(row))
                    //                             dispatch(setDatasourceModModal(myJson))
                    //                             dispatch(setIsvisibleModModal(true))
                    //                         });
                    //                     }}
                    //                 >
                    //                     <EditOutlined />
                    //                 </Button>
                    //             </Col>
                    //         </Row>,
                    // }
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
                  ▣ 동물용의약품의 잠정기준적용(Applicability of Veterinary Drug
                  MRLs for food in general){" "}
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
                          ></span>{" "}
                          {data}
                        </span>
                        <br />
                      </>
                    ))}
                  </>
                </div>
              </Col>
              <Col>
                <li style={{ fontSize: "13px" }}>① CODEX 기준</li>
                <li style={{ fontSize: "13px" }}>
                  ② 유사 식용동물의 잔류허용기준 중 해당부위의 최저기준. 즉,
                  기준이 정하여지지 아니한 포유류 중 반추동물, 포유류 중
                  비반추동물, 가금류, 어류 및 갑각류는 각각 기준이 정하여진
                  반추동물, 비반추동물, 가금류, 어류, 갑각류 해당 부위의 기준 중
                  최저기준(단, 비반추동물 중 말은 기준이 있는 반추동물에
                  해당하는 기준 적용)
                </li>
                <li style={{ fontSize: "13px" }}>
                  ③ 항생물질 및 합성항균제에 대하여 축·수산물(유, 알 포함) 및
                  벌꿀(로얄젤리, 프로몰리스 포함)의 잔류기준을 0.03 mg/kg으로
                  적용
                </li>
                <li style={{ fontSize: "13px" }}>④ 동물성 원재료 분류</li>
              </Col>
              <Table
                size="small"
                sticky
                showHeader={false}
                dataSource={add_info}
                pagination={false}
                style={{
                  borderTop: "solid 1px green",
                  borderBottom: "solid 1px green",
                }}
                columns={[
                  {
                    title: "CLASS_L",
                    dataIndex: "CLASS_L",
                    width: "15%",
                  },
                  {
                    title: "ITEM",
                    dataIndex: "ITEM",
                    width: "85%",
                  },
                ]}
              />
            </Card>
            <Card
              size="small"
              bordered={false}
              style={{ textAlign: "left" }}
              title={
                <>
                  ▣ 식품중 검출되어서는 아니 되는 물질{" "}
                  {userinfo.VD_MRL_MOD === "Y" ? (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        dispatch(setIsvisibleModModalAddInfo2(true));
                      }}
                    >
                      수정
                    </Button>
                  ) : (
                    <></>
                  )}
                </>
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
                <li style={{ fontSize: "13px", paddingLeft: "10px" }}>
                  ※ 관련법령에서 안전성 및 유효성에 문제가 있는 것으로 확인되어
                  제조 또는 수입 품목허가를 하지 아니하는 동물용의약품(대사물질
                  포함)은 검출되어서는 아니 된다. 이에 해당되는 주요 물질은
                  아래와 같으며, 아래에 명시하지 않은 물질에 대해서도 관련법령에
                  근거하여 본 항을 적용할 수 있다.{" "}
                </li>
              </Col>
              <div style={{ marginBottom: "10px" }}></div>
              <Table
                style={{
                  borderTop: "1px solid green",
                  borderBottom: "1px solid green",
                }}
                size="small"
                sticky
                // showHeader={false}
                bordered
                rowKey={(data) => data.NUM}
                pagination={false}
                columns={[
                  {
                    title: "번호",
                    dataIndex: "CLASS_L",
                    width: "10%",
                    render: (text, row, index) => {
                      return {
                        children: <span>{text}</span>,
                        props: {
                          rowSpan: row.ROW_SPAN,
                        },
                      };
                    },
                  },
                  {
                    title: "식품*1 중 검출되어서는 아니 되는 물질",
                    align: "center",
                    children: [
                      {
                        title: "물질명",
                        dataIndex: "CLASS_S",
                        align: "center",
                        width: "20%",
                      },
                      {
                        title: (
                          <Col style={{ textAlign: "center" }}>
                            잔류물의정의
                          </Col>
                        ),
                        dataIndex: "ITEM",
                        width: "60%",
                        render: (data, row, index) => {
                          return (
                            <span style={{ textAlign: "left" }}>{data}</span>
                          );
                        },
                      },
                    ],
                  },
                ]}
                dataSource={add_info2}
              ></Table>
            </Card>
          </div>
        }
      ></Template>
    </div>
  );
};
