import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import _ from "lodash";
import crypto from "crypto";
/////////////////////////////////////////////////////////////////////////////////
import "../App.css";
import "antd/dist/antd.css";
/////////////////////////////////////////////////////////////////////////////////
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import Input from "antd/es/input";
import message from "antd/es/message";
/////////////////////////////////////////////////////////////////////////////////
import { setIsvisibleLoginModal, setUserinfo } from "../reducers/header/header";
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const { Password } = Input;

function Header_Login_Modal() {
  const dispatch = useDispatch();
  const { isvisible_login_modal } = useSelector((state) => state.header);
  const [userIdS, setUserIdS] = useState("");
  const [userPwdS, setUserPwdS] = useState("");

  const handleLogin = () => {
    crypto.pbkdf2(userPwdS, userIdS, 789789, 64, "sha512", (err, key) => {
      fetch("/AUTH/login", {
        method: "POST",
        body: JSON.stringify({
          id: userIdS,
          pw: key.toString("base64"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then(function (response) {
          return response.json();
        })
        .then((myJson) => {
          if (Object.keys(myJson).length !== 0) {
            message.success(myJson.USERNAME + "님 환영합니다.");
            dispatch(setUserinfo(myJson));
            dispatch(setIsvisibleLoginModal(false));
            setUserIdS("");
            setUserPwdS("");
          } else {
            message.error("아이디와 비밀번호를 확인하세요.");
            dispatch(setUserinfo(myJson));
            dispatch(setIsvisibleLoginModal(false));
            setUserIdS("");
            setUserPwdS("");
          }
        });
    });
  };

  return (
    <div>
      <Modal
        visible={isvisible_login_modal}
        width="20vw"
        title="로그인"
        footer={
          <div>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                if (
                  userIdS &&
                  userPwdS &&
                  userIdS.length > 0 &&
                  userPwdS.length > 0
                ) {
                  crypto.pbkdf2(
                    userPwdS,
                    userIdS,
                    789789,
                    64,
                    "sha512",
                    (err, key) => {
                      fetch("/AUTH/login", {
                        method: "POST",
                        body: JSON.stringify({
                          id: userIdS,
                          pw: key.toString("base64"),
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      })
                        .then(function (response) {
                          return response.json();
                        })
                        .then((myJson) => {
                          if (Object.keys(myJson).length !== 0) {
                            message.success(myJson.USERNAME + "님 환영합니다.");
                            dispatch(setUserinfo(myJson));
                            dispatch(setIsvisibleLoginModal(false));
                            // dispatch(setUserID_LoginModal(""))
                            // dispatch(setUserPWD_LoginModal(""))
                            setUserIdS("");
                            setUserPwdS("");
                          } else {
                            message.error("아이디와 비밀번호를 확인하세요.");
                            dispatch(setUserinfo(myJson));
                            dispatch(setIsvisibleLoginModal(false));
                            // dispatch(setUserID_LoginModal(""))
                            // dispatch(setUserPWD_LoginModal(""))
                            setUserIdS("");
                            setUserPwdS("");
                          }
                        });
                    }
                  );
                }
              }}
              // disabled={!userIdS || !userPwdS}
            >
              로그인
            </Button>
            {/* <Button
              type="ghost"
              size="small"
              onClick={() => {
                dispatch(setIsvisibleLoginModal(false));
                // dispatch(setUserID_LoginModal(""))
                // dispatch(setUserPWD_LoginModal(""))
                setUserIdS("");
                setUserPwdS("");
              }}
            >
              취소
            </Button> */}
          </div>
        }
        onCancel={() => {
          dispatch(setIsvisibleLoginModal(false));
          // dispatch(setUserID_LoginModal(""))
          // dispatch(setUserPWD_LoginModal(""))
          setUserIdS("");
          setUserPwdS("");
        }}
      >
        <Row>
          <Col xs={8}>아이디</Col>
          <Col xs={16}>
            <Input
              size="small"
              defaultValue={userIdS}
              onChange={(e) => {
                setUserIdS(e.target.value);
              }}
              onPressEnter={handleLogin}
            ></Input>
          </Col>
        </Row>
        <Row>
          <Col xs={8}>비밀번호</Col>
          <Col xs={16}>
            <Password
              size="small"
              type="password"
              defaultValue={userPwdS}
              onChange={(e) => {
                setUserPwdS(e.target.value);
              }}
              onPressEnter={handleLogin}
            ></Password>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default Header_Login_Modal;
