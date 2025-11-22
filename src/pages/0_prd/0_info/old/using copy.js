import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// #antd icon
import { PhoneFilled, MessageFilled, UserOutlined, HomeFilled, } from '@ant-design/icons';
// #antd icon

//components
import Template from "../../../components/template"
//components

//redux
import setDataSource from "../../../reducers/prd/prdUsing"
//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row"
import Col from "antd/es/col"
import Button from "antd/es/button"
import Collapse from "antd/es/collapse"
import Dropdown from "antd/es/dropdown"
import Table from "antd/es/table"
// #antd lib

function Using() {
    const dispatch = useDispatch();
    const { dataSource } = useSelector(state => state.prdUsing);
    const { userinfo } = useSelector(state => state.header);

    useEffect(() => {

        fetch('/API/search?TYPE=11211', {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {            
            dispatch(setDataSource(myJson))
        });
    }, [])

    return (
        <div>
            <Template
                // 권한 전달
                userInfo={userinfo}

                //헤더 하단부 구성
                Header_bottom={{
                    title: "농약",
                    subTitle: "농약용도",
                    datasource_breadcrumb: [
                        {
                            href: "/",
                            name: <HomeFilled></HomeFilled>,
                        },
                        {
                            href: "/prd/using",
                            name: "농약",
                        },
                        {
                            href: "/prd/using",
                            name: "농약용도",
                        },
                    ]
                }}

                //사이더 종류
                sider={{
                    type: 1,
                    defaultActiveKey: 0
                }}

                //카드
                main_card={{
                    title: "농약용도 검색"
                }}

                content_card={
                    <div>

                    </div>
                }
                content={
                    <div>
                        <Table
                            size="small"
                            sticky
                            bordered
                            dataSource={dataSource}
                            columns={[
                                {
                                    title: "",
                                    dataIndex: "",
                                    key:"",
                                }
                            ]}
                        ></Table>
                    </div>
                }

            ></Template>
        </div>
    )
}



export default Using;
