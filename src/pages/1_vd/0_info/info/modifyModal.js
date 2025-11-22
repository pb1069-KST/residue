import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
//redux
import {
  setIsvisibleModModal,
  setDatasourceModModal,
} from "../../../../reducers/vd/VdInfoInfo";
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
  } = useSelector((state) => state.VdInfoInfo);

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
                      TABLE: "T_RESI_VD_VDRUG",
                      KEY: ["VDRUG_CODE"],
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

                  console.log(DS_UPDATE);

                  const ENC_DS_PRD = customEncrypt(DS_UPDATE);

                  fetch("/API/update", {
                    method: "POST",
                    body: JSON.stringify({ data: ENC_DS_PRD }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }).then(function (response) {
                    if (response.status === 200) {
                    } else if (response.status === 401) {
                    }
                  });

                  // 시약명 추가 및 제거
                  fetch("/API/search?TYPE=" + "21119", {
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
                          PESTICIDE_CODE: DS.VDRUG_CODE,
                          STD_NAME: data,
                          CON_FLAG: "Y",
                          GUBUN: "VD",
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
                          KEY: ["STD_NAME", "VDRUG_CODE"],
                          NUMERIC_KEY: [],
                          PESTICIDE_CODE: DS.VDRUG_CODE,
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
                  fetch("/API/search?TYPE=" + "21117", {
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
                          TABLE: "T_RESI_VD_VDRUG_DIFF_NAME",
                          NUM: maxDiffNum + idx + 1,
                          VDRUG_CODE: DS.VDRUG_CODE,
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
                          TABLE: "T_RESI_VD_VDRUG_DIFF_NAME",
                          KEY: ["DIFF_NAME", "VDRUG_CODE"],
                          NUMERIC_KEY: [],
                          VDRUG_CODE: DS.VDRUG_CODE,
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
                          TABLE: "T_RESI_VD_VDRUG_PRODUCT_NAME",
                          NUM: maxPRODUCTNum + idx + 1,
                          VDRUG_CODE: DS.VDRUG_CODE,
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
                          TABLE: "T_RESI_VD_VDRUG_PRODUCT_NAME",
                          KEY: ["PRODUCT_NAME", "VDRUG_CODE"],
                          NUMERIC_KEY: [],
                          VDRUG_CODE: DS.VDRUG_CODE,
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
                  fetch("/API/search?TYPE=" + "21114", {
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
                      const orgSet = new Set(krOrgList.map((kr, i) => kr));

                      const newSet = new Set(krList.map((kr, i) => kr));

                      // 유지, 변경, 제거 항목 초기화
                      var added = new Set();
                      var removed = new Set();

                      // 원본 데이터 순회
                      res.forEach((item) => {
                        const num = item.USING_NUM;
                        const target = item.USING_NAME_KR;

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
                          TABLE: "T_RESI_VD_VDRUG_USING_REL",
                          VDRUG_CODE: DS.VDRUG_CODE,
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
                          TABLE: "T_RESI_VD_VDRUG_USING_REL",
                          VDRUG_CODE: DS.VDRUG_CODE,
                          USING_NUM: data,
                          KEY: ["VDRUG_CODE", "USING_NUM"],
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
                    "농약정보: <" +
                      (DS_ORG.PESTICIDE_NAME_KR || DS_ORG.PESTICIDE_NAME_EN) +
                      "> 을 수정하였습니다."
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
              동물용의약품 수정 :{" "}
              {datasource_mod_modal.VDRUG_NAME_KR ||
                datasource_mod_modal.VDRUG_NAME_EN}
            </div>
          }
        >
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="동물용의약품 정보" key="1">
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
                      width: "16%",
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
                      width: "16%",
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
                        "VDRUG_NUM",
                        true
                      ),
                      wide: 1,
                    },
                    {
                      title_1: "동물용의약품 국문명",
                      data_1: CustomInput(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "VDRUG_NAME_KR",
                        true
                      ),
                      title_2: "동물용의약품 영문명",
                      data_2: CustomInput(
                        setDatasourceModModal,
                        datasource_mod_modal,
                        "VDRUG_NAME_EN",
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
                        "VDRUGS_SYSTEM",
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
                              {/* {"(" + data.USING_NAME_EN + ")"} */}
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
                        "VDRUGS_FORM",
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
          </Tabs>
        </Modal>
      </div>
    );
  }
};

export default ModifyModal;
