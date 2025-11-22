import React from "react";

import "../App.css";
import "antd/dist/antd.css";
import "./Footer.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import default_logo2 from "../img/default_logo2.png";
import Background from "../img/logo_default_footer.png";

function Footer() {
  return (
    <div>
      <Row
        className="footer_css"
        justify="space-around"
        align="middle"
        style={{ width: "100vw" }}
      >
        <Col sm={24}>
          <Row style={{ backgroundImage: `url(${Background})` }}>
            <Col style={{ height: "100px" }}></Col>
          </Row>
        </Col>
      </Row>
      <Row
        className="footer_css"
        justify="space-around"
        align="middle"
        style={{ background: "#00710e", width: "100vw", height: "50px" }}
      >
        <Col sm={24}>
          <Row>
            <Col sm={18} push={3}>
              <Row
                justify="space-around"
                align="middle"
                style={{
                  background: "#00710e",
                  color: "white",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "400",
                  marginTop: "5px",
                  marginBottom: "5px",
                  fontFamily: "맑은 고딕, Malgun Gothic, sans-serif",
                }}
              >
                <Col className="footer_list" sm={12}>
                  <div>
                    <span style={{ verticalAlign: "middle" }}>
                      우)28159 충청북도 청주시 흥덕구 오송읍 오송생명2로 187
                      (식품의약품안전처)
                    </span>
                  </div>
                  {/* <div>
                                    <span style={{ color: "#ffffff", fontSize: "12px" }}><MessageFilled></MessageFilled> 이메일: aragaya@korea.ac.kr</span>
                                </div>
                                <div>
                                    <span style={{ color: "#ffffff", fontSize: "12px" }}><PhoneFilled></PhoneFilled> 농약시험법문의: (043)719-4206 / 농약기준문의: (043)719-3865</span>
                                </div> */}
                </Col>
                <Col className="footer_img" sm={12}>
                  <div>
                    <div>
                      2015 ⓒ Ministry of Food and Drug Safety. ALL Righs
                      Reserved.{" "}
                      <img
                        style={{
                          verticalAlign: "bottom !important",
                          width: "76px",
                          height: "39px",
                        }}
                        src={default_logo2}
                        alt=""
                      ></img>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
