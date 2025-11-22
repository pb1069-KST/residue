import { Upload, Modal, Button, Checkbox, Tooltip, Input, message, Table, Row, Col, Divider, Popconfirm, Switch } from "antd";
import React, { Component, useState } from "react";
import axios from "axios"
import "antd/dist/antd.css";
import reqwest from 'reqwest';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";

import Form from "antd/es/form";
import Typography from "antd/es/typography";
import { SYSTEM_CHECK } from "../reducers/header/header";

// import Fileup_Modal from "./EditableTable"
// import EditableTable from "./fileUp_input"

const { Title } = Typography;

const props = {
  name: "files",
  fileList: []
};

const uploadFile = (values) => {
  const data = new FormData();
  console.log(values.imageFile.file.originFileObj)
  console.log(data)
}

class FileUP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: [],
      uploading: false,
      flag: 0,

      csv: [],
      visible: false,

      fail_filter_flag: false,
      diff_filter_flag: false,
    };
  }

  componentDidMount() {
    fetch('/API/file_upload_get_progress', {
      method: 'GET',
      credentials: 'include',
    }).then(res => {
      return res.json()
    }).then(myJson => {
      console.log(myJson)
      this.setState({ progress: myJson, flag: 1 })
      this.forceUpdate();
    });
  }

  render() {
    const props = {
      fileList: null,
      name: 'file',
      action: '/API/file_upload',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          setTimeout(function () {
            window.location.reload();
          }, 3000)
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    if (this.state.flag === 0) return <></>
    else return (
      <>
        <Row>
          <Col xs={3}></Col>
          <Col xs={18}>            
            <Divider plain orientation="left">
              파일 업로드
            </Divider>
            <Row>
              <Col xs={24} style={{ textAlign: "left" }}>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Col>
            </Row>
            <Row>
              <Col xs={24} style={{ textAlign: "left" }}>
                <Divider plain orientation="left">
                  진행 상태
                </Divider>
                <Table
                  size="small"
                  dataSource={this.state.progress}
                  pagination={false}
                  border
                  columns={
                    [
                      {
                        title: "업로드 파일",
                        key: "HWP",
                        dataIndex: "HWP",
                        render: (data) => <a href={"https://residue.korea.ac.kr:3001/API/file_download?NAME=" + data}>{data}</a>
                      },
                      {
                        title: "변환 완료 파일",
                        key: "CSV",
                        dataIndex: "CSV",
                        render: (data) => <a href={"https://residue.korea.ac.kr:3001/API/file_download?NAME=" + data}>{data}</a>
                      },
                      {
                        title: "상태",
                        key: "",
                        dataIndex: "",
                        render: (data, row) =>
                          <>
                            {row.CSV !== null ?
                              <a onClick={() => {
                                fetch('/API/file_load?NAME=' + row.CSV, {
                                  method: 'GET',
                                  credentials: 'include',
                                }).then(res => {
                                  return res.json()
                                }).then(myJson => {
                                  console.log(myJson)
                                  myJson.sort((a, b) => a.index - b.index);
                                  this.setState({ csv: myJson, visible: true })
                                });

                              }} style={{ color: "green" }}>완료</a>
                              : <span style={{ color: "red" }}>진행중</span>}
                          </>
                      },
                      {
                        title: "비고",
                        key: "NOT",
                        dataIndex: "NOT",
                      },
                    ]
                  }
                ></Table>
              </Col>
            </Row>
            <Row>
              <Col xs={24} style={{ textAlign: "left" }}>

                <Divider plain orientation="left">
                  테이블 수정
                </Divider>
                <Row>
                  <Col xs={12} style={{ textAlign: "left" }}>
                    <Checkbox
                      onChange={(e) => {
                        this.setState({
                          fail_filter_flag: this.state.fail_filter_flag === true ? false : true
                        })
                      }}
                      value={this.state.fail_filter_flag}
                    ></Checkbox> 실패 항목
                    <Checkbox
                      onChange={(e) => {
                        this.setState({
                          diff_filter_flag: this.state.diff_filter_flag === true ? false : true
                        })
                      }}
                      value={this.state.diff_filter_flag}
                    ></Checkbox> 변동 항목
                  </Col>
                  <Col xs={12} style={{ textAlign: "right" }}>
                    <Button
                      size="small"
                      type="primary"

                      onClick={() => {
                        this.state.csv.map(data => {
                          data.PESTICIDE_NAME_KR = data._PESTICIDE_NAME_KR
                          data.FOOD_NAME_KR = data._FOOD_NAME_KR
                          data.MRL_VALUE = data._MRL_VALUE
                        })

                        fetch('/API/file_validation?', {
                          body: JSON.stringify({ data: this.state.csv }),
                          method: 'POST',
                          credentials: 'include',
                          headers: {
                            'Content-Type': 'application/json',
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                          },
                        }).then(res => {
                          return res.json()
                        }).then(myJson => {
                          myJson.sort((a, b) => a.index - b.index);

                          this.setState({ csv: myJson, visible: true })
                        });
                      }}
                    >검증</Button>

                    <Popconfirm
                      title="정말로 업데이트하시겠습니까?"
                      disabled={
                        this.state.csv.filter((data) => data.FOOD_ERR === 1).length > 0 ||
                          this.state.csv.filter((data) => data.PESTICIDE_ERR === 1).length > 0
                          ?
                          true : false
                      }
                      onConfirm={() => {
                        var arr = []
                        this.state.csv.map((data) => {
                          arr.push({
                            TABLE: "T_RESI_PESTICIDE_MRL",
                            KEY: ["PESTICIDE_CODE", "FOOD_CODE"],
                            NUMERIC_KEY: [],
                            PESTICIDE_CODE: data.PESTICIDE_CODE,
                            FOOD_CODE: data.FOOD_CODE
                          })
                        })

                        var arr2 = []
                        this.state.csv.map((data) => {
                          arr2.push({
                            TABLE: "T_RESI_PESTICIDE_MRL",
                            KEY: ["PESTICIDE_CODE", "FOOD_CODE"],
                            NUMERIC_KEY: [],
                            PESTICIDE_CODE: data.PESTICIDE_CODE,
                            FOOD_CODE: data.FOOD_CODE,
                            MRL_VALUE: data._MRL_VALUE,
                          })
                        })

                        fetch('/API/delete?', {
                          body: JSON.stringify({ data: arr }),
                          method: 'POST',
                          credentials: 'include',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          mode: 'cors'
                        }).then(res => {
                          fetch('/API/insert?', {
                            body: JSON.stringify({ data: arr2 }),
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            mode: 'cors'
                          }).then(res => {
                            message.success("성공적으로 입력되었습니다.")
                          });
                        });
                      }}
                      onCancel={null}
                      okText="업데이트"
                      cancelText="취소"
                    >
                      <Button
                        size="small"
                        type="primary"
                        style={{ background: "green" }}
                        disabled={
                          this.state.csv.filter((data) => data.FOOD_ERR === 1).length > 0 ||
                            this.state.csv.filter((data) => data.PESTICIDE_ERR === 1).length > 0
                            ?
                            true : false
                        }
                        onClick={() => {

                        }}
                      >등록</Button>

                    </Popconfirm>
                    <Button
                      type="ghost"
                      size="small"
                      onClick={() => {
                        this.setState({
                          csv: []
                        })
                      }}
                    >초기화</Button>

                    <Button
                      type="ghost"
                      size="small"
                      onClick={() => {
                        console.log(this.state.csv)                        
                      }}
                    >
                      <CSVLink 
                        data={
                          this.state.csv
                        } 
                        target="_blank"
                        headers={
                          [
                            {label:"_PESTICIDE_NAME_KR",key:"_PESTICIDE_NAME_KR"},
                            {label:"_FOOD_NAME_KR",key:"_FOOD_NAME_KR"},
                            {label:"_MRL_VALUE",key:"_MRL_VALUE"},
                          ]
                        }>
                        엑셀 다운로드
                      </CSVLink>
                    </Button>

                  </Col>
                </Row>
                <Divider dashed style={{marginBottom:"12px",marginTop:"12px"}}></Divider>
                <Table
                  size="small"
                  bordered
                  // pagination={false}
                  dataSource={
                    this.state.fail_filter_flag === false ?

                      (
                        this.state.diff_filter_flag === false ?
                          this.state.csv
                          :
                          this.state.csv.filter((data) => data.MRL_VALUE !== data._MRL_VALUE)
                      )
                      :
                      (
                        this.state.diff_filter_flag === false ?
                          this.state.csv.filter((data) => data.FOOD_ERR === 1 || data.PESTICIDE_ERR === 1)
                          :
                          this.state.csv.filter((data) => data.FOOD_ERR === 1 || data.PESTICIDE_ERR === 1).filter((data) => data.MRL_VALUE !== data._MRL_VALUE)
                      )
                  }
                  columns={[
                    {
                      title: <div >
                        <span>농약 국문명 </span>
                        {this.state.csv.filter((data) =>
                          data.PESTICIDE_ERR === 1
                        ).length > 0 ?
                          <Tooltip
                            overlayStyle={{ fontSize: "12px", width: "500px", alignItems: "center" }}
                            title={this.state.csv.map((data, index) => {
                              if (data.PESTICIDE_ERR === 1) {
                                return (
                                  <div><span>[{index + 1} 행] "<b>{data._PESTICIDE_NAME_KR}</b>"을 데이터베이스에서 조회할 수 없습니다.</span></div>
                                )
                              }
                            })}
                          >
                            <span style={{ color: "red" }}>
                              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ExclamationCircleOutlined /> 오류 {this.state.csv.filter((data) =>
                                  data.PESTICIDE_ERR === 1
                                ).length}건</div></span>
                          </Tooltip>
                          : <span></span>}
                      </div>,
                      dataIndex: "_PESTICIDE_NAME_KR",
                      key: "_PESTICIDE_NAME_KR",
                      render: (data, row) =>
                        <>
                          <Row>
                            <Col xs={10}>
                              <span style={{ color: "black" }}>{this.state.csv[row.index].PESTICIDE_NAME_KR}</span>
                            </Col>
                            <Col xs={4}>→</Col>
                            <Col xs={10}>
                              <Input
                                size="small"
                                style={this.state.csv[row.index].PESTICIDE_ERR === 0 ? { color: "black" } : { color: "red", fontWeight: 700 }}
                                value={this.state.csv[row.index]._PESTICIDE_NAME_KR}
                                onChange={(e) => {
                                  const newArr = this.state.csv.slice()
                                  newArr[row.index]._PESTICIDE_NAME_KR = e.target.value
                                  this.setState({
                                    csv: newArr
                                  })
                                }}
                              ></Input>
                            </Col>
                          </Row>
                        </>
                    },
                    {
                      title: <div >
                        <span>식품 국문명 </span>
                        {this.state.csv.filter((data) =>
                          data.FOOD_ERR === 1
                        ).length > 0 ?
                          <Tooltip
                            overlayStyle={{ fontSize: "12px", width: "500px" }}
                            title={this.state.csv.map((data, index) => {
                              if (data.FOOD_ERR === 1) {
                                return (
                                  <div><span>[{index + 1} 행] "<b>{data._FOOD_NAME_KR}</b>"을 데이터베이스에서 조회할 수 없습니다.</span></div>
                                )
                              }
                            })}
                          >
                            <span style={{ color: "red" }}>
                              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>

                                <ExclamationCircleOutlined /> 오류 {this.state.csv.filter((data) =>
                                  data.FOOD_ERR === 1
                                ).length}건</div></span>
                          </Tooltip>
                          : <span></span>}
                      </div>,
                      dataIndex: "_FOOD_NAME_KR",
                      key: "_FOOD_NAME_KR",
                      render: (data, row) =>
                        <>
                          <Row>
                            <Col xs={10}>
                              <span style={{ color: "black" }}>{this.state.csv[row.index].FOOD_NAME_KR}</span>
                            </Col>
                            <Col xs={4}>→</Col>
                            <Col xs={10}>
                              <Input
                                size="small"
                                style={this.state.csv[row.index].FOOD_ERR === 0 ? { color: "black" } : { color: "red", fontWeight: 700 }}
                                value={this.state.csv[row.index]._FOOD_NAME_KR}
                                onChange={(e) => {
                                  const newArr = this.state.csv.slice()
                                  newArr[row.index]._FOOD_NAME_KR = e.target.value
                                  this.setState({
                                    csv: newArr
                                  })
                                }}
                              ></Input>
                            </Col>
                          </Row>
                        </>
                    },
                    {
                      title: "MRL",
                      dataIndex: "MRL_VALUE",
                      key: "MRL_VALUE",
                      render: (data, row) =>
                        <>
                          <Row>
                            <Col xs={10}><span>{this.state.csv[row.index].MRL_VALUE}</span></Col>
                            <Col xs={4}>→</Col>
                            <Col xs={10}>
                              <Input
                                size="small"
                                value={this.state.csv[row.index]._MRL_VALUE}
                                style={this.state.csv[row.index]._MRL_VALUE === this.state.csv[row.index].MRL_VALUE ? { color: "black" } : { color: "blue", fontWeight: "bold" }}
                                onChange={(e) => {
                                  const newArr = this.state.csv.slice()
                                  newArr[row.index]._MRL_VALUE = e.target.value
                                  this.setState({
                                    csv: newArr
                                  })
                                }}
                              ></Input>
                            </Col>
                          </Row>
                        </>
                    },
                  ]}
                >
                </Table>
              </Col>
            </Row>
          </Col>
          <Col xs={3}></Col>
        </Row>
      </>
    );
  }
}

export default FileUP;
