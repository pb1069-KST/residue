import React, { useState, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import CryptoJS from "crypto-js";
import Hangul from "hangul-js";
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
import { setDataSource } from "../../../reducers/doc/DocPrdArticle";
import {
  setIsvisibleRegModal,
  setDatasourceRegModal,
} from "../../../reducers/doc/DocPrdArticle";
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

export const RegisterModal = () => {
  const dispatch = useDispatch();
  const { isvisible_register_modal, datasource_reg_modal } = useSelector(
    (state) => state.DocPrdArticle
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
      ARTICLE_KEY: datasource_reg_modal.ARTICLE_KEY,
      TABLE: "T_RESI_ARTICLE",
      KEY: ["ARTICLE_KEY"],
      NUMERIC_KEY: ["ARTICLE_KEY"],
      FILE_LINK: fileList[0].name + datasource_reg_modal.ARTICLE_KEY,
    });
    formData.append("data", query);
    setUploading(true);
    // You can use any AJAX library you like
    fetch(
      "/API/uploadArticleFile?ARTICLE_KEY=" + datasource_reg_modal.ARTICLE_KEY,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => {
      if (res.status === 200) {
        fetch(
          "/API/search?TYPE=41112&ARTICLE_KEY=" +
            datasource_reg_modal.ARTICLE_KEY,
          {
            method: "GET",
            credentials: "include",
          }
        )
          .then(function (response) {
            return response.json();
          })
          .then((myJson) => {
            dispatch(setDatasourceRegModal(myJson[0]));
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
                  fetch("/API/search?TYPE=41113", {
                    method: "GET",
                    credentials: "include",
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((data) => {
                      var inputData = _.cloneDeep(datasource_reg_modal);

                      inputData = {
                        ...inputData,
                        TABLE: "T_RESI_ARTICLE",
                        KEY: [],
                        NUMERIC_KEY: [
                          "ARTICLE_KEY",
                          "FKEY",
                          "PKEY",
                          "OKEY",
                          "GKEY",
                          "BOARD_KEY",
                        ],
                        ARTICLE_KEY: parseInt(data[0].NUM, 10) + 1,
                        BOARD_KEY: 0,
                        FKEY: 0,
                        PKEY: 0,
                        OKEY: 0,
                        GKEY: 0,
                        USERID: userinfo.USERID,
                        REGISTER_IP: ip,
                        UPDATE_IP: ip,
                        SYS_RDATE: moment(new Date()).format(
                          "YYYY/MM/DD HH:mm:ss"
                        ),
                        SYS_UDATE: moment(new Date()).format(
                          "YYYY/MM/DD HH:mm:ss"
                        ),
                        GBN_BRD: "P",
                        FILE_LINK: "",
                      };

                      const encData = customEncrypt([inputData]);
                      fetch("/API/insert", {
                        method: "POST",
                        body: JSON.stringify({
                          data: encData,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }).then(function (response) {
                        console.log(response);
                        if (response.status === 200) {
                          message.success(
                            "게시물(농약): " +
                              datasource_reg_modal.TITLE +
                              "을 등록하였습니다."
                          );
                          dispatch(setIsvisibleRegModal(false));
                          dispatch(setDatasourceRegModal({}));
                          fetch("/API/search?TYPE=41111", {
                            method: "GET",
                            credentials: "include",
                          })
                            .then(function (response) {
                              return response.json();
                            })
                            .then((myJson) => {
                              dispatch(setDataSource(myJson));
                            });
                        } else if (response.status === 401) {
                          message.error("권한이 없습니다.");
                          dispatch(setIsvisibleRegModal(false));
                          dispatch(setDatasourceRegModal({}));
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
                        value={datasource_reg_modal.WRITER}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
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
                        value={datasource_reg_modal.TITLE}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
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
                          datasource_reg_modal.NOTICE_FLAG === "Y"
                            ? true
                            : false
                        }
                        checkedChildren="Y"
                        unCheckedChildren="N"
                        onChange={(e) => {
                          if (e) {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
                                NOTICE_FLAG: "Y",
                              })
                            );
                          } else {
                            dispatch(
                              setDatasourceRegModal({
                                ...datasource_reg_modal,
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
                        value={datasource_reg_modal.CONTENT}
                        onChange={(e) => {
                          dispatch(
                            setDatasourceRegModal({
                              ...datasource_reg_modal,
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
            </Row>
          </Card>
        </Modal>
      </div>
    );
  }
};
