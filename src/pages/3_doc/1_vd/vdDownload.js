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
import Template from "../../../components/template";
//components

//redux
import {
  setDataSource,
  setIsvisibleSchModal,
  setIsvisibleModModal,
  setIsvisibleRegModal,
  setDatasourceSchModal,
  setDatasourceModModal,
} from "../../../reducers/doc/DocVdArticle";
//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Tag from "antd/es/tag";
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
} from "../../../components/util";
import { render } from "@testing-library/react";

const { Search } = Input;
// const { TextArea } = Input;

export const VdDownload = () => {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.DocVdArticle);
  const { isvisible_modify_modal, isvisible_register_modal } = useSelector(
    (state) => state.DocVdArticle
  );

  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetch("/API/search?TYPE=42111", {
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
          title: "게시판",
          subTitle: "동물용의약품 게시판",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/vd/downloads",
              name: "게시판",
            },
            {
              href: "/vd/downloads",
              name: "게시판",
            },
            {
              href: "/vd/downloads",
              name: "동물용의약품 게시판",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 4,
          defaultActiveKey: 0,
        }}
        //카드
        main_card={{
          title: "게시물 검색",
        }}
        content_card={
          <div>
            <Search
              placeholder="제목을 입력하세요"
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
                return item.ARTICLE_KEY;
              }}
              dataSource={dataSource.filter((val) => {
                if (val.TITLE !== null) {
                  var word_str = "";
                  Hangul.disassemble(val.TITLE, true).forEach((word, index) => {
                    word_str += word[0];
                  });
                  return (
                    word_str.indexOf(searchKey) !== -1 ||
                    Hangul.disassemble(val.TITLE, true)[0][0].indexOf(
                      searchKey
                    ) > -1 ||
                    val.TITLE.indexOf(searchKey) >= 0 ||
                    (val.TITLE !== "" && val.TITLE !== null
                      ? val.TITLE.toLowerCase().indexOf(
                          searchKey.toLowerCase()
                        ) > -1
                      : null)
                  );
                } else {
                  return (
                    val.TITLE.toLowerCase().indexOf(searchKey.toLowerCase()) >
                    -1
                  );
                }
              })}
              columns={[
                {
                  title: "번호",
                  dataIndex: "NO",
                  key: "ARTICLE_KEY",
                  width: "10%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "NO"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                },
                {
                  title: "제목",
                  dataIndex: "TITLE",
                  render: (data, row, index) => {
                    if (row.NOTICE_FLAG === "Y") {
                      return (
                        <>
                          <Tag color="gold">중요</Tag>
                          <a
                            style={{ color: "red" }}
                            onClick={() => {
                              fetch(
                                "/API/search?TYPE=42112&ARTICLE_KEY=" +
                                  row.ARTICLE_KEY,
                                {
                                  method: "GET",
                                  credentials: "include",
                                }
                              )
                                .then(function (response) {
                                  return response.json();
                                })
                                .then((myJson) => {
                                  dispatch(setDatasourceSchModal(myJson[0]));
                                  dispatch(setIsvisibleSchModal(true));
                                });
                            }}
                          >
                            {row.TITLE}
                          </a>
                        </>
                      );
                    } else {
                      return (
                        <a
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=42112&ARTICLE_KEY=" +
                                row.ARTICLE_KEY,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceSchModal(myJson[0]));
                                dispatch(setIsvisibleSchModal(true));
                              });
                          }}
                        >
                          {row.TITLE}
                        </a>
                      );
                    }
                  },
                  key: "ARTICLE_KEY",
                  width: "50%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "TITLE"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                },
                {
                  title: "작성자",
                  dataIndex: "WRITER",
                  key: "ARTICLE_KEY",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "WRITER"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                },
                {
                  title: "작성일",
                  dataIndex: "SYS_RDATE",
                  key: "ARTICLE_KEY",
                  render: (data, row, index) => {
                    return row.SYS_RDATE.split(" ")[0];
                  },
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "SYS_RDATE"),
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
                  key: "ARTICLE_KEY",
                  flag: "등록",
                  width: "7%",
                  render: (data, row, index) => (
                    <Row key={row.ARTICLE_KEY}>
                      <Col xs={12}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=42112&ARTICLE_KEY=" +
                                row.ARTICLE_KEY,
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
                                        TABLE: "T_RESI_ARTICLE",
                                        KEY: ["ARTICLE_KEY"],
                                        NUMERIC_KEY: ["ARTICLE_KEY"],
                                        ARTICLE_KEY: row.ARTICLE_KEY,
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
                                      "게시물(농약): " +
                                        row.TITLE +
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
                              fetch("/API/search?TYPE=42111", {
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
