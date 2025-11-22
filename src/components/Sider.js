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
    title: <div>농약정보</div>,
    child: [
      { title: <div>농약정보</div>, href: "/prd/info", auth: "a" },
      {
        title: <div>농약용도</div>,
        href: "/prd/using",
        auth: "PRD_USING_SCH",
      },
      { title: <div>ADI 관리</div>, href: "/prd/adi", auth: "PRD_ADI_SCH" },
    ],
  },
  {
    title: <div>농약잔류허용기준</div>,
    child: [
      { title: <div>농약잔류허용기준</div>, href: "/prd/mrl", auth: "a" },
      {
        title: <div>식품 (농약)</div>,
        href: "/prd/food",
        auth: "PRD_FOOD_SCH",
      },
      // {
      //   title: <div>식품분류 관리</div>,
      //   href: "/prd/food_class",
      //   auth: "PRD_FCLASS_SCH",
      // },
    ],
  },
  // {
  //   title: <div>잔류허용기준 제안서</div>,
  //   child: [
  //     {
  //       title: <div>잔류허용기준 제안서</div>,
  //       href: "/prd/proposal",
  //       auth: "PRD_PROPOSAL_SCH",
  //     },
  //   ],
  // },
  {
    title: <div>작물잔류시험성적서</div>,
    child: [
      {
        title: <div>작물잔류시험성적서</div>,
        href: "/prd/exam",
        auth: "PRD_EXAM_SCH",
      },
    ],
  },
  {
    title: <div>농·축산물 시험법</div>,
    child: [
      { title: <div>농산물 시험법</div>, href: "/prd/analysis", auth: "a" },
      { title: <div>축산물 시험법</div>, href: "/prd/analysis_l", auth: "a" },
      // { title: <div>분석구분<br />(Analytic Category)</div>, href: "/prd/analysis_div", auth: "PRD_ANALYSIS_CLASS_SCH" },
    ],
  },
  {
    title: <div>수입식품 중 농약잔류허용기준 설정 진행 사항</div>,
    child: [
      {
        title: <div>수입식품 중 농약잔류허용기준 설정 진행 사항</div>,
        href: "/prd/progress",
        auth: "a",
      },
    ],
  },
];

export const Sider = () => {
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

export default Sider;
