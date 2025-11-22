import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
// #antd icon
import { EditOutlined, HomeFilled } from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../components/template";
//components

//redux
import { setDataSource } from "../../../reducers/vd/VdInfoAdi";
import {
  setIsvisibleModModal,
  setDatasourceModModal,
  setSelectedData,
} from "../../../reducers/vd/VdInfoAdi_modal";
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

import { useSelector, useDispatch } from "react-redux";
import { customEncrypt } from "../../util";

const { Option } = Select;
const { Search } = Input;

function Adi() {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.VdInfoAdi);
  const { isvisible_modify_modal } = useSelector(
    (state) => state.VdInfoAdi_modal
  );

  //////////////////////////////////////////////////////////////////////
  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  //////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetch("/API/search?TYPE=21311", {
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
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "동물용의약품",
          subTitle: "동물용의약품 ADI",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/vd/adi",
              name: "동물용의약품",
            },
            {
              href: "/vd/adi",
              name: "동물용의약품 정보",
            },
            {
              href: "/vd/adi",
              name: "동물용의약품 ADI",
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
          title: "ADI 검색",
        }}
        content_card={
          <div>
            <Search
              placeholder="동물용의약품명을 입력하세요"
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
                return item.VDRUG_CODE;
              }}
              dataSource={dataSource.filter((val) => {
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
              })}
              columns={[
                {
                  title: "동물용의약품 국문명",
                  dataIndex: "VDRUG_NAME_KR",
                  key: "VDRUG_CODE",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "VDRUG_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                },
                {
                  title: "동물용의약품 영문명",
                  dataIndex: "VDRUG_NAME_EN",
                  key: "VDRUG_CODE",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "VDRUG_NAME_EN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "한국",
                  dataIndex: "ADI_KR",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "코덱스",
                  dataIndex: "ADI_CD",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_CD"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "미국",
                  dataIndex: "ADI_US",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_US"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "유럽",
                  dataIndex: "ADI_EU",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_EU"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "중국",
                  dataIndex: "ADI_CN",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_CN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "일본",
                  dataIndex: "ADI_JP",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_JP"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "대만",
                  dataIndex: "ADI_TW",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_TW"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "호주",
                  dataIndex: "ADI_AU",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_AU"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "메뉴얼",
                  dataIndex: "ADI_PM",
                  key: "VDRUG_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_PM"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "",
                  align: "center",
                  dataIndex: "",
                  key: "VDRUG_CODE",
                  flag: "등록",
                  width: "8%",
                  render: (data, row, index) => (
                    <Row key={row.VDRUG_CODE}>
                      <Col xs={24}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=21312&VDRUG_CODE=" +
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
                                dispatch(setDatasourceModModal(myJson));
                                dispatch(setIsvisibleModModal(true));
                                dispatch(setSelectedData(data));
                              });
                          }}
                        >
                          <EditOutlined />
                        </Button>
                      </Col>
                    </Row>
                  ),
                },
              ].filter((data) => {
                if (
                  data.flag === "등록" &&
                  (userinfo.USERID === undefined || userinfo.VD_ADI_MOD === "N")
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
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
    </div>
  );
}

export default Adi;

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal, datasource_mod_modal, selected_data } =
    useSelector((state) => state.VdInfoAdi_modal);
  const { customSorter } = useSelector((state) => state.util);
  const xs_title = 3;
  const xs_input = 20;

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
                    data.TABLE = "T_RESI_VD_ADI";
                    data.VDRUG_CODE = selected_data.VDRUG_CODE;
                  });
                  fetch("/API/delete", {
                    method: "POST",
                    body: JSON.stringify({
                      data: customEncrypt([
                        {
                          VDRUG_CODE: selected_data.VDRUG_CODE,
                          TABLE: "T_RESI_VD_ADI",
                          KEY: ["VDRUG_CODE"],
                        },
                      ]),
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }).then(function (response) {
                    if (response.status === 200) {
                      ////////////////////////////////////////////////////////////////////////////////////
                      if (datasource_mod_modal_temp.length === 0) {
                        message.success(
                          "ADI: " +
                            selected_data.VDRUG_NAME_KR +
                            "을 수정하였습니다."
                        );
                        dispatch(setIsvisibleModModal(false));
                        dispatch(setDatasourceModModal([]));

                        fetch("/API/search?TYPE=21311", {
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
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({
                            data: customEncrypt(datasource_mod_modal_temp),
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }).then(function (response) {
                          if (response.status === 200) {
                            message.success(
                              "ADI: " +
                                selected_data.VDRUG_NAME_KR +
                                "을 수정하였습니다."
                            );
                            dispatch(setIsvisibleModModal(false));
                            dispatch(setDatasourceModModal([]));

                            fetch("/API/search?TYPE=21311", {
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
              동물용의약품 ADI 수정
              {" : " +
                (selected_data.VDRUG_NAME_KR !== null
                  ? selected_data.VDRUG_NAME_KR +
                    "(" +
                    selected_data.VDRUG_NAME_EN +
                    ")"
                  : selected_data.VDRUG_NAME_EN)}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 동물용의약품 ADI 수정"
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
              {/* <Col xs={xs_title} className="modal-input-col">
                <>
                  <span style={{ color: "red" }}>*</span>
                  <span>ADI 수정</span>
                </>
              </Col> */}
              {/* <Col xs={1}></Col> */}
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
                      key: "VDRUG_CODE",
                      width: "20%",
                      sorter: {
                        compare: (a, b, sortOrder) =>
                          customSorter(a, b, sortOrder, "VDRUG_NAME_KR"),
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
                          customSorter(a, b, sortOrder, "VDRUG_NAME_KR"),
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
