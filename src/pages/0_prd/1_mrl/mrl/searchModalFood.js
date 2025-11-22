import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";

import {
  setIsvisibleSchModalFood,
  setDatasourceModModal,
} from "../../../../reducers/prd/prdMrlMrl_modal";

import "antd/dist/antd.css";
import Table from "antd/es/table";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";

import { useSelector, useDispatch } from "react-redux";

const { Search, TextArea } = Input;

export const SearchModalFood = () => {
  const dispatch = useDispatch();
  const { isvisible_search_modal_food, datasource_mod_modal, selected_data } =
    useSelector((state) => state.prdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  if (!isvisible_search_modal_food) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_search_modal_food}
          footer={<></>}
          onCancel={() => {
            dispatch(setIsvisibleSchModalFood(false));
            dispatch(setDatasourceModModal([]));
          }}
          width="80vw"
          title={
            <div>농약잔류허용기준 조회 : {selected_data.FOOD_NAME_KR}</div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 농약잔류허용기준 조회"
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
              placeholder="농약명을 입력하세요"
              style={{ marginBottom: "10px" }}
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />

            <Table
              sticky
              bordered
              size="small"
              rowKey={(item) => {
                return item.NO;
              }}
              pagination={false}
              dataSource={datasource_mod_modal.filter((val) => {
                if (val.PESTICIDE_NAME_KR !== null) {
                  var word_str = "";
                  Hangul.disassemble(val.PESTICIDE_NAME_KR, true).forEach(
                    (word, index) => {
                      word_str += word[0];
                    }
                  );
                  return (
                    word_str.indexOf(searchKey) !== -1 ||
                    Hangul.disassemble(
                      val.PESTICIDE_NAME_KR,
                      true
                    )[0][0].indexOf(searchKey) > -1 ||
                    val.PESTICIDE_NAME_KR.indexOf(searchKey) >= 0 ||
                    (val.PESTICIDE_NAME_EN !== "" &&
                    val.PESTICIDE_NAME_EN !== null
                      ? val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
                          searchKey.toLowerCase()
                        ) > -1
                      : null)
                  );
                } else {
                  return (
                    val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
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
                  // filters: [
                  //     {
                  //         text: '한국',
                  //         value: 'KR',
                  //     },
                  // ],
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
                  title: "농약 국문명",
                  dataIndex: "PESTICIDE_NAME_KR",
                  key: "NO",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                  // render: (data, row, index) => {
                  //     return (
                  //         <Row>
                  //             <Col xs={18}><>{data !== '' ? <>{data}({row.FOOD_NAME_EN})</> : <>{row.FOOD_NAME_EN}</>}</></Col>
                  //             <Col xs={6}><Button type="primary" size="small"
                  //                 onClick={()=>{
                  //                     dispatch(setIsvisibleModDrawerMod(true))
                  //                     dispatch(setSelectedModalData(row))
                  //                 }}
                  //             >조회</Button></Col>
                  //         </Row>

                  //     )
                  // }
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
                  // render: (data, row, index) => {
                  //     return (
                  //         <Input
                  //             defaultValue={row.MRL_VALUE}
                  //             size="small"
                  //             onBlur={(e) => {
                  //                 const temp = _.cloneDeep(datasource_mod_modal)
                  //                 temp[row.NO].MRL_VALUE = e.target.value
                  //                 dispatch(setDatasourceModModal(temp))
                  //             }}
                  //         ></Input>
                  //     )
                  // }
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
                  // render: (data, row, index) => {
                  //     return (
                  //         <DatePicker
                  //             size="small"
                  //             value={moment(datasource_mod_modal[row.NO].LAUNCH_POINT, 'YYYY-MM-DD')}
                  //             style={{ width: "100%" }}
                  //             onChange={(date, dateString) => {
                  //                 const temp = _.cloneDeep(datasource_mod_modal)
                  //                 temp[row.NO].LAUNCH_POINT = dateString
                  //                 dispatch(setDatasourceModModal(temp))
                  //             }} />
                  //     )
                  // }
                },
                // {
                //     title: "기타류 여부",
                //     dataIndex: "ETC_FLAG",
                //     key: "NO",
                //     width: "6%",
                //     sorter: {
                //         compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "ETC_FLAG")),
                //     },
                //     showSorterTooltip: false,
                //     sortDirections: ['ascend', 'descend', 'ascend'],
                //     render: (data, row, index) => {
                //         return (
                //             <Switch
                //                 checked={data === 'N' ? false : true}
                //                 // onChange={(e) => {
                //                 //     const temp = _.cloneDeep(datasource_mod_modal)
                //                 //     temp[row.NO].ETC_FLAG = e ? 'Y' : 'N'
                //                 //     dispatch(setDatasourceModModal(temp))
                //                 // }}
                //                 checkedChildren={"Y"}
                //                 unCheckedChildren={"N"}
                //             />

                //         )
                //     }
                // },
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
                //         // onChange={(e) => {
                //         //     const temp = _.cloneDeep(datasource_mod_modal)
                //         //     temp[row.NO].DISCARD_FLAG = e ? 'Y' : 'N'
                //         //     dispatch(setDatasourceModModal(temp))
                //         // }}
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
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};
