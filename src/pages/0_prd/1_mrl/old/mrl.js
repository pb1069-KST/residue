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
  setIsvisibleModModal,
  setIsvisibleSchModal,
  setIsvisibleSchModalFood,
  setDatasourceModModal,

  // setIsvisibleModDrawerReg,
  setIsvisibleModDrawerMod,
  setSelectedModalData,
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

function getCurrentKoreanDateTime() {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");
  const hours = String(koreaTime.getHours()).padStart(2, "0");
  const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
  const seconds = String(koreaTime.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

const statuteList = [
  "농산물의 농약 잔류허용기준은 [별표 4]와 같다. 단, 개별 기준과 그룹 기준이 있을 경우에는 개별 기준을 우선 적용한다.",
  "농산물에 잔류한 농약에 대하여 [별표 4]에 별도로 잔류허용기준을 정하지 않는 경우 0.01 mg/kg이하를 적용한다.",
];

function Mrl() {
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

  useEffect(() => {
    fetch("/API/search?TYPE=12111", {
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

    fetch("/API/search?TYPE=12121", {
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
                                    console.log(response);
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    myJson = myJson.map((obj) => ({
                                      ...obj,
                                      IS_NEW: "N",
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
                    // {
                    //     title: "",
                    //     align: "center",
                    //     dataIndex: "",
                    //     key: "FOOD_CODE",
                    //     flag: "등록",
                    //     width: "7%",
                    //     render: (data, row, index) =>
                    //         <Row key={row.PESTICIDE_CODE}>
                    //             <Col xs={24}>
                    //                 <Button
                    //                     size="small"
                    //                     className="button_mod"
                    //                     onClick={() => {
                    //                         fetch('/API/search?TYPE=12112&PESTICIDE_CODE=' + row.PESTICIDE_CODE, {
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
      {isvisible_search_modal ? <SearchModal></SearchModal> : <></>}
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
      {isvisible_modify_modal_add_info ? (
        <ModifyModalAddInfo></ModifyModalAddInfo>
      ) : (
        <></>
      )}

      {isvisible_search_modal_food ? (
        <SearchModalFood></SearchModalFood>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Mrl;

export const SearchModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_search_modal,
    datasource_mod_modal,
    selected_data,
    isvisible_modify_drawer_mod,
  } = useSelector((state) => state.prdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  if (!isvisible_search_modal) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_search_modal}
          footer={<></>}
          onCancel={() => {
            dispatch(setIsvisibleSchModal(false));
            dispatch(setDatasourceModModal([]));
          }}
          width="80vw"
          title={
            <div>농약잔류허용기준 조회 : {selected_data.PESTICIDE_NAME_KR}</div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약잔류허용기준 조회"
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
            <Search
              placeholder="식품명을 입력하세요"
              style={{ marginBottom: "10px" }}
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />

            <Table
              sticky
              bordered
              size="small"
              rowKey={(item) => {
                return item.NO;
              }}
              pagination={false}
              dataSource={datasource_mod_modal
                .filter((data) => data.IS_DELETE !== "Y")
                .filter((val) => {
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
              columns={[
                {
                  title: "국가",
                  dataIndex: "COUNTRY_CODE",
                  key: "NO",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "COUNTRY_CODE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultFilteredValue: ["KR"],
                  // filters: [
                  //     {
                  //         text: '한국',
                  //         value: 'KR',
                  //     },
                  //     // {
                  //     //     text: '코덱스',
                  //     //     value: 'CD',
                  //     // },
                  //     // {
                  //     //     text: '미국',
                  //     //     value: 'US',
                  //     // },
                  //     // {
                  //     //     text: '유럽',
                  //     //     value: 'EU',
                  //     // },
                  //     // {
                  //     //     text: '중국',
                  //     //     value: 'CN',
                  //     // },
                  //     // {
                  //     //     text: '일본',
                  //     //     value: 'JP',
                  //     // },
                  //     // {
                  //     //     text: '호주',
                  //     //     value: 'AU',
                  //     // },
                  //     // {
                  //     //     text: '대만',
                  //     //     value: 'TW',
                  //     // },
                  //     // {
                  //     //     text: '메뉴얼',
                  //     //     value: 'PM',
                  //     // },
                  // ],
                  onFilter: (value, record) => value === record.COUNTRY_CODE,
                  render: (data, row, index) => {
                    return (
                      <>
                        {
                          [
                            {
                              text: "한국",
                              value: "KR",
                            },
                            {
                              text: "코덱스",
                              value: "CD",
                            },
                            {
                              text: "미국",
                              value: "US",
                            },
                            {
                              text: "유럽",
                              value: "EU",
                            },
                            {
                              text: "중국",
                              value: "CN",
                            },
                            {
                              text: "일본",
                              value: "JP",
                            },
                            {
                              text: "호주",
                              value: "AU",
                            },
                            {
                              text: "대만",
                              value: "TW",
                            },
                            {
                              text: "메뉴얼",
                              value: "PM",
                            },
                          ].filter((fdata) => fdata.value === data)[0].text
                        }
                      </>
                    );
                  },
                },
                {
                  title: "식품명",
                  dataIndex: "FOOD_NAME_KR",
                  key: "NO",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "FOOD_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  // render: (data, row, index) => {
                  //     return (
                  //         <Row>
                  //             <Col xs={18}><>{data !== '' ? <>{data}({row.FOOD_NAME_EN})</> : <>{row.FOOD_NAME_EN}</>}</></Col>
                  //             <Col xs={6}><Button type="primary" size="small"
                  //                 onClick={()=>{
                  //                     dispatch(setIsvisibleModDrawerMod(true))
                  //                     dispatch(setSelectedModalData(row))
                  //                 }}
                  //             >조회</Button></Col>
                  //         </Row>

                  //     )
                  // }
                },
                {
                  title: "MRL",
                  dataIndex: "MRL_VALUE",
                  key: "NO",
                  width: "5%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "MRL_VALUE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  // render: (data, row, index) => {
                  //     return (
                  //         <Input
                  //             defaultValue={row.MRL_VALUE}
                  //             size="small"
                  //             onBlur={(e) => {
                  //                 const temp = _.cloneDeep(datasource_mod_modal)
                  //                 temp[row.NO].MRL_VALUE = e.target.value
                  //                 dispatch(setDatasourceModModal(temp))
                  //             }}
                  //         ></Input>
                  //     )
                  // }
                },
                {
                  title: "시행시점",
                  dataIndex: "LAUNCH_POINT",
                  key: "NO",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "LAUNCH_POINT"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  // render: (data, row, index) => {
                  //     return (
                  //         <DatePicker
                  //             size="small"
                  //             value={moment(datasource_mod_modal[row.NO].LAUNCH_POINT, 'YYYY-MM-DD')}
                  //             style={{ width: "100%" }}
                  //             onChange={(date, dateString) => {
                  //                 const temp = _.cloneDeep(datasource_mod_modal)
                  //                 temp[row.NO].LAUNCH_POINT = dateString
                  //                 dispatch(setDatasourceModModal(temp))
                  //             }} />
                  //     )
                  // }
                },
                // {
                //     title: "기타류 여부",
                //     dataIndex: "ETC_FLAG",
                //     key: "NO",
                //     width: "6%",
                //     sorter: {
                //         compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "ETC_FLAG")),
                //     },
                //     showSorterTooltip: false,
                //     sortDirections: ['ascend', 'descend', 'ascend'],
                //     render: (data, row, index) => {
                //         return (
                //             <Switch
                //                 checked={data === 'N' ? false : true}
                //                 // onChange={(e) => {
                //                 //     const temp = _.cloneDeep(datasource_mod_modal)
                //                 //     temp[row.NO].ETC_FLAG = e ? 'Y' : 'N'
                //                 //     dispatch(setDatasourceModModal(temp))
                //                 // }}
                //                 checkedChildren={"Y"}
                //                 unCheckedChildren={"N"}
                //             />

                //         )
                //     }
                // },
                // {
                //     title: "폐기여부",
                //     dataIndex: "DISCARD_FLAG",
                //     key: "NO",
                //     width: "6%",
                //     sorter: {
                //         compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "DISCARD_FLAG")),
                //     },
                //     showSorterTooltip: false,
                //     sortDirections: ['ascend', 'descend', 'ascend'],
                //     render: (data, row, index) => {
                //         return (
                //             <Switch
                //                 checked={data === 'N' ? false : true}
                //                 // onChange={(e) => {
                //                 //     const temp = _.cloneDeep(datasource_mod_modal)
                //                 //     temp[row.NO].DISCARD_FLAG = e ? 'Y' : 'N'
                //                 //     dispatch(setDatasourceModModal(temp))
                //                 // }}
                //                 checkedChildren={"Y"}
                //                 unCheckedChildren={"N"}
                //             />
                //         )
                //     }
                // },
                {
                  title: "비고",
                  dataIndex: "BIGO",
                  key: "NO",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "BIGO"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <TextArea
                        defaultValue={row.BIGO}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].BIGO = e.target.value;
                          dispatch(setDatasourceModModal(temp));
                        }}
                      ></TextArea>
                    );
                  },
                },
                // {
                //     title: <Button
                //         size="small"
                //         type="link"
                //         onClick={() => {
                //             const temp = _.cloneDeep(datasource_mod_modal)
                //             dispatch(setDatasourceModModal([...temp, {
                //                 BIGO: null,
                //                 COUNTRY_CODE: 'KR',
                //                 DISCARD_FLAG: 'N',
                //                 ETC_FLAG: 'N',
                //                 FOOD_CODE: null,
                //                 FOOD_NAME_EN: "undefined",
                //                 FOOD_NAME_KR: "#미정",
                //                 FOOTNOTE_REF: null,
                //                 LAUNCH_POINT: "1900-01-01",
                //                 MRL_VALUE: "",
                //                 NO: datasource_mod_modal.length,
                //                 PESTICIDE_CODE: selected_data.PESTICIDE_CODE,
                //                 QUALIFICATION: null,
                //                 IS_DELETE: "N",
                //             },
                //             ]))
                //         }}
                //     >
                //         +
                //     </Button>,
                //     width: "7%",
                //     align: "center",
                //     render: (data, row, index) => {
                //         return (
                //             <Row justify="space-around">
                //                 <Col xl={24} align="middle">
                //                     <Button
                //                         size="small"
                //                         type="link"
                //                         style={{color:"red"}}
                //                         onClick={() => {
                //                             const temp = _.cloneDeep(datasource_mod_modal)
                //                             temp[row.NO].IS_DELETE='Y'
                //                             dispatch(setDatasourceModModal(temp))
                //                         }}
                //                     >
                //                         -
                //                     </Button>
                //                 </Col>
                //             </Row>
                //         )
                //     }
                // }
              ]}
            />
          </Card>
        </Modal>
        {/* {isvisible_modify_drawer_mod?<ModifyDrawer/>:<></>} */}
      </div>
    );
  }
};

export const SearchModalFood = () => {
  const dispatch = useDispatch();
  const {
    isvisible_search_modal_food,
    datasource_mod_modal,
    selected_data,
    isvisible_modify_drawer_mod,
  } = useSelector((state) => state.prdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  if (!isvisible_search_modal_food) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_search_modal_food}
          footer={<></>}
          onCancel={() => {
            dispatch(setIsvisibleSchModalFood(false));
            dispatch(setDatasourceModModal([]));
          }}
          width="80vw"
          title={
            <div>농약잔류허용기준 조회 : {selected_data.FOOD_NAME_KR}</div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약잔류허용기준 조회"
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
            <Search
              placeholder="농약명을 입력하세요"
              style={{ marginBottom: "10px" }}
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />

            <Table
              sticky
              bordered
              size="small"
              rowKey={(item) => {
                return item.NO;
              }}
              pagination={false}
              dataSource={datasource_mod_modal.filter((val) => {
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
                  title: "국가",
                  dataIndex: "COUNTRY_CODE",
                  key: "NO",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "COUNTRY_CODE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultFilteredValue: ["KR"],
                  // filters: [
                  //     {
                  //         text: '한국',
                  //         value: 'KR',
                  //     },
                  // ],
                  onFilter: (value, record) => value === record.COUNTRY_CODE,
                  render: (data, row, index) => {
                    return (
                      <>
                        {
                          [
                            {
                              text: "한국",
                              value: "KR",
                            },
                            {
                              text: "코덱스",
                              value: "CD",
                            },
                            {
                              text: "미국",
                              value: "US",
                            },
                            {
                              text: "유럽",
                              value: "EU",
                            },
                            {
                              text: "중국",
                              value: "CN",
                            },
                            {
                              text: "일본",
                              value: "JP",
                            },
                            {
                              text: "호주",
                              value: "AU",
                            },
                            {
                              text: "대만",
                              value: "TW",
                            },
                            {
                              text: "메뉴얼",
                              value: "PM",
                            },
                          ].filter((fdata) => fdata.value === data)[0].text
                        }
                      </>
                    );
                  },
                },
                {
                  title: "농약 국문명",
                  dataIndex: "PESTICIDE_NAME_KR",
                  key: "NO",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  // render: (data, row, index) => {
                  //     return (
                  //         <Row>
                  //             <Col xs={18}><>{data !== '' ? <>{data}({row.FOOD_NAME_EN})</> : <>{row.FOOD_NAME_EN}</>}</></Col>
                  //             <Col xs={6}><Button type="primary" size="small"
                  //                 onClick={()=>{
                  //                     dispatch(setIsvisibleModDrawerMod(true))
                  //                     dispatch(setSelectedModalData(row))
                  //                 }}
                  //             >조회</Button></Col>
                  //         </Row>

                  //     )
                  // }
                },
                {
                  title: "MRL",
                  dataIndex: "MRL_VALUE",
                  key: "NO",
                  width: "5%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "MRL_VALUE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  // render: (data, row, index) => {
                  //     return (
                  //         <Input
                  //             defaultValue={row.MRL_VALUE}
                  //             size="small"
                  //             onBlur={(e) => {
                  //                 const temp = _.cloneDeep(datasource_mod_modal)
                  //                 temp[row.NO].MRL_VALUE = e.target.value
                  //                 dispatch(setDatasourceModModal(temp))
                  //             }}
                  //         ></Input>
                  //     )
                  // }
                },
                {
                  title: "시행시점",
                  dataIndex: "LAUNCH_POINT",
                  key: "NO",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "LAUNCH_POINT"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  // render: (data, row, index) => {
                  //     return (
                  //         <DatePicker
                  //             size="small"
                  //             value={moment(datasource_mod_modal[row.NO].LAUNCH_POINT, 'YYYY-MM-DD')}
                  //             style={{ width: "100%" }}
                  //             onChange={(date, dateString) => {
                  //                 const temp = _.cloneDeep(datasource_mod_modal)
                  //                 temp[row.NO].LAUNCH_POINT = dateString
                  //                 dispatch(setDatasourceModModal(temp))
                  //             }} />
                  //     )
                  // }
                },
                // {
                //     title: "기타류 여부",
                //     dataIndex: "ETC_FLAG",
                //     key: "NO",
                //     width: "6%",
                //     sorter: {
                //         compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "ETC_FLAG")),
                //     },
                //     showSorterTooltip: false,
                //     sortDirections: ['ascend', 'descend', 'ascend'],
                //     render: (data, row, index) => {
                //         return (
                //             <Switch
                //                 checked={data === 'N' ? false : true}
                //                 // onChange={(e) => {
                //                 //     const temp = _.cloneDeep(datasource_mod_modal)
                //                 //     temp[row.NO].ETC_FLAG = e ? 'Y' : 'N'
                //                 //     dispatch(setDatasourceModModal(temp))
                //                 // }}
                //                 checkedChildren={"Y"}
                //                 unCheckedChildren={"N"}
                //             />

                //         )
                //     }
                // },
                // {
                //   title: "폐기여부",
                //   dataIndex: "DISCARD_FLAG",
                //   key: "NO",
                //   width: "6%",
                //   sorter: {
                //     compare: (a, b, sortOrder) =>
                //       customSorter(a, b, sortOrder, "DISCARD_FLAG"),
                //   },
                //   showSorterTooltip: false,
                //   sortDirections: ["ascend", "descend", "ascend"],
                //   render: (data, row, index) => {
                //     return (
                //       <Switch
                //         checked={data === "N" ? false : true}
                //         // onChange={(e) => {
                //         //     const temp = _.cloneDeep(datasource_mod_modal)
                //         //     temp[row.NO].DISCARD_FLAG = e ? 'Y' : 'N'
                //         //     dispatch(setDatasourceModModal(temp))
                //         // }}
                //         checkedChildren={"Y"}
                //         unCheckedChildren={"N"}
                //       />
                //     );
                //   },
                // },
                {
                  title: "비고",
                  dataIndex: "BIGO",
                  key: "NO",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "BIGO"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};

function compareArrays(array1, array2) {
  const changes = [];

  array1.forEach((item1) => {
    const item2 = array2.find((i) => i.NO === item1.NO);
    if (item2) {
      const changedFields = [];

      ["MRL_VALUE", "LAUNCH_POINT", "ETC_FLAG", "BIGO"].forEach((field) => {
        if (item1[field] !== item2[field]) {
          changedFields.push({
            field,
            oldValue: item1[field],
            newValue: item2[field],
          });
        }
      });

      if (changedFields.length > 0) {
        changes.push({
          PESTICIDE_NAME_KR: item1.FOOD_NAME_KR,
          changes: changedFields,
        });
      }
    }
  });

  return changes;
}

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_modify_modal,
    datasource_mod_modal,
    selected_data,
    isvisible_modify_drawer_mod,
  } = useSelector((state) => state.prdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);
  const [DS_ORG, setDS_ORG] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [isvisibleCheckModal, setIsvisibleCheckModal] = useState(false);

  const [modifiedData, setModifiedData] = useState([]);

  useEffect(() => {
    setDS_ORG(datasource_mod_modal);
  }, [dispatch]);

  if (!isvisible_modify_modal) {
    return <></>;
  } else {
    // setDS_ORG(datasource_mod_modal);
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
                  var insertData = _.cloneDeep(datasource_mod_modal);
                  var insertDataORG = _.cloneDeep(DS_ORG);
                  // insertData = insertData.map((obj) => ({
                  //   ...obj,
                  //   TABLE: "T_RESI_PESTICIDE_MRL",
                  // }));

                  // insertData = insertData.map(({ NO: _, ...rest }) => rest);
                  // insertData = insertData.map(
                  //   ({ FOOD_NAME_KR, FOOD_NAME_EN, ...rest }) => rest
                  // );
                  // insertDataORG = insertDataORG.map(
                  //   ({ FOOD_NAME_KR, FOOD_NAME_EN, ...rest }) => rest
                  // );

                  var exists_data = insertData.filter(
                    (obj) => obj.IS_NEW === "N"
                  );
                  var new_data = insertData.filter((obj) => obj.IS_NEW === "Y");

                  // const data = compareArrays(insertDataORG, exists_data);
                  // console.log(data);

                  var encInsertData = customEncrypt(insertData);
                  fetch("/API/modifyMRL", {
                    method: "POST",
                    body: JSON.stringify({ data: encInsertData }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }).then(function (response) {
                    if (response.status === 200) {
                    } else if (response.status === 401) {
                    }
                  });
                }}
                okText="수정"
                cancelText="취소"
              >
                <Button type="primary" size="small">
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
          width="80vw"
          title={
            <div>농약잔류허용기준 수정 : {selected_data.PESTICIDE_NAME_KR}</div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약잔류허용기준 수정"
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
            <Search
              placeholder="식품명을 입력하세요"
              style={{ marginBottom: "10px" }}
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />
            {/* <Row>
              <Col xs={24} style={{ textAlign: "right" }}>
                <Button
                  style={{ padding: "0px" }}
                  type="link"
                  onClick={() => {
                    setIsvisibleCheckModal(true);
                    var insertData = _.cloneDeep(datasource_mod_modal);
                    var insertDataORG = _.cloneDeep(DS_ORG);

                    var exists_data = insertData.filter(
                      (obj) => obj.IS_NEW === "N"
                    );
                    var new_data = insertData.filter(
                      (obj) => obj.IS_NEW === "Y"
                    );

                    const data = compareArrays(insertDataORG, exists_data);
                    setModifiedData(data);
                  }}
                >
                  변경사항 확인
                </Button>
              </Col>
            </Row> */}
            <Drawer
              title="변경사항 요약"
              open={isvisibleCheckModal}
              visible={isvisibleCheckModal}
              // closable={true}
              onClose={() => {
                setIsvisibleCheckModal(false);
              }}
              width={800}
            >
              <Table
                columns={[
                  {
                    title: "농약명",
                    dataIndex: "PESTICIDE_NAME_KR",
                    key: "NO",
                    width: "20%",
                    sorter: {
                      compare: (a, b, sortOrder) =>
                        customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                    },
                    showSorterTooltip: false,
                    sortDirections: ["ascend", "descend", "ascend"],
                  },
                  {
                    title: "항목",
                    dataIndex: "changes",
                    render: (data, row, index) => {
                      console.log(data, row);
                      return <></>;
                    },
                  },
                  {
                    title: "변경 전",
                  },
                  {
                    title: "변경 후",
                  },
                ]}
                dataSource={modifiedData}
                rowKey="NO"
              />
            </Drawer>

            <Table
              sticky
              bordered
              size="small"
              rowKey={(item) => {
                return item.NO;
              }}
              pagination={false}
              dataSource={datasource_mod_modal
                .filter((data) => data.IS_DELETE !== "Y")
                .filter((val) => {
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
              columns={[
                {
                  title: "국가",
                  dataIndex: "COUNTRY_CODE",
                  key: "NO",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "COUNTRY_CODE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultFilteredValue: ["KR"],
                  filters: [
                    {
                      text: "한국",
                      value: "KR",
                    },
                    // {
                    //     text: '코덱스',
                    //     value: 'CD',
                    // },
                    // {
                    //     text: '미국',
                    //     value: 'US',
                    // },
                    // {
                    //     text: '유럽',
                    //     value: 'EU',
                    // },
                    // {
                    //     text: '중국',
                    //     value: 'CN',
                    // },
                    // {
                    //     text: '일본',
                    //     value: 'JP',
                    // },
                    // {
                    //     text: '호주',
                    //     value: 'AU',
                    // },
                    // {
                    //     text: '대만',
                    //     value: 'TW',
                    // },
                    // {
                    //     text: '메뉴얼',
                    //     value: 'PM',
                    // },
                  ],
                  onFilter: (value, record) => value === record.COUNTRY_CODE,
                  render: (data, row, index) => {
                    return (
                      <>
                        {
                          [
                            {
                              text: "한국",
                              value: "KR",
                            },
                            {
                              text: "코덱스",
                              value: "CD",
                            },
                            {
                              text: "미국",
                              value: "US",
                            },
                            {
                              text: "유럽",
                              value: "EU",
                            },
                            {
                              text: "중국",
                              value: "CN",
                            },
                            {
                              text: "일본",
                              value: "JP",
                            },
                            {
                              text: "호주",
                              value: "AU",
                            },
                            {
                              text: "대만",
                              value: "TW",
                            },
                            {
                              text: "메뉴얼",
                              value: "PM",
                            },
                          ].filter((fdata) => fdata.value === data)[0].text
                        }
                      </>
                    );
                  },
                },
                {
                  title: "식품명",
                  dataIndex: "FOOD_NAME_KR",
                  key: "NO",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "FOOD_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <Row>
                        <Col xs={24}>
                          <>
                            {data !== "" ? (
                              <>
                                {data} ({row.FOOD_NAME_EN})
                              </>
                            ) : (
                              <>{row.FOOD_NAME_EN}</>
                            )}
                          </>
                        </Col>
                        {/* <Col xs={6}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              dispatch(setIsvisibleModDrawerMod(true));
                              dispatch(setSelectedModalData(row));
                            }}
                          >
                            조회
                          </Button>
                        </Col> */}
                      </Row>
                    );
                  },
                },
                {
                  title: "MRL",
                  dataIndex: "MRL_VALUE",
                  key: "NO",
                  width: "5%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "MRL_VALUE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <Input
                        defaultValue={row.MRL_VALUE}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].MRL_VALUE = e.target.value;
                          dispatch(setDatasourceModModal(temp));
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: "시행시점",
                  dataIndex: "LAUNCH_POINT",
                  key: "NO",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "LAUNCH_POINT"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <DatePicker
                        size="small"
                        value={moment(
                          datasource_mod_modal[row.NO].LAUNCH_POINT,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].LAUNCH_POINT = dateString;
                          dispatch(setDatasourceModModal(temp));
                        }}
                      />
                    );
                  },
                },
                {
                  title: "기타류 여부",
                  dataIndex: "ETC_FLAG",
                  key: "NO",
                  width: "6%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ETC_FLAG"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <Switch
                        checked={data === "N" ? false : true}
                        onChange={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].ETC_FLAG = e ? "Y" : "N";
                          dispatch(setDatasourceModModal(temp));
                        }}
                        checkedChildren={"Y"}
                        unCheckedChildren={"N"}
                      />
                    );
                  },
                },
                // {
                //   title: "폐기여부",
                //   dataIndex: "DISCARD_FLAG",
                //   key: "NO",
                //   width: "6%",
                //   sorter: {
                //     compare: (a, b, sortOrder) =>
                //       customSorter(a, b, sortOrder, "DISCARD_FLAG"),
                //   },
                //   showSorterTooltip: false,
                //   sortDirections: ["ascend", "descend", "ascend"],
                //   render: (data, row, index) => {
                //     return (
                //       <Switch
                //         checked={data === "N" ? false : true}
                //         onChange={(e) => {
                //           const temp = _.cloneDeep(datasource_mod_modal);
                //           temp[row.NO].DISCARD_FLAG = e ? "Y" : "N";
                //           dispatch(setDatasourceModModal(temp));
                //         }}
                //         checkedChildren={"Y"}
                //         unCheckedChildren={"N"}
                //       />
                //     );
                //   },
                // },
                {
                  title: "비고",
                  dataIndex: "BIGO",
                  key: "NO",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "BIGO"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <Input
                        defaultValue={row.BIGO}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].BIGO = e.target.value;
                          dispatch(setDatasourceModModal(temp));
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => {
                        dispatch(setIsvisibleModDrawerMod(true));
                      }}
                    >
                      +
                    </Button>
                  ),
                  width: "7%",
                  align: "center",
                  render: (data, row, index) => {
                    return (
                      <Row justify="space-around">
                        <Col xl={24} align="middle">
                          <Button
                            size="small"
                            type="link"
                            style={{ color: "red" }}
                            onClick={() => {
                              const temp = _.cloneDeep(datasource_mod_modal);
                              temp[row.NO].IS_DELETE = "Y";
                              dispatch(setDatasourceModModal(temp));
                            }}
                          >
                            -
                          </Button>
                        </Col>
                      </Row>
                    );
                  },
                },
              ]}
            />
          </Card>
        </Modal>
        {isvisible_modify_drawer_mod ? <ModifyDrawer /> : <></>}
      </div>
    );
  }
};
export const ModifyModalAddInfo = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal_add_info } = useSelector(
    (state) => state.prdMrlMrl_modal
  );

  const { customSorter } = useSelector((state) => state.util);
  const [searchKey, setSearchKey] = useState("");

  const [datasource_mod_modal, setDatasourceModModal] = useState([]);

  useEffect(() => {
    fetch("/API/search?TYPE=91111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        setDatasourceModModal(myJson);
      });
  }, []);

  if (!isvisible_modify_modal_add_info) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_modify_modal_add_info}
          footer={
            <div>
              <Popconfirm
                title="수정하시겠습니까?"
                onCancel={() => {
                  dispatch(setIsvisibleModModalAddInfo(false));
                  setDatasourceModModal([]);
                }}
                onConfirm={() => {
                  fetch("/API/search?TYPE=91112", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((max) => {
                      const MAX = parseInt(max[0].MAX, 10);

                      const temp = _.cloneDeep(
                        datasource_mod_modal.filter(
                          (data) => data.IS_DELETE === "N"
                        )
                      );

                      temp.forEach((data, index) => {
                        delete data.NO;
                        delete data.IS_DELETE;

                        data.TABLE =
                          "T_RESI_PESTICIDE_MRL_ADDITIONAL_INFORMATION";
                        data.NUMERIC_KEY = ["NUM", "ROW_SPAN"];
                        data.NUM = MAX + index + 1;
                      });

                      if (temp.length === 0) {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: temp }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            fetch("/API/search?TYPE=91111", {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setIsvisibleModModalAddInfo(false));
                                setDatasourceModModal(myJson);
                              });
                          } else if (response.status === 401) {
                            dispatch(setIsvisibleModModalAddInfo(false));
                            setDatasourceModModal([]);
                          }
                        });
                      } else {
                        console.log(temp);
                        fetch("/API/delete", {
                          method: "POST",
                          body: JSON.stringify({
                            data: [
                              {
                                TABLE:
                                  "T_RESI_PESTICIDE_MRL_ADDITIONAL_INFORMATION",
                                KEY: ["DELETE_ALL"],
                                DELETE_ALL: "N",
                              },
                            ],
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            fetch("/API/insert", {
                              method: "POST",
                              body: JSON.stringify({ data: temp }),
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }).then(function (response) {
                              console.log(response);
                              if (response.status === 200) {
                                fetch("/API/search?TYPE=91111", {
                                  method: "GET",
                                  credentials: "include",
                                })
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(
                                      setIsvisibleModModalAddInfo(false)
                                    );
                                    setDatasourceModModal(myJson);
                                  });
                              } else if (response.status === 401) {
                                dispatch(setIsvisibleModModalAddInfo(false));
                                setDatasourceModModal([]);
                              }
                            });
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                          }
                        });
                      }
                    });
                }}
                okText="수정"
                cancelText="취소"
              >
                <Button type="primary" size="small">
                  수정
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleModModalAddInfo(false));
                  setDatasourceModModal([]);
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModalAddInfo(false));
            setDatasourceModModal([]);
          }}
          width="60vw"
          title={<div>농약잔류허용기준 추가정보 수정</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약잔류허용기준 수정"
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
              sticky
              bordered
              size="small"
              pagination={false}
              rowKey={(row) => row.NO}
              dataSource={datasource_mod_modal.filter(
                (data) => data.IS_DELETE === "N"
              )}
              columns={[
                {
                  title: "대분류",
                  dataIndex: "CLASS_L",
                  key: "NO",
                  width: "15%",
                  render: (data, row, index) => {
                    return (
                      <Input
                        defaultValue={row.CLASS_L}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[parseInt(row.NO, 10)].CLASS_L = e.target.value;
                          setDatasourceModModal(temp);
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: "소분류",
                  dataIndex: "CLASS_S",
                  key: "NO",
                  width: "15%",
                  render: (data, row, index) => {
                    return (
                      <Input
                        defaultValue={row.CLASS_S}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[parseInt(row.NO, 10)].CLASS_S = e.target.value;
                          setDatasourceModModal(temp);
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: "품목",
                  dataIndex: "ITEM",
                  key: "NO",
                  width: "60%",
                  render: (data, row, index) => {
                    return (
                      <TextArea
                        defaultValue={row.ITEM}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[parseInt(row.NO, 10)].ITEM = e.target.value;
                          setDatasourceModModal(temp);
                        }}
                      ></TextArea>
                    );
                  },
                },
                {
                  title: "#",
                  dataIndex: "ITEM",
                  key: "NO",
                  width: "10%",
                  render: (data, row, index) => {
                    return (
                      <Input
                        defaultValue={row.ROW_SPAN}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[parseInt(row.NO, 10)].ROW_SPAN = e.target.value;
                          setDatasourceModModal(temp);
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => {
                        const temp = _.cloneDeep(datasource_mod_modal);
                        setDatasourceModModal([
                          ...temp,
                          {
                            CLASS_L: "",
                            CLASS_S: "",
                            ITEM: "",
                            ROW_SPAN: 1,
                            NO: datasource_mod_modal.length,
                            IS_DELETE: "N",
                          },
                        ]);
                      }}
                    >
                      +
                    </Button>
                  ),
                  width: "7%",
                  align: "center",
                  render: (data, row, index) => {
                    return (
                      <Row justify="space-around">
                        <Col xl={24} align="middle">
                          <Button
                            size="small"
                            type="link"
                            style={{ color: "red" }}
                            onClick={() => {
                              const temp = _.cloneDeep(datasource_mod_modal);
                              temp[parseInt(row.NO, 10)].IS_DELETE = "Y";
                              setDatasourceModModal(temp);
                            }}
                          >
                            -
                          </Button>
                        </Col>
                      </Row>
                    );
                  },
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};

export const ModifyDrawer = () => {
  const dispatch = useDispatch();
  const {
    datasource_mod_modal,
    isvisible_modify_drawer_mod,
    selected_modal_data,
    selected_data,
  } = useSelector((state) => state.prdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [existFoodcode, setExistFoodCode] = useState([]);

  useEffect(() => {
    fetch("/API/search?TYPE=12113", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setModify_drawer_data(myJson);
      });
    // console.log(modify_drawer_data);
    // //   {
    // //     "FOOD_NAME_KR": "농산물",
    // //     "FOOD_NAME_EN": "Agricultural products",
    // //     "FOOD_CODE": "ap100000002"
    // // }
    setExistFoodCode(datasource_mod_modal.map((obj) => obj.FOOD_CODE));
    // console.log(datasource_mod_modal.map((obj) => obj.FOOD_CODE));
  }, []);

  if (!isvisible_modify_drawer_mod) {
    return <></>;
  } else {
    return (
      <Drawer
        title="식품명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleModDrawerMod(false));
        }}
        visible={isvisible_modify_drawer_mod}
        width="30vw"
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
              width: "40%",
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
              width: "40%",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "FOOD_NAME_EN"),
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
                    console.log(datasource_mod_modal);

                    dispatch(setIsvisibleModDrawerMod(false));
                    const temp = _.cloneDeep(datasource_mod_modal);
                    dispatch(
                      setDatasourceModModal([
                        ...temp,
                        {
                          BIGO: "",
                          COUNTRY_CODE: "KR",
                          DISCARD_FLAG: "N",
                          ETC_FLAG: "N",
                          FOOD_CODE: data.FOOD_CODE,
                          FOOD_NAME_EN: data.FOOD_NAME_EN,
                          FOOD_NAME_KR: data.FOOD_NAME_KR,
                          FOOTNOTE_REF: null,
                          LAUNCH_POINT: getCurrentKoreanDateTime(),
                          REG_DATE: getCurrentKoreanDateTime(),
                          MRL_VALUE: "",
                          NO: datasource_mod_modal.length,
                          PESTICIDE_CODE: selected_data.PESTICIDE_CODE,
                          QUALIFICATION: null,
                          IS_NEW: "Y",
                          STEP: "",
                        },
                      ])
                    );
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data
            .filter((obj) => !existFoodcode.includes(obj.FOOD_CODE))
            .filter((val) => {
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
