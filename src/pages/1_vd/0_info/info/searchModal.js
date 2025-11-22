import React, { useEffect, useState } from "react";
import Hangul, { search } from "hangul-js";
import _ from "lodash";
import { FileDownloader } from "../../../../components/util";
//components

//redux
import {
  setIsvisibleSchModal,
  setDatasourceSchModal,
} from "../../../../reducers/vd/VdInfoInfo";

// #antd lib
import "antd/dist/antd.css";
import Table from "antd/es/table";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
import Tag from "antd/es/tag";

import { useSelector, useDispatch } from "react-redux";

const { Search } = Input;

export const SearchModal = () => {
  const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
  const dispatch = useDispatch();
  const {
    isvisible_search_modal,
    datasource_sch_modal,
    datasource_sch_modal_mrl,
  } = useSelector((state) => state.VdInfoInfo);
  const { customSorter } = useSelector((state) => state.util);
  const [searchKey, setSearchKey] = useState("");
  const [analysisUrl, setAnalysisUrl] = useState({});
  const [analysisUrlA, setAnalysisUrlA] = useState({});
  const { userinfo, system_check } = useSelector((state) => state.header);

  useEffect(() => {
    fetch(
      "/API/search?TYPE=21120&VDRUG_CODE=" + datasource_sch_modal.VDRUG_CODE,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${userinfo.USERID}`,
        },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setAnalysisUrl(myJson[0] ? myJson[0] : {});
      });
    // fetch(
    //   "/API/search?TYPE=21122&VDRUG_CODE=" + datasource_sch_modal.VDRUG_CODE,
    //   {
    //     method: "GET",
    //     credentials: "include",
    //     headers: {
    //       Authorization: `Bearer ${userinfo.USERID}`,
    //     },
    //   }
    // )
    //   .then(function (response) {
    //     return response.json();
    //   })
    //   .then((myJson) => {
    //     setAnalysisUrlA(myJson[0] ? myJson[0] : {});
    //   });
  }, [dispatch]);

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
            dispatch(setDatasourceSchModal({}));
          }}
          width="80vw"
          title={
            <div>
              {" "}
              동물용의약품 조회 :{" "}
              {datasource_sch_modal.VDRUG_NAME_KR ||
                datasource_sch_modal.VDRUG_NAME_EN}{" "}
            </div>
          }
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 동물용의약품 정보"
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
                  title_1: "공전번호",
                  data_1: datasource_sch_modal.VDRUG_NUM,
                  title_2: "시약명",
                  data_2: (
                    <div>
                      {datasource_sch_modal.STD_NAME !== null &&
                      datasource_sch_modal.STD_NAME !== "" ? (
                        datasource_sch_modal.STD_NAME.split(",").map((data) => (
                          <Tag style={{ fontWeight: "normal" }}>{data}</Tag>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  ),
                  wide: 0,
                },
                {
                  title_1: "동물용의약품명",
                  data_1: datasource_sch_modal.VDRUG_NAME_KR
                    ? datasource_sch_modal.VDRUG_NAME_EN
                      ? datasource_sch_modal.VDRUG_NAME_KR +
                        " (" +
                        datasource_sch_modal.VDRUG_NAME_EN +
                        ")"
                      : datasource_sch_modal.VDRUG_NAME_KR
                    : datasource_sch_modal.VDRUG_NAME_EN
                    ? datasource_sch_modal.VDRUG_NAME_EN
                    : "",
                  title_2: "동물용의약품이명",
                  data_2: (
                    <>
                      {datasource_sch_modal.DIFF_NAME !== null &&
                      datasource_sch_modal.DIFF_NAME !== "" ? (
                        datasource_sch_modal.DIFF_NAME.split(",")
                          .sort()
                          .map((data, idx, raw) => {
                            return (
                              <Tag style={{ fontWeight: "normal" }}>
                                {raw[idx]}
                              </Tag>
                            );
                          })
                      ) : (
                        <></>
                      )}
                    </>
                  ),
                  wide: 0,
                },
                {
                  title_1: "잔류물의정의",
                  data_1: datasource_sch_modal.DEFINE,
                  wide: 1,
                },
                {
                  title_1: "용도",
                  data_1: (
                    <>
                      {datasource_sch_modal.USING_NAME_KR !== null ? (
                        datasource_sch_modal.USING_NAME_KR.split(",")
                          .sort()
                          .map((data, idx, raw) => {
                            return (
                              <Tag style={{ fontWeight: "normal" }}>
                                {raw[idx]}
                                {/* {
                                  datasource_sch_modal.USING_NAME_EN.split(",")[
                                    idx
                                  ]
                                } */}
                              </Tag>
                            );
                          })
                      ) : (
                        <></>
                      )}
                    </>
                  ),
                  wide: 1,
                },
                {
                  title_1: "계통",
                  data_1: datasource_sch_modal.VDRUGS_SYSTEM,
                  wide: 1,
                },
                {
                  title_1: "IUPAC명",
                  data_1: datasource_sch_modal.IUPAC_NAME,
                  wide: 1,
                },
                {
                  title_1: "상품명",
                  data_1: (
                    <div>
                      {datasource_sch_modal.PRODUCT_NAME !== null ? (
                        datasource_sch_modal.PRODUCT_NAME.split(",")
                          .sort()
                          .map((data) => (
                            <Tag
                              style={{
                                fontWeight: "normal",
                                marginTop: "3px",
                                marginBottom: "3px",
                              }}
                            >
                              {data}
                            </Tag>
                          ))
                      ) : (
                        <></>
                      )}
                    </div>
                  ),
                  wide: 1,
                },
                // {
                //   title_1: "안정성 평가보고서",
                //   data_1:
                //     datasource_sch_modal.SAFETY_FILE_LINK !== null &&
                //     datasource_sch_modal.SAFETY_FILE_LINK !== "" ? (
                //       <FileDownloader
                //         fileUrl={
                //           "/API/downloadSafetyReport?VDRUG_CODE=" +
                //           datasource_sch_modal.VDRUG_CODE
                //         }
                //         customFileName={
                //           datasource_sch_modal.SAFETY_FILE_LINK.split(
                //             datasource_sch_modal.VDRUG_CODE
                //           )[0]
                //         }
                //       />
                //     ) : (
                //       <></>
                //     ),
                //   wide: 1,
                // },
              ]}
            />
          </Card>
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 분석법"
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
                  title_1: "물리학적 특성",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://pubchem.ncbi.nlm.nih.gov/#query=" +
                        datasource_sch_modal.VDRUG_NAME_EN
                      }
                    >
                      {datasource_sch_modal.VDRUG_NAME_EN ? (
                        <>Pubchem : {datasource_sch_modal.VDRUG_NAME_EN}</>
                      ) : (
                        <></>
                      )}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "축산물 정성시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        (analysisUrl ? analysisUrl.QUALITATIVE_URL_A : null)
                      }
                    >
                      {analysisUrl ? analysisUrl.QUALITATIVE_NUM_A : null}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "축산물 정량시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        (analysisUrl ? analysisUrl.QUANTITATIVE_URL_A : null)
                      }
                    >
                      {analysisUrl ? analysisUrl.QUANTITATIVE_NUM_A : null}{" "}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "수산물 정성시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        (analysisUrl ? analysisUrl.QUALITATIVE_URL_F : null)
                      }
                    >
                      {analysisUrl ? analysisUrl.QUALITATIVE_NUM_F : null}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "수산물 정량시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        (analysisUrl ? analysisUrl.QUANTITATIVE_URL_F : null)
                      }
                    >
                      {analysisUrl ? analysisUrl.QUANTITATIVE_NUM_F : null}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "기타 정량시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        (analysisUrl ? analysisUrl.QUANTITATIVE_URL_ETC : null)
                      }
                    >
                      {analysisUrl ? analysisUrl.QUANTITATIVE_NUM_ETC : null}
                    </a>
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 잔류허용기준"
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
            <Table
              sticky
              bordered
              size="small"
              // rowKey={item => { return item.NO }}
              pagination={false}
              dataSource={datasource_sch_modal_mrl
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
                },

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

// export default SearchModal;
