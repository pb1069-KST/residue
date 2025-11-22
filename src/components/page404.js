import React, { Component } from "react";

import "antd/dist/antd.css";
import Empty from "antd/es/empty"
import Row from "antd/es/row"
import Col from "antd/es/col"
import Button from "antd/es/button"

class page404 extends Component {
    

    render() {
        return (
            <div>
                <Row>
                    <Col style={{height:"100px"}}></Col>
                </Row>
                <Row>
                    <Col xs={3}></Col>
                    <Col xs={18} style={{textAlign:"center", height:"500px"}}>
                        <Empty  description=""></Empty>
                        <div
                            style={{fontSize:"40px",color:"#7ac2e9"}}
                        >
                            시스템 점검 중입니다.
                        </div>
                        <div
                            style={{fontSize:"20px",marginTop:"20px", color:"#93a5ab"}}
                        >
                            현재 시스템 점검 중으로 불편을 드려 죄송합니다.
                        </div>
                        <div
                            style={{fontSize:"20px",color:"#93a5ab"}}
                        >
                            자세한 내용은 사이트 관리자에게 문의하시기 바랍니다.
                        </div>
                        <Button
                            type="primary"
                            href="/"
                            style={{marginTop:"20px", borderRadius:"20px"}}
                        >메인으로 돌아가기</Button>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
                
            </div>
        )
    }
}

export default page404;
