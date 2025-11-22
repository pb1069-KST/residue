import React, { useState } from "react";
import "./Header.css";
import "antd/dist/antd.css";
// #antd icon
// #antd icon

//components
//components
import { useSelector } from "react-redux";
// import { useSelector, useDispatch } from "react-redux";
// #antd lib
import "antd/dist/antd.css";

import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Collapse from "antd/es/collapse";
import Dropdown from "antd/es/dropdown";

const { Panel } = Collapse;
// #antd lib

function Header_Menu() {
  // const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.header);

  const [visible, setVisible] = useState(false);

  const panels = [
    [
      {
        title: "농약정보",
        href: "/prd/info",
        child: [
          {
            title: "농약정보",
            href: "/prd/info",
            auth: "a",
          },
          {
            title: "농약용도",
            href: "/prd/using",
            auth: "PRD_USING_SCH",
          },
          {
            title: "농약 ADI",
            href: "/prd/adi",
            auth: "PRD_ADI_SCH",
          },
        ],
      },
      {
        title: "잔류허용기준",
        href: "/prd/mrl",
        child: [
          {
            title: "농약 잔류허용기준",
            href: "/prd/mrl",
            auth: "a",
          },
          {
            title: "농약 사용 정보",
            href: "https://psis.rda.go.kr/psis/",
            auth: "a",
          },
          {
            title: "식품(농약)",
            href: "/prd/food",
            auth: "PRD_FOOD_SCH",
          },
          // {
          //   title: "식품분류 관리",
          //   href: "/prd/food_class",
          //   auth: "PRD_FCLASS_SCH",
          // },
        ],
      },
      // {
      //   title: "잔류허용기준 제안서",
      //   child: [
      //     {
      //       title: "잔류허용기준 제안서",
      //       href: "/prd/proposal",
      //       auth: "PRD_PROPOSAL_SCH",
      //     },
      //   ],
      // },
      {
        title: "작물잔류시험성적서",
        child: [
          {
            title: "작물잔류시험성적서",
            href: "/prd/exam",
            auth: "PRD_EXAM_SCH",
          },
        ],
      },
      {
        title: "농 · 축산물 시험법",
        child: [
          {
            title: "농산물 시험법",
            href: "/prd/analysis",
            auth: "a",
          },
          {
            title: "축산물 시험법",
            href: "/prd/analysis_l",
            auth: "a",
          },
          // { title: "분석구분 (Analytic Category)", href: "/prd/analysis_div", auth: "PRD_ANALYSIS_CLASS_SCH" },
        ],
      },
      {
        title: "수입식품 중 농약잔류허용기준 설정 진행사항",
        child: [
          {
            title: "수입식품 중 농약잔류허용기준 설정 진행사항",
            href: "/prd/progress",
            auth: "a",
          },
        ],
      },
    ],
    [
      {
        title: "동물용의약품정보",
        child: [
          {
            title: "동물용의약품정보",
            href: "/vd/info",
            auth: "a",
          },
          {
            title: "동물용의약품용도",
            href: "/vd/using",
            auth: "VD_USING_SCH",
          },
          {
            title: "동물용의약품 ADI",
            href: "/vd/adi",
            auth: "VD_ADI_SCH",
          },
        ],
      },
      {
        title: "잔류허용기준",
        child: [
          {
            title: "동물용의약품 잔류허용기준",
            href: "/vd/mrl",
            auth: "a",
          },
          {
            title: "동물용의약품 사용 정보",
            href: "https://medi.qia.go.kr/searchMedicine",
            auth: "a",
          },
          {
            title: "식품(동물용의약품)",
            href: "/vd/food",
            auth: "VD_FOOD_SCH",
          },
          {
            title: "식품분류 관리",
            href: "/vd/food_class",
            auth: "VD_FCLASS_SCH",
          },
        ],
      },
      // {
      //   title: "잔류허용기준 제안서",
      //   child: [
      //     {
      //       title: "잔류허용기준 제안서 관리",
      //       href: "/vd/proposal",
      //       auth: "VD_PROPOSAL_SCH",
      //     },
      //   ],
      // },
      {
        title: "축 · 수산물 시험법",
        child: [
          {
            title: "축 · 수산물",
            href: "/vd/analysis",
            auth: "a",
          },
        ],
      },
    ],
    [
      {
        title: "표준품",
        child: [
          {
            title: "시약현황 조회",
            href: "/std/standard",
            auth: "a",
          },
          {
            title: "시약신청 및 시약지급현황",
            href: "/std/std_req",
            auth: "STD_APPLICATION_SCH",
          },
          // {
          //   title: "입력의뢰현황",
          //   href: "/std/std_input",
          //   auth: "STD_REQUEST_SCH",
          // },
          {
            title: "기타 관리",
            href: "/std/std_etc",
            auth: "STD_ETC_SCH",
          },
        ],
      },
    ],
    [
      {
        title: "농약 게시판",
        child: [
          { title: "농약", href: "/prd/downloads", auth: "a" },
          // {
          //   title: "동물용의약품",
          //   href: "/vd/downloads",
          //   auth: "a",
          // },
        ],
      },
      {
        title: "동물용의약품 게시판",
        child: [
          // { title: "농약", href: "/prd/rel_site", auth: "a" },
          // {
          //   title: "동물용의약품",
          //   href: "/vd/rel_site",
          //   auth: "a",
          // },
          {
            title: "동물용의약품",
            href: "/vd/downloads",
            auth: "a",
          },
        ],
      },
    ],
    [
      {
        title: "관리자",
        child: [
          {
            title: "사용자관리",
            href: "/admin/user",
            auth: "USER_SCH",
          },
          {
            title: "권한관리",
            href: "/admin/template",
            auth: "USER_SCH",
          },
        ],
      },
      {
        title: "일괄 업데이트",
        child: [
          {
            title: "잔류허용기준 업데이트(농약)",
            href: "/admin/user",
            auth: "USER_SCH",
          },
          {
            title: "잔류허용기준 업데이트(농약)",
            href: "/admin/user",
            auth: "USER_SCH",
          },
        ],
      },
    ],
  ];

  const menu = (
    <Row
      align="middle"
      justify="space-around"
      onMouseEnter={(e) => {
        setVisible(true);
        e.preventDefault();
      }}
      onMouseLeave={(e) => {
        setVisible(false);
        e.preventDefault();
      }}
    >
      <Col
        xs={3}
        style={{ paddingRight: 0, paddingLeft: 0, backgroundColor: "#FFFFFF" }}
      ></Col>
      <Col xs={18}>
        <Row
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 },
          ]}
          // style={{ margin: "0px 0px 0px 0px" }}
        >
          {panels.map((col, col_id) => {
            // console.log(panels);
            // Object.keys(userinfo).filter((data) => userinfo[data] === "Y");

            return (
              <Col
                className="row_col18_row_col6_dropdown_content"
                xs={userinfo.USER_SCH === "Y" ? (col_id === 4 ? 4 : 5) : 6}
                key={col_id}
                style={{ paddingRight: 0, paddingLeft: 0 }}
              >
                <Collapse
                  accordion
                  defaultActiveKey={null}
                  key={col_id}
                  style={{}}
                >
                  {col
                    .filter((panel, p_id) => {
                      var count = 0;

                      panel.child.forEach((li, li_id) => {
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

                      panel["count"] = count;

                      if (count > 0) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((panel_li, p_id) => {
                      if (panel_li.count > 1) {
                        return (
                          <Panel
                            header={
                              <Button
                                type="text"
                                className="one-item-panel"
                                style={{
                                  width: "100%",
                                  height: "40px",
                                  border: "0px",
                                }}
                              >
                                <Row style={{ width: "100%" }}>
                                  <Col xs={23}>{panel_li.title}</Col>
                                  <Col xs={1} style={{ textAlign: "right" }}>
                                    +
                                  </Col>
                                </Row>
                              </Button>
                            }
                            key={p_id}
                            showArrow={false}
                          >
                            {panel_li.child.map((li, li_id) => {
                              if (
                                [
                                  ...Object.keys(userinfo).filter(
                                    (data) => userinfo[data] === "Y"
                                  ),
                                  "a",
                                ].includes(li.auth)
                              ) {
                                return (
                                  <div
                                    style={{ textAlign: "center" }}
                                    key={li_id}
                                  >
                                    <a className="normal_user" href={li.href}>
                                      {li.title}
                                    </a>
                                  </div>
                                );
                              } else return null;
                            })}
                          </Panel>
                        );
                      } else {
                        return (
                          <Panel
                            header={
                              <Button
                                type="text"
                                className="one-item-panel"
                                style={{ width: "100%", height: "40px" }}
                                href={panel_li.child[0].href}
                              >
                                <Row style={{ width: "100%" }}>
                                  <Col xs={23}>{panel_li.title}</Col>
                                  <Col
                                    xs={1}
                                    style={{ textAlign: "right" }}
                                  ></Col>
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
            );
          })}
        </Row>
      </Col>
      <Col
        xs={3}
        style={{ paddingRight: 0, paddingLeft: 0, backgroundColor: "#FFFFFF" }}
      ></Col>
    </Row>
  );

  return (
    <Row
      justify="space-between"
      align="middle"
      style={{ width: "100vw", boxShadow: "0px 2px 4px #DDDDDD" }}
    >
      <Col sm={24}>
        <Row
          className="dropdown_menu_title_row"
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 },
          ]}
          align="middle"
          justify="space-around"
          onMouseEnter={(e) => {
            setVisible(true);
            e.preventDefault();
          }}
          onMouseLeave={(e) => {
            setVisible(false);
            e.preventDefault();
          }}
          style={{ width: "100vw" }}
        >
          <Col sm={{ span: 18, push: 0 }}>
            <Dropdown
              // expandIcon={false}
              // expandicon={false}
              overlay={menu}
              overlayStyle={{
                listHeight: "10px",
                width: "100vw",
                top: "30px !important",
              }}
              trigger="hover"
              visible={visible}
            >
              <Row
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
                gutter={[
                  { xs: 8, sm: 16, md: 24, lg: 32 },
                  { xs: 8, sm: 16, md: 24, lg: 32 },
                ]}
                align="middle"
                justify="space-around"
              >
                {Object.keys(userinfo).length !== 0 &&
                userinfo.USER_SCH === "Y" ? (
                  <>
                    <Col className="dropdown_menu_title" xs={5}>
                      <Button
                        className="dropdown_menu_title_button"
                        style={{ borderLeft: "1px solid #FFFFFF !important" }}
                      >
                        농약
                      </Button>
                    </Col>
                    <Col className="dropdown_menu_title" xs={5}>
                      <Button className="dropdown_menu_title_button">
                        동물용의약품
                      </Button>
                    </Col>
                    <Col className="dropdown_menu_title" xs={5}>
                      <Button className="dropdown_menu_title_button">
                        표준품
                      </Button>
                    </Col>
                    <Col className="dropdown_menu_title" xs={5}>
                      <Button className="dropdown_menu_title_button">
                        게시판
                      </Button>
                    </Col>
                    <Col className="dropdown_menu_title" xs={4}>
                      <Button className="dropdown_menu_title_button">
                        관리자
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col className="dropdown_menu_title" xs={6}>
                      <Button
                        className="dropdown_menu_title_button"
                        style={{ borderLeft: "1px solid #FFFFFF !important" }}
                      >
                        농약
                      </Button>
                    </Col>
                    <Col className="dropdown_menu_title" xs={6}>
                      <Button className="dropdown_menu_title_button">
                        동물용의약품
                      </Button>
                    </Col>
                    <Col className="dropdown_menu_title" xs={6}>
                      <Button className="dropdown_menu_title_button">
                        표준품
                      </Button>
                    </Col>
                    <Col className="dropdown_menu_title" xs={6}>
                      <Button className="dropdown_menu_title_button">
                        게시판
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Dropdown>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Header_Menu;
