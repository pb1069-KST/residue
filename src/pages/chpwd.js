import React, { useState, useEffect, useRef } from "react";
import Hangul from "hangul-js";
import { useInterval } from "usehooks-ts";
import "../App.css";
import "antd/dist/antd.css";
import _ from "lodash";
import { Line, Scatter } from "@ant-design/charts";
import { useSelector, useDispatch } from "react-redux";
import crypto from "crypto";

import Statistic from "antd/es/statistic";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Divider from "antd/es/divider";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Space from "antd/es/space";
import Tag from "antd/es/tag";
import Button from "antd/es/button";
import Image from "antd/es/image";
import Tabs from "antd/es/tabs";
import Table from "antd/es/table";
import AutoComplete from "antd/es/auto-complete";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
import Carousel from "antd/es/carousel";
import Popconfirm from "antd/es/popconfirm";
import Result from "antd/es/result";
import { CopyOutlined } from "@ant-design/icons";

import { RegisterDrawerJuso } from "./2_std/0_standard/application";

import SearchBackground from "../img/background.png";
import { customEncrypt } from "./util";

const { Search } = Input;

function ChangePassword(props) {
  const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.header);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [flag, setFlag] = useState(false);
  const [completeFlag, setCompleteFlag] = useState(false);

  const [USERID, setUSERID] = useState("");

  const [result, setResult] = useState({});

  useEffect(() => {
    fetch("/API/search?TYPE=51113&CHANGE_CODE=" + props.match.params.id, {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        if (myJson[0].FLAG === 0) {
          window.location.href = "/";
        } else {
          setFlag(true);
          setUSERID(myJson[0].USERID);
        }
      });
    // console.log(props.match.params.id)
  }, []);

  const checkPassword = (e) => {
    var regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regExp.test(e);
  };
  if (!flag) {
    return <></>;
  } else if (flag && !completeFlag) {
    return (
      <div className="App">
        <Row>
          <Col style={{ height: "100px" }}></Col>
        </Row>
        <Row>
          <Col xs={8}></Col>
          <Col
            xs={8}
            style={{ textAlign: "center", height: "500px", fontSize: "20px" }}
          >
            <Table
              style={{ marginTop: "5px" }}
              size="small"
              sticky
              bordered
              className="table-search"
              // showHeader={false}
              pagination={false}
              columns={[
                {
                  dataIndex: "title_1",
                  width: "30%",
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
                  title: (
                    <div style={{ width: "100%", textAlign: "left" }}>
                      비밀번호 변경
                    </div>
                  ),
                  dataIndex: "title_2",
                  width: "30%",
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
                  title_1: "비밀번호",
                  data_1: (
                    <Input
                      placeholder="비밀번호를 입력하세요"
                      type="password"
                      value={password1}
                      onChange={(e) => {
                        setPassword1(e.target.value);
                      }}
                    ></Input>
                  ),
                  wide: 1,
                },
                {
                  title_1: "비밀번호 확인",
                  data_1: (
                    <Input
                      placeholder="비밀번호를 한번 더 입력하세요"
                      type="password"
                      value={password2}
                      onChange={(e) => {
                        setPassword2(e.target.value);
                      }}
                    ></Input>
                  ),
                  wide: 1,
                },
              ]}
            />
            <div>
              {password1 !== password2 ? (
                <span style={{ color: "red", fontSize: "15px" }}>
                  비밀번호가 일치하지 않습니다.
                </span>
              ) : (
                <></>
              )}
            </div>
            <div>
              {!(checkPassword(password1) && checkPassword(password2)) ? (
                <span style={{ color: "red", fontSize: "15px" }}>
                  비밀번호는 8자 이상 입력해주세요(최소 1개의
                  대문자,숫자,특수문자 포함)
                </span>
              ) : (
                <></>
              )}
            </div>
            <Popconfirm
              title="비밀번호를 변경하시겠습니까?"
              onConfirm={() => {
                console.log(USERID);
                console.log(password1);
                crypto.pbkdf2(
                  password1,
                  USERID,
                  789789,
                  64,
                  "sha512",
                  (err, key) => {
                    const update_promise = new Promise((resolve, reject) => {
                      fetch("/API/update", {
                        method: "POST",
                        body: JSON.stringify({
                          data: customEncrypt([
                            {
                              TABLE: "T_RESI_MEMBER",
                              KEY: ["USERID"],
                              NUMERIC_KEY: [""],
                              USERID: USERID,
                              PASSWARD: key.toString("base64"),
                            },
                          ]),
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }).then(function (response) {
                        resolve(1);
                      });
                    });

                    const delete_promise = new Promise((resolve, reject) => {
                      fetch("/API/delete", {
                        method: "POST",
                        body: JSON.stringify({
                          data: customEncrypt([
                            {
                              TABLE: "T_RESI_CHANGE_PASSWORD",
                              KEY: ["USERID"],
                              NUMERIC_KEY: [""],
                              USERID: USERID,
                            },
                          ]),
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }).then(function (response) {
                        resolve(1);
                      });
                    });

                    Promise.all([update_promise, delete_promise]).then(
                      (result) => {
                        setCompleteFlag(true);
                      }
                    );
                  }
                );
              }}
              onCancel={() => {}}
              okText="변경"
              cancelText="취소"
            >
              <Button
                style={{ top: "15px" }}
                type="primary"
                onClick={() => {}}
                disabled={
                  !(checkPassword(password1) && checkPassword(password2))
                }
              >
                변경
              </Button>
            </Popconfirm>
          </Col>
          <Col xs={8}></Col>
        </Row>
      </div>
    );
  } else {
    return (
      <Result
        status="success"
        title="비밀번호가 성공적으로 변경되었습니다."
        // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            홈으로
          </Button>,
        ]}
      />
    );
  }
}

export default ChangePassword;
