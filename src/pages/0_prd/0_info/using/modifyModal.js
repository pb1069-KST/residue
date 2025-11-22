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
import Template from "../../../../components/template";
//components

//redux
import { setDataSource } from "../../../../reducers/prd/PrdInfoUsing";
import {
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceRegModal,
  setDatasourceModModal,
} from "../../../../reducers/prd/PrdInfoUsing_modal";
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

import { customEncrypt } from "../../../../components/util";

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal, datasource_mod_modal } = useSelector(
    (state) => state.PrdInfoUsing_modal
  );

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
