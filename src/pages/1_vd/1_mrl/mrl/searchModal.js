import React, { useState, useEffect, useRef } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
import { FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";
import html2pdf from "html2pdf.js";

import {
  setIsvisibleSchModal,
  setDatasourceModModal,
} from "../../../../reducers/vd/VdMrlMrl_modal";
import "antd/dist/antd.css";
import Table from "antd/es/table";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";

import { ExcelExportButton } from "../../../../components/util";

import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";

const { Search, TextArea } = Input;

export const SearchModal = () => {
  const dispatch = useDispatch();
  const { isvisible_search_modal, datasource_mod_modal, selected_data } =
    useSelector((state) => state.VdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  const contentRef = useRef(null);

  const exportToPDF = (name) => {
    const content = contentRef.current;

    const options = {
      filename: `${name}.pdf`,
      margin: [5, 5, 5, 5],
      image: { type: "jpeg", quality: 2 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "mm", format: "b3", orientation: "portrait" },
    };

    // html2pdf.js를 사용하여 PDF 생성 및 다운로드
    html2pdf().set(options).from(content).save();
  };

  if (!isvisible_search_modal) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_search_modal}
          footer={<></>}
          onCancel={() => {
            dispatch(setIsvisibleSchModal(false));
            dispatch(setDatasourceModModal([]));
          }}
          width="80vw"
          title={
            <div>
              동물용의약품 잔류허용기준 조회 : {selected_data.VDRUG_NAME_KR}
            </div>
          }
        >
          <div ref={contentRef}>
            <Card
              size="small"
              bordered={false}
              style={{ textAlign: "left" }}
              title="▣ 동물용의약품 잔류허용기준 조회"
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
                <Col xs={20}>
                  <Search
                    placeholder="식품명을 입력하세요"
                    style={{ marginBottom: "10px" }}
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                </Col>
                <Col xs={4} style={{ textAlign: "right" }}>
                  <ExcelExportButton
                    data={datasource_mod_modal}
                    name={selected_data.VDRUG_NAME_KR}
                  ></ExcelExportButton>
                  <Button
                    type="text"
                    onClick={() => {
                      exportToPDF(selected_data.VDRUG_NAME_KR);
                    }}
                  >
                    <PrinterOutlined style={{ color: "blue" }} /> PDF
                  </Button>
                </Col>
              </Row>
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
                        Hangul.disassemble(
                          val.FOOD_NAME_KR,
                          true
                        )[0][0].indexOf(searchKey) > -1 ||
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
                    // filters: [
                    //     {
                    //         text: '한국',
                    //         value: 'KR',
                    //     },
                    //     // {
                    //     //     text: '코덱스',
                    //     //     value: 'CD',
                    //     // },
                    //     // {
                    //     //     text: '미국',
                    //     //     value: 'US',
                    //     // },
                    //     // {
                    //     //     text: '유럽',
                    //     //     value: 'EU',
                    //     // },
                    //     // {
                    //     //     text: '중국',
                    //     //     value: 'CN',
                    //     // },
                    //     // {
                    //     //     text: '일본',
                    //     //     value: 'JP',
                    //     // },
                    //     // {
                    //     //     text: '호주',
                    //     //     value: 'AU',
                    //     // },
                    //     // {
                    //     //     text: '대만',
                    //     //     value: 'TW',
                    //     // },
                    //     // {
                    //     //     text: '메뉴얼',
                    //     //     value: 'PM',
                    //     // },
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
                  //     title: "폐기여부",
                  //     dataIndex: "DISCARD_FLAG",
                  //     key: "NO",
                  //     width: "6%",
                  //     sorter: {
                  //         compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "DISCARD_FLAG")),
                  //     },
                  //     showSorterTooltip: false,
                  //     sortDirections: ['ascend', 'descend', 'ascend'],
                  //     render: (data, row, index) => {
                  //         return (
                  //             <Switch
                  //                 checked={data === 'N' ? false : true}
                  //                 // onChange={(e) => {
                  //                 //     const temp = _.cloneDeep(datasource_mod_modal)
                  //                 //     temp[row.NO].DISCARD_FLAG = e ? 'Y' : 'N'
                  //                 //     dispatch(setDatasourceModModal(temp))
                  //                 // }}
                  //                 checkedChildren={"Y"}
                  //                 unCheckedChildren={"N"}
                  //             />
                  //         )
                  //     }
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
                      return row.BIGO;
                    },
                  },
                  // {
                  //     title: <Button
                  //         size="small"
                  //         type="link"
                  //         onClick={() => {
                  //             const temp = _.cloneDeep(datasource_mod_modal)
                  //             dispatch(setDatasourceModModal([...temp, {
                  //                 BIGO: null,
                  //                 COUNTRY_CODE: 'KR',
                  //                 DISCARD_FLAG: 'N',
                  //                 ETC_FLAG: 'N',
                  //                 FOOD_CODE: null,
                  //                 FOOD_NAME_EN: "undefined",
                  //                 FOOD_NAME_KR: "#미정",
                  //                 FOOTNOTE_REF: null,
                  //                 LAUNCH_POINT: "1900-01-01",
                  //                 MRL_VALUE: "",
                  //                 NO: datasource_mod_modal.length,
                  //                 PESTICIDE_CODE: selected_data.PESTICIDE_CODE,
                  //                 QUALIFICATION: null,
                  //                 IS_DELETE: "N",
                  //             },
                  //             ]))
                  //         }}
                  //     >
                  //         +
                  //     </Button>,
                  //     width: "7%",
                  //     align: "center",
                  //     render: (data, row, index) => {
                  //         return (
                  //             <Row justify="space-around">
                  //                 <Col xl={24} align="middle">
                  //                     <Button
                  //                         size="small"
                  //                         type="link"
                  //                         style={{color:"red"}}
                  //                         onClick={() => {
                  //                             const temp = _.cloneDeep(datasource_mod_modal)
                  //                             temp[row.NO].IS_DELETE='Y'
                  //                             dispatch(setDatasourceModModal(temp))
                  //                         }}
                  //                     >
                  //                         -
                  //                     </Button>
                  //                 </Col>
                  //             </Row>
                  //         )
                  //     }
                  // }
                ]}
              />
            </Card>
          </div>
        </Modal>
        {/* {isvisible_modify_drawer_mod?<ModifyDrawer/>:<></>} */}
      </div>
    );
  }
};
