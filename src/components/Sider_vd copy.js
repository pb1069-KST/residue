import React, { Component } from "react";

import "antd/dist/antd.css";
import Collapse from "antd/es/collapse";
import Row from "antd/es/row";
import Col from "antd/es/col";

const { Panel } = Collapse;

const panel = [
  [
    {
      title: (
        <div>
          동물용의약품정보
          <br />
          (VDrugs)
        </div>
      ),
      child: [
        {
          title: (
            <div>
              동물용의약품정보
              <br />
              (VDrug Information)
            </div>
          ),
          href: "/vd/info",
          auth: "a",
        },
        {
          title: (
            <div>
              용도
              <br />
              관리 (VDrug Using)
            </div>
          ),
          href: "/vd/using",
          auth: "VD_USING_SCH",
        },
        {
          title: (
            <div>
              ADI 관리
              <br />
              (VDrug ADI)
            </div>
          ),
          href: "/vd/adi",
          auth: "VD_ADI_SCH",
        },
      ],
    },
    {
      title: (
        <div>
          잔류허용기준
          <br />
          (MRLs in VDrugs)
        </div>
      ),
      child: [
        {
          title: (
            <div>
              잔류허용기준
              <br />
              (MRLs in VDrugs)
            </div>
          ),
          href: "/vd/mrl",
          auth: "a",
        },
        {
          title: (
            <div>
              식품 관리
              <br />
              (Foods)
            </div>
          ),
          href: "/vd/food",
          auth: "VD_FOOD_SCH",
        },
        {
          title: (
            <div>
              식품분류 관리
              <br />
              (Food Category)
            </div>
          ),
          href: "/vd/food_class",
          auth: "VD_FCLASS_SCH",
        },
      ],
    },
    {
      title: (
        <div>
          잔류허용기준 제안서
          <br />
          (Proposals)
        </div>
      ),
      child: [
        {
          title: (
            <div>
              잔류허용기준 제안서
              <br />
              (Proposals)
            </div>
          ),
          href: "/vd/proposal",
          auth: "VD_PROPOSAL_SCH",
        },
      ],
    },
    {
      title: (
        <div>
          분석정보
          <br />
          (VDrugs Analytical Manual)
        </div>
      ),
      child: [
        {
          title: (
            <div>
              축/수산물
              <br />
              (Analytic Information)
            </div>
          ),
          href: "/vd/analysis",
          auth: "a",
        },
      ],
    },
  ],
];

class Sider_vd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
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
        <Row
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 },
          ]}
        >
          {panel.map((col, col_id) => {
            Object.keys(this.props.userInfo).filter(
              (data) => this.props.userInfo[data] === "Y"
            );

            return (
              <Col
                className="row_col18_row_col6_dropdown_content"
                xs={24}
                key={col_id}
                style={{ paddingRight: 0, paddingLeft: 0 }}
              >
                <Collapse
                  accordion
                  defaultActiveKey={this.props.activeKey}
                  key={col_id}
                  style={{ width: "100%" }}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? null : null)}
                >
                  {col
                    .filter((panel, p_id) => {
                      var count = 0;

                      panel.child.map((li, li_id) => {
                        if (
                          [
                            ...Object.keys(this.props.userInfo).filter(
                              (data) => this.props.userInfo[data] === "Y"
                            ),
                            "a",
                          ].includes(li.auth)
                        ) {
                          count += 1;
                        }
                        return null;
                      });
                      if (count > 0) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((panel, p_id) => {
                      return (
                        <Panel
                          forceRender={true}
                          header={panel.title}
                          key={p_id}
                          showArrow={true}
                        >
                          {panel.child.map((li, li_id) => {
                            if (
                              [
                                ...Object.keys(this.props.userInfo).filter(
                                  (data) => this.props.userInfo[data] === "Y"
                                ),
                                "a",
                              ].includes(li.auth)
                            ) {
                              return (
                                // <li key={li_id} style={{textAlign:"center"}}>
                                <div
                                  style={{ textAlign: "center" }}
                                  key={li_id}
                                >
                                  <a className="normal_user" href={li.href}>
                                    {li.title}
                                  </a>
                                </div>
                                // {/* </li> */}
                              );
                            } else return null;
                          })}
                        </Panel>
                      );
                    })}
                </Collapse>
              </Col>
            );
          })}
        </Row>
      </>
    );
  }
}

export default Sider_vd;
