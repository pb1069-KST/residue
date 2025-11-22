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
    title: <div>동물용의약품정보</div>,
    child: [
      {
        title: <div>동물용의약품 정보</div>,
        href: "/vd/info",
        auth: "a",
      },
      {
        title: <div>동물용의약품 용도</div>,
        href: "/vd/using",
        auth: "VD_USING_SCH",
      },
      {
        title: <div>동물용의약품 ADI</div>,
        href: "/vd/adi",
        auth: "VD_ADI_SCH",
      },
    ],
  },
  {
    title: <div>잔류허용기준</div>,
    child: [
      {
        title: <div>잔류허용기준</div>,
        href: "/vd/mrl",
        auth: "a",
      },
      {
        title: <div>식품 (동물용의약품)</div>,
        href: "/vd/food",
        auth: "VD_FOOD_SCH",
      },
      // {
      //   title: (
      //     <div>
      //       식품분류 관리
      //       <br />
      //       (Food Category)
      //     </div>
      //   ),
      //   href: "/vd/food_class",
      //   auth: "VD_FCLASS_SCH",
      // },
    ],
  },
  // {
  //   title: (
  //     <div>
  //       잔류허용기준 제안서
  //       <br />
  //       (Proposals)
  //     </div>
  //   ),
  //   child: [
  //     {
  //       title: (
  //         <div>
  //           잔류허용기준 제안서
  //           <br />
  //           (Proposals)
  //         </div>
  //       ),
  //       href: "/vd/proposal",
  //       auth: "VD_PROPOSAL_SCH",
  //     },
  //   ],
  // },
  {
    title: <div>축·수산물 시험법</div>,
    child: [
      {
        title: <div>축·수산물 시험법</div>,
        href: "/vd/analysis",
        auth: "a",
      },
    ],
  },
];

export const Sider_vd = () => {
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

export default Sider_vd;
