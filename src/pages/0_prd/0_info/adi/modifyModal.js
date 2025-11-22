import React, { useState, useEffect } from "react";
import _ from "lodash";

//redux
import { setDataSource } from "../../../../reducers/prd/PrdInfoAdi";

import {
  setIsvisibleModModal,
  setDatasourceModModal,
} from "../../../../reducers/prd/PrdInfoAdi_modal";
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
// #antd lib

import { customEncrypt } from "../../../../components/util";

import { useSelector, useDispatch } from "react-redux";

const { Option } = Select;

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal, datasource_mod_modal, selected_data } =
    useSelector((state) => state.PrdInfoAdi_modal);
  const { customSorter } = useSelector((state) => state.util);

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
                  dispatch(setDatasourceModModal([]));
                }}
                onConfirm={() => {
                  var datasource_mod_modal_temp = datasource_mod_modal;
                  datasource_mod_modal_temp.forEach((data) => {
                    data.TABLE = "T_RESI_PESTICIDE_ADI";
                    data.PESTICIDE_CODE = selected_data.PESTICIDE_CODE;
                    delete data.NO;
                  });
                  var delete_adi = [
                    {
                      PESTICIDE_CODE: selected_data.PESTICIDE_CODE,
                      TABLE: "T_RESI_PESTICIDE_ADI",
                      KEY: ["PESTICIDE_CODE"],
                    },
                  ];

                  delete_adi = customEncrypt(delete_adi);

                  fetch("/API/delete", {
                    method: "POST",
                    body: JSON.stringify({ data: delete_adi }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }).then(function (response) {
                    if (response.status === 200) {
                      ////////////////////////////////////////////////////////////////////////////////////
                      if (datasource_mod_modal_temp.length === 0) {
                        message.success(
                          "농약 ADI: [" +
                            selected_data.PESTICIDE_NAME_KR +
                            "] 을 수정하였습니다."
                        );
                        dispatch(setIsvisibleModModal(false));
                        dispatch(setDatasourceModModal([]));

                        fetch("/API/search?TYPE=11311", {
                          method: "GET",
                          credentials: "include",
                        })
                          .then(function (response) {
                            return response.json();
                          })
                          .then((myJson) => {
                            dispatch(setDataSource(myJson));
                          });
                      } else {
                        datasource_mod_modal_temp = customEncrypt(
                          datasource_mod_modal_temp
                        );

                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({
                            data: datasource_mod_modal_temp,
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          if (response.status === 200) {
                            message.success(
                              "농약 ADI: <" +
                                selected_data.PESTICIDE_NAME_KR +
                                "> 을 수정하였습니다."
                            );
                            dispatch(setIsvisibleModModal(false));
                            dispatch(setDatasourceModModal([]));

                            fetch("/API/search?TYPE=11311", {
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
                            dispatch(setIsvisibleModModal(false));
                            dispatch(setDatasourceModModal([]));
                          }
                        });
                      }
                      ////////////////////////////////////////////////////////////////////////////////////
                    } else if (response.status === 401) {
                      message.error("권한이 없습니다.");
                      dispatch(setIsvisibleModModal(false));
                      dispatch(setDatasourceModModal([]));
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
                  dispatch(setDatasourceModModal([]));
                }}
              >
                돌아가기
              </Button>
            </div>
          }
          onCancel={() => {
            dispatch(setIsvisibleModModal(false));
            dispatch(setDatasourceModModal([]));
          }}
          width="40vw"
          title={
            <div>
              농약 ADI 수정
              {" : " +
                (selected_data.PESTICIDE_NAME_KR !== null
                  ? selected_data.PESTICIDE_NAME_KR +
                    "(" +
                    selected_data.PESTICIDE_NAME_EN +
                    ")"
                  : selected_data.PESTICIDE_NAME_EN)}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약 ADI 수정"
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
            <Row className="modal-input">
              <Col xs={24}>
                <Table
                  sticky
                  bordered
                  size="small"
                  dataSource={datasource_mod_modal}
                  pagination={false}
                  columns={[
                    {
                      title: "국가",
                      dataIndex: "COUNTRY_CODE",
                      key: "PESTICIDE_CODE",
                      width: "20%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      defaultSortOrder: "ascend",
                      render: (data, row, index) => {
                        return (
                          <Select
                            key={index}
                            value={data}
                            size="small"
                            style={{ width: "100%" }}
                            onChange={(e) => {
                              var temp = datasource_mod_modal;
                              temp[index].COUNTRY_CODE = e;
                              dispatch(setDatasourceModModal(temp));
                            }}
                          >
                            <Option value={"KR"}>한국</Option>
                            <Option value={"CD"}>코덱스</Option>
                            <Option value={"US"}>미국</Option>
                            <Option value={"EU"}>유럽</Option>
                            <Option value={"CN"}>중국</Option>
                            <Option value={"JP"}>일본</Option>
                            <Option value={"AU"}>호주</Option>
                            <Option value={"TW"}>대만</Option>
                            <Option value={"PM"}>메뉴얼</Option>
                          </Select>
                        );
                      },
                    },
                    {
                      title: "ADI",
                      dataIndex: "ADI_VALUE",
                      key: "ADI_VALUE",
                      width: "70%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                      },
                      showSorterTooltip: false,
                      sortDirections: ["ascend", "descend", "ascend"],
                      render: (data, row, index) => {
                        return (
                          <Input
                            size="small"
                            value={data}
                            onChange={(e) => {
                              var temp = datasource_mod_modal;
                              temp[index].ADI_VALUE = e.target.value;
                              dispatch(setDatasourceModModal(temp));
                            }}
                          />
                        );
                      },
                    },
                    {
                      title: (
                        <Button
                          type="link"
                          onClick={() => {
                            var temp = datasource_mod_modal;
                            temp = [
                              ...temp,
                              { COUNTRY_CODE: "KR", ADI_VALUE: "" },
                            ];
                            dispatch(setDatasourceModModal(temp));
                          }}
                        >
                          +
                        </Button>
                      ),
                      render: (data, row, index) => {
                        return (
                          <Button
                            type="link"
                            style={{ color: "red" }}
                            onClick={() => {
                              var temp = datasource_mod_modal;
                              temp = temp.filter((_, i) => index !== i);
                              dispatch(setDatasourceModModal(temp));
                            }}
                          >
                            -
                          </Button>
                        );
                      },
                    },
                  ]}
                />
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    );
  }
};
