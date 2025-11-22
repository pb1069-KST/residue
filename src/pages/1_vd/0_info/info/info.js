import React, { useEffect, useRef, useState } from "react";
import Hangul, { search } from "hangul-js";
import _ from "lodash";
import CryptoJS from "crypto-js";
import axios from "axios";
import {
  customEncrypt,
  CustomSearchPromise,
} from "../../../../components/util";
// #antd icon
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
  CloseOutlined,
} from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../../components/template";
//components

//redux
import {
  setDataSource,
  setIsvisibleSchModal,
  setDatasourceSchModal,
  setDatasourceSchModalMrl,
  setIsvisibleRegModal,
  setDatasourceRegModal,
  setIsvisibleModModal,
  setDatasourceModModal,
  setDatasourceModModalOrg,
  setUsingArray,
} from "../../../../reducers/vd/VdInfoInfo";
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
import Select from "antd/es/select";
// import Switch from "antd/es/switch";

// #antd lib

import { useSelector, useDispatch } from "react-redux";

const { Search, TextArea } = Input;
// const { Option } = Select;

export const Info = () => {
  const dispatch = useDispatch();
  const {
    dataSource,
    isvisible_search_modal,
    isvisible_register_modal,
    isvisible_modify_modal,
  } = useSelector((state) => state.VdInfoInfo);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  // const [usingArray, setUsingArray] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetch_21111 = await CustomSearchPromise("21111");
        const result = [fetch_21111];
        dispatch(setDataSource(result[0]));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        Header_bottom={{
          title: "동물용의약품",
          subTitle: "동물용의약품 정보",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/vd/info",
              name: "동물용의약품",
            },
            {
              href: "/vd/info",
              name: "동물용의약품 정보",
            },
            {
              href: "/vd/info",
              name: "동물용의약품 정보",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 2,
          defaultActiveKey: 0,
        }}
        //카드
        main_card={{
          title: "동물용의약품 검색",
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
                  <Select.Option value={0}>동물용의약품명</Select.Option>
                </Select>
              </Col>
              <Col xs={21}>
                {
                  <Search
                    placeholder="동물용의약품명을 입력하세요"
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                }
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
                return item.VDRUG_CODE;
              }}
              dataSource={dataSource.filter((val) => {
                if (searchFlag === 0) {
                  if (val.VDRUG_NAME_KR !== null) {
                    var word_str = "";
                    Hangul.disassemble(val.VDRUG_NAME_KR, true).forEach(
                      (word, index) => {
                        word_str += word[0];
                      }
                    );
                    return (
                      word_str.indexOf(searchKey) !== -1 ||
                      Hangul.disassemble(val.VDRUG_NAME_KR, true)[0][0].indexOf(
                        searchKey
                      ) > -1 ||
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
                } else {
                  if (val.VDRUG_NUM !== null) {
                    Hangul.disassemble(val.VDRUG_NUM, true).forEach(
                      (word, index) => {
                        word_str += word[0];
                      }
                    );
                    return (
                      word_str.indexOf(searchKey) !== -1 ||
                      Hangul.disassemble(val.VDRUG_NUM, true)[0][0].indexOf(
                        searchKey
                      ) > -1 ||
                      val.VDRUG_NUM.indexOf(searchKey) >= 0 ||
                      (val.VDRUG_NUM !== "" && val.VDRUG_NUM !== null
                        ? val.VDRUG_NUM.toLowerCase().indexOf(
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
                //   dataIndex: "VDRUG_NUM",
                //   key: "VDRUG_CODE",
                //   width: "10%",
                //   sorter: {
                //     compare: (a, b, sortOrder) =>
                //       customSorter(a, b, sortOrder, "VDRUG_NUM"),
                //   },
                //   showSorterTooltip: false,
                //   sortDirections: ["ascend", "descend", "ascend"],
                //   defaultSortOrder: "ascend",
                // },
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
                  render: (data, row, index) => (
                    <a
                      onClick={() => {
                        const promise_datasource_search_modal = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=21112&VDRUG_CODE=" +
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
                                console.log(myJson[0]);
                                dispatch(setDatasourceSchModal(myJson[0]));
                                resolve(1);
                              });
                          }
                        );
                        const promise_datasource_search_modal_mrl = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=21113&VDRUG_CODE=" +
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
                                dispatch(setDatasourceSchModalMrl(myJson));
                                resolve(1);
                              });
                          }
                        );
                        Promise.all([
                          promise_datasource_search_modal,
                          promise_datasource_search_modal_mrl,
                        ]).then((result) => {
                          dispatch(setIsvisibleSchModal(true));
                        });
                      }}
                    >
                      {data}
                    </a>
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
                    <a
                      onClick={() => {
                        const promise_datasource_search_modal = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=21112&VDRUG_CODE=" +
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
                                console.log(myJson[0]);
                                dispatch(setDatasourceSchModal(myJson[0]));
                                resolve(1);
                              });
                          }
                        );

                        const promise_datasource_search_modal_mrl = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=21113&VDRUG_CODE=" +
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
                                // console.log(myJson);
                                dispatch(setDatasourceSchModalMrl(myJson));
                                resolve(1);
                              });
                          }
                        );

                        Promise.all([
                          promise_datasource_search_modal,
                          promise_datasource_search_modal_mrl,
                        ]).then((result) => {
                          dispatch(setIsvisibleSchModal(true));
                        });
                      }}
                    >
                      {data}
                    </a>
                  ),
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
                              "/API/search?TYPE=21112&VDRUG_CODE=" +
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
                                dispatch(setDatasourceModModal(myJson[0]));
                                dispatch(setDatasourceModModalOrg(myJson[0]));
                                dispatch(setIsvisibleModModal(true));
                              });

                            fetch("/API/search?TYPE=21114", {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setUsingArray(myJson));
                              });
                          }}
                        >
                          <EditOutlined />
                        </Button>
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
                                        TABLE: "T_RESI_PESTICIDE",
                                        KEY: ["VDRUG_CODE"],
                                        NUMERIC_KEY: [""],
                                        VDRUG_CODE: row.VDRUG_CODE,
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
                                      "농약정보: <" +
                                        (row.VDRUG_NAME_KR ||
                                          row.VDRUG_NAME_EN) +
                                        "> 을 삭제하였습니다."
                                    );
                                    resolve(1);
                                  } else if (response.status === 401) {
                                    message.success(
                                      "농약정보: <" +
                                        (row.VDRUG_NAME_KR ||
                                          row.VDRUG_NAME_EN) +
                                        "> 을 삭제하지 못했습니다."
                                    );
                                    resolve(0);
                                  }
                                });
                              }
                            );

                            Promise.all([promise_delete]).then((values) => {
                              fetch("/API/search?TYPE=11111", {
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
                    userinfo.PRD_INFO_MOD === "N")
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
    </div>
  );
};

export default Info;
