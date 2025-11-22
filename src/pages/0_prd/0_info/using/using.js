import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";

// #antd icon
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
} from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../../components/template";
//components

//redux
import { setDataSource } from "../../../../reducers/prd/PrdInfoUsing";
import {
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceModModal,
} from "../../../../reducers/prd/PrdInfoUsing_modal";
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
// #antd lib

import { useSelector, useDispatch } from "react-redux";

import {
  customEncrypt,
  CustomInput,
  CustomTextArea,
  CustomTextAreaTags,
  getCurrentKoreanDateTime,
  CheckNullBlank,
  FileDownloader,
} from "../../../../components/util";

const { Search } = Input;
// const { TextArea } = Input;

export const Using = () => {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.PrdInfoUsing);
  const { isvisible_modify_modal, isvisible_register_modal } = useSelector(
    (state) => state.PrdInfoUsing_modal
  );

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=11211", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSource(myJson));
      });
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "농약",
          subTitle: "농약용도",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/using",
              name: "농약",
            },
            {
              href: "/prd/using",
              name: "농약정보",
            },
            {
              href: "/prd/using",
              name: "농약용도",
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
          title: "농약용도 검색",
        }}
        content_card={
          <div>
            <Search
              placeholder="용도명을 입력하세요"
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
                return item.USING_NUM;
              }}
              dataSource={dataSource.filter((val) => {
                if (val.USING_NAME_KR !== null) {
                  var word_str = "";
                  Hangul.disassemble(val.USING_NAME_KR, true).forEach(
                    (word, index) => {
                      word_str += word[0];
                    }
                  );
                  return (
                    word_str.indexOf(searchKey) !== -1 ||
                    Hangul.disassemble(val.USING_NAME_KR, true)[0][0].indexOf(
                      searchKey
                    ) > -1 ||
                    val.USING_NAME_KR.indexOf(searchKey) >= 0 ||
                    (val.USING_NAME_EN !== "" && val.USING_NAME_EN !== null
                      ? val.USING_NAME_EN.toLowerCase().indexOf(
                          searchKey.toLowerCase()
                        ) > -1
                      : null)
                  );
                } else {
                  return (
                    val.USING_NAME_EN.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  );
                }
              })}
              columns={[
                {
                  title: "용도 국문명",
                  dataIndex: "USING_NAME_KR",
                  key: "USING_NUM",
                  width: "35%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "USING_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                },
                {
                  title: "용도 영문명",
                  dataIndex: "USING_NAME_EN",
                  key: "USING_NUM",
                  width: "35%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "USING_NAME_EN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
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
                  key: "USING_NUM",
                  flag: "등록",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.USING_NUM}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=11213&USING_NUM=" +
                                row.USING_NUM,
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
                                dispatch(setIsvisibleModModal(true));
                              });
                          }}
                        >
                          <EditOutlined />
                        </Button>
                      </Col>
                      <Col xs={12}>
                        <Popconfirm
                          title="정말 삭제하시겠습니까?"
                          onConfirm={() => {
                            var promise_delete = new Promise(
                              (resolve, reject) => {
                                fetch("/API/delete", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    data: customEncrypt([
                                      {
                                        TABLE: "T_RESI_PESTICIDE_USING",
                                        KEY: ["USING_NUM"],
                                        NUMERIC_KEY: ["USING_NUM"],
                                        USING_NUM: row.USING_NUM,
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
                                      "용도: " +
                                        (row.USING_NAME_KR ||
                                          row.USING_NAME_EN) +
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
                              fetch("/API/search?TYPE=11211", {
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
                    userinfo.PRD_ADI_MOD === "N")
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
    </div>
  );
};
