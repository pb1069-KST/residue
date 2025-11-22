import React, { Component } from "react";

import "antd/dist/antd.css";

import Breadcrumb from "./_Breadcrumb";

import Col from "antd/es/col";
import Row from "antd/es/row";
import Image from "antd/es/image";

// import logo_header_bottom from "../img/logo_header_bottom.png"
import logo_leaf from "../img/leaf.png";

class Header_bottom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={24} style={{ height: "30px" }}></Col>
        </Row>
        <Row
          style={{
            height: "100px",
            width: "100vw",
            maxWidth: "100%",
            backgroundColor: "",
            textAlign: "left",
          }}
          justify="space-around"
          align="middle"
        >
          <Col
            xs={3}
            style={{ backgroundColor: "", height: "", textAlign: "center" }}
          ></Col>
          <Col
            xs={2}
            style={{
              height: "",
              textAlign: "center",
              zIndex: "-9999",
              border: "0",
            }}
          >
            {/* <Row className="gradient-border-bottom" justify="space-around" align="middle" style={{ height: "100px", backgroundSize:"100% 100%", 
          backgroundImage: "url(https://image.shutterstock.com/image-photo/tropical-banana-leaf-texture-garden-600w-1896669205.jpg", position:"relative",border:"0" 
          }}>
            <Col xs={24}>
              <span style={{ fontSize: "30px", color: "white", height: "", fontWeight: "bold" }}>{this.props.title}</span>
            </Col>
          </Row> */}
          </Col>
          <Col xs={1}></Col>
          <Col xs={15} style={{ zIndex: "-9999" }}>
            <Row
              justify="space-around"
              align="middle"
              style={{ height: "40px" }}
            >
              <Col xs={24} style={{ backgroundColor: "" }}>
                <Row justify="space-around" align="middle" style={{}}>
                  <Col
                    xs={24}
                    style={{
                      borderBottom: "3px solid rgb(0, 106, 197)",
                      borderImage:
                        "linear-gradient(to right, rgb(0, 106, 197) 0%, #0ad10a 100%)",
                      borderImageWidth: "0 0 3px 0",
                      borderStyle: "solid",
                      borderImageSlice: "1",
                    }}
                  >
                    <Row>
                      <Col xs={22} style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: "23px",
                            color: "black",
                            height: "",
                            fontWeight: "bold",
                          }}
                        >
                          {this.props.subTitle}
                        </span>
                      </Col>
                      <Col xs={2} style={{ textAlign: "right" }}>
                        <Image src={logo_leaf}></Image>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row
              justify="space-around"
              align="middle"
              style={{ height: "20px" }}
            >
              <Col
                xs={24}
                style={{ height: "", backgroundColor: "transparent" }}
              >
                <Row style={{ backgroundColor: "transparent", height: "0px" }}>
                  <Col xs={24} style={{ textAlign: "right !important" }}>
                    <Breadcrumb
                      datasource_breadcrumb={this.props.datasource_breadcrumb}
                    ></Breadcrumb>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={3} style={{ backgroundColor: "", height: "" }}></Col>
        </Row>
      </div>
    );
  }
}

export default Header_bottom;
