import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import moment from "moment";
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

import {
  customEncrypt,
  CustomInput,
  CustomTextArea,
  CustomTextAreaTags,
  getCurrentKoreanDateTime,
  CheckNullBlank,
  FileDownloader,
} from "../../../components/util";

//redux
import { setDataSource } from "../../../reducers/prd/prdMrlFood";
import {
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceRegModal,
  setDatasourceModModal,
  setDatasourceClassL,
  setDatasourceClassM,
  setDatasourceClassS,
} from "../../../reducers/prd/prdMrlFood_modal";
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
// import Drawer from "antd/es/drawer"
import DatePicker from "antd/es/date-picker";
import Radio from "antd/es/radio";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
// import { Switch } from "antd";
// import { render } from "@testing-library/react";

const { Option } = Select;
const { Search } = Input;
// const { TextArea } = Input;

function Food() {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.prdMrlFood);
  const {
    isvisible_modify_modal,
    isvisible_register_modal,
    // datasource_class_L,
    // datasource_mod_modal
  } = useSelector((state) => state.prdMrlFood_modal);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=12211", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSource(myJson));
      });

    fetch("/API/search?TYPE=12213", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDatasourceClassL(myJson));
      });

    fetch("/API/search?TYPE=12214", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDatasourceClassM(myJson));
      });

    fetch("/API/search?TYPE=12215", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDatasourceClassS(myJson));
      });
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "농약",
          subTitle: "식품(농약)",
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
              name: "농약잔류허용기준",
            },
            {
              href: "/prd/food",
              name: "식품(농약)",
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
          title: "식품 검색",
        }}
        content_card={
          <div>
            <Search
              placeholder="식품명을 입력하세요"
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
                return item.FOOD_CODE;
              }}
              dataSource={dataSource.filter((val) => {
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
                  title: "식품명",
                  dataIndex: "FOOD_NAME_KR",
                  key: "FOOD_CODE",
                  width: "30%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "FOOD_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <>
                        {row.FOOD_NAME_KR}(
                        <span style={{ fontStyle: "italic" }}>
                          {row.FOOD_NAME_EN}
                        </span>
                        )
                      </>
                    );
                  },
                },
                {
                  title: "대분류",
                  dataIndex: "CLASS_L_NAME_KR",
                  key: "FOOD_CODE",
                  width: "17%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "CLASS_L_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return !(
                      row.CLASS_L_NAME_KR === null ||
                      row.CLASS_L_NAME_KR.replace(" ", "") === ""
                    ) ? (
                      <>
                        {row.CLASS_L_NAME_KR}(
                        <span style={{ fontStyle: "italic" }}>
                          {row.CLASS_L_NAME_EN}
                        </span>
                        )
                      </>
                    ) : (
                      <>
                        <span style={{ fontStyle: "italic" }}>
                          {row.CLASS_L_NAME_EN}
                        </span>
                      </>
                    );
                  },
                },
                {
                  title: "중분류",
                  dataIndex: "CLASS_M_NAME_KR",
                  key: "FOOD_CODE",
                  width: "17%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "CLASS_M_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return !(
                      row.CLASS_M_NAME_KR === null ||
                      row.CLASS_M_NAME_KR.replace(" ", "") === ""
                    ) ? (
                      <>
                        {row.CLASS_M_NAME_KR}(
                        <span style={{ fontStyle: "italic" }}>
                          {row.CLASS_M_NAME_EN}
                        </span>
                        )
                      </>
                    ) : (
                      <>
                        <span style={{ fontStyle: "italic" }}>
                          {row.CLASS_M_NAME_EN}
                        </span>
                      </>
                    );
                  },
                },
                {
                  title: "소분류",
                  dataIndex: "CLASS_S_NAME_KR",
                  key: "FOOD_CODE",
                  width: "17%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "CLASS_S_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return !(
                      row.CLASS_S_NAME_KR === null ||
                      row.CLASS_S_NAME_KR.replace(" ", "") === ""
                    ) ? (
                      <>
                        {row.CLASS_S_NAME_KR}(
                        <span style={{ fontStyle: "italic" }}>
                          {row.CLASS_S_NAME_EN}
                        </span>
                        )
                      </>
                    ) : (
                      <>
                        <span style={{ fontStyle: "italic" }}>
                          {row.CLASS_S_NAME_EN}
                        </span>
                      </>
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
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.FOOD_CODE}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=12212&FOOD_CODE=" +
                                row.FOOD_CODE,
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

                                fetch(
                                  "/API/search?TYPE=12216&CLASS_L_CODE=" +
                                    myJson[0].CLASS_L_CODE,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setDatasourceClassM(myJson));
                                  });

                                fetch(
                                  "/API/search?TYPE=12217&CLASS_L_CODE=" +
                                    myJson[0].CLASS_L_CODE +
                                    "&CLASS_M_CODE=" +
                                    myJson[0].CLASS_M_CODE,
                                  {
                                    method: "GET",
                                    credentials: "include",
                                  }
                                )
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(setDatasourceClassS(myJson));
                                  });
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
                                        TABLE: "T_RESI_FOOD",
                                        KEY: ["FOOD_CODE"],
                                        // NUMERIC_KEY: ["FOOD_CODE"],
                                        FOOD_CODE: row.FOOD_CODE,
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
                                      "식품: " +
                                        (row.FOOD_NAME_KR || row.FOOD_NAME_EN) +
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
                              fetch("/API/search?TYPE=12211", {
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

export default Food;

export const RegisterModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_register_modal,
    datasource_reg_modal,
    datasource_class_L,
    datasource_class_M,
    datasource_class_S,
  } = useSelector((state) => state.prdMrlFood_modal);

  const { userinfo } = useSelector((state) => state.header);

  useEffect(() => {
    dispatch(
      setDatasourceRegModal({
        ...datasource_reg_modal,
        FOOD_NAME_CH_DATE: moment(new Date()).format("YYYY-MM-DD"),
      })
    );
  }, [dispatch]);

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
                  fetch("/API/search?TYPE=12218", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((data) => {
                      var promise_using = new Promise((resolve, reject) => {
                        datasource_reg_modal.FOOD_CODE =
                          "ap" +
                          (parseInt(data[0].NUM.replace("ap", ""), 10) + 1);
                        datasource_reg_modal.TABLE = "T_RESI_FOOD";
                        delete datasource_reg_modal.NO;

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
                              "식품: " +
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
                        fetch("/API/search?TYPE=12211", {
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
                    ((datasource_reg_modal.FOOD_NAME_KR === undefined ||
                      datasource_reg_modal.FOOD_NAME_KR === "" ||
                      datasource_reg_modal.FOOD_NAME_KR === null) &&
                      (datasource_reg_modal.FOOD_NAME_EN === "" ||
                        datasource_reg_modal.FOOD_NAME_EN === undefined ||
                        datasource_reg_modal.FOOD_NAME_EN === null)) ||
                    datasource_reg_modal.CLASS_L_CODE === "" ||
                    datasource_reg_modal.CLASS_L_CODE === undefined ||
                    datasource_reg_modal.CLASS_L_CODE === null
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
          width="50vw"
          title={<div>식품 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 식품 등록"
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
                    title_1: "식품분류",
                    data_1: (
                      <div>
                        <Select
                          size="small"
                          style={{ width: "100%", marginBottom: "10px" }}
                          placeholder="대분류를 선택하세요"
                          value={datasource_reg_modal.CLASS_L_CODE}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                CLASS_L_CODE: e,
                                CLASS_M_CODE: "",
                                CLASS_S_CODE: "",
                              })
                            );
                            fetch("/API/search?TYPE=12216&CLASS_L_CODE=" + e, {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceClassM(myJson));
                              });
                          }}
                        >
                          {datasource_class_L.map((data) => {
                            return (
                              <Option value={data.CLASS_L_CODE}>
                                {data.CLASS_L_NAME_KR}
                              </Option>
                            );
                          })}
                        </Select>
                        <Select
                          size="small"
                          style={{ width: "100%", marginBottom: "10px" }}
                          placeholder="중분류를 선택하세요"
                          value={datasource_reg_modal.CLASS_M_CODE}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                CLASS_M_CODE: e,
                                CLASS_S_CODE: "",
                              })
                            );
                            fetch(
                              "/API/search?TYPE=12217&CLASS_L_CODE=" +
                                datasource_reg_modal.CLASS_L_CODE +
                                "&CLASS_M_CODE=" +
                                e,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceClassS(myJson));
                              });
                          }}
                        >
                          {datasource_class_M.map((data) => {
                            return (
                              <Option value={data.CLASS_M_CODE}>
                                {data.CLASS_M_NAME_KR}
                              </Option>
                            );
                          })}
                        </Select>
                        <Select
                          size="small"
                          style={{ width: "100%", marginBottom: "10px" }}
                          placeholder="소분류를 선택하세요"
                          value={datasource_reg_modal.CLASS_S_CODE}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                CLASS_S_CODE: e,
                              })
                            );
                          }}
                        >
                          {datasource_class_S.map((data) => {
                            return (
                              <Option value={data.CLASS_S_CODE}>
                                {data.CLASS_S_NAME_KR}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "한글명",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.FOOD_NAME_KR}
                        placeholder="식품 한글명을 입력하세요"
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              FOOD_NAME_KR: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "영문명",
                    data_2: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.FOOD_NAME_EN}
                        placeholder="식품 영문명을 입력하세요"
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              FOOD_NAME_EN: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "섭취량(g/일)",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.FOOD_INTAKE}
                        placeholder="식품 섭취량을 입력하세요"
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              FOOD_INTAKE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "일자",
                    data_2: (
                      <DatePicker
                        size="small"
                        value={moment(
                          datasource_reg_modal.FOOD_NAME_CH_DATE,
                          "YYYY-MM-DD"
                        )}
                        placeholder="일자를 입력하세요"
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              FOOD_NAME_CH_DATE: dateString,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "잠정기준 적용 여부",
                    data_1: (
                      <Radio.Group
                        value={datasource_reg_modal.APPLY_FLAG}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              APPLY_FLAG: e.target.value,
                            })
                          );
                        }}
                      >
                        <Radio size="small" value={"Y"}>
                          Y
                        </Radio>
                        <Radio size="small" value={"N"}>
                          N
                        </Radio>
                      </Radio.Group>
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
  const {
    isvisible_modify_modal,
    datasource_mod_modal,
    datasource_class_L,
    datasource_class_M,
    datasource_class_S,
  } = useSelector((state) => state.prdMrlFood_modal);
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
                    datasource_mod_modal.TABLE = "T_RESI_FOOD";
                    datasource_mod_modal.KEY = ["FOOD_CODE"];
                    datasource_mod_modal.NUMERIC_KEY = [""];

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
                          "식품: " +
                            (datasource_mod_modal.FOOD_NAME_KR ||
                              datasource_mod_modal.FOOD_NAME_EN) +
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
                    fetch("/API/search?TYPE=12211", {
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
                    (datasource_mod_modal.FOOD_NAME_KR === "" ||
                      datasource_mod_modal.FOOD_NAME_KR === null) &&
                    (datasource_mod_modal.FOOD_NAME_EN === "" ||
                      datasource_mod_modal.FOOD_NAME_EN === null)
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
          width="50vw"
          title={<div>식품 수정</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 식품 수정"
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
                    title_1: "식품분류",
                    data_1: (
                      <div>
                        <Select
                          size="small"
                          style={{ width: "100%" }}
                          value={datasource_mod_modal.CLASS_L_CODE}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceModModal({
                                ...datasource_mod_modal,
                                CLASS_L_CODE: e,
                                CLASS_M_CODE: "",
                                CLASS_S_CODE: "",
                              })
                            );
                            fetch("/API/search?TYPE=12216&CLASS_L_CODE=" + e, {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceClassM(myJson));
                              });
                          }}
                        >
                          {datasource_class_L.map((data) => {
                            return (
                              <Option value={data.CLASS_L_CODE}>
                                {data.CLASS_L_NAME_KR}
                              </Option>
                            );
                          })}
                        </Select>
                        <Select
                          size="small"
                          style={{ width: "100%" }}
                          value={datasource_mod_modal.CLASS_M_CODE}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceModModal({
                                ...datasource_mod_modal,
                                CLASS_M_CODE: e,
                                CLASS_S_CODE: "",
                              })
                            );
                            fetch(
                              "/API/search?TYPE=12217&CLASS_L_CODE=" +
                                datasource_mod_modal.CLASS_L_CODE +
                                "&CLASS_M_CODE=" +
                                e,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceClassS(myJson));
                              });
                          }}
                        >
                          {datasource_class_M.map((data) => {
                            return (
                              <Option value={data.CLASS_M_CODE}>
                                {data.CLASS_M_NAME_KR}
                              </Option>
                            );
                          })}
                        </Select>
                        <Select
                          size="small"
                          style={{ width: "100%" }}
                          value={datasource_mod_modal.CLASS_S_CODE}
                          onChange={(e) => {
                            dispatch(
                              setDatasourceModModal({
                                ...datasource_mod_modal,
                                CLASS_S_CODE: e,
                              })
                            );
                          }}
                        >
                          {datasource_class_S.map((data) => {
                            return (
                              <Option value={data.CLASS_S_CODE}>
                                {data.CLASS_S_NAME_KR}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "한글명",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.FOOD_NAME_KR}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              FOOD_NAME_KR: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "영문명",
                    data_2: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.FOOD_NAME_EN}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              FOOD_NAME_EN: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "섭취량(g/일)",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.FOOD_INTAKE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              FOOD_INTAKE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "일자",
                    data_2: (
                      <DatePicker
                        size="small"
                        value={moment(
                          datasource_mod_modal.FOOD_NAME_CH_DATE,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              FOOD_NAME_CH_DATE: dateString,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "잠정기준 적용 여부",
                    data_1: (
                      <Radio.Group
                        value={datasource_mod_modal.APPLY_FLAG}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              APPLY_FLAG: e.target.value,
                            })
                          );
                        }}
                      >
                        <Radio size="small" value={"Y"}>
                          Y
                        </Radio>
                        <Radio size="small" value={"N"}>
                          N
                        </Radio>
                      </Radio.Group>
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
