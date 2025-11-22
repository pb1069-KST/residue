import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "antd/dist/antd.css";
import "../App.css";

import moment from "moment";

import SiderPrd from "./Sider";
import SiderVd from "./Sider_vd";
import SiderStd from "./Sider_std";
import SiderDown from "./Sider_down";
import SiderAdmin from "./Sider_admin";

import HeaderBottom from "./Header_bottom";

import Col from "antd/es/col";
import Row from "antd/es/row";
import Card from "antd/es/card";
import Button from "antd/es/button";
import Radio from "antd/es/radio";
import Image from "antd/es/image";

import logo_verypositive from "../img/verypositive.png";
import logo_positive from "../img/positive.png";
import logo_neutral from "../img/neutral.png";
import logo_negative from "../img/negative.png";
import logo_verynegative from "../img/verynegative.png";

import { StepBackwardOutlined } from "@ant-design/icons";

import { setRateComment, setRate } from "../reducers/header/header";

function Template(props) {
  const dispatch = useDispatch();
  const { userinfo, rate, rate_comment } = useSelector((state) => state.header);

  return (
    <div>
      <Row
        className=""
        justify="space-around"
        align="middle"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ width: "100vw" }}
      >
        <Col xs={24}>
          <HeaderBottom
            datasource_breadcrumb={props.Header_bottom.datasource_breadcrumb}
            title={props.Header_bottom.title}
            subTitle={props.Header_bottom.subTitle}
          ></HeaderBottom>
          <Row
            className=""
            justify="space-around"
            align=""
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          >
            <Col xs={3}></Col>
            <Col
              xs={2}
              className="gradient-border-bottom"
              style={{ backgroundColor: "", height: "" }}
            >
              <Row
                className=""
                justify="space-around"
                style={{ height: "20px" }}
                align=""
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              ></Row>
              {
                [
                  {
                    siderType: 1,
                    content: (
                      <SiderPrd
                        userInfo={props.userInfo}
                        activeKey={props.sider.defaultActiveKey}
                      ></SiderPrd>
                    ),
                  },
                  {
                    siderType: 2,
                    content: (
                      <SiderVd
                        userInfo={props.userInfo}
                        activeKey={props.sider.defaultActiveKey}
                      ></SiderVd>
                    ),
                  },
                  {
                    siderType: 3,
                    content: (
                      <SiderStd
                        userInfo={props.userInfo}
                        activeKey={props.sider.defaultActiveKey}
                      ></SiderStd>
                    ),
                  },
                  {
                    siderType: 4,
                    content: (
                      <SiderDown
                        userInfo={props.userInfo}
                        activeKey={props.sider.defaultActiveKey}
                      ></SiderDown>
                    ),
                  },
                  {
                    siderType: 5,
                    content: (
                      <SiderAdmin
                        userInfo={props.userInfo}
                        activeKey={props.sider.defaultActiveKey}
                      ></SiderAdmin>
                    ),
                  },
                ].filter((sider) => sider.siderType === props.sider.type)[0]
                  .content
              }
            </Col>
            <Col xs={1}> </Col>
            <Col xs={15}>
              <Row
                className=""
                justify="space-around"
                style={{ height: "20px" }}
                align=""
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              ></Row>
              <Row
                className=""
                justify="space-around"
                align=""
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col xs={24} style={{ background: "", textAlign: "right" }}>
                  <Row>
                    <Col xs={24}>
                      <Row>{props.content_header}</Row>
                      <Row>
                        <Col xs={24}>
                          <Card
                            size="small"
                            title={props.main_card.title}
                            style={{
                              width: "100%",
                              marginBottom: "10px",
                              textAlign: "left",
                            }}
                            headStyle={{
                              background: "rgb(0 106 197)",
                              color: "white",
                              fontSize: "15px",
                            }}
                            bodyStyle={{
                              padding: "20px 20px 20px 20px",
                            }}
                          >
                            {props.content_card}
                          </Card>

                          {props.content}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={24} style={{ width: "100%", height: "50px" }}></Col>
              </Row>
            </Col>
            <Col xs={3} style={{ backgroundColor: "#", height: "" }}></Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Template;
