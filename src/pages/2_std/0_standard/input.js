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

} from "../../../reducers/std/StdStandardInput"
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
import Radio from "antd/es/radio"
import DatePicker from "antd/es/date-picker"
import Tag from "antd/es/tag"
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";

const { Option } = Select;
const { Search } = Input;

function InputRequest() {
    const dispatch = useDispatch();
    const { 
        dataSource,
        isvisible_search_modal,
        isvisible_modify_modal,
        isvisible_register_modal, 
    } = useSelector(state => state.StdStandardInput);


    const { userinfo } = useSelector(state => state.header);
    const { customSorter } = useSelector(state => state.util);

    const [searchKey, setSearchKey] = useState("")
    const [searchFlag, setSearchFlag] = useState(0)

    // useEffect 제외
    useEffect(() => {
        fetch('/API/search?TYPE=31311', {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {
            dispatch(setDataSource(myJson))
        });
    }, [dispatch])

    return (
        <div>
            <Template                
                userInfo={userinfo}

                //헤더 하단부 구성
                Header_bottom={{
                    title: "표준품", 
                    subTitle: "입력의뢰현황", 
                    datasource_breadcrumb: [
                        {
                            href: "/",
                            name: <HomeFilled></HomeFilled>,
                        },
                        {
                            href: "/std/std_input",
                            name: "표준품", 
                        },
                        {
                            href: "/std/std_input",
                            name: "입력의뢰현황", 
                        },
                    ]
                }}

                //사이더 종류
                sider={{
                    type: 3,
                    defaultActiveKey: 1
                }}

                //카드
                main_card={{
                    title: "입력의뢰현황 검색"
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
                                <Option value={0}>등록일</Option>
                                <Option value={1}>소속</Option>
                                <Option value={2}>등록자</Option>
                                <Option value={3}>검토완료예정일</Option>                             
                                <Option value={4}>입력자</Option>                             
                                <Option value={4}>입력일자</Option>
                            </Select>

                        </Col>
                        <Col xs={21}>
                            {
                                [
                                    {
                                        num:0,
                                        desc:"등록일을 입력하세요"
                                    },
                                    {
                                        num:1,
                                        desc:"소속을 입력하세요"
                                    },
                                    {
                                        num:2,
                                        desc:"등록자를 입력하세요"
                                    },
                                    {
                                        num:3,
                                        desc:"파일을 입력하세요"
                                    },
                                    {
                                        num:4,
                                        desc:"입력자를 입력하세요"
                                    },
                                    {
                                        num:5,
                                        desc:"입력일자를 입력하세요"
                                    },
                                ].map(data=>{
                                    if(data.num===searchFlag){
                                        return(
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
                            rowKey={item=>{return item.NUM}}
                            dataSource={dataSource.filter((val) => {

                                const func = (key)=>{
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

                                switch(searchFlag){
                                    case 0:
                                        return(func("INS_DATE"))
                                        break                                        
                                    case 1:
                                        return(func("PROVINCE_NAME"))
                                        break
                                    case 2:
                                        return(func("INS_NAME"))
                                        break
                                    case 3:
                                        return(func("FILE_NAME"))
                                        break
                                    case 4:
                                        return(func("INP_NAME"))
                                        break
                                    case 5:
                                        return(func("INP_DATE"))
                                        break
                                }
                            })}                            
                            columns={[
                                {
                                    title: "구분",
                                    dataIndex: "GUBUN",
                                    key: "STANDARD_NAME_REQUEST_NUM",
                                    width: "15%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "GUBUN")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],                                    
                                    render:(data,row,index)=>{
                                        if(row.GUBUN==="PRD"){
                                            return (
                                                <>농약</>
                                            )
                                        }else{
                                            return (
                                                <>동물용의약품</>
                                            )
                                        }
                                    }
                                },
                                {
                                    title: "등록일",
                                    dataIndex: "INS_DATE",
                                    key: "STANDARD_NAME_REQUEST_NUM",
                                    width: "15%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "INS_DATE")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],                                    
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.INS_DATE}</>
                                        )
                                    }
                                },
                                {
                                    title: "소속",
                                    dataIndex: "PROVINCE_NAME",
                                    key: "STANDARD_NAME_REQUEST_NUM",                                    
                                    width: "19%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "PROVINCE_NAME")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],                                    
                                    defaultSortOrder: 'descend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.PROVINCE_NAME}</>
                                        )
                                    }
                                },
                                {
                                    title: "등록자",
                                    dataIndex: "INS_NAME",
                                    key: "STANDARD_NAME_REQUEST_NUM",
                                    width: "8%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "INS_NAME")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.INS_NAME}</>
                                        )
                                    }
                                },
                                {
                                    title: "파일",
                                    dataIndex: "FILE_NAME",
                                    key: "STANDARD_NAME_REQUEST_NUM",
                                    width: "19%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "FILE_NAME")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.FILE_NAME}</>
                                        )
                                    }
                                },
                                {
                                    title: "입력일자",
                                    dataIndex: "INP_DATE",
                                    key: "STANDARD_NAME_REQUEST_NUM",
                                    width: "15%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "INP_DATE")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.INP_DATE}</>
                                        )
                                    }
                                },
                                {
                                    title: "입력자",
                                    dataIndex: "INP_NAME",
                                    key: "STANDARD_NAME_REQUEST_NUM",
                                    width: "10%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "INP_NAME")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.INP_NAME}</>
                                        )
                                    }
                                },
                                {
                                    title: "처리상태",
                                    key: "STANDARD_NAME_REQUEST_NUM",
                                    width: "10%",
                                    align:"center",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "INP_NAME")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        if (row.STATUS==="receipt"){
                                            return(
                                                <Tag color={"blue"}>
                                                    {"접수"}
                                                </Tag>
                                            )

                                        }
                                        else if(row.STATUS==="management"){
                                            return(
                                                <Tag color={"yellow"}>
                                                    {"처리중"}
                                                </Tag>
                                            )
                                        }
                                        else if(row.STATUS==="end"){
                                            return(
                                                <Tag color={"green"}>
                                                    {"완료"}
                                                </Tag>
                                            )
                                        }
                                        
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
                                    width: "8%",
                                    render: (data, row, index) =>
                                        <Row key={row.FOOD_CODE}>
                                            <Col xs={12}>
                                                <Button
                                                    size="small"
                                                    className="button_mod"
                                                    onClick={() => {                                                        
                                                        fetch("/API/search?TYPE=31313&STANDARD_NAME_REQUEST_NUM="+row.STANDARD_NAME_REQUEST_NUM, {
                                                            method: 'GET',
                                                            credentials: 'include',
                                                        }).then(function (response) {
                                                            return response.json();
                                                        }).then(myJson => {
                                                            console.log(myJson[0])
                                                            dispatch(setDatasourceModModal(myJson[0]))
                                                            dispatch(setIsvisibleModModal(true))                                                            
                                                        });                                                        
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            </Col>
                                            <Col xs={12}>
                                                <Popconfirm
                                                    title="정말 삭제하시겠습니까?"
                                                    onConfirm={() => {
                                                        var promise_delete=new Promise((resolve,reject)=>{
                                                            fetch('/API/delete', {
                                                                method: 'POST',
                                                                body: JSON.stringify({ data: [{
                                                                    TABLE:"T_RESI_STANDARD_NAME_REQUEST",
                                                                    KEY:["STANDARD_NAME_REQUEST_NUM"],
                                                                    NUMERIC_KEY:["STANDARD_NAME_REQUEST_NUM"],
                                                                    STANDARD_NAME_REQUEST_NUM:row.STANDARD_NAME_REQUEST_NUM,
                                                                }] }),
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                if (response.status === 200) {
                                                                    message.success("입력의뢰: 1건을 삭제하였습니다.")
                                                                    resolve(1)                                                           
                                                                } else if (response.status === 401) {
                                                                    message.error("권한이 없습니다.")
                                                                    resolve(0)
                                                                }
                                                            })
                                                        })

                                                        Promise.all([promise_delete]).then(values=>{
                                                            fetch('/API/search?TYPE=31311', {
                                                                method: 'GET',
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                return response.json();
                                                            }).then(myJson => {
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
            {isvisible_register_modal?<RegisterModal></RegisterModal>:<></>}            
            {isvisible_modify_modal?<ModifyModal></ModifyModal>:<></>}
            
        </div>
    )
}

export default InputRequest;

export const RegisterModal = () => {
    const dispatch = useDispatch();
    const { 
        isvisible_register_modal, 
        datasource_reg_modal, 
     } = useSelector(state => state.StdStandardInput); //수정    
     const { userinfo } = useSelector(state => state.header);

    useEffect(() => {
        fetch('/API/search?TYPE=31117&USERID='+userinfo.USERID, {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {
            dispatch(setDatasourceRegModal({...myJson[0],GUBUN:"PRD"}))
        });
    }, [dispatch])    

    
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
                                    fetch('/API/search?TYPE=31312', {
                                        method: 'GET',
                                        credentials: 'include',
                                    }).then(res => {
                                        return res.json()
                                    }).then(data => {
                                        var promise_using = new Promise((resolve, reject) => {                                            
                                            const temp = _.cloneDeep(datasource_reg_modal)

                                            temp.STANDARD_NAME_REQUEST_NUM = (parseInt(data[0].MAX, 10) + 1)
                                            temp.TABLE = "T_RESI_STANDARD_NAME_REQUEST"
                                            temp.USERID = userinfo.USERID                                            
                                            temp.INS_NAME = userinfo.USERNAME
                                            temp.INS_DATE = moment(new Date()).format("YYYY-MM-DD")
                                            temp.STATUS = "receipt"                                               

                                            delete temp.PROVINCE_NAME
                                            delete temp.USERNAME                              
                                            delete temp.USERID

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
                                                    message.success("입력의뢰: 1건을 등록하였습니다.")
                                                    dispatch(setIsvisibleRegModal(false))
                                                    dispatch(setDatasourceRegModal({}))
                                                    resolve(1)
                                                    
                                                } else if (response.status === 401) {
                                                    message.error("권한이 없습니다.")
                                                    dispatch(setIsvisibleRegModal(false))
                                                    dispatch(setDatasourceRegModal({}))
                                                    resolve(0)
                                                }
                                            })
                                        })

                                        Promise.all([promise_using]).then(values=>{
                                            fetch('/API/search?TYPE=31311', {
                                                method: 'GET',
                                                credentials: 'include',
                                            }).then(function (response) {
                                                return response.json();
                                            }).then(myJson => {                                                
                                                dispatch(setDataSource(myJson))
                                            });
                                        })
                                    })

                                }}
                                okText="확인"
                                cancelText="취소"
                            >
                                <Button type="primary" size="small"
                                    
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
                    width="40vw"
                    title={<div>입력처리상태 등록</div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 입력처리상태 등록"
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
                                size="small"
                                sticky
                                bordered
                                className="table-search"
                                showHeader={false}
                                pagination={false}
                                columns={[
                                    {
                                        dataIndex:"title_1",
                                        width:"15%",
                                        className:"table-title"
                                    },
                                    {
                                        dataIndex:"data_1",
                                        render:(text,row,index)=>{
                                            if(row.wide===0){
                                                return {
                                                    children:<>{text}</>,                                                    
                                                }
                                            }
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:3,
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        dataIndex:"title_2",
                                        width:"15%",
                                        className:"table-title",
                                        render:(text,row,index)=>{
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:0,
                                                    }
                                                }
                                            }else{
                                                return <>{text}</>
                                            }
                                        }           
                                    },
                                    {
                                        dataIndex:"data_2",
                                        render:(text,row,index)=>{
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:0,
                                                    }
                                                }
                                            }else{
                                                return <>{text}</>
                                            }
                                        }                                
                                    },
                                ]}
                                dataSource={[
                                    { 
                                        title_1 : "구분",
                                        data_1 : 
                                            <Radio.Group 
                                                
                                                value={datasource_reg_modal.GUBUN }
                                                onChange={(e)=>{
                                                dispatch(setDatasourceRegModal({ ...datasource_reg_modal, GUBUN: e.target.value }))
                                            }}>
                                                <Radio size="small" value={'PRD'}>농약</Radio>
                                                <Radio size="small" value={'VD'}>동물용의약품</Radio>                                                
                                            </Radio.Group>
                                        ,                      
                                        wide:1
                                    },
                                    {
                                        title_1 : "소속",
                                        data_1 : datasource_reg_modal.PROVINCE_NAME,
                                        title_2 : "성명",
                                        data_2 : datasource_reg_modal.USERNAME,   
                                        wide:0
                                    },
                                    {
                                        title_1 : "연락처",
                                        data_1 : <Input size="small"
                                            defaultValue={datasource_reg_modal.INS_PHONE}
                                            onBlur={(e)=>{dispatch(setDatasourceModModal({...datasource_reg_modal,INS_PHONE:e.target.value}))}}
                                        />,
                                        title_2 : "이메일",
                                        data_2 : <Input size="small"
                                        defaultValue={datasource_reg_modal.INS_EMAIL}
                                        onBlur={(e)=>{dispatch(setDatasourceModModal({...datasource_reg_modal,INS_EMAIL:e.target.value}))}}
                                    />,
                                        wide:0
                                    },             
                                ]}
                            />

                        
                    </Card>
                </Modal>
            </div>
        );
    }
};

export const ModifyModal = () => {
    const dispatch = useDispatch();
    const { 
        isvisible_modify_modal,
        datasource_mod_modal, 
    } = useSelector(state => state.StdStandardInput); //수정
    const { userinfo } = useSelector(state => state.header);

    useEffect(() => {
        fetch('/API/search?TYPE=31117&USERID='+userinfo.USERID, {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {
            dispatch(setDatasourceModModal({...datasource_mod_modal,...myJson[0],GUBUN:"PRD"}))
        });
        console.log(datasource_mod_modal)
    }, [dispatch])   

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
                                title="수정하시겠습니까?"
                                onCancel={() => {
                                    dispatch(setIsvisibleModModal(false))
                                    dispatch(setDatasourceModModal({}))
                                }}
                                onConfirm={() => {                                                                        
                                    var promise_update=new Promise((resolve,reject)=>{
                                        
                                        const temp = _.cloneDeep(datasource_mod_modal)
                                        
                                        temp.TABLE="T_RESI_STANDARD_NAME_REQUEST"
                                        temp.KEY=["STANDARD_NAME_REQUEST_NUM"]
                                        temp.NUMERIC_KEY=["STANDARD_NAME_REQUEST_NUM","PROVINCE_NUM","FILE_SIZE"]

                                        temp.INP_NAME = temp.USERNAME

                                        delete temp.USERNAME
                                        delete temp.PROVINCE_NAME
                                        delete temp.PROVINCE_NAME_RP
                                        
                                        console.log(temp)

                                        fetch('/API/update', {
                                            method: 'POST',
                                            body: JSON.stringify({ data: [temp] }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            credentials: 'include',
                                        }).then(function (response) {
                                            if (response.status === 200) {
                                                message.success("입력의뢰 : 1건을 수정하였습니다.")
                                                dispatch(setIsvisibleModModal(false))
                                                dispatch(setDatasourceModModal({}))                                                    
                                                resolve(1)
                                                
                                            } else if (response.status === 401) {
                                                message.error("권한이 없습니다.")
                                                dispatch(setIsvisibleModModal(false))
                                                dispatch(setDatasourceModModal({}))
                                                resolve(0)
                                            }
                                        })
                                    })

                                    Promise.all([promise_update]).then(values=>{
                                        fetch('/API/search?TYPE=31311', {
                                            method: 'GET',
                                            credentials: 'include',
                                        }).then(function (response) {
                                            return response.json();
                                        }).then(myJson => {
                                            dispatch(setDataSource(myJson))
                                        });
                                    })
                                    
                                }}
                                okText="수정"
                                cancelText="취소"
                            >
                                <Button type="primary" size="small"
                                    disabled={
                                        ((
                                            datasource_mod_modal.PESTICIDE_NAME === "" ||
                                            datasource_mod_modal.PESTICIDE_NAME === null) &&
                                            (datasource_mod_modal.FOOD_NAME === "" ||
                                            datasource_mod_modal.FOOD_NAME === null))
                                    }
                                >
                                    수정
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
                    width="30vw"
                    title={<div>입력처리상태 관리 - {
                        !(datasource_mod_modal.PESTICIDE_NAME===null||datasource_mod_modal.PESTICIDE_NAME===undefined||datasource_mod_modal.PESTICIDE_NAME==="")?
                        <>{datasource_mod_modal.PESTICIDE_NAME}</>:
                        <>{datasource_mod_modal.PESTICIDE_NAME}</>
                    } </div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 입력의뢰 수정" //수정
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
                                size="small"
                                sticky
                                bordered
                                className="table-search"
                                showHeader={false}
                                pagination={false}
                                columns={[
                                    {
                                        dataIndex:"title_1",
                                        width:"15%",
                                        className:"table-title"
                                    },
                                    {
                                        dataIndex:"data_1",
                                        render:(text,row,index)=>{
                                            if(row.wide===0){
                                                return {
                                                    children:<>{text}</>,                                                    
                                                }
                                            }
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:3,
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        dataIndex:"title_2",
                                        width:"15%",
                                        className:"table-title",
                                        render:(text,row,index)=>{
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:0,
                                                    }
                                                }
                                            }else{
                                                return <>{text}</>
                                            }
                                        }           
                                    },
                                    {
                                        dataIndex:"data_2",
                                        render:(text,row,index)=>{
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:0,
                                                    }
                                                }
                                            }else{
                                                return <>{text}</>
                                            }
                                        }                                
                                    },
                                ]}
                                dataSource={[
                                    { 
                                        title_1 : "구분",
                                        data_1 : 
                                            <Radio.Group 
                                                
                                                value={datasource_mod_modal.GUBUN }
                                                onChange={(e)=>{
                                                dispatch(setDatasourceModModal({ ...datasource_mod_modal, GUBUN: e.target.value }))
                                            }}>
                                                <Radio size="small" value={'PRD'}>농약</Radio>
                                                <Radio size="small" value={'VD'}>동물용의약품</Radio>                                                
                                            </Radio.Group>
                                        ,                      
                                        wide:1
                                    },
                                    {
                                        title_1 : "소속",
                                        data_1 : datasource_mod_modal.PROVINCE_NAME_RP,
                                        title_2 : "성명",
                                        data_2 : datasource_mod_modal.INS_NAME,   
                                        wide:0
                                    },
                                    {
                                        title_1 : "연락처",
                                        data_1 : <Input size="small"
                                            defaultValue={datasource_mod_modal.INS_PHONE}
                                            onBlur={(e)=>{dispatch(setDatasourceModModal({...datasource_mod_modal,INS_PHONE:e.target.value}))}}
                                        />,
                                        title_2 : "이메일",
                                        data_2 : <Input size="small"
                                        defaultValue={datasource_mod_modal.INS_EMAIL}
                                        onBlur={(e)=>{dispatch(setDatasourceModModal({...datasource_mod_modal,INS_EMAIL:e.target.value}))}}
                                    />,
                                        wide:0
                                    },             
                                ]}
                            />
                       
                    </Card>
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 입력처리상태 수정" //수정
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
                                size="small"
                                sticky
                                bordered
                                className="table-search"
                                showHeader={false}
                                pagination={false}
                                columns={[
                                    {
                                        dataIndex:"title_1",
                                        width:"15%",
                                        className:"table-title"
                                    },
                                    {
                                        dataIndex:"data_1",
                                        render:(text,row,index)=>{
                                            if(row.wide===0){
                                                return {
                                                    children:<>{text}</>,                                                    
                                                }
                                            }
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:3,
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        dataIndex:"title_2",
                                        width:"15%",
                                        className:"table-title",
                                        render:(text,row,index)=>{
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:0,
                                                    }
                                                }
                                            }else{
                                                return <>{text}</>
                                            }
                                        }           
                                    },
                                    {
                                        dataIndex:"data_2",
                                        render:(text,row,index)=>{
                                            if(row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                    props:{
                                                        colSpan:0,
                                                    }
                                                }
                                            }else{
                                                return <>{text}</>
                                            }
                                        }                                
                                    },
                                ]}
                                dataSource={[
                                    {
                                        title_1: "입력일자",
                                        data_1: <DatePicker
                                            size="small"
                                            value={moment(datasource_mod_modal.INP_DATE, 'YYYY-MM-DD')}
                                            style={{ width: "100%" }}
                                            onChange={(date, dateString) => {
                                                dispatch(setDatasourceModModal({ ...datasource_mod_modal, INP_DATE: dateString}))
                                            }}
                                        />,
                                        wide: 1
                                    },
                                    {
                                        title_1: "입력자",
                                        data_1: datasource_mod_modal.USERNAME,
                                        wide: 1
                                    },
                                    {
                                        title_1: "구분",
                                        data_1:
                                            <Radio.Group

                                                value={datasource_mod_modal.STATUS}
                                                onChange={(e) => {
                                                    dispatch(setDatasourceModModal({ ...datasource_mod_modal, STATUS: e.target.value }))
                                                }}>
                                                <Radio size="small" value={'receipt'}>접수</Radio>
                                                <Radio size="small" value={'management'}>처리중</Radio>
                                                <Radio size="small" value={'end'}>완료</Radio>
                                            </Radio.Group>
                                        ,
                                        wide: 1
                                    },
                                ]}
                            />
                       
                    </Card>                  
                </Modal>
            </div>
        );
    }
};