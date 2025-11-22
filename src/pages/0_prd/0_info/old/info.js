import React, { useEffect, useRef, useState } from "react";
import Hangul, { search } from "hangul-js";
import _ from "lodash";
import CryptoJS from "crypto-js";
import axios from "axios";
// #antd icon
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
  CloseOutlined,
} from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../components/template";
//components

//redux
import {
  setDataSource,
  setIsvisibleSchModal,
  setDatasourceSchModal,
  setDatasourceSchModalMrl,
  setIsvisibleRegModal,
  setDatasourceRegModal,
  setIsvisibleModModal,
  setDatasourceModModal,
  setDatasourceModModalOrg,
} from "../../../reducers/prd/PrdInfoInfo";
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
import Select from "antd/es/select";
import Checkbox from "antd/es/checkbox";
import Tabs from "antd/es/tabs";

// import Switch from "antd/es/switch";
import Tag from "antd/es/tag";

// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { setSelectedData } from "../../../reducers/prd/prdMrlMrl";

const { Search, TextArea } = Input;
// const { Option } = Select;

const FileDownloader = ({ fileUrl, customFileName }) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = customFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  return (
    <Button type="link" style={{ paddingLeft: "0px" }} onClick={handleDownload}>
      {customFileName}
    </Button>
  );
};

const CustomSearchPromise = (type_num) => {
  return new Promise((resolve) => {
    try {
      fetch("/API/search?TYPE=" + type_num, {
        method: "GET",
        credentials: "include",
      })
        .then(function (response) {
          return response.json();
        })
        .then((myJson) => {
          resolve(myJson);
        });
    } catch (error) {
      console.error("Error in CustomSearch:", error);
      resolve(0);
      throw error;
    }
  });
};

function Info() {
  const dispatch = useDispatch();
  const {
    dataSource,
    isvisible_search_modal,
    isvisible_register_modal,
    isvisible_modify_modal,
  } = useSelector((state) => state.PrdInfoInfo);

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  const [usingArray, setUsingArray] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetch_11111 = await CustomSearchPromise("11111");
        const result = [fetch_11111];
        dispatch(setDataSource(result[0]));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        Header_bottom={{
          title: "농약",
          subTitle: "농약정보",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/info",
              name: "농약",
            },
            {
              href: "/prd/info",
              name: "농약정보",
            },
            {
              href: "/prd/info",
              name: "농약정보",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 1,
          defaultActiveKey: 0,
        }}
        //카드
        main_card={{
          title: "농약 검색",
        }}
        content_card={
          <>
            <Row>
              <Col xs={3}>
                <Select
                  style={{ width: "100%" }}
                  defaultValue={0}
                  onChange={(e) => {
                    setSearchFlag(e);
                  }}
                >
                  <Select.Option value={0}>농약명</Select.Option>
                </Select>
              </Col>
              <Col xs={21}>
                {
                  <Search
                    placeholder="농약명을 입력하세요"
                    enterButton
                    onSearch={(e) => {
                      setSearchKey(e);
                    }}
                  />
                }
              </Col>
            </Row>
          </>
        }
        content={
          <div>
            <Table
              size="small"
              sticky
              bordered
              rowKey={(item) => {
                return item.PESTICIDE_CODE;
              }}
              dataSource={dataSource.filter((val) => {
                if (searchFlag === 0) {
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
                } else {
                  if (val.PESTICIDE_NUM !== null) {
                    Hangul.disassemble(val.PESTICIDE_NUM, true).forEach(
                      (word, index) => {
                        word_str += word[0];
                      }
                    );
                    return (
                      word_str.indexOf(searchKey) !== -1 ||
                      Hangul.disassemble(val.PESTICIDE_NUM, true)[0][0].indexOf(
                        searchKey
                      ) > -1 ||
                      val.PESTICIDE_NUM.indexOf(searchKey) >= 0 ||
                      (val.PESTICIDE_NUM !== "" && val.PESTICIDE_NUM !== null
                        ? val.PESTICIDE_NUM.toLowerCase().indexOf(
                            searchKey.toLowerCase()
                          ) > -1
                        : null)
                    );
                  }
                }
              })}
              columns={[
                // {
                //   title: "공전번호",
                //   dataIndex: "PESTICIDE_NUM",
                //   key: "PESTICIDE_CODE",
                //   width: "10%",
                //   sorter: {
                //     compare: (a, b, sortOrder) =>
                //       customSorter(a, b, sortOrder, "PESTICIDE_NUM"),
                //   },
                //   showSorterTooltip: false,
                //   sortDirections: ["ascend", "descend", "ascend"],
                //   defaultSortOrder: "ascend",
                // },
                {
                  title: "농약 국문명",
                  dataIndex: "PESTICIDE_NAME_KR",
                  key: "PESTICIDE_CODE",
                  width: "35%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => (
                    <a
                      onClick={() => {
                        const promise_datasource_search_modal = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=11112&PESTICIDE_CODE=" +
                                row.PESTICIDE_CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                console.log(myJson[0]);
                                dispatch(setDatasourceSchModal(myJson[0]));
                                resolve(1);
                              });
                          }
                        );
                        const promise_datasource_search_modal_mrl = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=11113&PESTICIDE_CODE=" +
                                row.PESTICIDE_CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceSchModalMrl(myJson));
                                resolve(1);
                              });
                          }
                        );
                        Promise.all([
                          promise_datasource_search_modal,
                          promise_datasource_search_modal_mrl,
                        ]).then((result) => {
                          dispatch(setIsvisibleSchModal(true));
                        });
                      }}
                    >
                      {data}
                    </a>
                  ),
                },
                {
                  title: "농약 영문명",
                  dataIndex: "PESTICIDE_NAME_EN",
                  key: "PESTICIDE_CODE",
                  width: "35%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  render: (data, row, index) => (
                    <a
                      onClick={() => {
                        const promise_datasource_search_modal = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=11112&PESTICIDE_CODE=" +
                                row.PESTICIDE_CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                // console.log(myJson[0])
                                dispatch(setDatasourceSchModal(myJson[0]));
                                resolve(1);
                              });
                          }
                        );

                        const promise_datasource_search_modal_mrl = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=11113&PESTICIDE_CODE=" +
                                row.PESTICIDE_CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceSchModalMrl(myJson));
                                resolve(1);
                              });
                          }
                        );

                        Promise.all([
                          promise_datasource_search_modal,
                          promise_datasource_search_modal_mrl,
                        ]).then((result) => {
                          dispatch(setIsvisibleSchModal(true));
                        });
                      }}
                    >
                      {data}
                    </a>
                  ),
                },
                {
                  title: (
                    <Button
                      size="small"
                      className="button_reg"
                      onClick={() => {
                        dispatch(setIsvisibleRegModal(true));
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  ),

                  align: "center",
                  dataIndex: "",
                  key: "PESTICIDE_CODE",
                  flag: "등록",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.PESTICIDE_CODE}>
                      <Col xs={24}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=11112&PESTICIDE_CODE=" +
                                row.PESTICIDE_CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceModModal(myJson[0]));
                                dispatch(setDatasourceModModalOrg(myJson[0]));
                                dispatch(setIsvisibleModModal(true));
                              });

                            fetch("/API/search?TYPE=11114", {
                              method: "GET",
                              credentials: "include",
                            })
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                setUsingArray(myJson);
                              });
                          }}
                        >
                          <EditOutlined />
                        </Button>
                        <Popconfirm
                          title="정말 삭제하시겠습니까?"
                          onConfirm={() => {
                            var promise_delete = new Promise(
                              (resolve, reject) => {
                                fetch("/API/update", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        TABLE: "T_RESI_PESTICIDE",
                                        KEY: ["PESTICIDE_CODE"],
                                        NUMERIC_KEY: [""],
                                        PESTICIDE_CODE: row.PESTICIDE_CODE,
                                        DELETE_FLAG: "Y",
                                      },
                                    ]),
                                  }),
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  credentials: "include",
                                }).then(function (response) {
                                  if (response.status === 200) {
                                    message.success(
                                      "농약: " +
                                        (row.PESTICIDE_NAME_KR ||
                                          row.PESTICIDE_NAME_EN) +
                                        "을 삭제하였습니다."
                                    );
                                    resolve(1);
                                  } else if (response.status === 401) {
                                    message.error("권한이 없습니다.");
                                    resolve(0);
                                  }
                                });
                              }
                            );

                            Promise.all([promise_delete]).then((values) => {
                              fetch("/API/search?TYPE=11111", {
                                method: "GET",
                                credentials: "include",
                              })
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(setDataSource(myJson));
                                });
                            });
                          }}
                          onCancel={false}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button size="small" className="button_del">
                            <DeleteOutlined />
                          </Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                  ),
                },
              ].filter((data) => {
                if (
                  data.flag === "등록" &&
                  (userinfo.USERID === undefined ||
                    userinfo.PRD_INFO_MOD === "N")
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
      {isvisible_search_modal ? <SearchModal></SearchModal> : <></>}
      {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>}
      {isvisible_modify_modal ? (
        <ModifyModal usingArray={usingArray}></ModifyModal>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Info;

export const SearchModal = () => {
  const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
  const dispatch = useDispatch();
  const {
    isvisible_search_modal,
    datasource_sch_modal,
    datasource_sch_modal_mrl,
  } = useSelector((state) => state.PrdInfoInfo);
  const { customSorter } = useSelector((state) => state.util);
  const [searchKey, setSearchKey] = useState("");
  const [analysisUrl, setAnalysisUrl] = useState({});

  useEffect(() => {
    fetch(
      "/API/search?TYPE=11120&PESTICIDE_CODE=" +
        datasource_sch_modal.PESTICIDE_CODE,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setAnalysisUrl(myJson[0] ? myJson[0] : {});
      });
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
              농약정보 조회 :{" "}
              {datasource_sch_modal.PESTICIDE_NAME_KR ||
                datasource_sch_modal.PESTICIDE_NAME_EN}{" "}
            </div>
          }
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
                  data_1: datasource_sch_modal.PESTICIDE_NUM,
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
                  title_1: "농약명",
                  data_1: datasource_sch_modal.PESTICIDE_NAME_KR
                    ? datasource_sch_modal.PESTICIDE_NAME_EN
                      ? datasource_sch_modal.PESTICIDE_NAME_KR +
                        " (" +
                        datasource_sch_modal.PESTICIDE_NAME_EN +
                        ")"
                      : datasource_sch_modal.PESTICIDE_NAME_KR
                    : datasource_sch_modal.PESTICIDE_NAME_EN
                    ? datasource_sch_modal.PESTICIDE_NAME_EN
                    : "",
                  title_2: "농약이명",
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
                                {raw[idx]} │{" "}
                                {
                                  datasource_sch_modal.USING_NAME_EN.split(",")[
                                    idx
                                  ]
                                }
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
                  data_1: datasource_sch_modal.PESTICIDES_SYSTEM,
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
                {
                  title_1: "안정성 평가보고서",
                  data_1:
                    datasource_sch_modal.SAFETY_FILE_LINK !== null &&
                    datasource_sch_modal.SAFETY_FILE_LINK !== "" ? (
                      <FileDownloader
                        fileUrl={
                          "/API/file_download_prd_safety_report?PESTICIDE_CODE=" +
                          datasource_sch_modal.PESTICIDE_CODE
                        }
                        customFileName={
                          datasource_sch_modal.SAFETY_FILE_LINK.split(
                            ".pdf"
                          )[0] + ".pdf"
                        }
                      />
                    ) : (
                      <></>
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
                        datasource_sch_modal.PESTICIDE_NAME_EN
                      }
                    >
                      {datasource_sch_modal.PESTICIDE_NAME_EN ? (
                        <>Pubchem : {datasource_sch_modal.PESTICIDE_NAME_EN}</>
                      ) : (
                        <></>
                      )}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "농약 정성 시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        analysisUrl
                          ? analysisUrl.QUALITATIVE_URL
                          : null
                      }
                    >
                      {analysisUrl ? analysisUrl.QUALITATIVE_NUM : null}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "농약 정량 시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        analysisUrl
                          ? analysisUrl.QUANTITATIVE_URL
                          : null
                      }
                    >
                      {analysisUrl ? analysisUrl.QUANTITATIVE_NUM : null}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "축산물 다성분 시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        analysisUrl
                          ? analysisUrl.QUANTITATIVE_URL
                          : null
                      }
                    >
                      {analysisUrl ? analysisUrl.QUANTITATIVE_NUM : null}
                    </a>
                  ),
                  wide: 1,
                },
                {
                  title_1: "축산물 다성분 시험법",
                  data_1: (
                    <a
                      target="_blank"
                      href={
                        "https://www.foodsafetykorea.go.kr/foodcode/" +
                        analysisUrl
                          ? analysisUrl.QUANTITATIVE_URL
                          : null
                      }
                    >
                      {analysisUrl ? analysisUrl.QUANTITATIVE_NUM : null}
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

export const CustomInput = (func, datasource, target, prefix) => {
  const dispatch = useDispatch();
  return (
    <>
      <Input
        size="small"
        placeholder="내용을 입력하세요."
        prefix={prefix ? <span style={{ color: "red" }}>*</span> : <></>}
        defaultValue={datasource[target]}
        onBlur={(e) => {
          dispatch(
            func({
              ...datasource,
              [target]: e.target.value,
            })
          );
        }}
      />
      {prefix && (datasource[target] === null || datasource[target] === "") ? (
        <span style={{ color: "red" }}>※ 필수값입니다.</span>
      ) : (
        <></>
      )}
    </>
  );
};

export const CustomTextArea = (func, datasource, target, prefix) => {
  const dispatch = useDispatch();
  return (
    <TextArea
      placeholder="내용을 입력하세요."
      size="small"
      autoSize={{ minRows: 1, maxRows: 10 }}
      prefix={prefix ? <span style={{ color: "red" }}>*</span> : <></>}
      defaultValue={datasource[target]}
      onBlur={(e) => {
        dispatch(
          func({
            ...datasource,
            [target]: e.target.value,
          })
        );
      }}
    />
  );
};

export const CustomTextAreaTags = (func, datasource, target, prefix) => {
  const dispatch = useDispatch();
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTarget, setTempTarget] = useState("");
  const handleInputChange = (e) => {
    setTempTarget(e.target.value);
  };

  const handleInputBlur = (func, idx, target) => {
    const newTarget = datasource[target]
      .split(",")
      .map((data, data_idx) =>
        data_idx === idx ? (tempTarget === "" ? data : tempTarget) : data
      )
      .join(",");

    dispatch(
      func({
        ...datasource,
        [target]: newTarget,
      })
    );
    setEditingIndex(null);
  };
  const handleTagClick = (idx) => {
    setEditingIndex(idx);
  };
  const handleRemoveTag = (e, func, data_idx, target) => {
    e.preventDefault();
    const newTarget = datasource[target]
      .split(",")
      .filter((data, idx) => idx != data_idx)
      .join(",");
    dispatch(
      func({
        ...datasource,
        [target]: newTarget,
      })
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      {datasource[target] !== null && datasource[target] !== "" ? (
        datasource[target].split(",").map((data, data_idx) => {
          return (
            <Tag
              key={data_idx}
              closable
              style={{
                fontWeight: "normal",
                flexBasis: "20%",
              }}
              color="geekblue"
              onClick={() => {
                handleTagClick(data_idx);
              }}
              closeIcon={<CloseOutlined style={{ color: "black" }} />}
              onClose={(e) => handleRemoveTag(e, func, data_idx, target)}
            >
              {editingIndex === data_idx ? (
                <Input
                  size="small"
                  defaultValue={data}
                  onChange={(e) => handleInputChange(e)}
                  onBlur={() => handleInputBlur(func, data_idx, target)}
                  onPressEnter={() => handleInputBlur(func, data_idx, target)}
                  autoFocus
                />
              ) : (
                data
              )}
            </Tag>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

function getCurrentKoreanDateTime() {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");
  const hours = String(koreaTime.getHours()).padStart(2, "0");
  const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
  const seconds = String(koreaTime.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export const customEncrypt = (obj) => {
  var temp = _.cloneDeep(obj);
  temp = JSON.stringify(temp);
  temp = CryptoJS.AES.encrypt(temp, "residue").toString();
  return temp;
};
export const RegisterModal = ({ usingArray }) => {
  console.log(usingArray);
  const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
  const dispatch = useDispatch();
  const {
    isvisible_register_modal,
    datasource_reg_modal,
    // datasource_reg_modal,
  } = useSelector((state) => state.PrdInfoInfo);

  const { customSorter } = useSelector((state) => state.util);

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
export const ModifyModal = ({ usingArray }) => {
  console.log(usingArray);
  const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
  const dispatch = useDispatch();
  const {
    isvisible_modify_modal,
    datasource_mod_modal,
    datasource_mod_modal_org,
  } = useSelector((state) => state.PrdInfoInfo);

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
                  dispatch(setDatasourceModModal({}));
                }}
                onConfirm={() => {
                  const DS = _.cloneDeep(datasource_mod_modal);
                  const DS_ORG = _.cloneDeep(datasource_mod_modal_org);

                  console.log(DS);

                  // 시약명 추가 및 제거
                  fetch("/API/search?TYPE=" + "11119", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((res) => {
                      const maxStdNum = parseInt(res[0].MAX, 10);

                      const DS_STD_NAME =
                        DS.STD_NAME !== null ? DS.STD_NAME.split(",") : [];
                      const DS_STD_NAME_ORG =
                        DS_ORG.STD_NAME !== null
                          ? DS_ORG.STD_NAME.split(",")
                          : [];

                      const DS_STD_added = DS_STD_NAME.filter(
                        (item) => !DS_STD_NAME_ORG.includes(item)
                      ).map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_STD_NAME",
                          STD_NUM: maxStdNum + idx + 1,
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          STD_NAME: data,
                          CON_FLAG: "Y",
                          GUBUN: "PRD",
                          REG_DATE: getCurrentKoreanDateTime(),
                        };
                      });

                      const ENC_DS_STD_added = customEncrypt(DS_STD_added);
                      if (DS_STD_added) {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: ENC_DS_STD_added }),
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

                      const DS_STD_removed = DS_STD_NAME_ORG.filter(
                        (item) => !DS_STD_NAME.includes(item)
                      ).map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_STD_NAME",
                          KEY: ["STD_NAME", "PESTICIDE_CODE"],
                          NUMERIC_KEY: [],
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          STD_NAME: data,
                          CON_FLAG: "N",
                        };
                      });

                      const ENC_DS_STD_removed = customEncrypt(DS_STD_removed);
                      if (DS_STD_removed) {
                        fetch("/API/update", {
                          method: "POST",
                          body: JSON.stringify({ data: ENC_DS_STD_removed }),
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
                    });
                  // 시약명 추가 및 제거 //////////////

                  // 농약이명 추가 및 제거
                  fetch("/API/search?TYPE=" + "11117", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((res) => {
                      const maxDiffNum = parseInt(res[0].MAX, 10);

                      const DS_DIFF_NAME =
                        DS.DIFF_NAME !== null ? DS.DIFF_NAME.split(",") : [];
                      const DS_DIFF_NAME_ORG =
                        DS_ORG.DIFF_NAME !== null
                          ? DS_ORG.DIFF_NAME.split(",")
                          : [];

                      const DS_DIFF_added = DS_DIFF_NAME.filter(
                        (item) => !DS_DIFF_NAME_ORG.includes(item)
                      ).map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_DIFF_NAME",
                          NUM: maxDiffNum + idx + 1,
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          DIFF_NAME: data,
                        };
                      });

                      const ENC_DS_DIFF_added = customEncrypt(DS_DIFF_added);

                      if (DS_DIFF_added.length > 0) {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: ENC_DS_DIFF_added }),
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

                      const DS_DIFF_removed = DS_DIFF_NAME_ORG.filter(
                        (item) => !DS_DIFF_NAME.includes(item)
                      ).map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_DIFF_NAME",
                          KEY: ["DIFF_NAME", "PESTICIDE_CODE"],
                          NUMERIC_KEY: [],
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          DIFF_NAME: data,
                        };
                      });

                      const ENC_DS_DIFF_removed =
                        customEncrypt(DS_DIFF_removed);
                      if (DS_DIFF_removed.length > 0) {
                        fetch("/API/delete", {
                          method: "POST",
                          body: JSON.stringify({ data: ENC_DS_DIFF_removed }),
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
                    });
                  // 농약이명 추가 및 제거 //////////////

                  // 상품명 추가 및 제거
                  fetch("/API/search?TYPE=" + "11118", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((res) => {
                      const maxPRODUCTNum = parseInt(res[0].MAX, 10);

                      const DS_PRODUCT_NAME =
                        DS.PRODUCT_NAME !== null
                          ? DS.PRODUCT_NAME.split(",")
                          : [];
                      const DS_PRODUCT_NAME_ORG =
                        DS_ORG.PRODUCT_NAME !== null
                          ? DS_ORG.PRODUCT_NAME.split(",")
                          : [];

                      const DS_PRODUCT_added = DS_PRODUCT_NAME.filter(
                        (item) => !DS_PRODUCT_NAME_ORG.includes(item)
                      ).map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_PRODUCT_NAME",
                          NUM: maxPRODUCTNum + idx + 1,
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          PRODUCT_NAME: data,
                        };
                      });

                      const ENC_DS_PRODUCT_added =
                        customEncrypt(DS_PRODUCT_added);
                      if (DS_PRODUCT_added.length > 0) {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: ENC_DS_PRODUCT_added }),
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

                      const DS_PRODUCT_removed = DS_PRODUCT_NAME_ORG.filter(
                        (item) => !DS_PRODUCT_NAME.includes(item)
                      ).map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_PRODUCT_NAME",
                          KEY: ["PRODUCT_NAME", "PESTICIDE_CODE"],
                          NUMERIC_KEY: [],
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          PRODUCT_NAME: data,
                        };
                      });

                      const ENC_DS_PRODUCT_removed =
                        customEncrypt(DS_PRODUCT_removed);
                      if (DS_PRODUCT_removed.length > 0) {
                        fetch("/API/delete", {
                          method: "POST",
                          body: JSON.stringify({
                            data: ENC_DS_PRODUCT_removed,
                          }),
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
                    });
                  // 농약이명 추가 및 제거 //////////////

                  // 용도 추가 및 제거
                  fetch("/API/search?TYPE=" + "11114", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then(function (response) {
                      return response.json();
                    })
                    .then((res) => {
                      const krOrgList = (
                        DS_ORG.USING_NAME_KR !== null
                          ? DS_ORG.USING_NAME_KR
                          : ""
                      ).split(",");
                      const enOrgList = (
                        DS_ORG.USING_NAME_EN !== null
                          ? DS_ORG.USING_NAME_EN
                          : ""
                      ).split(",");

                      // 수정된 문자열을 배열로 변환
                      const krList = DS.USING_NAME_KR.split(",");
                      const enList = DS.USING_NAME_EN.split(",");

                      // 원본과 수정된 데이터의 Set 생성
                      const orgSet = new Set(
                        krOrgList.map((kr, i) => kr + "|" + enOrgList[i])
                      );

                      const newSet = new Set(
                        krList.map((kr, i) => kr + "|" + enList[i])
                      );

                      console.log(orgSet, newSet);

                      // 유지, 변경, 제거 항목 초기화
                      var added = new Set();
                      var removed = new Set();

                      // 원본 데이터 순회
                      res.forEach((item) => {
                        const num = item.USING_NUM;
                        const target =
                          item.USING_NAME_KR + "|" + item.USING_NAME_EN;

                        if (!orgSet.has(target) && newSet.has(target)) {
                          added.add(num);
                        } else if (orgSet.has(target) && !newSet.has(target)) {
                          removed.add(num);
                        }
                      });

                      added = Array.from(added);
                      removed = Array.from(removed);

                      const DS_USING_added = added.map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_USING_REL",
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          USING_NUM: data,
                        };
                      });
                      const ENC_DS_USING_added = customEncrypt(DS_USING_added);
                      if (DS_USING_added.length > 0) {
                        fetch("/API/insert", {
                          method: "POST",
                          body: JSON.stringify({ data: ENC_DS_USING_added }),
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

                      const DS_USING_removed = removed.map((data, idx) => {
                        return {
                          TABLE: "T_RESI_PESTICIDE_USING_REL",
                          PESTICIDE_CODE: DS.PESTICIDE_CODE,
                          USING_NUM: data,
                          KEY: ["PESTICIDE_CODE", "USING_NUM"],
                          NUMERIC_KEY: ["USING_NUM"],
                        };
                      });
                      const ENC_DS_USING_removed =
                        customEncrypt(DS_USING_removed);

                      if (DS_USING_removed.length > 0) {
                        fetch("/API/delete", {
                          method: "POST",
                          body: JSON.stringify({
                            data: ENC_DS_USING_removed,
                          }),
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
                    });
                  // 용도 추가 및 제거 //////////////
                  message.success(
                    "농약: " +
                      (DS_ORG.PESTICIDE_NAME_KR || DS_ORG.PESTICIDE_NAME_EN) +
                      "을 수정하였습니다."
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
          width="55vw"
          title={
            <div>
              농약정보 수정 :{" "}
              {datasource_mod_modal.PESTICIDE_NAME_KR ||
                datasource_mod_modal.PESTICIDE_NAME_EN}
            </div>
          }
        >
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="농약 정보" key="1">
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
                      data_1: CustomInput(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "PESTICIDE_NUM",
                        true
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "농약 국문명",
                      data_1: CustomInput(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "PESTICIDE_NAME_KR",
                        true
                      ),
                      title_2: "농약 영문명",
                      data_2: CustomInput(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "PESTICIDE_NAME_EN",
                        true
                      ),
                      wide: 0,
                    },
                    {
                      title_1: "잔류물의 정의",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "DEFINE",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "적용대상작물",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "FOOD_NAME",
                        false
                      ),
                      title_2: "계통",
                      data_2: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "PESTICIDES_SYSTEM",
                        false
                      ),
                      wide: 0,
                    },
                    {
                      title_1: "분자식",
                      data_1: CustomInput(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "MOD_FORM",
                        false
                      ),
                      title_2: "분자량",
                      data_2: CustomInput(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "MOD_WEIGHT",
                        false
                      ),
                      wide: 0,
                    },
                    {
                      title_1: "IUPAC명",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "IUPAC_NAME",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "CAS번호",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "CAS_NUM",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: (
                        <Row>
                          <Col xs={12}>시약명</Col>
                          <Col xs={12} style={{ textAlign: "right" }}>
                            <Button
                              type="ghost"
                              size="small"
                              onClick={() => {
                                console.log(datasource_mod_modal.STD_NAME);
                                dispatch(
                                  setDatasourceModModal({
                                    ...datasource_mod_modal,
                                    STD_NAME:
                                      datasource_mod_modal.STD_NAME === null ||
                                      datasource_mod_modal.STD_NAME === ""
                                        ? "수정하세요"
                                        : `${datasource_mod_modal.STD_NAME},수정하세요`,
                                  })
                                );
                              }}
                            >
                              +
                            </Button>
                          </Col>
                        </Row>
                      ),
                      data_1: CustomTextAreaTags(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "STD_NAME",
                        true
                      ),
                      wide: 1,
                    },
                    {
                      title_1: (
                        <Row>
                          <Col xs={12}>농약이명</Col>
                          <Col xs={12} style={{ textAlign: "right" }}>
                            <Button
                              type="ghost"
                              size="small"
                              onClick={() => {
                                if (datasource_mod_modal.DIFF_NAME === null) {
                                  dispatch(
                                    setDatasourceModModal({
                                      ...datasource_mod_modal,
                                      DIFF_NAME: "수정하세요",
                                    })
                                  );
                                } else {
                                  dispatch(
                                    setDatasourceModModal({
                                      ...datasource_mod_modal,
                                      DIFF_NAME:
                                        datasource_mod_modal.DIFF_NAME ===
                                          null ||
                                        datasource_mod_modal.DIFF_NAME === ""
                                          ? "수정하세요"
                                          : `${datasource_mod_modal.DIFF_NAME},수정하세요`,
                                    })
                                  );
                                }
                              }}
                            >
                              +
                            </Button>
                          </Col>
                        </Row>
                      ),
                      data_1: CustomTextAreaTags(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "DIFF_NAME",
                        true
                      ),
                      wide: 1,
                    },
                    {
                      title_1: (
                        <Row>
                          <Col xs={12}>상품명</Col>
                          <Col xs={12} style={{ textAlign: "right" }}>
                            <Button
                              type="ghost"
                              size="small"
                              onClick={() => {
                                dispatch(
                                  setDatasourceModModal({
                                    ...datasource_mod_modal,
                                    PRODUCT_NAME:
                                      datasource_mod_modal.PRODUCT_NAME ===
                                        null ||
                                      datasource_mod_modal.PRODUCT_NAME === ""
                                        ? "수정하세요"
                                        : `${datasource_mod_modal.PRODUCT_NAME},수정하세요`,
                                  })
                                );
                              }}
                            >
                              +
                            </Button>
                          </Col>
                        </Row>
                      ),
                      data_1: CustomTextAreaTags(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "PRODUCT_NAME",
                        true
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "용도",
                      data_1: (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          {usingArray.map((data) => (
                            <Checkbox
                              key={data.USING_NUM}
                              style={{
                                fontWeight: "normal",
                                flexBasis: "40%",
                              }}
                              checked={(datasource_mod_modal.USING_NAME_KR !==
                              null
                                ? datasource_mod_modal.USING_NAME_KR
                                : ""
                              )
                                .split(",")
                                .includes(data.USING_NAME_KR)}
                              onChange={(e) => {
                                var temp_USING_NAME_KR =
                                  datasource_mod_modal.USING_NAME_KR !== null
                                    ? _.cloneDeep(
                                        datasource_mod_modal.USING_NAME_KR
                                      ).split(",")
                                    : [];
                                var temp_USING_NAME_EN =
                                  datasource_mod_modal.USING_NAME_EN !== null
                                    ? _.cloneDeep(
                                        datasource_mod_modal.USING_NAME_EN
                                      ).split(",")
                                    : [];

                                if (e.target.checked) {
                                  temp_USING_NAME_KR.push(data.USING_NAME_KR);
                                  temp_USING_NAME_EN.push(data.USING_NAME_EN);
                                } else {
                                  temp_USING_NAME_KR =
                                    temp_USING_NAME_KR.filter(
                                      (cond) => cond !== data.USING_NAME_KR
                                    );
                                  temp_USING_NAME_EN =
                                    temp_USING_NAME_EN.filter(
                                      (cond) => cond !== data.USING_NAME_EN
                                    );
                                }

                                dispatch(
                                  setDatasourceModModal({
                                    ...datasource_mod_modal,
                                    USING_NAME_KR: temp_USING_NAME_KR.join(","),
                                    USING_NAME_EN: temp_USING_NAME_EN.join(","),
                                  })
                                );
                              }}
                            >
                              {data.USING_NAME_KR}{" "}
                              {"(" + data.USING_NAME_EN + ")"}
                            </Checkbox>
                          ))}
                        </div>
                      ),
                      wide: 1,
                    },
                  ]}
                ></Table>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="물리화학적 특성" key="2">
              <Card
                size="small"
                bordered={false}
                style={{ textAlign: "left" }}
                title="▣ 물리화학적 특성"
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
                      title_1: "형태",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "PESTICIDES_FORM",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "녹는점",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "MELTING_POINT",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "끓는점",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "BOILING_POINT",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "증기압",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "VAPOR_PRESSURE",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "LogPow",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "LOG_POW",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "밀도",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "DENSITY",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "PKA",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "PKA",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "용해도",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "SOLUBILITY",
                        false
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "안정성",
                      data_1: CustomTextArea(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "STABILITY",
                        false
                      ),
                      wide: 1,
                    },
                  ]}
                ></Table>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="독성 정보" key="3">
              <Card
                size="small"
                bordered={false}
                style={{ textAlign: "left" }}
                title="▣ 독성 정보"
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
                <Row align="middle">
                  <Col xs={2}>
                    <span
                      style={{
                        height: "100%",
                        fontWeight: "bold",
                        borderBottom: "2px solid dodgerblue",
                      }}
                    >
                      한국
                    </span>
                  </Col>
                  <Col xs={22}>
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
                          title_1: "ADI",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ADI_KR",
                            false
                          ),
                          title_2: "Acute RfD",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ACUTRRFD_KR",
                            false
                          ),
                          wide: 0,
                        },
                        {
                          title_1: "Residue",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "RESIDUE_KR",
                            false
                          ),
                          title_2: "독성요약정보",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "TOXCTY_SUMRY_INFO_KR",
                            false
                          ),
                          wide: 0,
                        },
                      ]}
                    ></Table>
                  </Col>
                </Row>
                <Row align="middle">
                  <Col xs={2}>
                    <span
                      style={{
                        height: "100%",
                        fontWeight: "bold",
                        borderBottom: "2px solid dodgerblue",
                      }}
                    >
                      코덱스
                    </span>
                  </Col>
                  <Col xs={22}>
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
                          title_1: "ADI",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ADI",
                            false
                          ),
                          title_2: "Acute RfD",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ACUTRRFD",
                            false
                          ),
                          wide: 0,
                        },
                        {
                          title_1: "Residue",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "RESIDUE",
                            false
                          ),
                          title_2: "독성요약정보",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "TOXCTY_SUMRY_INFO",
                            false
                          ),
                          wide: 0,
                        },
                      ]}
                    ></Table>
                  </Col>
                </Row>
                <Row align="middle">
                  <Col xs={2}>
                    <span
                      style={{
                        height: "100%",
                        fontWeight: "bold",
                        borderBottom: "2px solid dodgerblue",
                      }}
                    >
                      미국
                    </span>
                  </Col>
                  <Col xs={22}>
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
                          title_1: "ADI",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ADI_US",
                            false
                          ),
                          title_2: "Acute RfD",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ACUTRRFD_US",
                            false
                          ),
                          wide: 0,
                        },
                        {
                          title_1: "Residue",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "RESIDUE_US",
                            false
                          ),
                          title_2: "독성요약정보",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "TOXCTY_SUMRY_INFO_US",
                            false
                          ),
                          wide: 0,
                        },
                      ]}
                    ></Table>
                  </Col>
                </Row>
                <Row align="middle">
                  <Col xs={2}>
                    <span
                      style={{
                        height: "100%",
                        fontWeight: "bold",
                        borderBottom: "2px solid dodgerblue",
                      }}
                    >
                      일본
                    </span>
                  </Col>
                  <Col xs={22}>
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
                          title_1: "ADI",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ADI_JP",
                            false
                          ),
                          title_2: "Acute RfD",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ACUTRRFD_JP",
                            false
                          ),
                          wide: 0,
                        },
                        {
                          title_1: "Residue",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "RESIDUE_JP",
                            false
                          ),
                          title_2: "독성요약정보",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "TOXCTY_SUMRY_INFO_JP",
                            false
                          ),
                          wide: 0,
                        },
                      ]}
                    ></Table>
                  </Col>
                </Row>
                <Row align="middle">
                  <Col xs={2}>
                    <span
                      style={{
                        height: "100%",
                        fontWeight: "bold",
                        borderBottom: "2px solid dodgerblue",
                      }}
                    >
                      유럽
                    </span>
                  </Col>
                  <Col xs={22}>
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
                          title_1: "ADI",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ADI_EU",
                            false
                          ),
                          title_2: "Acute RfD",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "ACUTRRFD_EU",
                            false
                          ),
                          wide: 0,
                        },
                        {
                          title_1: "Residue",
                          data_1: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "RESIDUE_EU",
                            false
                          ),
                          title_2: "독성요약정보",
                          data_2: CustomTextArea(
                            setDatasourceModModal,
                            datasource_mod_modal,
                            "TOXCTY_SUMRY_INFO_EU",
                            false
                          ),
                          wide: 0,
                        },
                      ]}
                    ></Table>
                  </Col>
                </Row>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="안정성 평가 보고서" key="4">
              <Card
                size="small"
                bordered={false}
                style={{ textAlign: "left" }}
                title="▣ 안정성 평가 보고서"
                headStyle={{
                  padding: "0px !important",
                  color: "#2a538b",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                bodyStyle={{
                  padding: "20px 20px 20px 20px",
                }}
              ></Card>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
};
