import React from "react";
import _ from "lodash";

import {
  customEncrypt,
  CustomInput,
  CustomTextArea,
  CustomSearchPromise,
} from "../../../../components/util";

//redux
import {
  setDataSource,
  setIsvisibleRegModal,
  setDatasourceRegModal,
} from "../../../../reducers/prd/PrdInfoInfo";
//

// #antd lib
import "antd/dist/antd.css";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Popconfirm from "antd/es/popconfirm";
import message from "antd/es/message";
import Modal from "antd/es/modal";
import Card from "antd/es/card";

import { useSelector, useDispatch } from "react-redux";

export const RegisterModal = ({ usingArray }) => {
  //   const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
  const dispatch = useDispatch();
  const { isvisible_register_modal, datasource_reg_modal } = useSelector(
    (state) => state.PrdInfoInfo
  );

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
                  fetch("/API/search?TYPE=" + "11115", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((res) => {
                      const newPesticideCode =
                        "P" + (parseInt(res[0].MAX.split("P")[1], 10) + 1);
                      var DS = _.cloneDeep(datasource_reg_modal);
                      DS.TABLE = "T_RESI_PESTICIDE";
                      DS.PESTICIDE_CODE = newPesticideCode;

                      const ENC_DS_PRODUCT_added = customEncrypt([DS]);

                      fetch("/API/insert", {
                        method: "POST",
                        body: JSON.stringify({ data: ENC_DS_PRODUCT_added }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }).then(function (response) {
                        if (response.status === 200) {
                          dispatch(setIsvisibleRegModal(false));

                          async function fetchData() {
                            try {
                              const fetch_11111 = await CustomSearchPromise(
                                "11111"
                              );
                              const result = [fetch_11111];
                              dispatch(setDataSource(result[0]));
                              message.success(
                                "용도: " +
                                  (DS.PESTICIDE_NAME_KR ||
                                    DS.PESTICIDE_NAME_EN) +
                                  "을 등록하였습니다."
                              );
                            } catch (error) {
                              console.error("Error fetching data:", error);
                            }
                          }
                          fetchData();
                        } else if (response.status === 401) {
                        }
                      });
                    });
                }}
                okText="등록"
                cancelText="취소"
              >
                <Button type="primary" size="small">
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
          width="55vw"
          title={<div>농약정보 등록</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약 정보"
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
                  render: (text, row) => ({
                    children: <>{text}</>,
                    ...(row.wide === 1 ? { props: { colSpan: 3 } } : {}),
                  }),
                },
                {
                  dataIndex: "title_2",
                  width: "15%",
                  className: "table-title",
                  render: (text, row) =>
                    row.wide === 1 ? (
                      { props: { colSpan: 0 }, children: <>{text}</> }
                    ) : (
                      <>{text}</>
                    ),
                },
                {
                  dataIndex: "data_2",
                  render: (text, row) =>
                    row.wide === 1 ? (
                      { props: { colSpan: 0 }, children: <>{text}</> }
                    ) : (
                      <>{text}</>
                    ),
                },
              ]}
              dataSource={[
                {
                  title_1: "공전번호",
                  data_1: CustomInput(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "PESTICIDE_NUM",
                    true
                  ),
                  wide: 1,
                },
                {
                  title_1: "농약 국문명",
                  data_1: CustomInput(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "PESTICIDE_NAME_KR",
                    true
                  ),
                  title_2: "농약 영문명",
                  data_2: CustomInput(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "PESTICIDE_NAME_EN",
                    true
                  ),
                  wide: 0,
                },
                {
                  title_1: "잔류물의 정의",
                  data_1: CustomTextArea(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "DEFINE",
                    false
                  ),
                  wide: 1,
                },
                {
                  title_1: "적용대상작물",
                  data_1: CustomTextArea(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "FOOD_NAME",
                    false
                  ),
                  title_2: "계통",
                  data_2: CustomTextArea(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "PESTICIDES_SYSTEM",
                    false
                  ),
                  wide: 0,
                },
                {
                  title_1: "분자식",
                  data_1: CustomInput(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "MOD_FORM",
                    false
                  ),
                  title_2: "분자량",
                  data_2: CustomInput(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "MOD_WEIGHT",
                    false
                  ),
                  wide: 0,
                },
                {
                  title_1: "IUPAC명",
                  data_1: CustomTextArea(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "IUPAC_NAME",
                    false
                  ),
                  wide: 1,
                },
                {
                  title_1: "CAS번호",
                  data_1: CustomTextArea(
                    setDatasourceRegModal,
                    datasource_reg_modal,
                    "CAS_NUM",
                    false
                  ),
                  wide: 1,
                },
              ]}
            ></Table>
          </Card>
        </Modal>
      </div>
    );
  }
};

export default RegisterModal;
