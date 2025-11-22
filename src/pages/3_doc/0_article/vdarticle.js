import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import moment from "moment"
// #antd icon
import { DeleteOutlined, EditOutlined, PlusOutlined, HomeFilled, } from "@ant-design/icons";
// #antd icon

import { Editor } from "react-draft-wysiwyg";
import { EditorState,convertToRaw  } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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

} from "../../../reducers/doc/DocVdArticle"
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

function VdArticle() {
    const dispatch = useDispatch();
    const { 
        dataSource,
        isvisible_search_modal,
        isvisible_modify_modal,
        isvisible_register_modal, 
    } = useSelector(state => state.DocVdArticle);


    const { userinfo } = useSelector(state => state.header);
    const { customSorter } = useSelector(state => state.util);

    const [searchKey, setSearchKey] = useState("")
    const [searchFlag, setSearchFlag] = useState(0)

    const [editorState, setEditorState] = useState(() =>    
        EditorState.createEmpty()
    );

    // useEffect 제외
    useEffect(() => {
        fetch('/API/search?TYPE=42111', {
            method: 'GET',
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(myJson => {
            dispatch(setDataSource(myJson))
        });
    }, [dispatch,editorState])

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
                            href: "/vd/downloads",
                            name: "자료실", 
                        },
                        {
                            href: "/vd/downloads",
                            name: "동물용의약품", 
                        },
                    ]
                }}

                //사이더 종류
                sider={{
                    type: 4,
                    defaultActiveKey: 1
                }}

                //카드
                main_card={{
                    title: "게시물 검색"
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
                                <Option value={0}>제목</Option>
                                <Option value={1}>내용</Option>
                                <Option value={2}>작성자</Option>
                            </Select>

                        </Col>
                        <Col xs={21}>
                            {
                                [
                                    {
                                        num:0,
                                        desc:"제목을 입력하세요"
                                    },
                                    {
                                        num:1,
                                        desc:"내용을 입력하세요"
                                    },
                                    {
                                        num:2,
                                        desc:"작성자를 입력하세요"
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
                            rowKey={item=>{return item.ARTICLE_KEY}}
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
                                        return(func("TITLE"))
                                        break                                        
                                    case 1:
                                        return(func("CONTENT"))
                                        break
                                    case 2:
                                        return(func("WRITER"))
                                        break
                                    default:
                                }
                            })}                            
                            columns={[
                                {
                                    title: "번호",
                                    dataIndex: "NUM",
                                    key: "ARTICLE_KEY",
                                    width: "5%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "NUM")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.NUM}</>
                                        )
                                    }
                                },
                                {
                                    title: "구분",
                                    dataIndex: "GBN_BRD",
                                    key: "ARTICLE_KEY",
                                    width: "15%",
                                    filters: [
                                        { text: "동물용의약품정보", value: "V" },
                                        { text: "홍보자료", value: "T" },
                                    ],
                                    onFilter: (value, record) => record.PUBLIC_FLAG.indexOf(value) === 0,
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "GBN_BRD")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render: (data, row, index) => {
                                        return (
                                            data === 'V' ? <span style={{ color: "blue" }}>동물용의약품정보</span> : <span style={{ color: "green" }}></span>
                                        )
                                    },
                                },
                                {
                                    title: "제목",
                                    dataIndex: "TITLE",
                                    key: "ARTICLE_KEY",                                    
                                    width: "35%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "TITLE")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],                                    
                                    defaultSortOrder: 'descend',
                                    render:(data,row,index)=>{
                                        return(
                                                <a
                                                    onClick={() => {                                                        
                                                        fetch("/API/search?TYPE=42112&ARTICLE_KEY="+row.ARTICLE_KEY, {
                                                            method: 'GET',
                                                            credentials: 'include',
                                                        }).then(function (response) {
                                                            return response.json();
                                                        }).then(myJson => {
                                                            console.log(myJson[0])
                                                            dispatch(setDatasourceSchModal(myJson[0]))
                                                            dispatch(setIsvisibleSchModal(true))                                                            
                                                        });                                                        
                                                    }}
                                                >
                                                    {data}
                                                </a>
                                        )
                                    }
                                },
                                {
                                    title: "작성자",
                                    dataIndex: "WRITER",
                                    key: "ARTICLE_KEY",
                                    width: "15%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "WRITER")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.WRITER}</>
                                        )
                                    }
                                },
                                {
                                    title: "작성일",
                                    dataIndex: "SYS_RDATE",
                                    key: "ARTICLE_KEY",
                                    width: "15%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "SYS_RDATE")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.SYS_RDATE.substr(0,10)}</>
                                        )
                                    }
                                },
                                {
                                    title: "조회수",
                                    dataIndex: "READ_COUNT",
                                    key: "ARTICLE_KEY",
                                    width: "5%",
                                    sorter: {
                                        compare: (a, b, sortOrder) => (customSorter(a, b, sortOrder, "READ_COUNT")),
                                    },
                                    showSorterTooltip: false,
                                    sortDirections: ['ascend', 'descend', 'ascend'],
                                    defaultSortOrder: 'ascend',
                                    render:(data,row,index)=>{
                                        return(
                                            <>{row.READ_COUNT}</>
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
                                    key: "ARTICLE_KEY",
                                    flag: "등록",
                                    width: "10%",
                                    render: (data, row, index) =>
                                        <Row key={row.ARTICLE_KEY}>
                                            <Col xs={12}>
                                                <Button
                                                    size="small"
                                                    className="button_mod"
                                                    onClick={() => {                                                        
                                                        fetch("/API/search?TYPE=42112&ARTICLE_KEY="+row.ARTICLE_KEY, {
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
                                                                    TABLE:"T_RESI_ARTICLE",
                                                                    KEY:["ARTICLE_KEY"],
                                                                    NUMERIC_KEY:["ARTICLE_KEY"],
                                                                    ARTICLE_KEY:row.ARTICLE_KEY,
                                                                }] }),
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                credentials: 'include',
                                                            }).then(function (response) {
                                                                if (response.status === 200) {
                                                                    message.success("게시물: "+(row.TITLE)+"을 삭제하였습니다.")
                                                                    resolve(1)                                                           
                                                                } else if (response.status === 401) {
                                                                    message.error("권한이 없습니다.")
                                                                    resolve(0)
                                                                }
                                                            })
                                                        })

                                                        Promise.all([promise_delete]).then(values=>{
                                                            fetch('/API/search?TYPE=42111', {
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
            {isvisible_search_modal?<SearchModal></SearchModal>:<></>} 
            {isvisible_register_modal?<RegisterModal></RegisterModal>:<></>}            
            {isvisible_modify_modal?<ModifyModal></ModifyModal>:<></>}
            
        </div>
    )
}

export default VdArticle;

export const SearchModal = () => {
    const dispatch = useDispatch();
    const {
        isvisible_search_modal,
        datasource_sch_modal,
        datasource_sch_modal_div_req,
    } = useSelector(state => state.DocVdArticle); //수정
    // const xs_title = 7
    // const xs_input = 16

    useEffect(() => {
        
    }, [dispatch])

    if (!isvisible_search_modal) {
        return <></>
    }
    else {        
        
        return (
            <div>
                <Modal
                    visible={isvisible_search_modal}
                    onCancel={() => {
                        dispatch(setIsvisibleSchModal(false))
                    }}
                    footer={<></>}
                    width="50vw"
                    title={<div>동물용의약품 게시물 조회</div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 게시물 조회"
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
                        <Row>
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
                                            if(text==='V') {
                                                return{
                                                    children:<span>동물용의약품정보</span>
                                                }
                                            }
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
                                        title_1 : "제목",
                                        data_1 : datasource_sch_modal.TITLE,                                        
                                        wide:1
                                    },
                                    {
                                        title_1 : "구분",
                                        data_1 : datasource_sch_modal.GBN_BRD, 
                                        title_2 : "조회수",
                                        data_2 : datasource_sch_modal.READ_COUNT,        
                                        wide:0
                                    },
                                    {
                                        title_1 : "등록일",
                                        data_1 : <>{datasource_sch_modal.SYS_RDATE.substr(0,10)}</>,
                                        title_2 : "수정일",
                                        data_2 : datasource_sch_modal.SYS_UDATE,
                                        wide:0
                                    },
                                    {
                                        title_1 : "글쓴이",
                                        data_1 : <span>{datasource_sch_modal.WRITER} ({datasource_sch_modal.REGISTER_IP})</span>,                                        
                                        wide:1
                                    },
                                    {
                                        title_1 : "동영상파일 링크",
                                        data_1 : datasource_sch_modal.FILE_LINK,                                        
                                        wide:1
                                    },
                                    {
                                        title_1 : "내용",
                                        data_1 : datasource_sch_modal.CONTENT,                                        
                                        wide:1
                                    },         
                                ]}
                            />
                        </Row>
                    </Card>
                </Modal>
            </div>
        );
    }
};

export const RegisterModal = () => {
    const dispatch = useDispatch();
    const { 
        isvisible_register_modal, 
        datasource_reg_modal, 
     } = useSelector(state => state.DocVdArticle); //수정
    // const xs_title = 7
    // const xs_input = 16

    const [editorState, setEditorState] = useState(() =>    
        EditorState.createEmpty()
    );

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
                                    fetch('/API/search?TYPE=42113', {
                                        method: 'GET',
                                        credentials: 'include',
                                    }).then(res => {
                                        return res.json()
                                    }).then(data => {
                                        var promise_using = new Promise((resolve, reject) => {                                            
                                            datasource_reg_modal.ARTICLE_KEY = parseInt(data[0].NUM, 10) + 1
                                            datasource_reg_modal.TABLE = "T_RESI_ARTICLE"
                                            delete datasource_reg_modal.NO
                                            datasource_reg_modal.REMOVE_FLAG = "N"
                                            datasource_reg_modal.SYS_RDATE = moment(new Date()).format("YYYY-MM-DD")
                                            datasource_reg_modal.NUMERIC_KEY = ["ARTICLE_KEY", "READ_COUNT"]

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
                                                    message.success("게시물: "+(datasource_reg_modal.TITLE)+"을 등록하였습니다.")
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
                                            fetch('/API/search?TYPE=42111', {
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
                                    // disabled={
                                    //     (
                                    //         (
                                    //             (datasource_reg_modal.PESTICIDE_NAME === undefined ||
                                    //             datasource_reg_modal.PESTICIDE_NAME === "" ||
                                    //             datasource_reg_modal.PESTICIDE_NAME === null) 
                                    //             ||
                                    //             (datasource_reg_modal.FOOD_NAME === "" ||
                                    //             datasource_reg_modal.FOOD_NAME === undefined ||
                                    //             datasource_reg_modal.FOOD_NAME === null))
                                    //         )
                                    // }
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
                    width="50vw"
                    title={<div>동물용의약품 게시물 등록</div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 게시물 등록"
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
                        <Row>
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
                                        className:"table-title",
                                        render:(text,row,index)=>{
                                            if(row.wide===0||row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                }
                                            }
                                        }
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
                                            }else if(row.wide===0){
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
                                            }else if(row.wide===0){
                                                return <>{text}</>
                                            }
                                        }                                
                                    },
                                ]}
                                dataSource={[             
                                    {
                                        title_1 : "구분",
                                        data_1 : <Select
                                        size="small"
                                        style={{ width: "100%" }}
                                        placeholder="구분 선택"
                                        value={datasource_reg_modal.GBN_BRD}
                                        onChange={(e) => {
                                            dispatch(setDatasourceRegModal(
                                                { ...datasource_reg_modal, GBN_BRD: e }
                                            ))
                                            console.log(datasource_reg_modal.GBN_BRD)
                                        }}
                                    >
                                        <Option value={"V"}>동물용의약품정보</Option>
                                        {/* {datasource_class_L.map(data=>{
                                        return(
                                            <Option value={data.GBN_BRD}>{data.CLASS_L_NAME_KR}</Option>
                                        )
                                    })}                                                    */}
                                    </Select>,                                       
                                        title_2:"작성자",
                                        data_2 : <Input size="small"
                                        value={datasource_reg_modal.WRITER}
                                        onChange={(e) => {
                                            dispatch(setDatasourceRegModal(
                                                { ...datasource_reg_modal, WRITER: e.target.value }
                                            ))
                                        }}
                                    />,
                                        wide:0
                                    },
                                    {
                                        title_1 : "제목",
                                        data_1 : <Input size="small"
                                        value={datasource_reg_modal.TITLE}
                                        onChange={(e) => {
                                            dispatch(setDatasourceRegModal(
                                                { ...datasource_reg_modal, TITLE: e.target.value }
                                            ))
                                        }}/>,
                                        wide:1
                                    }, 
                                    {
                                        title_1 : "동영상파일링크",
                                        data_1 : <Input size="small"
                                        value={datasource_reg_modal.FILE_LINK}
                                        onChange={(e) => {
                                            dispatch(setDatasourceRegModal(
                                                { ...datasource_reg_modal, FILE_LINK: e.target.value }
                                            ))
                                        }}/>,
                                        wide:1
                                    }, 
                                ]}
                            />
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
                                        render:(text,row,index)=>{
                                                return {
                                                    children:<>{text}</>,
                                                }
                                        }
                                    },
                                ]}
                                dataSource={[             
                                    {
                                        title_1 : <Editor
                                        placeholder="내용을 입력하세요"
                                        style={{border:"1px solid black !important"}}
                                        editorState={editorState}
                                        onEditorStateChange={setEditorState} />
                                    },   
                                ]}
                            />
                        </Row>
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
    } = useSelector(state => state.DocVdArticle); //수정
    // const xs_title = 7
    // const xs_input = 16

    const [editorState, setEditorState] = useState(() =>    
        EditorState.createEmpty()
    );

    // useEffect 제외
    // useEffect(() => {
    //     fetch('/API/search?TYPE=16111', {
    //         method: 'GET',
    //         credentials: 'include',
    //     }).then(function (response) {
    //         return response.json();
    //     }).then(myJson => {
    //         dispatch(setDataSource(myJson))
    //     });
    // }, [dispatch,editorState])

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
                                        datasource_mod_modal.TABLE="T_RESI_ARTICLE"
                                        datasource_mod_modal.KEY=["ARTICLE_KEY"]
                                        datasource_mod_modal.NUMERIC_KEY=["ARTICLE_KEY", "READ_COUNT"]
                                        datasource_mod_modal.SYS_UDATE = moment(new Date()).format("YYYY-MM-DD")

                                        fetch('/API/update', {
                                            method: 'POST',
                                            body: JSON.stringify({ data: [datasource_mod_modal] }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            credentials: 'include',
                                        }).then(function (response) {
                                            if (response.status === 200) {
                                                message.success("게시물 : "+(datasource_mod_modal.TITLE)+"을 수정하였습니다.")
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
                                        fetch('/API/search?TYPE=41111', {
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
                                //     disabled={
                                //         ((
                                //             datasource_mod_modal.PESTICIDE_NAME === "" ||
                                //             datasource_mod_modal.PESTICIDE_NAME === null) &&
                                //             (datasource_mod_modal.FOOD_NAME === "" ||
                                //             datasource_mod_modal.FOOD_NAME === null))
                                //     }
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
                    width="50vw"
                    title={<div>동물용의약품 게시물 관리 - {
                        datasource_mod_modal.TITLE
                    } </div>}
                >
                    <Card
                        size="small"
                        bordered={false}
                        style={{ textAlign: "left" }}
                        title="▣ 게시물 수정" //수정
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
                        <Row>
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
                                        className:"table-title",
                                        render:(text,row,index)=>{
                                            if(row.wide===0||row.wide===1){
                                                return {
                                                    children:<>{text}</>,
                                                }
                                            }
                                        }
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
                                            }else if(row.wide===0){
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
                                            }else if(row.wide===0){
                                                return <>{text}</>
                                            }
                                        }                                
                                    },
                                ]}
                                dataSource={[             
                                    {
                                        title_1 : "구분",
                                        data_1 : <Select
                                        size="small"
                                        style={{ width: "100%" }}
                                        placeholder="구분 선택"
                                        value={datasource_mod_modal.GBN_BRD}
                                        onChange={(e)=>{
                                            dispatch(setDatasourceModModal(
                                                { ...datasource_mod_modal, GBN_BRD: e }
                                            ))
                                        }}
                                        // onChange={(e)=>{
                                        //     dispatch(setDatasourceModModal(
                                        //         { ...datasource_mod_modal, GBN_BRD: e,CLASS_M_CODE: "",CLASS_S_CODE: "" }
                                        //     ))
                                        //     fetch('/API/search?TYPE=12216&GBN_BRD='+e, {
                                        //         method: 'GET',
                                        //         credentials: 'include',
                                        //     }).then(function (response) {
                                        //         return response.json();
                                        //     }).then(myJson => {
                                        //         dispatch(setDatasourceClassM(myJson))
                                        //     });
                                        // }}
                                    >
                                        <Option value={"V"}>동물용의약품정보</Option>
                                        {/* {datasource_class_L.map(data=>{
                                        return(
                                            <Option value={data.GBN_BRD}>{data.CLASS_L_NAME_KR}</Option>
                                        )
                                    })}                                                    */}
                                    </Select>,                                       
                                        title_2:"작성자",
                                        data_2 : <Input size="small"
                                        value={datasource_mod_modal.WRITER}
                                        onChange={(e) => {
                                            dispatch(setDatasourceModModal(
                                                { ...datasource_mod_modal, WRITER: e.target.value }
                                            ))
                                        }}
                                    />,
                                        wide:0
                                    },
                                    {
                                        title_1 : "제목",
                                        data_1 : <Input size="small"
                                        value={datasource_mod_modal.TITLE}
                                        onChange={(e) => {
                                            dispatch(setDatasourceModModal(
                                                { ...datasource_mod_modal, TITLE: e.target.value }
                                            ))
                                        }}/>,
                                        wide:1
                                    }, 
                                    {
                                        title_1 : "동영상파일링크",
                                        data_1 : <Input size="small"
                                        value={datasource_mod_modal.FILE_LINK}
                                        onChange={(e) => {
                                            dispatch(setDatasourceModModal(
                                                { ...datasource_mod_modal, FILE_LINK: e.target.value }
                                            ))
                                        }}/>,
                                        wide:1
                                    }, 
                                ]}
                            />
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
                                        render:(text,row,index)=>{
                                                return {
                                                    children:<>{text}</>,
                                                }
                                        }
                                    },
                                ]}
                                dataSource={[             
                                    {
                                        title_1 : <Editor
                                        placeholder="내용을 입력하세요"
                                        style={{border:"1px solid black !important"}}
                                        editorState={editorState}
                                        onEditorStateChange={setEditorState} />
                                    },   
                                ]}
                            />
                        </Row>
                    </Card>                    
                </Modal>
            </div>
        );
    }
};