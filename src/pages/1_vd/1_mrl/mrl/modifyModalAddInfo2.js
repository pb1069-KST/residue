import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";

import {
  setIsvisibleModModalAddInfo2,
  setDatasourceModModal,
} from "../../../../reducers/vd/VdMrlMrl_modal";

import "antd/dist/antd.css";
import Table from "antd/es/table";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Popconfirm from "antd/es/popconfirm";
import message from "antd/es/message";
import {
  customEncrypt,
  CustomInput,
  getCurrentKoreanDateTime,
} from "../../../../components/util";
import { useSelector, useDispatch } from "react-redux";

const { Search, TextArea } = Input;

export const ModifyModalAddInfo2 = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal_add_info2 } = useSelector(
    (state) => state.VdMrlMrl_modal
  );

  const { customSorter } = useSelector((state) => state.util);
  const [searchKey, setSearchKey] = useState("");

  const [datasource_mod_modal, setDatasourceModModal] = useState([]);

  useEffect(() => {
    fetch("/API/search?TYPE=92211", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setDatasourceModModal(myJson);
      });
  }, []);

  if (!isvisible_modify_modal_add_info2) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_modify_modal_add_info2}
          footer={
            <div>
              <Popconfirm
                title="수정하시겠습니까?"
                onCancel={() => {
                  dispatch(setIsvisibleModModalAddInfo2(false));
                  setDatasourceModModal([]);
                }}
                onConfirm={() => {
                  fetch("/API/search?TYPE=92212", {
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
                          "T_RESI_VD_VDRUG_MRL_ADDITIONAL_INFORMATION2";
                        data.NUMERIC_KEY = ["NUM", "ROW_SPAN"];
                        data.NUM = MAX + index + 1;
                      });

                      if (temp.length === 0) {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: customEncrypt(temp) }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          console.log(response);
                          if (response.status === 200) {
                            fetch("/API/search?TYPE=92211", {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setIsvisibleModModalAddInfo2(false));
                                setDatasourceModModal([]);
                              });
                          } else if (response.status === 401) {
                            dispatch(setIsvisibleModModalAddInfo2(false));
                            setDatasourceModModal([]);
                          }
                        });
                      } else {
                        fetch("/API/delete", {
                          method: "POST",
                          body: JSON.stringify({
                            data: customEncrypt([
                              {
                                TABLE:
                                  "T_RESI_VD_VDRUG_MRL_ADDITIONAL_INFORMATION2",
                                KEY: ["DELETE_ALL"],
                                DELETE_ALL: "N",
                              },
                            ]),
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
                              body: JSON.stringify({
                                data: customEncrypt(temp),
                              }),
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }).then(function (response) {
                              console.log(response);
                              if (response.status === 200) {
                                fetch("/API/search?TYPE=92211", {
                                  method: "GET",
                                  credentials: "include",
                                })
                                  .then(function (response) {
                                    return response.json();
                                  })
                                  .then((myJson) => {
                                    dispatch(
                                      setIsvisibleModModalAddInfo2(false)
                                    );
                                    setDatasourceModModal([]);
                                  });
                              } else if (response.status === 401) {
                                dispatch(setIsvisibleModModalAddInfo2(false));
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
                  dispatch(setIsvisibleModModalAddInfo2(false));
                  setDatasourceModModal([]);
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModalAddInfo2(false));
            setDatasourceModModal([]);
          }}
          width="60vw"
          title={<div>동물용의약품 잔류허용기준 추가정보 수정</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 동물용의약품 잔류허용기준 수정"
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
                  title: "번호",
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
                  title: "물질명",
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
                  title: "잔류물질 정의",
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
