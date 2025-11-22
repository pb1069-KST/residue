import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
import moment from "moment";
import CrytoJS from "crypto-js";
// #antd icon
import { EditOutlined, HomeFilled } from "@ant-design/icons";
// #antd icon
import { ModifyDrawer } from "../mrl/modifyDrawer";
//components
import Template from "../../../../components/template";
//components

//redux
import {
  setDataSource,
  setDataSourceFood,
} from "../../../../reducers/vd/VdMrlMrl";
import {
  setSelectedData,
  setIsvisibleModModal,
  setIsvisibleSchModal,
  setIsvisibleSchModalFood,
  setDatasourceModModal,

  // setIsvisibleModDrawerReg,
  setIsvisibleModDrawerMod,
  setSelectedModalData,
  setIsvisibleModModalAddInfo,
} from "../../../../reducers/vd/VdMrlMrl_modal";

//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Popconfirm from "antd/es/popconfirm";
import Drawer from "antd/es/drawer";
import message from "antd/es/message";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
// import Select from "antd/es/select"
import Switch from "antd/es/switch";
import DatePicker from "antd/es/date-picker";
import Tabs from "antd/es/tabs";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Divider } from "antd";
import {
  customEncrypt,
  CustomInput,
  getCurrentKoreanDateTime,
} from "../../../../components/util";
// import { setIsvisibleModDrawerStdName } from "../../../reducers/std/StdStandardStatus_modal";

const { Search, TextArea } = Input;
// const { Option } = Select;

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const {
    isvisible_modify_modal,
    datasource_mod_modal,
    selected_data,
    isvisible_modify_drawer_mod,
  } = useSelector((state) => state.VdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);
  const [DS_ORG, setDS_ORG] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [isvisibleCheckModal, setIsvisibleCheckModal] = useState(false);

  const [modifiedData, setModifiedData] = useState([]);

  function compareArrays(originalArray, modifiedArray) {
    const modify_arr = [];
    const delete_arr = [];
    const new_arr = [];

    console.log(originalArray, modifiedArray);

    // 수정된 항목과 삭제된 항목 찾기
    originalArray.forEach((originalObj) => {
      const modifiedObj = modifiedArray.find(
        (obj) => obj.NO === originalObj.NO
      );

      if (modifiedObj) {
        // 수정된 항목 확인
        if (
          (originalObj.LAUNCH_POINT !== modifiedObj.LAUNCH_POINT ||
            originalObj.STEP !== modifiedObj.STEP ||
            originalObj.MRL_VALUE !== modifiedObj.MRL_VALUE ||
            originalObj.ETC_FLAG !== modifiedObj.ETC_FLAG ||
            originalObj.BIGO !== modifiedObj.BIGO) &&
          modifiedObj.IS_DELETE !== "Y"
        ) {
          modify_arr.push(modifiedObj);
        }

        // DISCARD_FLAG 변경 확인
        if (originalObj.IS_DELETE === "N" && modifiedObj.IS_DELETE === "Y") {
          delete_arr.push(modifiedObj);
        }
      }
    });

    // 새로운 항목 찾기
    modifiedArray.forEach((modifiedObj) => {
      const exists = originalArray.some(
        (obj) =>
          obj.COUNTRY_CODE === modifiedObj.COUNTRY_CODE &&
          obj.VDRUG_CODE === modifiedObj.VDRUG_CODE &&
          obj.FOOD_CODE === modifiedObj.FOOD_CODE
      );

      if (!exists) {
        new_arr.push(modifiedObj);
      }
    });

    return { modify_arr, delete_arr, new_arr };
  }

  useEffect(() => {
    setDS_ORG(datasource_mod_modal);
  }, [dispatch]);

  if (!isvisible_modify_modal) {
    return <></>;
  } else {
    // setDS_ORG(datasource_mod_modal);
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
                // COUNTRY_CODE
                // VDRUG_CODE
                // FOOD_CODE
                // LAUNCH_POINT
                // STEP
                // MRL_VALUE
                // FOOTNOTE_REF
                // ETC_FLAG
                // DISCARD_FLAG
                // BIGO
                // QUALIFICATION
                // REG_DATE
                onConfirm={() => {
                  var insertData = _.cloneDeep(datasource_mod_modal);
                  var insertDataORG = _.cloneDeep(DS_ORG);

                  insertData = insertData.map((obj) => ({
                    ...obj,
                    TABLE: "T_RESI_VD_VDRUG_MRL",
                  }));

                  insertDataORG = insertDataORG.map((obj) => ({
                    ...obj,
                    TABLE: "T_RESI_VD_VDRUG_MRL",
                  }));

                  const result = compareArrays(insertDataORG, insertData);

                  var new_arr = result.new_arr;
                  var delete_arr = result.delete_arr;
                  var modify_arr = result.modify_arr;

                  console.log("new_arr: ", new_arr);
                  console.log("delete_arr: ", delete_arr);
                  console.log("modify_arr: ", modify_arr);

                  new_arr = new_arr.map(
                    ({
                      FOOD_NAME_KR,
                      FOOD_NAME_EN,
                      NO,
                      IS_NEW,
                      IS_DELETE,
                      ...rest
                    }) => rest
                  );
                  delete_arr = delete_arr.map(
                    ({
                      FOOD_NAME_KR,
                      FOOD_NAME_EN,
                      NO,
                      IS_NEW,
                      IS_DELETE,
                      ...rest
                    }) => rest
                  );
                  delete_arr = delete_arr.map((rest) => ({
                    ...rest,
                    DISCARD_FLAG: "Y",
                  }));
                  modify_arr = modify_arr.map(
                    ({
                      FOOD_NAME_KR,
                      FOOD_NAME_EN,
                      NO,
                      IS_NEW,
                      IS_DELETE,
                      ...rest
                    }) => rest
                  );
                  modify_arr = modify_arr.map((rest) => ({
                    ...rest,
                    REG_DATE: getCurrentKoreanDateTime(),
                  }));

                  console.log(new_arr);
                  console.log(delete_arr);
                  console.log(modify_arr);

                  //   console.log(delete_arr);
                  //   console.log(new_arr);
                  //   var exists_data = insertData.filter(
                  //     (obj) => obj.IS_NEW === "N"
                  //   );
                  //   var new_data = insertData.filter((obj) => obj.IS_NEW === "Y");

                  //   // const data = compareArrays(insertDataORG, exists_data);
                  //   // console.log(data);

                  if (new_arr.length > 0) {
                    var encNewArr = customEncrypt(new_arr);
                    fetch("/API/insertNewMrlVD", {
                      method: "POST",
                      body: JSON.stringify({ data: encNewArr }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                      } else if (response.status === 401) {
                      }
                    });
                  }

                  if (delete_arr.length > 0) {
                    var encDeleteArr = customEncrypt(delete_arr);
                    fetch("/API/deleteMrlVD", {
                      method: "POST",
                      body: JSON.stringify({ data: encDeleteArr }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                      } else if (response.status === 401) {
                      }
                    });
                  }

                  if (modify_arr.length > 0) {
                    var encUpdateArr = customEncrypt(modify_arr);
                    fetch("/API/updateMrlVD", {
                      method: "POST",
                      body: JSON.stringify({ data: encUpdateArr }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }).then(function (response) {
                      if (response.status === 200) {
                      } else if (response.status === 401) {
                      }
                    });
                  }

                  message.success(
                    `잔류허용기준 수정: [${selected_data.VDRUG_NAME_KR}] 의 잔류허용기준을 수정하였습니다.`
                  );
                  dispatch(setIsvisibleModModal(false));
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
          width="80vw"
          title={
            <div>
              동물용의약품 잔류허용기준 수정 : {selected_data.VDRUG_NAME_KR}
            </div>
          }
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
            <Search
              placeholder="식품명을 입력하세요"
              style={{ marginBottom: "10px" }}
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />
            {/* <Row>
                <Col xs={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ padding: "0px" }}
                    type="link"
                    onClick={() => {
                      setIsvisibleCheckModal(true);
                      var insertData = _.cloneDeep(datasource_mod_modal);
                      var insertDataORG = _.cloneDeep(DS_ORG);
  
                      var exists_data = insertData.filter(
                        (obj) => obj.IS_NEW === "N"
                      );
                      var new_data = insertData.filter(
                        (obj) => obj.IS_NEW === "Y"
                      );
  
                      const data = compareArrays(insertDataORG, exists_data);
                      setModifiedData(data);
                    }}
                  >
                    변경사항 확인
                  </Button>
                </Col>
              </Row> */}
            <Drawer
              title="변경사항 요약"
              open={isvisibleCheckModal}
              visible={isvisibleCheckModal}
              // closable={true}
              onClose={() => {
                setIsvisibleCheckModal(false);
              }}
              width={800}
            >
              <Table
                columns={[
                  {
                    title: "동물용의약품명",
                    dataIndex: "VDRUG_NAME_KR",
                    key: "NO",
                    width: "20%",
                    sorter: {
                      compare: (a, b, sortOrder) =>
                        customSorter(a, b, sortOrder, "VDRUG_NAME_KR"),
                    },
                    showSorterTooltip: false,
                    sortDirections: ["ascend", "descend", "ascend"],
                  },
                  {
                    title: "항목",
                    dataIndex: "changes",
                    render: (data, row, index) => {
                      console.log(data, row);
                      return <></>;
                    },
                  },
                  {
                    title: "변경 전",
                  },
                  {
                    title: "변경 후",
                  },
                ]}
                dataSource={modifiedData}
                rowKey="NO"
              />
            </Drawer>

            <Table
              sticky
              bordered
              size="small"
              rowKey={(item) => {
                return item.NO;
              }}
              pagination={false}
              dataSource={datasource_mod_modal
                .filter((data) => data.IS_DELETE !== "Y")
                .filter((val) => {
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
                  title: "국가",
                  dataIndex: "COUNTRY_CODE",
                  key: "NO",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "COUNTRY_CODE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultFilteredValue: ["KR"],
                  filters: [
                    {
                      text: "한국",
                      value: "KR",
                    },
                    // {
                    //     text: '코덱스',
                    //     value: 'CD',
                    // },
                    // {
                    //     text: '미국',
                    //     value: 'US',
                    // },
                    // {
                    //     text: '유럽',
                    //     value: 'EU',
                    // },
                    // {
                    //     text: '중국',
                    //     value: 'CN',
                    // },
                    // {
                    //     text: '일본',
                    //     value: 'JP',
                    // },
                    // {
                    //     text: '호주',
                    //     value: 'AU',
                    // },
                    // {
                    //     text: '대만',
                    //     value: 'TW',
                    // },
                    // {
                    //     text: '메뉴얼',
                    //     value: 'PM',
                    // },
                  ],
                  onFilter: (value, record) => value === record.COUNTRY_CODE,
                  render: (data, row, index) => {
                    return (
                      <>
                        {
                          [
                            {
                              text: "한국",
                              value: "KR",
                            },
                            {
                              text: "코덱스",
                              value: "CD",
                            },
                            {
                              text: "미국",
                              value: "US",
                            },
                            {
                              text: "유럽",
                              value: "EU",
                            },
                            {
                              text: "중국",
                              value: "CN",
                            },
                            {
                              text: "일본",
                              value: "JP",
                            },
                            {
                              text: "호주",
                              value: "AU",
                            },
                            {
                              text: "대만",
                              value: "TW",
                            },
                            {
                              text: "메뉴얼",
                              value: "PM",
                            },
                          ].filter((fdata) => fdata.value === data)[0].text
                        }
                      </>
                    );
                  },
                },
                {
                  title: "식품명",
                  dataIndex: "FOOD_NAME_KR",
                  key: "NO",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "FOOD_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  render: (data, row, index) => {
                    return (
                      <Row>
                        <Col xs={24}>
                          <>
                            {data !== "" ? (
                              <>
                                {data} ({row.FOOD_NAME_EN})
                              </>
                            ) : (
                              <>{row.FOOD_NAME_EN}</>
                            )}
                          </>
                        </Col>
                        {/* <Col xs={6}>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => {
                                dispatch(setIsvisibleModDrawerMod(true));
                                dispatch(setSelectedModalData(row));
                              }}
                            >
                              조회
                            </Button>
                          </Col> */}
                      </Row>
                    );
                  },
                },
                {
                  title: "MRL",
                  dataIndex: "MRL_VALUE",
                  key: "NO",
                  width: "5%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "MRL_VALUE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <Input
                        defaultValue={row.MRL_VALUE}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].MRL_VALUE = e.target.value;
                          dispatch(setDatasourceModModal(temp));
                        }}
                      ></Input>
                    );
                  },
                },
                {
                  title: "시행시점",
                  dataIndex: "LAUNCH_POINT",
                  key: "NO",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "LAUNCH_POINT"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <DatePicker
                        size="small"
                        value={moment(
                          datasource_mod_modal[row.NO].LAUNCH_POINT,
                          "YYYY-MM-DD"
                        )}
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].LAUNCH_POINT = dateString;
                          dispatch(setDatasourceModModal(temp));
                        }}
                      />
                    );
                  },
                },
                {
                  title: "기타류 여부",
                  dataIndex: "ETC_FLAG",
                  key: "NO",
                  width: "6%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ETC_FLAG"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <Switch
                        checked={data === "N" ? false : true}
                        onChange={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].ETC_FLAG = e ? "Y" : "N";
                          dispatch(setDatasourceModModal(temp));
                        }}
                        checkedChildren={"Y"}
                        unCheckedChildren={"N"}
                      />
                    );
                  },
                },
                // {
                //   title: "폐기여부",
                //   dataIndex: "DISCARD_FLAG",
                //   key: "NO",
                //   width: "6%",
                //   sorter: {
                //     compare: (a, b, sortOrder) =>
                //       customSorter(a, b, sortOrder, "DISCARD_FLAG"),
                //   },
                //   showSorterTooltip: false,
                //   sortDirections: ["ascend", "descend", "ascend"],
                //   render: (data, row, index) => {
                //     return (
                //       <Switch
                //         checked={data === "N" ? false : true}
                //         onChange={(e) => {
                //           const temp = _.cloneDeep(datasource_mod_modal);
                //           temp[row.NO].DISCARD_FLAG = e ? "Y" : "N";
                //           dispatch(setDatasourceModModal(temp));
                //         }}
                //         checkedChildren={"Y"}
                //         unCheckedChildren={"N"}
                //       />
                //     );
                //   },
                // },
                {
                  title: "비고",
                  dataIndex: "BIGO",
                  key: "NO",
                  width: "20%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "BIGO"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => {
                    return (
                      <Input
                        defaultValue={row.BIGO}
                        size="small"
                        onBlur={(e) => {
                          const temp = _.cloneDeep(datasource_mod_modal);
                          temp[row.NO].BIGO = e.target.value;
                          dispatch(setDatasourceModModal(temp));
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
                        dispatch(setIsvisibleModDrawerMod(true));
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
                              temp[row.NO].IS_DELETE = "Y";
                              dispatch(setDatasourceModModal(temp));
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
        {isvisible_modify_drawer_mod ? <ModifyDrawer /> : <></>}
      </div>
    );
  }
};
