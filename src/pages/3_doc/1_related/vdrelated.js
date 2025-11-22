import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
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

} from "../../../reducers/doc/DocVdRelated"
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
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Switch } from "antd";
import { render } from "@testing-library/react";

const { Option } = Select;
const { Search } = Input;

function VdRelated() {
    const dispatch = useDispatch();
    const { 
        dataSource,
        isvisible_search_modal,
        isvisible_modify_modal,
        isvisible_register_modal, 
    } = useSelector(state => state.DocVdRelated);


    const { userinfo } = useSelector(state => state.header);
    const { customSorter } = useSelector(state => state.util);

    const [searchKey, setSearchKey] = useState("")
    const [searchFlag, setSearchFlag] = useState(0)

    // useEffect 제외
    useEffect(() => {
        fetch('/API/search?TYPE=16111', {
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
                    title: "자료실", 
                    subTitle: "동물용의약품", 
                    datasource_breadcrumb: [
                        {
                            href: "/",
                            name: <HomeFilled></HomeFilled>,
                        },
                        {
                            href: "/vd/rel_site",
                            name: "관련사이트", 
                        },
                        {
                            href: "/vd/rel_site",
                            name: "동물용의약품", 
                        },
                    ]
                }}

                //사이더 종류
                sider={{
                    type: 4,
                    defaultActiveKey: 2
                }}

                //카드
                main_card={{
                    title: "동물용의약품 관련사이트 검색"
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
                                <Option value={0}>농약명</Option>
                                <Option value={1}>대상식품</Option>
                                <Option value={2}>신청일</Option>
                                <Option value={3}>검토완료예정일</Option>                             
                                <Option value={4}>신청회사</Option>
                            </Select>

                        </Col>
                        <Col xs={21}>
                            {
                                [
                                    {
                                        num:0,
                                        desc:"농약명을 입력하세요"
                                    },
                                    {
                                        num:1,
                                        desc:"대상식품을 입력하세요"
                                    },
                                    {
                                        num:2,
                                        desc:"신청일을 입력하세요 ex) 2000, 2000-01, 2000-01-01"
                                    },
                                    {
                                        num:3,
                                        desc:"검토완료예정일을 입력하세요 ex) 2000, 2000-01, 2000-01-01"
                                    },
                                    {
                                        num:4,
                                        desc:"신청회사를 입력하세요"
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
                                        return(func("PESTICIDE_NAME"))
                                        break                                        
                                    case 1:
                                        return(func("FOOD_NAME"))
                                        break
                                    case 2:
                                        return(func("APPLICATION_DATE"))
                                        break
                                    case 3:
                                        return(func("DUE_DATE_OF_COMPLETION"))
                                        break
                                    case 4:
                                        return(func("APPLICATION_COMPANY"))
                                        break
                                }
                            })}                            
                            columns={[
                                {
                                    title: "농약명",
                                    dataIndex: "PESTICIDE_NAME",
                                    key: "NUM",
                                    width: "12%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "PESTICIDE_NAME")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.PESTICIDE_NAME}</>
                                        )
                                    }
                                },
                                {
                                    title: "대상식품",
                                    dataIndex: "FOOD_NAME",
                                    key: "NUM",
                                    width: "12%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "FOOD_NAME")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],                                    
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.FOOD_NAME}</>
                                        )
                                    }
                                },
                                {
                                    title: "신청일",
                                    dataIndex: "APPLICATION_DATE",
                                    key: "NUM",                                    
                                    width: "12%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "APPLICATION_DATE")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],                                    
                                    defaultSortOrder: 'descend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.APPLICATION_DATE}</>
                                        )
                                    }
                                },
                                {
                                    title: "검토완료예정일",
                                    dataIndex: "DUE_DATE_OF_COMPLETION",
                                    key: "NUM",
                                    width: "12%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "DUE_DATE_OF_COMPLETION")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.DUE_DATE_OF_COMPLETION}</>
                                        )
                                    }
                                },
                                {
                                    title: "신청회사",
                                    dataIndex: "APPLICATION_COMPANY",
                                    key: "NUM",
                                    width: "12%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "APPLICATION_COMPANY")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.APPLICATION_COMPANY}</>
                                        )
                                    }
                                },
                                {
                                    title: "비고",
                                    dataIndex: "COMMENTS",
                                    key: "NUM",
                                    width: "15%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "COMMENTS")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        return(
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
                                    width: "7%",
                                    render: (data, row, index) =>
                                        <Row key={row.FOOD_CODE}>
                                            <Col xs={12}>
                                                <Button
                                                    size="small"
                                                    className="button_mod"
                                                    onClick={() => {                                                        
                                                        fetch("/API/search?TYPE=16112&NUM="+row.NUM, {
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
                                                                    TABLE:"T_RESI_PESTICIDE_PROGRESS",
                                                                    KEY:["NUM"],
                                                                    NUMERIC_KEY:["NUM"],
                                                                    NUM:row.NUM,
                                                                }] }),
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                if (response.status === 200) {
                                                                    message.success("진행사항: "+(row.PESTICIDE_NAME||row.PESTICIDE_NAME)+"을 삭제하였습니다.")
                                                                    resolve(1)                                                           
                                                                } else if (response.status === 401) {
                                                                    message.error("권한이 없습니다.")
                                                                    resolve(0)
                                                                }
                                                            })
                                                        })

                                                        Promise.all([promise_delete]).then(values=>{
                                                            fetch('/API/search?TYPE=16111', {
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

export default VdRelated;

export const RegisterModal = () => {
    const dispatch = useDispatch();
    const { 
        isvisible_register_modal, 
        datasource_reg_modal, 
     } = useSelector(state => state.DocVdRelated); //수정
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
                                    fetch('/API/search?TYPE=16113', {
                                        method: 'GET',
                                        credentials: 'include',
                                    }).then(res => {
                                        return res.json()
                                    }).then(data => {
                                        var promise_using = new Promise((resolve, reject) => {                                            
                                            datasource_reg_modal.NUM = (parseInt(data[0].NUM, 10) + 1)
                                            datasource_reg_modal.TABLE = "T_RESI_PESTICIDE_PROGRESS"

                                            fetch('/API/insert', {
                                                method: 'POST',
                                                body: JSON.stringify({ data: [datasource_reg_modal] }),
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                credentials: 'include',
                                            }).then(function (response) {
                                                console.log(response)
                                                if (response.status === 200) {
                                                    message.success("사이트링크: "+(datasource_reg_modal.FOOD_NAME_KR||datasource_reg_modal.FOOD_NAME_EN)+"을 등록하였습니다.")
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
                                            fetch('/API/search?TYPE=16111', {
                                                method: 'GET',
                                                credentials: 'include',
                                            }).then(function (response) {
                                                return response.json();
                                            }).then(myJson => {
                                                console.log(myJson)
                                                dispatch(setDataSource(myJson))
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
                                                (datasource_reg_modal.PESTICIDE_NAME === undefined ||
                                                datasource_reg_modal.PESTICIDE_NAME === "" ||
                                                datasource_reg_modal.PESTICIDE_NAME === null) 
                                                ||
                                                (datasource_reg_modal.FOOD_NAME === "" ||
                                                datasource_reg_modal.FOOD_NAME === undefined ||
                                                datasource_reg_modal.FOOD_NAME === null))
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
                    width="30vw"
                    title={<div>동물용의약품 사이트링크 등록</div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 사이트링크 등록"
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
                        {
                            [
                                {
                                    title:"제목",
                                    key:"",
                                    placeholder:"제목을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"URL",
                                    key:"",
                                    placeholder:"URL을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"목록 소개글",
                                    key:"",
                                    placeholder:"목록 소개글을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"내용",
                                    key:"",
                                    placeholder:"내용을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"목록 이미지",
                                    key:"",
                                    placeholder:"목록 이미지를 입력하세요",
                                    flag:false
                                },
                            ].map((data) => {
                                return (
                                    <Row className="modal-input">
                                        <Col xs={xs_title} className="modal-input-col">
                                            {data.flag?<><span style={{color:"red"}}>*</span><span>{data.title}</span></>:<><span>{data.title}</span></>}
                                        </Col>
                                        <Col xs={1}></Col>
                                        <Col xs={xs_input}>
                                            <Input
                                                value={datasource_reg_modal[data.key]}
                                                className="modal-input"
                                                placeholder={data.placeholder}
                                                size="small"
                                                onChange={(e) => {
                                                    dispatch(setDatasourceRegModal(
                                                        { ...datasource_reg_modal, [data.key]: e.target.value }
                                                    ))
                                                }}
                                            ></Input>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                        
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
    } = useSelector(state => state.DocVdRelated); //수정
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
                                title="수정하시겠습니까?"
                                onCancel={() => {
                                    dispatch(setIsvisibleModModal(false))
                                    dispatch(setDatasourceModModal({}))
                                }}
                                onConfirm={() => {                                                                        
                                    var promise_update=new Promise((resolve,reject)=>{
                                        datasource_mod_modal.TABLE="T_RESI_PESTICIDE_PROGRESS"
                                        datasource_mod_modal.KEY=["NUM"]
                                        datasource_mod_modal.NUMERIC_KEY=["NUM"]

                                        fetch('/API/update', {
                                            method: 'POST',
                                            body: JSON.stringify({ data: [datasource_mod_modal] }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            credentials: 'include',
                                        }).then(function (response) {
                                            if (response.status === 200) {
                                                message.success("사이트링크 : "+(datasource_mod_modal.PESTICIDE_NAME||datasource_mod_modal.PESTICIDE_NAME)+"을 수정하였습니다.")
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
                                        fetch('/API/search?TYPE=16111', {
                                            method: 'GET',
                                            credentials: 'include',
                                        }).then(function (response) {
                                            return response.json();
                                        }).then(myJson => {
                                            console.log(myJson)
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
                    title={<div>동물용의약품 사이트링크 관리 - {
                        !(datasource_mod_modal.PESTICIDE_NAME===null||datasource_mod_modal.PESTICIDE_NAME===undefined||datasource_mod_modal.PESTICIDE_NAME==="")?
                        <>{datasource_mod_modal.PESTICIDE_NAME}</>:
                        <>{datasource_mod_modal.PESTICIDE_NAME}</>
                    } </div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 사이트링크 수정" //수정
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
                        {
                            [
                                {
                                    title:"제목",
                                    key:"",
                                    placeholder:"제목을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"URL",
                                    key:"",
                                    placeholder:"URL을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"목록 소개글",
                                    key:"",
                                    placeholder:"목록 소개글을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"내용",
                                    key:"",
                                    placeholder:"내용을 입력하세요",
                                    flag:false
                                },
                                {
                                    title:"목록 이미지",
                                    key:"",
                                    placeholder:"목록 이미지를 입력하세요",
                                    flag:false
                                },
                            ].map((data) => {
                                return (
                                    <Row className="modal-input">
                                        <Col xs={xs_title} className="modal-input-col">
                                            {data.flag?<><span style={{color:"red"}}>*</span><span>{data.title}</span></>:<><span>{data.title}</span></>}
                                        </Col>
                                        <Col xs={1}></Col>
                                        <Col xs={xs_input}>
                                            <Input
                                                value={datasource_mod_modal[data.key]}
                                                className="modal-input"
                                                placeholder={data.placeholder}
                                                size="small"
                                                onChange={(e) => {
                                                    dispatch(setDatasourceModModal(
                                                        { ...datasource_mod_modal, [data.key]: e.target.value }
                                                    ))
                                                }}
                                            ></Input>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                    </Card>                    
                </Modal>
            </div>
        );
    }
};