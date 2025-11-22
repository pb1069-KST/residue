import React, { useState, useEffect } from "react";
import moment from "moment";
import CryptoJS from "crypto-js";
import Hangul from "hangul-js";
import _ from "lodash";
import axios from "axios";

// #antd icon
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
  UploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
// #antd icon

//components
// import Template from "../../../../components/template";
//components

//redux
import { setDataSource } from "../../../reducers/doc/DocVdArticle";
import {
  setIsvisibleModModal,
  setDatasourceModModal,
} from "../../../reducers/doc/DocVdArticle";
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
import Switch from "antd/es/switch";
import Upload from "antd/es/upload";
import Divider from "antd/es/divider";
import Tooltip from "antd/es/tooltip";
// #antd lib

import { useSelector, useDispatch } from "react-redux";

import {
  customEncrypt,
  getCurrentKoreanDateTime,
  CheckNullBlank,
  FileDownloader,
} from "../../../components/util";
import TextArea from "antd/es/input/TextArea";

export const ModifyModal = () => {
  const dispatch = useDispatch();
  const { isvisible_modify_modal, datasource_mod_modal } = useSelector(
    (state) => state.DocVdArticle
  );
  const [uploading, setUploading] = useState(false);

  const { userinfo } = useSelector((state) => state.header);
  const [ip, setIP] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });
    var query = customEncrypt({
      ARTICLE_KEY: datasource_mod_modal.ARTICLE_KEY,
      TABLE: "T_RESI_ARTICLE",
      KEY: ["ARTICLE_KEY"],
      NUMERIC_KEY: ["ARTICLE_KEY"],
      FILE_LINK: fileList[0].name + datasource_mod_modal.ARTICLE_KEY,
    });
    formData.append("data", query);
    setUploading(true);
    // You can use any AJAX library you like
    fetch(
      "/API/uploadArticleFile?ARTICLE_KEY=" + datasource_mod_modal.ARTICLE_KEY,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => {
      if (res.status === 200) {
        fetch(
          "/API/search?TYPE=42112&ARTICLE_KEY=" +
            datasource_mod_modal.ARTICLE_KEY,
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
          "게시물 파일: <" + fileList[0].name + "> 파일을 업로드하였습니다."
        );

        setFileList([]);
        setUploading(false);
      } else {
        message.success(
          "게시물 파일: <" +
            fileList[0].name +
            "> 파일을 업로드하지 못했습니다."
        );
        setFileList([]);
        setUploading(false);
      }
    });
  };
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json"); // IP를 반환하는 API
        setIP(response.data.ip); // IP 주소를 상태에 저장
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };
    fetchIP();
  }, []);

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
                  var inputData = _.cloneDeep(datasource_mod_modal);

                  inputData = {
                    ...inputData,
                    TABLE: "T_RESI_ARTICLE",
                    KEY: ["ARTICLE_KEY"],
                    ARTICLE_KEY: datasource_mod_modal.ARTICLE_KEY,
                    NUMERIC_KEY: [
                      "ARTICLE_KEY",
                      "FKEY",
                      "PKEY",
                      "OKEY",
                      "GKEY",
                      "BOARD_KEY",
                    ],
                    UPDATE_IP: ip,
                    SYS_UDATE: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                  };

                  const encData = customEncrypt([inputData]);

                  fetch("/API/update", {
                    method: "POST",
                    body: JSON.stringify({ data: encData }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }).then(function (response) {
                    if (response.status === 200) {
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
                      dispatch(setIsvisibleModModal(false));
                      dispatch(setDatasourceModModal({}));
                      message.success(
                        "게시물(농약): " +
                          datasource_mod_modal.TITLE +
                          "을 수정하였습니다."
                      );
                    } else if (response.status === 401) {
                      message.error("권한이 없습니다.");
                      dispatch(setIsvisibleModModal(false));
                      dispatch(setDatasourceModModal({}));
                      message.success(
                        "게시물(농약): " +
                          datasource_mod_modal.TITLE +
                          "을 수정 실패하였습니다."
                      );
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
          width="50vw"
          title={<div>게시물 수정</div>}
        >
          <Card
            size="small"
            bordered={false}
            style={{ textAlign: "left" }}
            title="▣ 게시물 수정"
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
                    title_1: "작성자",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.WRITER}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              WRITER: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    title_2: "ID",
                    data_2: (
                      <>
                        {userinfo.USERID} ({ip})
                      </>
                    ),
                    wide: 0,
                  },
                  {
                    title_1: "제목",
                    data_1: (
                      <Input
                        size="small"
                        value={datasource_mod_modal.TITLE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              TITLE: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "상단공지",
                    data_1: (
                      <Switch
                        checked={
                          datasource_mod_modal.NOTICE_FLAG === "Y"
                            ? true
                            : false
                        }
                        checkedChildren="Y"
                        unCheckedChildren="N"
                        onChange={(e) => {
                          if (e) {
                            dispatch(
                              setDatasourceModModal({
                                ...datasource_mod_modal,
                                NOTICE_FLAG: "Y",
                              })
                            );
                          } else {
                            dispatch(
                              setDatasourceModModal({
                                ...datasource_mod_modal,
                                NOTICE_FLAG: "N",
                              })
                            );
                          }
                        }}
                      ></Switch>
                    ),
                    wide: 1,
                  },
                  {
                    title_1: "내용",
                    data_1: (
                      <TextArea
                        size="small"
                        rows={6}
                        value={datasource_mod_modal.CONTENT}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceModModal({
                              ...datasource_mod_modal,
                              CONTENT: e.target.value,
                            })
                          );
                        }}
                      />
                    ),
                    wide: 1,
                  },
                ]}
              />
              <Divider></Divider>
              <Row style={{ width: "100%" }}>
                <Col xs={6}>
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
                        (datasource_mod_modal.FILE_LINK !== null &&
                          datasource_mod_modal.FILE_LINK !== "")
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
                          title={<span>하나의 자료만 업로드 가능합니다.</span>}
                        >
                          <InfoCircleOutlined style={{ color: "black" }} />
                        </Tooltip>
                      </>
                    ),
                    data_1: CheckNullBlank(datasource_mod_modal.FILE_LINK) ? (
                      <>
                        <FileDownloader
                          fileUrl={
                            "/API/downloadArticleFile?ARTICLE_KEY=" +
                            datasource_mod_modal.ARTICLE_KEY
                          }
                          customFileName={
                            datasource_mod_modal.FILE_LINK.split(
                              datasource_mod_modal.ARTICLE_KEY
                            )[0]
                          }
                        />
                        <Popconfirm
                          title="이 파일을 삭제하겠습니까?"
                          onConfirm={() => {
                            var deleteData = {
                              TABLE: "T_RESI_ARTICLE",
                              KEY: ["ARTICLE_KEY"],
                              NUMERIC_KEY: ["ARTICLE_KEY"],
                              ARTICLE_KEY: datasource_mod_modal.ARTICLE_KEY,
                              FILE_LINK: null,
                            };
                            const encryptedData = customEncrypt(deleteData);

                            fetch(
                              "/API/deleteArticleFile?f=" +
                                datasource_mod_modal.FILE_LINK,
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
                                  "/API/search?TYPE=41112&ARTICLE_KEY=" +
                                    datasource_mod_modal.ARTICLE_KEY,
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
                                  "게시물 파일: <" +
                                    datasource_mod_modal.FILE_LINK.split(
                                      datasource_mod_modal.ARTICLE_KEY
                                    )[0] +
                                    "> 파일을 삭제하였습니다."
                                );
                              } else if (response.status === 401) {
                                message.error(
                                  "게시물 파일: <" +
                                    datasource_mod_modal.FILE_LINK +
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
            </Row>
          </Card>
        </Modal>
      </div>
    );
  }
};
