import React, { Component, useState } from "react";
import { useSelector } from "react-redux";

import "antd/dist/antd.css";

import Collapse from "antd/es/collapse";
import Col from "antd/es/col";
import Row from "antd/es/row";
import Divider from "antd/es/divider";
import { Button } from "antd";
import { CodeSandboxCircleFilled } from "@ant-design/icons";

const { Panel } = Collapse;

const panel = [
  {
    title: <div>게시판</div>,
    child: [
      { title: <div>농약 게시판</div>, href: "/prd/downloads", auth: "a" },
      {
        title: <div>동물용의약품 게시판</div>,
        href: "/vd/downloads",
        auth: "a",
      },
    ],
  },
];

export const Sider_down = () => {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }
  const { userinfo } = useSelector((state) => state.header);
  const [activeKey, setActiveKey] = useState(undefined);

  return (
    <Row
      gutter={[
        { xs: 8, sm: 16, md: 24, lg: 32 },
        { xs: 8, sm: 16, md: 24, lg: 32 },
      ]}
    >
      <Col xs={24}>
        <Row style={{ width: "100%" }}>
          <Col
            xs={24}
            style={{
              height: "10px",
              background:
                "linear-gradient(180deg, rgba(0,106,197,1) 0%, rgba(48,161,114,1) 100%)",
              width: "100%",
            }}
          ></Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Collapse
              accordion
              style={{ width: "100%" }}
              expandIconPosition="right"
              expandIcon={({ isActive }) => (isActive ? null : null)}
              onChange={(e) => {
                setActiveKey(e);
              }}
            >
              {panel.map((panel_child, p_id) => {
                var count = 0;

                panel_child.child.forEach((li, li_id) => {
                  if (
                    [
                      ...Object.keys(userinfo).filter(
                        (data) => userinfo[data] === "Y"
                      ),
                      "a",
                    ].includes(li.auth)
                  ) {
                    count += 1;
                  }
                });
                // console.log(activeKey, p_id);
                if (count > 1) {
                  return (
                    <Panel
                      key={p_id}
                      header={
                        <Button
                          type="text"
                          className="one-item-panel"
                          style={{
                            width: "100%",
                            height: "40px",
                            textAlign: "center",
                            // color:
                            //   parseInt(activeKey, 10) === parseInt(p_id, 10)
                            //     ? "white"
                            //     : "black",
                          }}
                        >
                          <Row style={{ width: "100%" }}>
                            <Col xs={23}>{panel_child.title}</Col>
                            <Col xs={1} style={{ textAlign: "right" }}>
                              +
                            </Col>
                          </Row>
                        </Button>
                      }
                    >
                      {panel_child.child.map((li, li_id) => {
                        return (
                          <Row style={{ width: "100%" }}>
                            <Col style={{ width: "100%", textAlign: "center" }}>
                              <Button
                                type="ghost"
                                style={{
                                  border: "0px",
                                  textAlign: "center",
                                  paddingLeft: "0px",
                                  paddingRight: "0px",
                                  letterSpacing: "-1px",
                                  paddingBottom: "1px",
                                }}
                                className="panel_child"
                                href={li.href}
                              >
                                {li.title}
                              </Button>
                            </Col>
                          </Row>
                        );
                      })}
                    </Panel>
                  );
                } else if (count === 1) {
                  return (
                    <Panel
                      header={
                        <Button
                          type="text"
                          className="one-item-panel"
                          style={{
                            width: "100%",
                            height: "auto",
                            whiteSpace: "normal",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            letterSpacing: "-1px",
                          }}
                          href={panel_child.child[0].href}
                        >
                          <Row style={{ width: "100%" }}>
                            <Col xs={23}>{panel_child.title}</Col>
                            <Col xs={1} style={{ textAlign: "right" }}></Col>
                          </Row>
                        </Button>
                      }
                      collapsible="disabled"
                      key={p_id}
                      showArrow={false}
                    ></Panel>
                  );
                }
              })}
            </Collapse>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Sider_down;
