import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
//redux
import {
  setIsvisibleModModal,
  setDatasourceModModal,
  setDataSource,
} from "../../../../reducers/prd/PrdInfoInfo";
//

import {
  UploadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import {
  customEncrypt,
  CustomInput,
  CustomTextArea,
  CustomTextAreaTags,
  getCurrentKoreanDateTime,
  CheckNullBlank,
  FileDownloader,
} from "../../../../components/util";

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Tooltip from "antd/es/tooltip";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Popconfirm from "antd/es/popconfirm";
import message from "antd/es/message";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
import Checkbox from "antd/es/checkbox";
import Tabs from "antd/es/tabs";
import Upload from "antd/es/upload";

// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Divider } from "antd";

export const ModifyModal = ({ usingArray }) => {
  console.log(usingArray);
  const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { userinfo, system_check } = useSelector((state) => state.header);

  const {
    isvisible_modify_modal,
    datasource_mod_modal,
    datasource_mod_modal_org,
  } = useSelector((state) => state.PrdInfoInfo);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });
    var query = customEncrypt({
      PESTICIDE_CODE: datasource_mod_modal.PESTICIDE_CODE,
      TABLE: "T_RESI_PESTICIDE",
      KEY: ["PESTICIDE_CODE"],
      NUMERIC_KEY: [],
      SAFETY_FILE_LINK: fileList[0].name + datasource_mod_modal.PESTICIDE_CODE,
    });
    formData.append("data", query);
    setUploading(true);
    // You can use any AJAX library you like
    fetch(
      "/API/uploadSafetyReport?PESTICIDE_CODE=" +
        datasource_mod_modal.PESTICIDE_CODE,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => {
      if (res.status === 200) {
        fetch(
          "/API/search?TYPE=11112&PESTICIDE_CODE=" +
            datasource_mod_modal.PESTICIDE_CODE,
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
          });
        message.success(
          "농약 정보: <" + fileList[0].name + "> 파일을 업로드하였습니다."
        );

        setFileList([]);
        setUploading(false);
      } else {
        message.success(
          "농약 정보: <" + fileList[0].name + "> 파일을 업로드하지 못했습니다."
        );
        setFileList([]);
        setUploading(false);
      }
    });
  };

  //   const { customSorter } = useSelector((state) => state.util);

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

                  var DS_UPDATE = [
                    {
                      ...DS,
                      TABLE: "T_RESI_PESTICIDE",
                      KEY: ["PESTICIDE_CODE"],
                      NUMERIC_KEY: [],
                    },
                  ];

                  DS_UPDATE = DS_UPDATE.map(
                    ({
                      DIFF_NAME,
                      STD_NAME,
                      USING_NAME_EN,
                      USING_NAME_KR,
                      PRODUCT_NAME,
                      ...rest
                    }) => rest
                  );

                  const customFetchPOST = async (method, encData) => {
                    let promise = new Promise((resolve, reject) => {
                      fetch("/API/" + method, {
                        method: "POST",
                        body: JSON.stringify({ data: encData }),
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                      }).then((response) => {
                        if (response.status === 200) {
                          resolve(true);
                        } else {
                          resolve(false);
                        }
                      });
                    });

                    let result = await promise;
                    return result;
                  };

                  const promise_DS = new Promise((resolve_DS) => {
                    const ENC_DS_PRD = customEncrypt(DS_UPDATE);
                    const promise_update = new Promise((resolve) => {
                      resolve(customFetchPOST("update", ENC_DS_PRD));
                    });
                    Promise.all([promise_update]).then((results) => {
                      console.log(results);
                      const result = results.reduce(
                        (acc, curr) => acc && curr,
                        true
                      );
                      if (result) {
                        resolve_DS(true);
                      } else {
                        resolve_DS(false);
                      }
                    });
                  });

                  const promise_STD = new Promise((resolve_STD) => {
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

                        const promise_insert = new Promise((resolve) => {
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
                            resolve(
                              customFetchPOST("insert", ENC_DS_STD_added)
                            );
                          } else {
                            resolve(true);
                          }
                        });

                        const promise_update = new Promise((resolve) => {
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

                          const ENC_DS_STD_removed =
                            customEncrypt(DS_STD_removed);
                          if (DS_STD_removed) {
                            resolve(
                              customFetchPOST("update", ENC_DS_STD_removed)
                            );
                          } else {
                            resolve(true);
                          }
                        });
                        Promise.all([promise_insert, promise_update]).then(
                          (results) => {
                            const result = results.reduce(
                              (acc, curr) => acc && curr,
                              true
                            );
                            if (result) {
                              resolve_STD(true);
                            } else {
                              resolve_STD(false);
                            }
                          }
                        );
                      });
                  });

                  const promise_DIFF = new Promise((resolve_DIFF) => {
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
                        const promise_insert = new Promise((resolve) => {
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

                          const ENC_DS_DIFF_added =
                            customEncrypt(DS_DIFF_added);

                          if (DS_DIFF_added.length > 0) {
                            resolve(
                              customFetchPOST("insert", ENC_DS_DIFF_added)
                            );
                          } else {
                            resolve(true);
                          }
                        });
                        const promise_delete = new Promise((resolve) => {
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
                            resolve(
                              customFetchPOST("delete", ENC_DS_DIFF_removed)
                            );
                          } else {
                            resolve(true);
                          }
                        });
                        Promise.all([promise_insert, promise_delete]).then(
                          (results) => {
                            const result = results.reduce(
                              (acc, curr) => acc && curr,
                              true
                            );
                            if (result) {
                              resolve_DIFF(true);
                            } else {
                              resolve_DIFF(false);
                            }
                          }
                        );
                      });
                  });

                  const promise_PRODUCT = new Promise((resolve_PRODUCT) => {
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

                        const promise_insert = new Promise((resolve) => {
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
                            resolve(
                              customFetchPOST("insert", ENC_DS_PRODUCT_added)
                            );
                          } else {
                            resolve(true);
                          }
                        });
                        const promise_delete = new Promise((resolve) => {
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
                            resolve(
                              customFetchPOST("delete", ENC_DS_PRODUCT_removed)
                            );
                          } else {
                            resolve(true);
                          }
                        });
                        Promise.all([promise_insert, promise_delete]).then(
                          (results) => {
                            const result = results.reduce(
                              (acc, curr) => acc && curr,
                              true
                            );
                            if (result) {
                              resolve_PRODUCT(true);
                            } else {
                              resolve_PRODUCT(false);
                            }
                          }
                        );
                      });
                  });

                  // 농약이명 추가 및 제거 //////////////
                  const promise_USING = new Promise((resolve_USING) => {
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
                        const krList =
                          DS.USING_NAME_KR !== null && DS.USING_NAME_KR !== ""
                            ? DS.USING_NAME_KR.split(",")
                            : [];
                        const enList =
                          DS.USING_NAME_EN !== null && DS.USING_NAME_EN !== ""
                            ? DS.USING_NAME_EN.split(",")
                            : [];

                        // 원본과 수정된 데이터의 Set 생성
                        const orgSet = new Set(
                          krOrgList.map((kr, i) => kr + "|" + enOrgList[i])
                        );

                        const newSet = new Set(
                          krList.map((kr, i) => kr + "|" + enList[i])
                        );

                        //   console.log(orgSet, newSet);

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
                          } else if (
                            orgSet.has(target) &&
                            !newSet.has(target)
                          ) {
                            removed.add(num);
                          }
                        });

                        added = Array.from(added);
                        removed = Array.from(removed);

                        const promise_insert = new Promise((resolve) => {
                          const DS_USING_added = added.map((data, idx) => {
                            return {
                              TABLE: "T_RESI_PESTICIDE_USING_REL",
                              PESTICIDE_CODE: DS.PESTICIDE_CODE,
                              USING_NUM: data,
                            };
                          });

                          const ENC_DS_USING_added =
                            customEncrypt(DS_USING_added);
                          if (DS_USING_added.length > 0) {
                            resolve(
                              customFetchPOST("insert", ENC_DS_USING_added)
                            );
                          } else {
                            resolve(true);
                          }
                        });
                        const promise_delete = new Promise((resolve) => {
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
                            resolve(
                              customFetchPOST("delete", ENC_DS_USING_removed)
                            );
                          } else {
                            resolve(true);
                          }
                        });
                        Promise.all([promise_insert, promise_delete]).then(
                          (results) => {
                            const result = results.reduce(
                              (acc, curr) => acc && curr,
                              true
                            );
                            if (result) {
                              resolve_USING(true);
                            } else {
                              resolve_USING(false);
                            }
                          }
                        );
                      });
                  });
                  // 용도 추가 및 제거

                  Promise.all([
                    promise_DS,
                    promise_STD,
                    promise_DIFF,
                    promise_PRODUCT,
                    promise_USING,
                  ]).then((results) => {
                    const result = results.reduce(
                      (acc, curr) => acc && curr,
                      true
                    );
                    console.log(results);
                    if (result) {
                      message.success(
                        <>
                          농약정보: {"<"}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "blue",
                            }}
                          >
                            {DS_ORG.PESTICIDE_NAME_KR ||
                              DS_ORG.PESTICIDE_NAME_EN}
                          </span>
                          {">"} 수정하였습니다.
                        </>
                      );

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
                      dispatch(setIsvisibleModModal(false));
                    } else {
                      message.error(
                        <>
                          농약정보: {"<"}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "red",
                            }}
                          >
                            {DS_ORG.PESTICIDE_NAME_KR ||
                              DS_ORG.PESTICIDE_NAME_EN}
                          </span>
                          {">"} 수정에 실패하였습니다.
                        </>
                      );
                    }
                  });

                  // 용도 추가 및 제거 //////////////
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
                title={<>▣ 안정성 평가 보고서 </>}
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
                  <Col xs={4}>
                    {" "}
                    <Upload
                      style={{ width: "100% !important" }}
                      {...{
                        onRemove: (file) => {
                          const index = fileList.indexOf(file);
                          const newFileList = fileList.slice();
                          newFileList.splice(index, 1);
                          setFileList(newFileList);
                        },
                        beforeUpload: (file) => {
                          setFileList([...fileList, file]);
                          return false;
                        },
                        fileList,
                      }}
                    >
                      <Button
                        style={{ width: "100%" }}
                        icon={<UploadOutlined />}
                        disabled={
                          fileList.length > 0 ||
                          (datasource_mod_modal.SAFETY_FILE_LINK !== null &&
                            datasource_mod_modal.SAFETY_FILE_LINK !== "")
                        }
                      >
                        파일 선택
                      </Button>
                    </Upload>
                  </Col>
                  <Col xs={6}>
                    {fileList.length > 0 ? (
                      <Popconfirm
                        onConfirm={handleUpload}
                        title="파일을 등록하시겠습니까?"
                        okText="예"
                        cancelText="아니오"
                      >
                        <Button
                          type="primary"
                          disabled={fileList.length === 0}
                          loading={uploading}
                        >
                          {uploading ? "업로드 중" : "업로드"}
                        </Button>
                      </Popconfirm>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
                <Divider></Divider>

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
                      title_1: (
                        <>
                          첨부자료{"　"}
                          <Tooltip
                            title={
                              <span>하나의 자료만 업로드 가능합니다.</span>
                            }
                          >
                            <InfoCircleOutlined style={{ color: "black" }} />
                          </Tooltip>
                        </>
                      ),
                      data_1: CheckNullBlank(
                        datasource_mod_modal.SAFETY_FILE_LINK
                      ) ? (
                        <>
                          <FileDownloader
                            fileUrl={
                              "/API/downloadSafetyReport?PESTICIDE_CODE=" +
                              datasource_mod_modal.PESTICIDE_CODE
                            }
                            customFileName={
                              datasource_mod_modal.SAFETY_FILE_LINK.split(
                                datasource_mod_modal.PESTICIDE_CODE
                              )[0]
                            }
                          />
                          <Popconfirm
                            title="이 파일을 삭제하겠습니까?"
                            onConfirm={() => {
                              var deleteData = {
                                TABLE: "T_RESI_PESTICIDE",
                                KEY: ["PESTICIDE_CODE"],
                                NUMERIC_KEY: [],
                                PESTICIDE_CODE:
                                  datasource_mod_modal.PESTICIDE_CODE,
                                SAFETY_FILE_LINK: null,
                              };
                              const encryptedData = customEncrypt(deleteData);

                              fetch(
                                "/API/deleteSafetyReport?f=" +
                                  datasource_mod_modal.SAFETY_FILE_LINK,
                                {
                                  method: "POST",
                                  body: JSON.stringify({ data: encryptedData }),
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  credentials: "include",
                                }
                              ).then(function (response) {
                                if (response.status === 200) {
                                  fetch(
                                    "/API/search?TYPE=11112&PESTICIDE_CODE=" +
                                      datasource_mod_modal.PESTICIDE_CODE,
                                    {
                                      method: "GET",
                                      credentials: "include",
                                    }
                                  )
                                    .then(function (response) {
                                      return response.json();
                                    })
                                    .then((myJson) => {
                                      dispatch(
                                        setDatasourceModModal(myJson[0])
                                      );
                                    });
                                  message.success(
                                    "농약 정보: <" +
                                      datasource_mod_modal.SAFETY_FILE_LINK.split(
                                        datasource_mod_modal.PESTICIDE_CODE
                                      )[0] +
                                      "> 파일을 삭제하였습니다."
                                  );
                                } else if (response.status === 401) {
                                  message.error(
                                    "농약 정보: <" +
                                      datasource_mod_modal.SAFETY_FILE_LINK +
                                      "> 파일을 삭제하지 못했습니다."
                                  );
                                }
                              });
                            }}
                            okText="예"
                            cancelText="아니오"
                          >
                            <Button type="link">
                              <DeleteOutlined
                                style={{ color: "red" }}
                                onClick={() => {
                                  console.log("asdf");
                                }}
                              />
                            </Button>
                          </Popconfirm>
                        </>
                      ) : (
                        <></>
                      ),
                      wide: 1,
                    },
                  ]}
                ></Table>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
};

export default ModifyModal;
