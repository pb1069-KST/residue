import React, { useEffect } from "react";
/////////////////////////////////////////////////////////////////////////////////
import "../App.css";
import "antd/dist/antd.css";
import main_logo from "../img/logo_default.jpg";
/////////////////////////////////////////////////////////////////////////////////
import Row from "antd/es/row";
import Image from "antd/es/image";
import Col from "antd/es/col";
import Button from "antd/es/button";
import message from "antd/es/message";
// import Switch from "antd/es/switch";
/////////////////////////////////////////////////////////////////////////////////
import HeaderLoginModal from "./Header_Login_Modal";
/////////////////////////////////////////////////////////////////////////////////
import {
  PhoneFilled,
  MessageFilled,
  UserOutlined,
  HomeFilled,
} from "@ant-design/icons";
/////////////////////////////////////////////////////////////////////////////////
import { useSelector, useDispatch } from "react-redux";
import {
  setIsvisibleLoginModal,
  setUserinfo,
  //   setSystemCheck,
} from "../reducers/header/header";
import Popconfirm from "antd/es/popconfirm";

function Header_Information() {
  const dispatch = useDispatch();
  //   const { userinfo, system_check } = useSelector((state) => state.header);
  const { userinfo } = useSelector((state) => state.header);

  useEffect(() => {}, []);

  return (
    <div>
      <Row
        className="header-row"
        justify="space-between"
        align="middle"
        style={{ borderBottom: "1px solid #EAEAEA", background: "#FAFAFA" }}
      >
        <Col sm={{ span: 6, push: 3 }} className="header-col-left">
          <div>
            <span className="header-col-information">
              <MessageFilled></MessageFilled> 이메일: aragaya06@korea.kr
            </span>
          </div>
          <div>
            <span className="header-col-information">
              <PhoneFilled></PhoneFilled> 농약시험법문의: (043)719-4206 /
              농약기준문의: (043)719-3865
            </span>
          </div>
        </Col>
        <Col sm={{ span: 5, pull: 3 }}>
          <Row justify="space-between" align="middle">
            <Col sm={1} style={{ textAlign: "center" }}>
              <span style={{ color: "white", fontWeight: "100" }}>|</span>
            </Col>
            {/* <Col sm={2} style={{ textAlign: "center" }}>
                    <Switch
                                size="small"
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={system_check}
                                onChange={(e)=>{
                                    dispatch(setSystemCheck(e))
                                }}
                            />
                    </Col>
                    <Col sm={1} style={{ textAlign: "center" }}><span style={{ color: "white", fontWeight: "100" }}>|</span></Col> */}
            <Col sm={6} style={{ textAlign: "center" }}>
              {Object.keys(userinfo).length !== 0 ? (
                <div>
                  {/* {console.log(userinfo.USERNAME)} */}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    {userinfo.USERNAME}
                  </span>
                  <span
                    style={{
                      color: "gray",
                      fontSize: "12px",
                      fontWeight: "300",
                    }}
                  >
                    님
                  </span>
                  <Popconfirm
                    title="정말 로그아웃 하시겠습니까?"
                    okText="확인"
                    cancelText="취소"
                    onConfirm={() => {
                      fetch("/AUTH/logout", {
                        method: "GET",
                        credentials: "include",
                      }).then((res) => {
                        dispatch(setUserinfo({}));
                        window.location.href = "/";
                        message.success("로그아웃 되었습니다.");
                      });
                    }}
                  >
                    <Button
                      style={{
                        fontSize: "12px",
                        color: "#gray",
                        fontWeight: "100",
                      }}
                      size="small"
                      type="text"
                    >
                      로그아웃
                    </Button>
                  </Popconfirm>
                </div>
              ) : (
                <Button
                  className="header_login_button"
                  size="small"
                  type="link"
                  style={{ backgroundColor: "transparent", fontSize: "12px" }}
                  onClick={() => {
                    dispatch(setIsvisibleLoginModal(true));
                  }}
                >
                  <UserOutlined></UserOutlined> 로그인
                </Button>
              )}
            </Col>
            <Col sm={1} style={{ textAlign: "center" }}>
              <span style={{ color: "black", fontWeight: "100" }}>|</span>
            </Col>
            <Col sm={1} style={{ textAlign: "center" }}>
              <a
                className="header_login_button"
                href="/"
                style={{ fontSize: "12px" }}
              >
                <HomeFilled></HomeFilled>
              </a>
            </Col>
            <Col sm={1} style={{ textAlign: "center", fontWeight: "100" }}>
              <span style={{ color: "black" }}>|</span>
            </Col>
            <Col sm={4} style={{ textAlign: "center" }}>
              <a
                className="header_login_button"
                href="/"
                style={{ fontSize: "12px" }}
              >
                사이트 맵
              </a>
            </Col>
            <Col sm={1} style={{ textAlign: "center", fontWeight: "100" }}>
              <span style={{ color: "black" }}>|</span>
            </Col>
          </Row>
          <Row></Row>
        </Col>
      </Row>
      <Row>
        <Col xs={3}></Col>
        <Col xs={18}>
          <Row>
            <Col
              xs={5}
              style={{ height: "45px", paddingRight: 0, paddingLeft: 0 }}
            >
              <a href="/">
                <Image
                  preview={false}
                  width={"330px"}
                  height={"44px"}
                  src={main_logo}
                  alt=""
                ></Image>
              </a>
            </Col>
          </Row>
        </Col>
        <Col xs={3}></Col>
      </Row>
      <HeaderLoginModal />
    </div>
  );
}

export default Header_Information;
