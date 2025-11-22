import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
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
import { setDataSource } from "../../../reducers/prd/PrdInfoUsing";
import {
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceRegModal,
  setDatasourceModModal,
} from "../../../reducers/prd/PrdInfoUsing_modal";
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
// #antd lib

import { useSelector, useDispatch } from "react-redux";

import {
  customEncrypt,
  CustomInput,
  CustomTextArea,
  CustomTextAreaTags,
  getCurrentKoreanDateTime,
  CheckNullBlank,
  FileDownloader,
} from "../../../components/util";

const { Search } = Input;
// const { TextArea } = Input;

function Using() {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.PrdInfoUsing);
  const { isvisible_modify_modal, isvisible_register_modal } = useSelector(
    (state) => state.PrdInfoUsing_modal
  );

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=11211", {
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
          subTitle: "농약용도",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/using",
              name: "농약",
            },
            {
              href: "/prd/using",
              name: "농약정보",
            },
            {
              href: "/prd/using",
              name: "농약용도",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 1,
          defaultActiveKey: 0,
        }}
        //카드
        main_card={{
          title: "농약용도 검색",
        }}
        content_card={
          <div>
            <Search
              placeholder="용도명을 입력하세요"
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />
          </div>
        }
        content={
          <div>
            <Table
              size="small"
              sticky
              bordered
              rowKey={(item) => {
                return item.USING_NUM;
              }}
              dataSource={dataSource.filter((val) => {
                if (val.USING_NAME_KR !== null) {
                  var word_str = "";
                  Hangul.disassemble(val.USING_NAME_KR, true).forEach(
                    (word, index) => {
                      word_str += word[0];
                    }
                  );
                  return (
                    word_str.indexOf(searchKey) !== -1 ||
                    Hangul.disassemble(val.USING_NAME_KR, true)[0][0].indexOf(
                      searchKey
                    ) > -1 ||
                    val.USING_NAME_KR.indexOf(searchKey) >= 0 ||
                    (val.USING_NAME_EN !== "" && val.USING_NAME_EN !== null
                      ? val.USING_NAME_EN.toLowerCase().indexOf(
                          searchKey.toLowerCase()
                        ) > -1
                      : null)
                  );
                } else {
                  return (
                    val.USING_NAME_EN.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  );
                }
              })}
              columns={[
                {
                  title: "용도 국문명",
                  dataIndex: "USING_NAME_KR",
                  key: "USING_NUM",
                  width: "35%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "USING_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                },
                {
                  title: "용도 영문명",
                  dataIndex: "USING_NAME_EN",
                  key: "USING_NUM",
                  width: "35%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "USING_NAME_EN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
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
                  key: "USING_NUM",
                  flag: "등록",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.USING_NUM}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=11213&USING_NUM=" +
                                row.USING_NUM,
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
                                        TABLE: "T_RESI_PESTICIDE_USING",
                                        KEY: ["USING_NUM"],
                                        NUMERIC_KEY: ["USING_NUM"],
                                        USING_NUM: row.USING_NUM,
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
                                      "용도: " +
                                        (row.USING_NAME_KR ||
                                          row.USING_NAME_EN) +
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
                              fetch("/API/search?TYPE=11211", {
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
                    userinfo.PRD_ADI_MOD === "N")
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

export default Using;

export const RegisterModal = () => {
  const dispatch = useDispatch();
  const { isvisible_register_modal, datasource_reg_modal } = useSelector(
    (state) => state.PrdInfoUsing_modal
  );
  // const xs_title = 5
  // const xs_input = 18

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
                  fetch("/API/search?TYPE=11212", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((data) => {
                      var promise_using = new Promise((resolve, reject) => {
                        datasource_reg_modal.USING_NUM =
                          parseInt(data[0].NUM, 10) + 1;
                        datasource_reg_modal.TABLE = "T_RESI_PESTICIDE_USING";
                        datasource_reg_modal.DELETE_FLAG = "N";
                        delete datasource_reg_modal.NO;

                        var encrypted_data = _.cloneDeep(datasource_reg_modal);
                        encrypted_data = customEncrypt([encrypted_data]);

                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({
                            data: encrypted_data,
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            message.success(
                              "용도: " +
                                (datasource_reg_modal.USING_NAME_KR ||
                                  datasource_reg_modal.USING_NAME_EN) +
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
                        fetch("/API/search?TYPE=11211", {
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
          title={<div>농약용도 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약용도 등록"
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
                    width: "30%",
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
                    title_1: "용도 국문명",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.USING_NAME_KR}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USING_NAME_KR: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "용도 영문명",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.USING_NAME_EN}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USING_NAME_EN: e.target.value,
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

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal, datasource_mod_modal } = useSelector(
    (state) => state.PrdInfoUsing_modal
  );
  // const xs_title = 5
  // const xs_input = 18

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
                    datasource_mod_modal.TABLE = "T_RESI_PESTICIDE_USING";
                    datasource_mod_modal.KEY = ["USING_NUM"];
                    datasource_mod_modal.NUMERIC_KEY = ["USING_NUM"];

                    var encrypted_data = _.cloneDeep(datasource_mod_modal);
                    encrypted_data = customEncrypt([encrypted_data]);

                    fetch("/API/update", {
                      method: "POST",
                      body: JSON.stringify({ data: encrypted_data }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                        message.success(
                          "용도: " +
                            (datasource_mod_modal.USING_NAME_KR ||
                              datasource_mod_modal.USING_NAME_EN) +
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
                    fetch("/API/search?TYPE=11211", {
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
                  disabled={
                    (datasource_mod_modal.USING_NAME_KR === "" ||
                      datasource_mod_modal.USING_NAME_KR === null) &&
                    (datasource_mod_modal.USING_NAME_EN === "" ||
                      datasource_mod_modal.USING_NAME_EN === null)
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
          title={<div>농약용도 수정</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약용도 수정"
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
                    width: "30%",
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
                    title_1: "용도 국문명",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.USING_NAME_KR}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              USING_NAME_KR: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "용도 영문명",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.USING_NAME_EN}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              USING_NAME_EN: e.target.value,
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
