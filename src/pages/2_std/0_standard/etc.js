import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
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
import {
  setDataSource,
  setDataSource2,
  setDataSource3,
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setIsvisibleModModal2,
  setIsvisibleRegModal2,
  setIsvisibleModModal3,
  setIsvisibleRegModal3,
  setDatasourceSchModal,
  setDatasourceRegModal,
  setDatasourceModModal,
  setDatasourceSchModal2,
  setDatasourceRegModal2,
  setDatasourceModModal2,
  setDatasourceSchModal3,
  setDatasourceRegModal3,
  setDatasourceModModal3,
  setDatasourceRegDrawer,
  setIsvisibleRegDrawer,
} from "../../../reducers/std/StdStandardEtc";
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
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch, Tabs } from "antd";
import { render } from "@testing-library/react";
import { customEncrypt } from "../../util";

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

function Etc() {
  const dispatch = useDispatch();
  const {
    dataSource,
    dataSource2,
    dataSource3,
    isvisible_search_modal,
    isvisible_modify_modal,
    isvisible_register_modal,
    isvisible_register_modal2,
    isvisible_modify_modal2,
    isvisible_register_modal3,
    isvisible_modify_modal3,
  } = useSelector((state) => state.StdStandardEtc);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  const [contentType, setContentType] = useState("1");

  // useEffect 제외
  useEffect(() => {
    fetch("/API/search?TYPE=31411", {
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

  useEffect(() => {
    fetch("/API/search?TYPE=31421", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSource2(myJson));
      });
  }, [dispatch]);

  useEffect(() => {
    fetch("/API/search?TYPE=31431", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSource3(myJson));
      });
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "표준품",
          subTitle: "기타 관리",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/std/std_input",
              name: "표준품",
            },
            {
              href: "/std/std_input",
              name: "기타 관리",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 3,
          defaultActiveKey: 1,
        }}
        content_header={
          <Tabs
            defaultActiveKey="1"
            onChange={(e) => {
              setContentType(e);
            }}
          >
            <TabPane tab="제조회사 관리" key="1"></TabPane>
            <TabPane tab="상태 관리" key="2"></TabPane>
            <TabPane tab="단위 관리" key="3"></TabPane>
          </Tabs>
        }
        //카드
        main_card={
          {
            1: { title: "제조회사 관리" },
            2: { title: "상태 관리" },
            3: { title: "단위 관리" },
          }[contentType]
        }
        content_card={
          {
            1: (
              <Row>
                <Col xs={24}>
                  <Search
                    placeholder="제조회사명을 입력하세요"
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                </Col>
              </Row>
            ),
            2: (
              <Row>
                <Col xs={24}>
                  <Search
                    placeholder="상태명을 입력하세요"
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                </Col>
              </Row>
            ),
            3: (
              <Row>
                <Col xs={24}>
                  <Search
                    placeholder="단위명을 입력하세요"
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                </Col>
              </Row>
            ),
          }[contentType]
        }
        content={
          {
            1: (
              <div>
                <Table
                  size="small"
                  sticky
                  bordered
                  rowKey={(item) => {
                    return item.COMPANY_NUM;
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
                    return func("COMPANY_NAME");
                  })}
                  columns={[
                    {
                      title: "구분",
                      dataIndex: "GUBUN",
                      key: "PROVINCE_NUM",
                      width: "12%",
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
                      title: "제조회사명",
                      dataIndex: "PROVINCE_NAME",
                      key: "PROVINCE_NUM",
                      width: "12%",
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
                                  "/API/search?TYPE=31412&COMPANY_NUM=" +
                                    row.COMPANY_NUM,
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
                                            TABLE: "T_RESI_COMPANY",
                                            KEY: ["COMPANY_NUM"],
                                            NUMERIC_KEY: ["COMPANY_NUM"],
                                            COMPANY_NUM: row.COMPANY_NUM,
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
                                          "제조회사: 1건을 삭제하였습니다."
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
                                  fetch("/API/search?TYPE=31411", {
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
            ),
            2: (
              <div>
                <Table
                  size="small"
                  sticky
                  bordered
                  rowKey={(item) => {
                    return item.STATUS_NUM;
                  }}
                  dataSource={dataSource2.filter((val) => {
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
                    return func("STATUS_NAME");
                  })}
                  columns={[
                    {
                      title: "구분",
                      dataIndex: "GUBUN",
                      key: "PROVINCE_NUM",
                      width: "12%",
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
                      title: "상태명",
                      dataIndex: "STATUS_NAME",
                      key: "STATUS_NUM",
                      width: "12%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "STATUS_NAME"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      render: (data, row, index) => {
                        return <>{row.STATUS_NAME}</>;
                      },
                    },
                    {
                      title: (
                        <Button
                          size="small"
                          className="button_reg"
                          onClick={() => {
                            dispatch(setIsvisibleRegModal2(true));
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
                                  "/API/search?TYPE=31422&STATUS_NUM=" +
                                    row.STATUS_NUM,
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
                                    dispatch(setDatasourceModModal2(myJson[0]));
                                    dispatch(setIsvisibleModModal2(true));
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
                                            TABLE: "T_RESI_STATUS",
                                            KEY: ["STATUS_NUM"],
                                            NUMERIC_KEY: ["STATUS_NUM"],
                                            STATUS_NUM: row.STATUS_NUM,
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
                                          "상태관리: 1건을 삭제하였습니다."
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
                                  fetch("/API/search?TYPE=31421", {
                                    method: "GET",
                                    credentials: "include",
                                  })
                                    .then(function (response) {
                                      return response.json();
                                    })
                                    .then((myJson) => {
                                      dispatch(setDataSource2(myJson));
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
            ),
            3: (
              <div>
                <Table
                  size="small"
                  sticky
                  bordered
                  rowKey={(item) => {
                    return item.UNIT_NUM;
                  }}
                  dataSource={dataSource3.filter((val) => {
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
                    return func("UNIT_NAME");
                  })}
                  columns={[
                    {
                      title: "구분",
                      dataIndex: "GUBUN",
                      key: "UNIT_NUM",
                      width: "12%",
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
                      title: "단위명",
                      dataIndex: "UNIT_NAME",
                      key: "UNIT_NUM",
                      width: "12%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "UNIT_NAME"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      render: (data, row, index) => {
                        return <>{row.UNIT_NAME}</>;
                      },
                    },
                    {
                      title: (
                        <Button
                          size="small"
                          className="button_reg"
                          onClick={() => {
                            dispatch(setIsvisibleRegModal3(true));
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
                                  "/API/search?TYPE=31432&UNIT_NUM=" +
                                    row.UNIT_NUM,
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
                                    dispatch(setDatasourceModModal3(myJson[0]));
                                    dispatch(setIsvisibleModModal3(true));
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
                                            TABLE: "T_RESI_UNIT",
                                            KEY: ["UNIT_NUM"],
                                            NUMERIC_KEY: ["UNIT_NUM"],
                                            UNIT_NUM: row.UNIT_NUM,
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
                                          "단위관리: 1건을 삭제하였습니다."
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
                                  fetch("/API/search?TYPE=31431", {
                                    method: "GET",
                                    credentials: "include",
                                  })
                                    .then(function (response) {
                                      return response.json();
                                    })
                                    .then((myJson) => {
                                      dispatch(setDataSource3(myJson));
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
            ),
          }[contentType]
        }
      ></Template>
      {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>}
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
      {isvisible_register_modal2 ? <RegisterModal2></RegisterModal2> : <></>}
      {isvisible_modify_modal2 ? <ModifyModal2></ModifyModal2> : <></>}
      {isvisible_register_modal3 ? <RegisterModal3></RegisterModal3> : <></>}
      {isvisible_modify_modal3 ? <ModifyModal3></ModifyModal3> : <></>}
    </div>
  );
}

export default Etc;

//제조회사 등록
export const RegisterModal = () => {
  const dispatch = useDispatch();
  const { isvisible_register_modal, datasource_reg_modal } = useSelector(
    (state) => state.StdStandardEtc
  ); //수정
  const xs_title = 7;
  const xs_input = 16;

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
                  fetch("/API/search?TYPE=31413", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((data) => {
                      var promise_using = new Promise((resolve, reject) => {
                        datasource_reg_modal.COMPANY_NUM = parseInt(
                          data[0].MAX,
                          10
                        );
                        datasource_reg_modal.TABLE = "T_RESI_COMPANY";
                        datasource_reg_modal.DELETE_FLAG = "N";

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
                            message.success("제조회사: 1건을 등록하였습니다.");
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
                        fetch("/API/search?TYPE=31411", {
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
                    datasource_reg_modal.GUBUN === undefined ||
                    datasource_reg_modal.GUBUN === "" ||
                    datasource_reg_modal.GUBUN === null ||
                    datasource_reg_modal.COMPANY_NAME === "" ||
                    datasource_reg_modal.COMPANY_NAME === undefined ||
                    datasource_reg_modal.COMPANY_NAME === null
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
          width="30vw"
          title={<div>제조회사 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 제조회사 등록"
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
                  title_1: "제조회사명",
                  data_1: (
                    <Input
                      size="small"
                      defaultValue={datasource_reg_modal.COMPANY_NAME}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal({
                            ...datasource_reg_modal,
                            COMPANY_NAME: e.target.value,
                          })
                        );
                      }}
                    />
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};

//제조회사 수정
export const ModifyModal = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal, datasource_mod_modal } = useSelector(
    (state) => state.StdStandardEtc
  ); //수정
  const xs_title = 7;
  const xs_input = 16;

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
                    const temp = _.cloneDeep(datasource_mod_modal);
                    temp.TABLE = "T_RESI_COMPANY";
                    temp.KEY = ["COMPANY_NUM"];
                    temp.NUMERIC_KEY = ["COMPANY_NUM"];

                    console.log(temp);

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({ data: customEncrypt([temp]) }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        message.success("제조회사 : 1건을 수정하였습니다.");
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
                    fetch("/API/search?TYPE=31411", {
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
          width="30vw"
          title={
            <div>
              제조회사 관리 -{" "}
              {!(
                datasource_mod_modal.PESTICIDE_NAME === null ||
                datasource_mod_modal.PESTICIDE_NAME === undefined ||
                datasource_mod_modal.PESTICIDE_NAME === ""
              ) ? (
                <>{datasource_mod_modal.PESTICIDE_NAME}</>
              ) : (
                <>{datasource_mod_modal.PESTICIDE_NAME}</>
              )}{" "}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 제조회사 수정" //수정
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
                  title_1: "제조회사명",
                  data_1: (
                    <Input
                      size="small"
                      defaultValue={datasource_mod_modal.COMPANY_NAME}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceModModal({
                            ...datasource_mod_modal,
                            COMPANY_NAME: e.target.value,
                          })
                        );
                      }}
                    />
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};

//상태 등록
export const RegisterModal2 = () => {
  const dispatch = useDispatch();
  const { isvisible_register_modal2, datasource_reg_modal2 } = useSelector(
    (state) => state.StdStandardEtc
  ); //수정
  const xs_title = 7;
  const xs_input = 16;

  if (!isvisible_register_modal2) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_register_modal2}
          footer={
            <div>
              <Popconfirm
                title="등록하시겠습니까?"
                onCancel={() => {
                  dispatch(setIsvisibleRegModal2(false));
                  dispatch(setDatasourceRegModal2({}));
                }}
                onConfirm={() => {
                  fetch("/API/search?TYPE=31423", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((data) => {
                      var promise_using = new Promise((resolve, reject) => {
                        const temp = _.cloneDeep(datasource_reg_modal2);
                        temp.STATUS_NUM = parseInt(data[0].MAX, 10);
                        temp.TABLE = "T_RESI_STATUS";
                        temp.DELETE_FLAG = "N";

                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: customEncrypt([temp]) }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            message.success("상태: 1건을 등록하였습니다.");
                            dispatch(setIsvisibleRegModal2(false));
                            dispatch(setDatasourceRegModal2({}));
                            resolve(1);
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                            dispatch(setIsvisibleRegModal2(false));
                            dispatch(setDatasourceRegModal2({}));
                            resolve(0);
                          }
                        });
                      });

                      Promise.all([promise_using]).then((values) => {
                        fetch("/API/search?TYPE=31421", {
                          method: "GET",
                          credentials: "include",
                        })
                          .then(function (response) {
                            return response.json();
                          })
                          .then((myJson) => {
                            dispatch(setDataSource2(myJson));
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
                    datasource_reg_modal2.GUBUN === undefined ||
                    datasource_reg_modal2.GUBUN === "" ||
                    datasource_reg_modal2.GUBUN === null ||
                    datasource_reg_modal2.STATUS_NAME === "" ||
                    datasource_reg_modal2.STATUS_NAME === undefined ||
                    datasource_reg_modal2.STATUS_NAME === null
                  }
                >
                  등록
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleRegModal2(false));
                  dispatch(setDatasourceRegModal2({}));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleRegModal2(false));
            dispatch(setDatasourceRegModal2({}));
          }}
          width="30vw"
          title={<div>상태 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 상태 등록"
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
                  title_1: "구분",
                  data_1: (
                    <Radio.Group
                      value={datasource_reg_modal2.GUBUN}
                      onChange={(e) => {
                        dispatch(
                          setDatasourceRegModal2({
                            ...datasource_reg_modal2,
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
                  title_1: "상태명",
                  data_1: (
                    <Input
                      size="small"
                      defaultValue={datasource_reg_modal2.STATUS_NAME}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal2({
                            ...datasource_reg_modal2,
                            STATUS_NAME: e.target.value,
                          })
                        );
                      }}
                    />
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};

//상태 수정
export const ModifyModal2 = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal2, datasource_mod_modal2 } = useSelector(
    (state) => state.StdStandardEtc
  ); //수정
  const xs_title = 7;
  const xs_input = 16;

  if (!isvisible_modify_modal2) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_modify_modal2}
          footer={
            <div>
              <Popconfirm
                title="수정하시겠습니까?"
                onCancel={() => {
                  dispatch(setIsvisibleModModal2(false));
                  dispatch(setDatasourceModModal2({}));
                }}
                onConfirm={() => {
                  var promise_update = new Promise((resolve, reject) => {
                    datasource_mod_modal2.TABLE = "T_RESI_STATUS";
                    datasource_mod_modal2.KEY = ["STATUS_NUM"];
                    datasource_mod_modal2.NUMERIC_KEY = ["STATUS_NUM"];

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({
                        data: customEncrypt([datasource_mod_modal2]),
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        message.success("상태 : 1건을 수정하였습니다.");
                        dispatch(setIsvisibleModModal2(false));
                        dispatch(setDatasourceModModal2({}));
                        resolve(1);
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.");
                        dispatch(setIsvisibleModModal2(false));
                        dispatch(setDatasourceModModal2({}));
                        resolve(0);
                      }
                    });
                  });

                  Promise.all([promise_update]).then((values) => {
                    fetch("/API/search?TYPE=31421", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then(function (response) {
                        return response.json();
                      })
                      .then((myJson) => {
                        console.log(myJson);
                        dispatch(setDataSource2(myJson));
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
                    datasource_mod_modal2.GUBUN === "" ||
                    datasource_mod_modal2.GUBUN === null ||
                    datasource_mod_modal2.STATUS_NAME === "" ||
                    datasource_mod_modal2.STATUS_NAME === null
                  }
                >
                  수정
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleModModal2(false));
                  dispatch(setDatasourceModModal2({}));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModal2(false));
            dispatch(setDatasourceModModal2({}));
          }}
          width="30vw"
          title={
            <div>
              상태 관리 -{" "}
              {!(
                datasource_mod_modal2.PESTICIDE_NAME === null ||
                datasource_mod_modal2.PESTICIDE_NAME === undefined ||
                datasource_mod_modal2.PESTICIDE_NAME === ""
              ) ? (
                <>{datasource_mod_modal2.PESTICIDE_NAME}</>
              ) : (
                <>{datasource_mod_modal2.PESTICIDE_NAME}</>
              )}{" "}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 상태 수정" //수정
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
                  title_1: "구분",
                  data_1: (
                    <Radio.Group
                      value={datasource_mod_modal2.GUBUN}
                      onChange={(e) => {
                        dispatch(
                          setDatasourceModModal2({
                            ...datasource_mod_modal2,
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
                  title_1: "상태명",
                  data_1: (
                    <Input
                      size="small"
                      defaultValue={datasource_mod_modal2.STATUS_NAME}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceModModal2({
                            ...datasource_mod_modal2,
                            STATUS_NAME: e.target.value,
                          })
                        );
                      }}
                    />
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};

//단위 등록
export const RegisterModal3 = () => {
  const dispatch = useDispatch();
  const { isvisible_register_modal3, datasource_reg_modal3 } = useSelector(
    (state) => state.StdStandardEtc
  ); //수정
  const xs_title = 7;
  const xs_input = 16;

  if (!isvisible_register_modal3) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_register_modal3}
          footer={
            <div>
              <Popconfirm
                title="등록하시겠습니까?"
                onCancel={() => {
                  dispatch(setIsvisibleRegModal3(false));
                  dispatch(setDatasourceRegModal3({}));
                }}
                onConfirm={() => {
                  fetch("/API/search?TYPE=31433", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((data) => {
                      var promise_using = new Promise((resolve, reject) => {
                        const temp = _.cloneDeep(datasource_reg_modal3);
                        temp.UNIT_NUM = parseInt(data[0].MAX, 10);
                        temp.TABLE = "T_RESI_UNIT";
                        temp.DELETE_FLAG = "N";

                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: customEncrypt([temp]) }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            message.success("단위: 1건을 등록하였습니다.");
                            dispatch(setIsvisibleRegModal3(false));
                            dispatch(setDatasourceRegModal3({}));
                            resolve(1);
                          } else if (response.status === 401) {
                            message.error("권한이 없습니다.");
                            dispatch(setIsvisibleRegModal3(false));
                            dispatch(setDatasourceRegModal3({}));
                            resolve(0);
                          }
                        });
                      });

                      Promise.all([promise_using]).then((values) => {
                        fetch("/API/search?TYPE=31431", {
                          method: "GET",
                          credentials: "include",
                        })
                          .then(function (response) {
                            return response.json();
                          })
                          .then((myJson) => {
                            console.log(myJson);
                            dispatch(setDataSource3(myJson));
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
                    datasource_reg_modal3.GUBUN === undefined ||
                    datasource_reg_modal3.GUBUN === "" ||
                    datasource_reg_modal3.GUBUN === null ||
                    datasource_reg_modal3.UNIT_NAME === "" ||
                    datasource_reg_modal3.UNIT_NAME === undefined ||
                    datasource_reg_modal3.UNIT_NAME === null
                  }
                >
                  등록
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleRegModal3(false));
                  dispatch(setDatasourceRegModal3({}));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleRegModal3(false));
            dispatch(setDatasourceRegModal3({}));
          }}
          width="30vw"
          title={<div>단위 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 단위 등록"
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
                  title_1: "구분",
                  data_1: (
                    <Radio.Group
                      value={datasource_reg_modal3.GUBUN}
                      onChange={(e) => {
                        dispatch(
                          setDatasourceRegModal3({
                            ...datasource_reg_modal3,
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
                  title_1: "상태명",
                  data_1: (
                    <Input
                      size="small"
                      defaultValue={datasource_reg_modal3.UNIT_NAME}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceRegModal3({
                            ...datasource_reg_modal3,
                            UNIT_NAME: e.target.value,
                          })
                        );
                      }}
                    />
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};

//단위 수정
export const ModifyModal3 = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal3, datasource_mod_modal3 } = useSelector(
    (state) => state.StdStandardEtc
  ); //수정
  const xs_title = 7;
  const xs_input = 16;

  if (!isvisible_modify_modal3) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_modify_modal3}
          footer={
            <div>
              <Popconfirm
                title="수정하시겠습니까?"
                onCancel={() => {
                  dispatch(setIsvisibleModModal3(false));
                  dispatch(setDatasourceModModal3({}));
                }}
                onConfirm={() => {
                  var promise_update = new Promise((resolve, reject) => {
                    const temp = _.cloneDeep(datasource_mod_modal3);
                    temp.TABLE = "T_RESI_UNIT";
                    temp.KEY = ["UNIT_NUM"];
                    temp.NUMERIC_KEY = ["UNIT_NUM"];
                    temp.DELETE_FLAG = "N";

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({ data: customEncrypt([temp]) }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        message.success("단위 : 1건을 수정하였습니다.");
                        dispatch(setIsvisibleModModal3(false));
                        dispatch(setDatasourceModModal3({}));
                        resolve(1);
                      } else if (response.status === 401) {
                        message.error("권한이 없습니다.");
                        dispatch(setIsvisibleModModal3(false));
                        dispatch(setDatasourceModModal3({}));
                        resolve(0);
                      }
                    });
                  });

                  Promise.all([promise_update]).then((values) => {
                    fetch("/API/search?TYPE=31431", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then(function (response) {
                        return response.json();
                      })
                      .then((myJson) => {
                        console.log(myJson);
                        dispatch(setDataSource3(myJson));
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
                    (datasource_mod_modal3.GUBUN === "" ||
                      datasource_mod_modal3.GUBUN === null) &&
                    (datasource_mod_modal3.UNIT_NAME === "" ||
                      datasource_mod_modal3.UNIT_NAME === null)
                  }
                >
                  수정
                </Button>
              </Popconfirm>
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  dispatch(setIsvisibleModModal3(false));
                  dispatch(setDatasourceModModal3({}));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModal3(false));
            dispatch(setDatasourceModModal3({}));
          }}
          width="30vw"
          title={
            <div>
              단위 관리 -{" "}
              {!(
                datasource_mod_modal3.PESTICIDE_NAME === null ||
                datasource_mod_modal3.PESTICIDE_NAME === undefined ||
                datasource_mod_modal3.PESTICIDE_NAME === ""
              ) ? (
                <>{datasource_mod_modal3.PESTICIDE_NAME}</>
              ) : (
                <>{datasource_mod_modal3.PESTICIDE_NAME}</>
              )}{" "}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 단위 수정" //수정
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
                  title_1: "구분",
                  data_1: (
                    <Radio.Group
                      value={datasource_mod_modal3.GUBUN}
                      onChange={(e) => {
                        dispatch(
                          setDatasourceModModal3({
                            ...datasource_mod_modal3,
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
                  title_1: "상태명",
                  data_1: (
                    <Input
                      size="small"
                      defaultValue={datasource_mod_modal3.UNIT_NAME}
                      onBlur={(e) => {
                        dispatch(
                          setDatasourceModModal3({
                            ...datasource_mod_modal3,
                            UNIT_NAME: e.target.value,
                          })
                        );
                      }}
                    />
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};
