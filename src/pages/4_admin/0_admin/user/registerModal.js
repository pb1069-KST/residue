import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
import moment from "moment";
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
import Drawer from "antd/es/drawer";
import Tag from "antd/es/tag";
import Select from "antd/es/select";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";
import { customEncrypt } from "../../../util";

const { Option } = Select;
const { Search } = Input;

export const RegisterModal = () => {
  const dispatch = useDispatch();
  const { dataSource, isvisible_register_modal, datasource_reg_modal } =
    useSelector((state) => state.AdminAdminUser); //수정

  const [province, setProvince] = useState([]);
  const [auth, setAuth] = useState([]);
  const xs_title = 7;
  const xs_input = 16;
  useEffect(() => {
    fetch("/API/search?TYPE=51114", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        const transformedArray = myJson.map((item) => ({
          value: item.PROVINCE_NUM,
          label: item.PROVINCE_NAME,
        }));
        setProvince(transformedArray);
      });
    fetch("/API/search?TYPE=51115", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        const transformedArray = myJson.map((item) => ({
          value: item.TEMPLATE_ID,
          label: item.TEMPLATE_NAME,
        }));
        setAuth(transformedArray);
      });
  }, [dispatch]);

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
                  var data = _.cloneDeep(datasource_reg_modal);
                  data.PASSWD = 0;
                  data.REG_DATE = moment(new Date()).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  data.PASSWARD = "NEED";
                  data.DELETE_FLAG = "N";

                  data.TABLE = "T_RESI_MEMBER";
                  data.KEY = [];
                  data.NUMERIC_KEY = ["PROVINCE_NUM", "AUTH_NUM"];

                  const encData = customEncrypt([data]);

                  fetch("/API/insert", {
                    method: "POST",
                    body: JSON.stringify({
                      data: encData,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }).then(function (response) {
                    console.log(response);
                    if (response.status === 200) {
                      message.success(
                        "사용자: " +
                          datasource_reg_modal.USERNAME +
                          "을 등록하였습니다."
                      );
                      dispatch(setIsvisibleRegModal(false));
                      dispatch(setDatasourceRegModal({}));
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
                      dispatch(setIsvisibleRegModal(false));
                      dispatch(setDatasourceRegModal({}));
                    }
                  });
                }}
                okText="확인"
                cancelText="취소"
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={
                    datasource_reg_modal.USERID === undefined ||
                    datasource_reg_modal.USERID === "" ||
                    datasource_reg_modal.USERID === null ||
                    datasource_reg_modal.USERNAME === "" ||
                    datasource_reg_modal.USERNAME === undefined ||
                    datasource_reg_modal.USERNAME === null
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
          title={<div>농약 사이트링크 등록</div>}
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
                    title_1: "사용자 ID",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.USERID}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USERID: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "사용자 이름",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.USERNAME}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USERNAME: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "사용자구분",
                    data_1: (
                      <Select
                        size="small"
                        style={{ width: "100%" }}
                        options={[
                          { value: "A", label: "관리자" },
                          { value: "N", label: "일반" },
                        ]}
                        value={datasource_reg_modal.USER_TYPE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              USER_TYPE: e,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "업무구분",
                    data_1: (
                      <Select
                        size="small"
                        style={{ width: "100%" }}
                        options={[
                          { value: "P", label: "농약" },
                          { value: "V", label: "동물용의약품" },
                          { value: "A", label: "농약/동약" },
                        ]}
                        value={datasource_reg_modal.WORK_TYPE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              WORK_TYPE: e,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "소속",
                    data_1: (
                      <Select
                        size="small"
                        style={{ width: "100%" }}
                        options={province}
                        value={datasource_reg_modal.PROVINCE_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              PROVINCE_NUM: e,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "EMAIL",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.EMAIL}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              EMAIL: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "전화번호",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_reg_modal.PHONE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              PHONE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "권한구분",
                    data_1: (
                      <Select
                        size="small"
                        style={{ width: "100%" }}
                        options={auth}
                        value={datasource_reg_modal.AUTH_NUM}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
                              AUTH_NUM: e,
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
