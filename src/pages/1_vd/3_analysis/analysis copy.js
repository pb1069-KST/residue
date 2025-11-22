import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash"
import moment from "moment"
// #antd icon
import { DeleteOutlined, EditOutlined, PlusOutlined, HomeFilled, } from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../components/template"
//components

//redux
import {
    setDataSource,

    setIsvisibleSchModal,
    setIsvisibleModModal,
    setIsvisibleRegModal,

    setDatasourceSchModal,
    setDatasourceRegModal,
    setDatasourceModModal,

    setDatasourceRegDrawer,
    setIsvisibleRegDrawer,
    setIsvisibleModDrawer,
    setDatasourceRegModalAnalysis,
    setDatasourceModModalAnalysis,

} from "../../../reducers/vd/VdAnalysisAnalysis"
//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row"
import Col from "antd/es/col"
import Button from "antd/es/button"
import Table from "antd/es/table"
import Popconfirm from "antd/es/popconfirm"
import message from "antd/es/message"
import Input from "antd/es/input"
import Modal from "antd/es/modal"
import Card from "antd/es/card"
import Select from "antd/es/select"
import Drawer from "antd/es/drawer"
import Tag from "antd/es/tag"
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";

const { Option } = Select;
const { Search } = Input;

function Analysis() {
    const dispatch = useDispatch();
    // 수정
    const {
        dataSource,
        isvisible_search_modal,
        isvisible_modify_modal,
        isvisible_register_modal,
    } = useSelector(state => state.VdAnalysisAnalysis);


    const { userinfo } = useSelector(state => state.header);
    const { customSorter } = useSelector(state => state.util);

    const [searchKey, setSearchKey] = useState("")
    const [searchFlag, setSearchFlag] = useState(0)

    // useEffect 제외
    useEffect(() => {
        fetch('/API/search?TYPE=24111', {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {
            myJson = myJson.map(data => {
                data.ARRAY = [];
                [...Array(data.CNT).keys()].map(index => {
                    data.ARRAY.push({
                        COVERAGE: data.COVERAGE.split(";")[index],
                        VDRUG_NUM: data.VDRUG_NUM.split(";")[index],
                        METHOD_TITLE: data.METHOD_TITLE.split(";")[index],
                        PRINCIPLES: data.PRINCIPLES.split(";")[index],
                        TOOLS: data.TOOLS.split(";")[index],
                        DOSE: data.DOSE.split(";")[index],
                    })
                })
                return data;
            })
            dispatch(setDataSource(myJson))
        });
    }, [dispatch])

    return (
        <div>
            <Template
                userInfo={userinfo}

                //헤더 하단부 구성
                Header_bottom={{
                    title: "동물용의약품",
                    subTitle: "분석정보",
                    datasource_breadcrumb: [
                        {
                            href: "/",
                            name: <HomeFilled></HomeFilled>,
                        },
                        {
                            href: "/vd/analysis",
                            name: "분석정보",
                        },
                        {
                            href: "/vd/analysis",
                            name: "축/수산물",
                        },
                    ]
                }}

                //사이더 종류
                sider={{
                    type: 2,
                    defaultActiveKey: 3
                }}

                //카드
                main_card={{
                    title: "축/수산물 검색"
                }}

                content_card={
                    <>
                        <Row>
                            <Col xs={3}>
                                <Select style={{ width: "100%" }}
                                    defaultValue={0}
                                    onChange={(e) => {
                                        setSearchFlag(e)
                                    }}
                                >
                                    <Option value={0}>동물용의약품명</Option>
                                    <Option value={1}>대상식품</Option>
                                </Select>

                            </Col>
                            <Col xs={21}>
                                {
                                    [
                                        {
                                            num: 0,
                                            desc: "농약명을 입력하세요"
                                        },
                                        {
                                            num: 1,
                                            desc: "대상식품을 입력하세요"
                                        },
                                    ].map(data => {
                                        if (data.num === searchFlag) {
                                            return (
                                                <Search
                                                    placeholder={data.desc}
                                                    enterButton
                                                    onSearch={(e) => {
                                                        setSearchKey(e)
                                                    }}
                                                />
                                            )
                                        }
                                    })
                                }

                            </Col>
                        </Row>
                    </>
                }
                content={
                    <div>
                        <Table
                            size="small"
                            sticky
                            bordered
                            rowKey={item => { return item.NUM }}
                            dataSource={dataSource.filter((val) => {

                                const func = (key) => {
                                    if (val[key] !== null) {
                                        var word_str = "";
                                        Hangul.disassemble(val[key], true).forEach((word, index) => {
                                            word_str += word[0];
                                        });
                                        return (
                                            word_str.indexOf(searchKey) !== -1 ||
                                            Hangul.disassemble(val[key], true)[0][0].indexOf(searchKey) > -1 ||
                                            val[key].indexOf(searchKey) >= 0 ||
                                            (val[key] !== "" && val[key] !== null ? val[key].toLowerCase().indexOf(searchKey.toLowerCase()) > -1 : null)
                                        );
                                    }
                                }

                                switch (searchFlag) {
                                    case 0:
                                        return (func("VDRUG_NAME_KR"))
                                        break
                                    case 1:
                                        return (func("VDRUG_NAME_EN"))
                                        break
                                }
                            })}
                            columns={[
                                {
                                    title: "구분",
                                    dataIndex: "FLAG",
                                    key: "NUM",
                                    width: "10%",
                                    // sorter: {
                                    //     compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "FLAG")),
                                    // },
                                    filters: [
                                        {
                                            text: '축산물',
                                            value: 'A',
                                        },
                                        {
                                            text: '수산물',
                                            value: 'F',
                                        },
                                    ],
                                    onFilter: (value, record) => record.FLAG.includes(value),
                                    // showSorterTooltip: false,
                                    // sortDirections: ['ascend', 'descend', 'ascend'],
                                    render: (data, row, index) => {
                                        return (
                                            <>
                                                {row.FLAG === 'A' ? <Tag color="yellow">축산물</Tag> : <Tag color="blue">수산물</Tag>}
                                            </>
                                        )
                                    }
                                },
                                {
                                    title: <>동물용의약품<br />국문명</>,
                                    dataIndex: "VDRUG_NAME_KR",
                                    key: "NUM",
                                    width: "20%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "VDRUG_NAME_KR")),
                                    },
                                    defaultSortOrder: "ascend",
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render: (data, row, index) => {
                                        return (
                                            <>{row.VDRUG_NAME_KR}({row.VDRUG_NAME_EN})</>
                                        )
                                    }
                                },
                                {
                                    title: <>
                                        <Row>
                                            <Col xs={3} style={{ textAlign: "center" }}>
                                                적용<br />범위
                                            </Col>
                                            <Col xs={3} style={{ textAlign: "center" }}>
                                                식품<br />공전번호
                                            </Col>
                                            <Col xs={6} style={{ textAlign: "center" }}>
                                                Method<br />Title
                                            </Col>
                                            <Col xs={6} style={{ textAlign: "center" }}>
                                                분석<br />원리
                                            </Col>
                                            <Col xs={3} style={{ textAlign: "center" }}>
                                                분석<br />기기
                                            </Col>
                                            <Col xs={3} style={{ textAlign: "center" }}>
                                                정량<br />한계
                                            </Col>
                                        </Row>
                                    </>,
                                    // dataIndex: "COVERAGE",
                                    key: "NUM",
                                    width: "80%",
                                    // sorter: {
                                    //     compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "COVERAGE")),
                                    // },
                                    // showSorterTooltip: false,
                                    // sortDirections: ['ascend', 'descend', 'ascend'],
                                    // defaultSortOrder: 'descend',
                                    render: (data, row, index) => {
                                        return (
                                            <Table
                                                sticky
                                                bordered
                                                showHeader={false}
                                                size="small"
                                                pagination={false}
                                                className="table-vd-analysis"
                                                columns={[
                                                    {
                                                        dataIndex: "COVERAGE",
                                                        width: "12.5%"
                                                    },
                                                    {
                                                        dataIndex: "VDRUG_NUM",
                                                        width: "12.5%"
                                                    },
                                                    {
                                                        dataIndex: "METHOD_TITLE",
                                                        width: "25%"
                                                    },
                                                    {
                                                        dataIndex: "PRINCIPLES",
                                                        width: "25%"
                                                    },
                                                    {
                                                        dataIndex: "TOOLS",
                                                        width: "12.5%"
                                                    },
                                                    {
                                                        dataIndex: "DOSE",
                                                        width: "12.5%"
                                                    },
                                                ]}
                                                dataSource={row.ARRAY}
                                            />

                                        )
                                    }
                                },
                                {
                                    title: "식품공전",
                                    dataIndex: "",
                                    key: "NUM",
                                    width: "10%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render: (data, row, index) => {
                                        return (
                                            <>{ }</>
                                        )
                                    }
                                },
                                {
                                    title: "해설서",
                                    dataIndex: "APPLICATION_COMPANY",
                                    key: "NUM",
                                    width: "10%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "APPLICATION_COMPANY")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render: (data, row, index) => {
                                        return (
                                            <>{row.APPLICATION_COMPANY}</>
                                        )
                                    }
                                },
                                {
                                    title: "연구보고서",
                                    dataIndex: "COMMENTS",
                                    key: "NUM",
                                    width: "10%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "COMMENTS")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render: (data, row, index) => {
                                        return (
                                            <>{row.COMMENTS}</>
                                        )
                                    }
                                },
                                {
                                    title: <Button
                                        size="small"
                                        className="button_reg"
                                        onClick={() => {
                                            dispatch(setIsvisibleRegModal(true))
                                        }}
                                    >
                                        <PlusOutlined />
                                    </Button>,
                                    align: "center",
                                    dataIndex: "",
                                    key: "FOOD_CODE",
                                    flag: "등록",
                                    width: "10%",
                                    render: (data, row, index) =>
                                        <Row key={row.FOOD_CODE}>
                                            <Col xs={12}>
                                                <Button
                                                    size="small"
                                                    className="button_mod"
                                                    onClick={() => {
                                                        const promise_PRODUCT = new Promise((resolve,reject)=>{
                                                            fetch("/API/search?TYPE=24112&NUM=" + row.NUM, {
                                                                method: 'GET',
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                return response.json();
                                                            }).then(myJson => {                                                                
                                                                dispatch(setDatasourceModModal(myJson[0]))
                                                                resolve(1)
                                                            });
                                                        })
                                                        const promise_PRODUCT_ANALYSIS = new Promise((resolve,reject)=>{
                                                            fetch("/API/search?TYPE=24115&PRODUCTS_NUM=" + row.NUM, {
                                                                method: 'GET',
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                return response.json();
                                                            }).then(myJson => {      
                                                                console.log(myJson)                                                         
                                                                dispatch(setDatasourceModModalAnalysis(myJson))
                                                                resolve(1)
                                                            });
                                                        })

                                                        Promise.all([promise_PRODUCT,promise_PRODUCT_ANALYSIS]).then(result=>{
                                                            dispatch(setIsvisibleModModal(true))
                                                        })
                                                        

                                                        // fetch("/API/search?TYPE=24115&NUM=" + row.NUM, {
                                                        //     method: 'GET',
                                                        //     credentials: 'include',
                                                        // }).then(function (response) {
                                                        //     return response.json();
                                                        // }).then(myJson => {
                                                        //     console.log(myJson[0])
                                                        //     dispatch(setDatasourceModModalAnalysis(myJson[0]))                                                            
                                                        // });
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            </Col>
                                            <Col xs={12}>
                                                <Popconfirm
                                                    title="정말 삭제하시겠습니까?"
                                                    onConfirm={() => {
                                                        var promise_delete = new Promise((resolve, reject) => {
                                                            fetch('/API/delete', {
                                                                method: 'POST',
                                                                body: JSON.stringify({
                                                                    data: [{
                                                                        TABLE: "T_RESI_VD_PRODUCTS",
                                                                        KEY: ["NUM"],
                                                                        NUMERIC_KEY: ["NUM"],
                                                                        NUM: row.NUM,
                                                                    }]
                                                                }),
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                if (response.status === 200) {
                                                                    resolve(1)
                                                                } else if (response.status === 401) {
                                                                    message.error("권한이 없습니다.")
                                                                    resolve(0)
                                                                }
                                                            })
                                                        })
                                                        var promise_delete_analysis = new Promise((resolve, reject) => {
                                                            fetch('/API/delete', {
                                                                method: 'POST',
                                                                body: JSON.stringify({
                                                                    data: [{
                                                                        TABLE: "T_RESI_VD_PRODUCTS_DETECT",
                                                                        KEY: ["PRODUCTS_NUM"],
                                                                        NUMERIC_KEY: ["PRODUCTS_NUM"],
                                                                        PRODUCTS_NUM: row.NUM,
                                                                    }]
                                                                }),
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                if (response.status === 200) {                                                                    
                                                                    resolve(1)
                                                                } else if (response.status === 401) {
                                                                    message.error("권한이 없습니다.")
                                                                    resolve(0)
                                                                }
                                                            })
                                                        })

                                                        Promise.all([promise_delete,promise_delete_analysis]).then(values => {
                                                            message.success("동물용의약품 분석정보:" + (row.VDRUG_NAME_KR||row.VDRUG_NAME_EN) + "를 삭제하였습니다..")
                                                            fetch('/API/search?TYPE=24111', {
                                                                method: 'GET',
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                return response.json();
                                                            }).then(myJson => {
                                                                myJson = myJson.map(data => {
                                                                    data.ARRAY = [];
                                                                    [...Array(data.CNT).keys()].map(index => {
                                                                        data.ARRAY.push({
                                                                            COVERAGE: data.COVERAGE.split(";")[index],
                                                                            VDRUG_NUM: data.VDRUG_NUM.split(";")[index],
                                                                            METHOD_TITLE: data.METHOD_TITLE.split(";")[index],
                                                                            PRINCIPLES: data.PRINCIPLES.split(";")[index],
                                                                            TOOLS: data.TOOLS.split(";")[index],
                                                                            DOSE: data.DOSE.split(";")[index],
                                                                        })
                                                                    })
                                                                    return data;
                                                                })
                                                                dispatch(setDataSource(myJson))
                                                                
                                                            });
                                                        })
                                                    }}
                                                    onCancel={false}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button
                                                        size="small"
                                                        className="button_del"
                                                    >
                                                        <DeleteOutlined />
                                                    </Button>
                                                </Popconfirm>
                                            </Col>
                                        </Row>,
                                }
                            ].filter((data) => {
                                if (data.flag === "등록" && (userinfo.USERID === undefined || (userinfo.PRD_ANALYSIS_MOD === 'N'))) {
                                    return false
                                } else {
                                    return true
                                }
                            })
                            }
                        ></Table>
                    </div>
                }

            ></Template>
            {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>}
            {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}

        </div>
    )
}

export default Analysis;

export const RegisterModal = () => {
    const dispatch = useDispatch();
    const {
        isvisible_register_modal,
        datasource_reg_modal,
        datasource_reg_modal_analysis,
        isvisible_register_drawer,
    } = useSelector(state => state.VdAnalysisAnalysis);
    const xs_title = 7
    const xs_input = 16

    if (!isvisible_register_modal) {
        return <></>
    }
    else {
        return (
            <div>
                <Modal
                    visible={isvisible_register_modal}
                    footer={
                        <div>
                            <Popconfirm
                                title="등록하시겠습니까?"
                                onCancel={() => {
                                    dispatch(setIsvisibleRegModal(false))
                                    dispatch(setDatasourceRegModal({}))
                                }}
                                onConfirm={() => {
                                    fetch('/API/search?TYPE=24114', {
                                        method: 'GET',
                                        credentials: 'include',
                                    }).then(res => {
                                        return res.json()
                                    }).then(data => {
                                        
                                        const promise_VDRUG = new Promise((resolve,reject)=>{

                                            const temp = _.cloneDeep(datasource_reg_modal)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

                                            temp.TABLE="T_RESI_VD_PRODUCTS"

                                            temp.NUM = data[0].MAX
                                            temp.REG_DATE= moment(new Date()).format("YYYY-MM-DD");
                                            temp.MOD_DATE= moment(new Date()).format("YYYY-MM-DD");

                                            delete temp.VDRUG_NAME_KR
                                            delete temp.VDRUG_NAME_EN
                                            
                                            // console.log("VDRUG",temp)
                                            // resolve(1)

                                            fetch('/API/insert', {
                                                method: 'POST',
                                                body: JSON.stringify({ data: [temp] }),
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                credentials: 'include',
                                            }).then(function (response) {
                                                console.log(response)
                                                if (response.status === 200) {
                                                    message.success("동물용의약품 분석정보:" + (datasource_reg_modal.VDRUG_NAME_KR||datasource_reg_modal.VDRUG_NAME_EN) + "를 등록하였습니다.")
                                                    resolve(1)
    
                                                } else if (response.status === 401) {
                                                    message.error("권한이 없습니다.")
                                                    resolve(0)
                                                }
                                            })
                                        })
                                        const promise_VDRUG_ANALYSIS = new Promise((resolve,reject)=>{
                                            const temp = _.cloneDeep(datasource_reg_modal_analysis.filter(data_filter=>data_filter.IS_DELETE==='N'))                                            

                                            temp.forEach(data_analysis=>{
                                                data_analysis.TABLE = "T_RESI_VD_PRODUCTS_DETECT";
                                                data_analysis.PRODUCTS_NUM = data[0].MAX

                                                delete data_analysis.IS_DELETE
                                                delete data_analysis.NO
                                                
                                            })
                                            // console.log("VDRUG_ANALYSIS",temp)
                                            // resolve(1)

                                            fetch('/API/insert', {
                                                method: 'POST',
                                                body: JSON.stringify({ data: temp }),
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                credentials: 'include',
                                            }).then(function (response) {
                                                console.log(response)
                                                if (response.status === 200) {
                                                    message.success("동물용의약품 분석정보: 분석방법 "+temp.length+ "종을 등록하였습니다.")                                                    
                                                    resolve(1)
    
                                                } else if (response.status === 401) {
                                                    message.error("권한이 없습니다.")
                                                    resolve(0)
                                                }
                                            })
                                        })
                                        
                                        Promise.all([promise_VDRUG,promise_VDRUG_ANALYSIS]).then(result=>{
                                            // window.location.href="/vd/analysis"
                                            fetch('/API/search?TYPE=24111', {
                                                method: 'GET',
                                                credentials: 'include',
                                            }).then(function (response) {
                                                return response.json();
                                            }).then(myJson => {
                                                myJson = myJson.map(data => {
                                                    data.ARRAY = [];
                                                    [...Array(data.CNT).keys()].map(index => {
                                                        data.ARRAY.push({
                                                            COVERAGE: data.COVERAGE.split(";")[index],
                                                            VDRUG_NUM: data.VDRUG_NUM.split(";")[index],
                                                            METHOD_TITLE: data.METHOD_TITLE.split(";")[index],
                                                            PRINCIPLES: data.PRINCIPLES.split(";")[index],
                                                            TOOLS: data.TOOLS.split(";")[index],
                                                            DOSE: data.DOSE.split(";")[index],
                                                        })
                                                    })
                                                    return data;
                                                })
                                                dispatch(setDataSource(myJson))
                                                dispatch(setIsvisibleRegModal(false))
                                                dispatch(setDatasourceRegModal({}))
                                            });                                         
                                        })
                                        
                                    })

                                }}
                                okText="확인"
                                cancelText="취소"
                            >
                                <Button type="primary" size="small"
                                    disabled={
                                        (
                                            (
                                                (datasource_reg_modal.VDRUG_NAME_KR === undefined ||
                                                    datasource_reg_modal.VDRUG_NAME_KR === "" ||
                                                    datasource_reg_modal.VDRUG_NAME_KR === null)
                                                ||
                                                (datasource_reg_modal.VDRUG_NAME_EN === "" ||
                                                    datasource_reg_modal.VDRUG_NAME_EN === undefined ||
                                                    datasource_reg_modal.VDRUG_NAME_EN === null)
                                                &&
                                                (datasource_reg_modal.FLAG === "" ||
                                                    datasource_reg_modal.FLAG === undefined ||
                                                    datasource_reg_modal.FLAG === null))

                                        )
                                    }
                                >
                                    등록
                                </Button>
                            </Popconfirm>
                            <Button
                                type="ghost"
                                size="small"
                                onClick={() => {
                                    dispatch(setIsvisibleRegModal(false))
                                    dispatch(setDatasourceRegModal({}))
                                }}
                            >
                                돌아가기
                            </Button>
                        </div>
                    }
                    onCancel={() => {
                        dispatch(setIsvisibleRegModal(false))
                        dispatch(setDatasourceRegModal({}))
                    }}
                    width="60vw"
                    title={<div>분석법 등록</div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 분석법 등록"
                        headStyle={{
                            padding: "0px !important",
                            color: "#2a538b",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        bodyStyle={{
                            padding: "20px 20px 20px 20px",
                        }}
                    >
                        <Table
                            style={{ marginTop: "5px" }}
                            size="small"
                            sticky
                            bordered
                            className="table-search"
                            showHeader={false}
                            pagination={false}
                            columns={[
                                {
                                    dataIndex: "title_1",
                                    width: "15%",
                                    className: "table-title"
                                },
                                {
                                    dataIndex: "data_1",
                                    render: (text, row, index) => {
                                        if (row.wide === 0) {
                                            return {
                                                children: <>{text}</>,
                                            }
                                        }
                                        if (row.wide === 1) {
                                            return {
                                                children: <>{text}</>,
                                                props: {
                                                    colSpan: 3,
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    dataIndex: "title_2",
                                    width: "15%",
                                    className: "table-title",
                                    render: (text, row, index) => {
                                        if (row.wide === 1) {
                                            return {
                                                children: <>{text}</>,
                                                props: {
                                                    colSpan: 0,
                                                }
                                            }
                                        } else {
                                            return <>{text}</>
                                        }
                                    }
                                },
                                {
                                    dataIndex: "data_2",
                                    render: (text, row, index) => {
                                        if (row.wide === 1) {
                                            return {
                                                children: <>{text}</>,
                                                props: {
                                                    colSpan: 0,
                                                }
                                            }
                                        } else {
                                            return <>{text}</>
                                        }
                                    }
                                },
                            ]}
                            dataSource={[
                                {
                                    title_1: "구분",
                                    data_1: <Select size="small" style={{ width: "100%" }}
                                        value={datasource_reg_modal.FLAG}
                                        onChange={(e) => {                                            
                                            dispatch(setDatasourceRegModal({ ...datasource_reg_modal, FLAG: e }))
                                        }}
                                    >
                                        <Select.Option value={'A'}>축산물</Select.Option>
                                        <Select.Option value={'F'}>수산물</Select.Option>
                                    </Select>,
                                    wide: 1,
                                },
                                {
                                    title_1: "동물용의약품",
                                    data_1:
                                        <Row>
                                            <Col xs={9}>
                                                <Input
                                                    size="small"
                                                    value={datasource_reg_modal.VDRUG_NAME_KR || ""}
                                                ></Input>
                                            </Col>
                                            <Col xs={9}>
                                                <Input
                                                    size="small"
                                                    value={datasource_reg_modal.VDRUG_NAME_EN || ""}
                                                ></Input>
                                            </Col>
                                            <Col xs={5} push={1}>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    block
                                                    onClick={() => {
                                                        dispatch(setIsvisibleRegDrawer(true))
                                                    }}
                                                >조회</Button>
                                                {isvisible_register_drawer ? <RegisterDrawer></RegisterDrawer> : <></>}
                                            </Col>
                                        </Row>
                                    ,
                                    wide: 1
                                },
                            ]}
                        />

                    </Card>
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 정보 입력"
                        headStyle={{
                            padding: "0px !important",
                            color: "#2a538b",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        bodyStyle={{
                            padding: "20px 20px 20px 20px",
                        }}
                    >
                        <Table
                            sticky
                            bordered
                            size="small"
                            rowKey={item => { return item.NO }}
                            pagination={false}
                            dataSource={datasource_reg_modal_analysis.filter(data=>data.IS_DELETE==='N')}
                            columns={[                                                                
                                {
                                    title: "적용범위",
                                    dataIndex: "COVERAGE",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                                // value={row.COVERAGE}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_reg_modal_analysis)
                                                    temp[row.NO].COVERAGE=e.target.value
                                                    dispatch(setDatasourceRegModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: "식품공전 번호",
                                    dataIndex: "VDRUG_NUM",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                                // value={row.VDRUG_NUM}                                        
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_reg_modal_analysis)
                                                    temp[row.NO].VDRUG_NUM=e.target.value
                                                    dispatch(setDatasourceRegModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: "Method Title",
                                    dataIndex: "COVERAGE",
                                    key: "NO",
                                    width: "20%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input.TextArea
                                            size="small"
                                                // value={row.METHOD_TITLE}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_reg_modal_analysis)
                                                    temp[row.NO].METHOD_TITLE=e.target.value
                                                    dispatch(setDatasourceRegModalAnalysis(temp))
                                                }}
                                            ></Input.TextArea>
                                        )
                                    }
                                },
                                {
                                    title: "분석원리",
                                    dataIndex: "COVERAGE",
                                    key: "NO",
                                    width: "20%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input.TextArea
                                            size="small"
                                                // value={row.VDRUG_NUM}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_reg_modal_analysis)
                                                    temp[row.NO].PRINCIPLES=e.target.value
                                                    dispatch(setDatasourceRegModalAnalysis(temp))
                                                }}
                                            ></Input.TextArea>
                                        )
                                    }
                                },
                                {
                                    title: "분석기기",
                                    dataIndex: "TOOLS",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                                // value={row.VDRUG_NUM}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_reg_modal_analysis)
                                                    temp[row.NO].TOOLS=e.target.value
                                                    dispatch(setDatasourceRegModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: "정량한계",
                                    dataIndex: "DOSE",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                                // value={row.VDRUG_NUM}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_reg_modal_analysis)
                                                    temp[row.NO].DOSE=e.target.value
                                                    dispatch(setDatasourceRegModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: <Button type="text"
                                        onClick={()=>{                                            
                                            dispatch(setDatasourceRegModalAnalysis([...datasource_reg_modal_analysis,{
                                                NO:datasource_reg_modal_analysis.length,
                                                COVERAGE:"",
                                                VDRUG_NUM:"",
                                                METHOD_TITLE:"",
                                                PRINCIPLES:"",
                                                TOOLS:"",
                                                DOSE:"",
                                                IS_DELETE:'N',
                                            }]))
                                        }}
                                    ><span style={{color:"blue"}}>+</span></Button>,
                                    key: "NO",
                                    align:"center",
                                    width: "5%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Button
                                                size="small"
                                                type="text"
                                                onClick={()=>{
                                                    const temp = _.cloneDeep(datasource_reg_modal_analysis)
                                                    temp[row.NO].IS_DELETE = 'Y'
                                                    dispatch(setDatasourceRegModalAnalysis(temp))
                                                }}
                                            ><span style={{color:"red"}}>-</span></Button>
                                        )
                                    }
                                },
                            ]}
                        >
                    </Table>
                </Card>
            </Modal>
            </div >
        );
    }
};

export const RegisterDrawer = () => {
    const dispatch = useDispatch();
    const {
        datasource_reg_modal,
        isvisible_register_drawer,
        datasource_std_value,
        selected_std_value_idx
    } = useSelector(state => state.VdAnalysisAnalysis);
    const { customSorter } = useSelector(state => state.util);

    const [modify_drawer_data, setModify_drawer_data] = useState([])
    const [searchKey, setSearchKey] = useState("")

    useEffect(() => {
        fetch('/API/search?TYPE=24113', {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {
            setModify_drawer_data(myJson)
        });
    }, [])

    if (!isvisible_register_drawer) {
        return (<></>)
    }
    else {
        return (
            <Drawer title="동물용의약품명 조회" placement="right" onClose={() => {
                dispatch(setIsvisibleRegDrawer(false))
            }} visible={isvisible_register_drawer}
                width="30vw"
            >
                <Search
                    placeholder="동물용의약품명을 입력하세요"
                    onSearch={(e) => {
                        setSearchKey(e)
                    }}
                    style={{ marginBottom: "10px" }}
                />
                <Table
                    size="small"
                    sticky
                    bordered
                    columns={[
                        {
                            title: "동물용의약품 국문명",
                            dataIndex: "VDRUG_NAME_KR",
                            key: "VDRUG_CODE",
                            width: "40%",
                            defaultSortOrder: 'ascend',
                            sorter: {
                                compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "VDRUG_NAME_KR")),
                            },
                            showSorterTooltip: false,
                            sortDirections: ['ascend', 'descend', 'ascend'],
                        },
                        {
                            title: "동물용의약품 영문명",
                            dataIndex: "VDRUG_NAME_EN",
                            key: "VDRUG_CODE",
                            width: "40%",
                            defaultSortOrder: 'ascend',
                            sorter: {
                                compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "VDRUG_NAME_EN")),
                            },
                            showSorterTooltip: false,
                            sortDirections: ['ascend', 'descend', 'ascend'],
                        },
                        {
                            render: (data, row, index) => <Button size="small"
                                onClick={() => {
                                    dispatch(setDatasourceRegModal({
                                        ...datasource_reg_modal,
                                        VDRUG_NAME_KR: row.VDRUG_NAME_KR,
                                        VDRUG_NAME_EN: row.VDRUG_NAME_EN,
                                        VDRUG_CODE: row.VDRUG_CODE
                                    }))
                                    dispatch(setIsvisibleRegDrawer(false))
                                }}
                            >선택</Button>
                        }
                    ]}
                    dataSource={modify_drawer_data.filter((val) => {
                        if (val.VDRUG_NAME_KR !== null) {
                            var word_str = "";
                            Hangul.disassemble(val.VDRUG_NAME_KR, true).forEach((word, index) => {
                                word_str += word[0];
                            });
                            return (
                                word_str.indexOf(searchKey) !== -1 ||
                                Hangul.disassemble(val.VDRUG_NAME_KR, true)[0][0].indexOf(searchKey) > -1 ||
                                val.VDRUG_NAME_KR.indexOf(searchKey) >= 0 ||
                                (val.VDRUG_NAME_EN !== "" && val.VDRUG_NAME_EN !== null ? val.VDRUG_NAME_EN.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 : null)
                            );
                        } else {
                            return val.VDRUG_NAME_EN.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
                        }
                    })}
                ></Table>
            </Drawer>
        )
    }
}

export const ModifyModal = () => {
    const dispatch = useDispatch();
    const {
        isvisible_modify_modal,
        datasource_mod_modal,
        datasource_mod_modal_analysis,
        isvisible_modify_drawer,
        isvisible_register_drawer,
    } = useSelector(state => state.VdAnalysisAnalysis);
    const xs_title = 7
    const xs_input = 16

    if (!isvisible_modify_modal) {
        return <></>
    }
    else {
        return (
            <div>
                <Modal
                    visible={isvisible_modify_modal}
                    footer={
                        <div>
                            <Popconfirm
                                title="등록하시겠습니까?"
                                onCancel={() => {
                                    dispatch(setIsvisibleModModal(false))
                                    dispatch(setDatasourceModModal({}))
                                }}
                                onConfirm={() => {
                                    const promise_VDRUG = new Promise((resolve,reject)=>{

                                        const temp = _.cloneDeep(datasource_mod_modal)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

                                        temp.TABLE="T_RESI_VD_PRODUCTS"
                                        temp.KEY=["NUM"]
                                        temp.NUMERIC_KEY=["NUM"]

                                        temp.MOD_DATE= moment(new Date()).format("YYYY-MM-DD");

                                        delete temp.VDRUG_NAME_KR
                                        delete temp.VDRUG_NAME_EN
                                        
                                        // console.log("VDRUG",temp)
                                        // resolve(1)

                                        fetch('/API/update', {
                                            method: 'POST',
                                            body: JSON.stringify({ data: [temp] }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            credentials: 'include',
                                        }).then(function (response) {
                                            console.log(response)
                                            if (response.status === 200) {
                                                message.success("동물용의약품 분석정보:" + (datasource_mod_modal.VDRUG_NAME_KR||datasource_mod_modal.VDRUG_NAME_EN) + "를 수정하였습니다.")
                                                resolve(1)

                                            } else if (response.status === 401) {
                                                message.error("권한이 없습니다.")
                                                resolve(0)
                                            }
                                        })
                                    })
                                    const promise_VDRUG_ANALYSIS = new Promise((resolve,reject)=>{
                                        const temp = _.cloneDeep(datasource_mod_modal_analysis.filter(data_filter=>data_filter.IS_DELETE==='N'))                                            

                                        temp.forEach(data_analysis=>{
                                            data_analysis.TABLE = "T_RESI_VD_PRODUCTS_DETECT";
                                            data_analysis.PRODUCTS_NUM = datasource_mod_modal.NUM

                                            delete data_analysis.IS_DELETE
                                            delete data_analysis.NO                                                
                                        })
                                        // console.log("VDRUG_ANALYSIS",temp)
                                        // resolve(1)

                                        fetch('/API/delete', {
                                            method: 'POST',
                                            body: JSON.stringify({
                                                data: [{
                                                    TABLE: "T_RESI_VD_PRODUCTS_DETECT",
                                                    KEY: ["PRODUCTS_NUM"],
                                                    NUMERIC_KEY: ["PRODUCTS_NUM"],
                                                    PRODUCTS_NUM: datasource_mod_modal.NUM,
                                                }]
                                            }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            credentials: 'include',
                                        }).then(function (response) {
                                            if (response.status === 200) {                                                                    
                                                fetch('/API/insert', {
                                                    method: 'POST',
                                                    body: JSON.stringify({ data: temp }),
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    credentials: 'include',
                                                }).then(function (response) {
                                                    // console.log(response)
                                                    if (response.status === 200) {
                                                        message.success("동물용의약품 분석정보: 분석방법 "+temp.length+ "종을 수정하였습니다.")                                                    
                                                        resolve(1)
        
                                                    } else if (response.status === 401) {
                                                        message.error("권한이 없습니다.")
                                                        resolve(0)
                                                    }
                                                })
                                            } else if (response.status === 401) {
                                                message.error("권한이 없습니다.")
                                                resolve(0)
                                            }
                                        })
                                        
                                    })
                                    
                                    Promise.all([promise_VDRUG,promise_VDRUG_ANALYSIS]).then(result=>{
                                        // window.location.href="/vd/analysis"
                                        fetch('/API/search?TYPE=24111', {
                                            method: 'GET',
                                            credentials: 'include',
                                        }).then(function (response) {
                                            return response.json();
                                        }).then(myJson => {
                                            myJson = myJson.map(data => {
                                                data.ARRAY = [];
                                                [...Array(data.CNT).keys()].map(index => {
                                                    data.ARRAY.push({
                                                        COVERAGE: data.COVERAGE.split(";")[index],
                                                        VDRUG_NUM: data.VDRUG_NUM.split(";")[index],
                                                        METHOD_TITLE: data.METHOD_TITLE.split(";")[index],
                                                        PRINCIPLES: data.PRINCIPLES.split(";")[index],
                                                        TOOLS: data.TOOLS.split(";")[index],
                                                        DOSE: data.DOSE.split(";")[index],
                                                    })
                                                })
                                                return data;
                                            })
                                            dispatch(setDataSource(myJson))
                                            dispatch(setIsvisibleModModal(false))
                                            dispatch(setDatasourceModModal({}))
                                        });                                         
                                    })
                                }}
                                okText="확인"
                                cancelText="취소"
                            >
                                <Button type="primary" size="small"
                                    disabled={
                                        (
                                            (
                                                (datasource_mod_modal.VDRUG_NAME_KR === undefined ||
                                                    datasource_mod_modal.VDRUG_NAME_KR === "" ||
                                                    datasource_mod_modal.VDRUG_NAME_KR === null)
                                                ||
                                                (datasource_mod_modal.VDRUG_NAME_EN === "" ||
                                                    datasource_mod_modal.VDRUG_NAME_EN === undefined ||
                                                    datasource_mod_modal.VDRUG_NAME_EN === null)
                                                &&
                                                (datasource_mod_modal.FLAG === "" ||
                                                    datasource_mod_modal.FLAG === undefined ||
                                                    datasource_mod_modal.FLAG === null))

                                        )
                                    }
                                >
                                    등록
                                </Button>
                            </Popconfirm>
                            <Button
                                type="ghost"
                                size="small"
                                onClick={() => {
                                    dispatch(setIsvisibleModModal(false))
                                    dispatch(setDatasourceModModal({}))
                                }}
                            >
                                돌아가기
                            </Button>
                        </div>
                    }
                    onCancel={() => {
                        dispatch(setIsvisibleModModal(false))
                        dispatch(setDatasourceModModal({}))
                    }}
                    width="60vw"
                    title={<div>분석법 등록</div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 분석법 등록"
                        headStyle={{
                            padding: "0px !important",
                            color: "#2a538b",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        bodyStyle={{
                            padding: "20px 20px 20px 20px",
                        }}
                    >
                        <Table
                            style={{ marginTop: "5px" }}
                            size="small"
                            sticky
                            bordered
                            className="table-search"
                            showHeader={false}
                            pagination={false}
                            columns={[
                                {
                                    dataIndex: "title_1",
                                    width: "15%",
                                    className: "table-title"
                                },
                                {
                                    dataIndex: "data_1",
                                    render: (text, row, index) => {
                                        if (row.wide === 0) {
                                            return {
                                                children: <>{text}</>,
                                            }
                                        }
                                        if (row.wide === 1) {
                                            return {
                                                children: <>{text}</>,
                                                props: {
                                                    colSpan: 3,
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    dataIndex: "title_2",
                                    width: "15%",
                                    className: "table-title",
                                    render: (text, row, index) => {
                                        if (row.wide === 1) {
                                            return {
                                                children: <>{text}</>,
                                                props: {
                                                    colSpan: 0,
                                                }
                                            }
                                        } else {
                                            return <>{text}</>
                                        }
                                    }
                                },
                                {
                                    dataIndex: "data_2",
                                    render: (text, row, index) => {
                                        if (row.wide === 1) {
                                            return {
                                                children: <>{text}</>,
                                                props: {
                                                    colSpan: 0,
                                                }
                                            }
                                        } else {
                                            return <>{text}</>
                                        }
                                    }
                                },
                            ]}
                            dataSource={[
                                {
                                    title_1: "구분",
                                    data_1: <Select size="small" style={{ width: "100%" }}
                                        value={datasource_mod_modal.FLAG}
                                        onChange={(e) => {                                            
                                            dispatch(setDatasourceModModal({ ...datasource_mod_modal, FLAG: e }))
                                        }}
                                    >
                                        <Select.Option value={'A'}>축산물</Select.Option>
                                        <Select.Option value={'F'}>수산물</Select.Option>
                                    </Select>,
                                    wide: 1,
                                },
                                {
                                    title_1: "동물용의약품",
                                    data_1:
                                        <Row>
                                            <Col xs={9}>
                                                <Input
                                                    size="small"
                                                    value={datasource_mod_modal.VDRUG_NAME_KR || ""}
                                                ></Input>
                                            </Col>
                                            <Col xs={9}>
                                                <Input
                                                    size="small"
                                                    value={datasource_mod_modal.VDRUG_NAME_EN || ""}
                                                ></Input>
                                            </Col>
                                            <Col xs={5} push={1}>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    block
                                                    onClick={() => {
                                                        dispatch(setIsvisibleModDrawer(true))
                                                    }}
                                                >조회</Button>
                                                {isvisible_modify_drawer ? <ModifyDrawer></ModifyDrawer> : <></>}
                                            </Col>
                                        </Row>
                                    ,
                                    wide: 1
                                },
                            ]}
                        />

                    </Card>
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 정보 입력"
                        headStyle={{
                            padding: "0px !important",
                            color: "#2a538b",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        bodyStyle={{
                            padding: "20px 20px 20px 20px",
                        }}
                    >
                        <Table
                            sticky
                            bordered
                            size="small"
                            rowKey={item => { return item.NO }}
                            pagination={false}
                            dataSource={datasource_mod_modal_analysis.filter(data=>data.IS_DELETE==='N')}
                            columns={[                                                                
                                {
                                    title: "적용범위",
                                    dataIndex: "COVERAGE",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                                defaultValue={row.COVERAGE}
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_mod_modal_analysis)
                                                    temp[row.NO].COVERAGE=e.target.value
                                                    dispatch(setDatasourceModModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: "식품공전 번호",
                                    dataIndex: "VDRUG_NUM",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                            defaultValue={row.VDRUG_NUM}                                        
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_mod_modal_analysis)
                                                    temp[row.NO].VDRUG_NUM=e.target.value
                                                    dispatch(setDatasourceModModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: "Method Title",
                                    dataIndex: "COVERAGE",
                                    key: "NO",
                                    width: "20%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input.TextArea
                                            size="small"
                                            defaultValue={row.METHOD_TITLE}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_mod_modal_analysis)
                                                    temp[row.NO].METHOD_TITLE=e.target.value
                                                    dispatch(setDatasourceModModalAnalysis(temp))
                                                }}
                                            ></Input.TextArea>
                                        )
                                    }
                                },
                                {
                                    title: "분석원리",
                                    dataIndex: "COVERAGE",
                                    key: "NO",
                                    width: "20%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input.TextArea
                                            size="small"
                                            defaultValue={row.PRINCIPLES}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_mod_modal_analysis)
                                                    temp[row.NO].PRINCIPLES=e.target.value
                                                    dispatch(setDatasourceModModalAnalysis(temp))
                                                }}
                                            ></Input.TextArea>
                                        )
                                    }
                                },
                                {
                                    title: "분석기기",
                                    dataIndex: "TOOLS",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                            defaultValue={row.TOOLS}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_mod_modal_analysis)
                                                    temp[row.NO].TOOLS=e.target.value
                                                    dispatch(setDatasourceModModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: "정량한계",
                                    dataIndex: "DOSE",
                                    key: "NO",
                                    width: "10%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Input
                                            size="small"
                                            defaultValue={row.DOSE}                                           
                                                onBlur={(e)=>{
                                                    const temp = _.cloneDeep(datasource_mod_modal_analysis)
                                                    temp[row.NO].DOSE=e.target.value
                                                    dispatch(setDatasourceModModalAnalysis(temp))
                                                }}
                                            ></Input>
                                        )
                                    }
                                },
                                {
                                    title: <Button type="text"
                                        onClick={()=>{                                            
                                            dispatch(setDatasourceModModalAnalysis([...datasource_mod_modal_analysis,{
                                                NO:datasource_mod_modal_analysis.length,
                                                COVERAGE:"",
                                                VDRUG_NUM:"",
                                                METHOD_TITLE:"",
                                                PRINCIPLES:"",
                                                TOOLS:"",
                                                DOSE:"",
                                                IS_DELETE:'N',
                                            }]))
                                        }}
                                    ><span style={{color:"blue"}}>+</span></Button>,
                                    key: "NO",
                                    align:"center",
                                    width: "5%",                                   
                                    render: (data, row, index) => {
                                        return (
                                            <Button
                                                size="small"
                                                type="text"
                                                onClick={()=>{
                                                    const temp = _.cloneDeep(datasource_mod_modal_analysis)
                                                    temp[row.NO].IS_DELETE = 'Y'
                                                    dispatch(setDatasourceModModalAnalysis(temp))
                                                }}
                                            ><span style={{color:"red"}}>-</span></Button>
                                        )
                                    }
                                },
                            ]}
                        >
                    </Table>
                </Card>
            </Modal>
            </div >
        );
    }
};

export const ModifyDrawer = () => {
    const dispatch = useDispatch();
    const {
        datasource_mod_modal,
        isvisible_modify_drawer,
        datasource_std_value,
        selected_std_value_idx
    } = useSelector(state => state.VdAnalysisAnalysis);
    const { customSorter } = useSelector(state => state.util);

    const [modify_drawer_data, setModify_drawer_data] = useState([])
    const [searchKey, setSearchKey] = useState("")

    useEffect(() => {
        fetch('/API/search?TYPE=24113', {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {
            setModify_drawer_data(myJson)
        });
    }, [])

    if (!isvisible_modify_drawer) {
        return (<></>)
    }
    else {
        return (
            <Drawer title="동물용의약품명 조회" placement="right" onClose={() => {
                dispatch(setIsvisibleModDrawer(false))
            }} visible={isvisible_modify_drawer}
                width="30vw"
            >
                <Search
                    placeholder="동물용의약품명을 입력하세요"
                    onSearch={(e) => {
                        setSearchKey(e)
                    }}
                    style={{ marginBottom: "10px" }}
                />
                <Table
                    size="small"
                    sticky
                    bordered
                    columns={[
                        {
                            title: "동물용의약품 국문명",
                            dataIndex: "VDRUG_NAME_KR",
                            key: "VDRUG_CODE",
                            width: "40%",
                            defaultSortOrder: 'ascend',
                            sorter: {
                                compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "VDRUG_NAME_KR")),
                            },
                            showSorterTooltip: false,
                            sortDirections: ['ascend', 'descend', 'ascend'],
                        },
                        {
                            title: "동물용의약품 영문명",
                            dataIndex: "VDRUG_NAME_EN",
                            key: "VDRUG_CODE",
                            width: "40%",
                            defaultSortOrder: 'ascend',
                            sorter: {
                                compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "VDRUG_NAME_EN")),
                            },
                            showSorterTooltip: false,
                            sortDirections: ['ascend', 'descend', 'ascend'],
                        },
                        {
                            render: (data, row, index) => <Button size="small"
                                onClick={() => {
                                    dispatch(setDatasourceModModal({
                                        ...datasource_mod_modal,
                                        VDRUG_NAME_KR: row.VDRUG_NAME_KR,
                                        VDRUG_NAME_EN: row.VDRUG_NAME_EN,
                                        VDRUG_CODE: row.VDRUG_CODE
                                    }))
                                    dispatch(setIsvisibleModDrawer(false))
                                }}
                            >선택</Button>
                        }
                    ]}
                    dataSource={modify_drawer_data.filter((val) => {
                        if (val.VDRUG_NAME_KR !== null) {
                            var word_str = "";
                            Hangul.disassemble(val.VDRUG_NAME_KR, true).forEach((word, index) => {
                                word_str += word[0];
                            });
                            return (
                                word_str.indexOf(searchKey) !== -1 ||
                                Hangul.disassemble(val.VDRUG_NAME_KR, true)[0][0].indexOf(searchKey) > -1 ||
                                val.VDRUG_NAME_KR.indexOf(searchKey) >= 0 ||
                                (val.VDRUG_NAME_EN !== "" && val.VDRUG_NAME_EN !== null ? val.VDRUG_NAME_EN.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 : null)
                            );
                        } else {
                            return val.VDRUG_NAME_EN.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
                        }
                    })}
                ></Table>
            </Drawer>
        )
    }
}