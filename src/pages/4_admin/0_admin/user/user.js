import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import crypto from "crypto";
import { CopyToClipboard } from "react-copy-to-clipboard";

// #antd icon
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
} from "@ant-design/icons";

// #antd icon

//components
import Template from "../../../../components/template";
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
  setDatasourceRegDrawer,
  setIsvisibleRegDrawer,
} from "../../../../reducers/admin/AdminAdminUser";
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
import Tag from "antd/es/tag";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";
import { customEncrypt } from "../../../util";

const { Option } = Select;
const { Search } = Input;

export const User = () => {
  const dispatch = useDispatch();
  const {
    dataSource,
    isvisible_search_modal,
    isvisible_modify_modal,
    isvisible_register_modal,
  } = useSelector((state) => state.AdminAdminUser);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  // useEffect 제외
  useEffect(() => {
    fetch("/API/search?TYPE=51111", {
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
          title: "관리자",
          subTitle: "사용자관리",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/admin/user",
              name: "관리자",
            },
            {
              href: "/admin/user",
              name: "사용자관리",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 5,
          defaultActiveKey: 1,
        }}
        //카드
        main_card={{
          title: "사용자 관리",
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
                  <Option value={0}>사용자ID</Option>
                  <Option value={1}>사용자이름</Option>
                </Select>
              </Col>
              <Col xs={21}>
                {[
                  {
                    num: 0,
                    desc: "사용자 ID를 입력하세요",
                  },
                  {
                    num: 1,
                    desc: "사용자 이름을 입력하세요",
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
                return item.USERID;
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
                    return func("USERID");
                    break;
                  case 1:
                    return func("USERNAME");
                    break;
                }
              })}
              columns={[
                {
                  title: "사용자ID",
                  dataIndex: "USERID",
                  key: "USERID",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "USERID"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.USERID}</>;
                  },
                },
                {
                  title: "사용자이름",
                  dataIndex: "USERNAME",
                  key: "USERID",
                  width: "12%",
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
                  title: "업무구분",
                  dataIndex: "WORK_TYPE",
                  key: "USERID",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "WORK_TYPE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "descend",
                  render: (data, row, index) => {
                    switch (row.WORK_TYPE) {
                      case "P":
                        return <Tag color="red">농약</Tag>;
                        break;
                      case "V":
                        return <Tag color="blue">동약</Tag>;
                        break;
                      case "A":
                        return <Tag color="purple">농약/동약</Tag>;
                        break;
                    }
                    return <>{row.WORK_TYPE}</>;
                  },
                },
                {
                  title: "이메일",
                  dataIndex: "EMAIL",
                  key: "USERID",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "EMAIL"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return <>{row.EMAIL}</>;
                  },
                },
                {
                  title: "전화번호",
                  dataIndex: "PHONE",
                  key: "USERID",
                  width: "12%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PHONE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return <>{row.PHONE}</>;
                  },
                },
                {
                  title: "소속",
                  dataIndex: "PROVINCE_NAME",
                  key: "USERID",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PROVINCE_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return <>{row.PROVINCE_NAME}</>;
                  },
                },
                {
                  title: "권한구분",
                  dataIndex: "TEMPLATE_NAME",
                  key: "USERID",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "TEMPLATE_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return <>{row.TEMPLATE_NAME}</>;
                  },
                },
                {
                  title: "비밀번호 변경신청",
                  dataIndex: "TEMPLATE_NAME",
                  key: "USERID",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "TEMPLATE_NAME"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    if (row.CHANGE_PASSWORD_FLAG === 1) {
                      return (
                        <>
                          <Tag color="green">변경중</Tag>
                          <CopyToClipboard
                            text={
                              "https://residue.korea.ac.kr/chpwd/" +
                              row.CHANGE_CODE
                            }
                          >
                            <Button
                              type="link"
                              onClick={() => {
                                message.success("링크가 복사되었습니다.");
                              }}
                            >
                              URL
                            </Button>
                          </CopyToClipboard>
                        </>
                      );
                    } else {
                      return (
                        <Popconfirm
                          title="비밀번호 변경 URL를 생성하시겠습니까?"
                          onConfirm={() => {
                            fetch("/API/insert", {
                              method: "POST",
                              body: JSON.stringify({
                                data: customEncrypt([
                                  {
                                    TABLE: "T_RESI_CHANGE_PASSWORD",
                                    USERID: row.USERID,
                                    CHANGE_CODE: crypto
                                      .randomBytes(64)
                                      .toString("hex"),
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
                                  "비밀번호 변경 신청 : " +
                                    row.USERNAME +
                                    "의 비밀번호 변경 URL을 생성하였습니다."
                                );
                                fetch("/API/search?TYPE=51111", {
                                  method: "GET",
                                  credentials: "include",
                                })
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setDataSource(myJson));
                                  });
                              } else if (response.status === 401) {
                                message.error("권한이 없습니다.");
                              }
                            });
                          }}
                          onCancel={() => {}}
                          okText="생성"
                          cancelText="취소"
                        >
                          <Button type="primary" size="small">
                            신청
                          </Button>
                        </Popconfirm>
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
                            fetch(
                              "/API/search?TYPE=51112&USERID=" + row.USERID,
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
                                        TABLE: "T_RESI_MEMBER",
                                        KEY: ["USERID"],
                                        NUMERIC_KEY: [
                                          "PROVINCE_NUM",
                                          "AUTH_NUM",
                                        ],
                                        USERID: row.USERID,
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
                                      "사용자: " +
                                        row.USERNAME +
                                        "을 삭제하였습니다."
                                    );
                                    fetch("/API/search?TYPE=51111", {
                                      method: "GET",
                                      credentials: "include",
                                    })
                                      .then(function (response) {
                                        return response.json();
                                      })
                                      .then((myJson) => {
                                        dispatch(setDataSource(myJson));
                                      });
                                    resolve(1);
                                  } else if (response.status === 401) {
                                    message.error("권한이 없습니다.");
                                    resolve(0);
                                  }
                                });
                              }
                            );

                            Promise.all([promise_delete]).then((values) => {
                              fetch("/API/search?TYPE=51111", {
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
                  (userinfo.USERID === undefined || userinfo.USER_MOD === "N")
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
      {/* {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>} */}
      {/* {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>} */}
    </div>
  );
};

export default User;
