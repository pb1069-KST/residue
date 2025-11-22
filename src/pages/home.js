import React, { useState, useEffect, useRef } from "react";
import Hangul from "hangul-js";
import { useInterval } from "usehooks-ts";
import "../App.css";
import "antd/dist/antd.css";
import _ from "lodash";
import { Line, Scatter } from "@ant-design/charts";
import { useSelector, useDispatch } from "react-redux";

import Statistic from "antd/es/statistic";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Divider from "antd/es/divider";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Space from "antd/es/space";
import Tag from "antd/es/tag";
import Button from "antd/es/button";
import Image from "antd/es/image";
import Tabs from "antd/es/tabs";
import Table from "antd/es/table";
import AutoComplete from "antd/es/auto-complete";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
import Tooltip from "antd/es/tooltip";
import Carousel from "antd/es/carousel";
import Popover from "antd/es/popover";

import { RegisterDrawerJuso } from "./2_std/0_standard/application";

import SearchBackground from "../img/background.png";

import LogoPrdInfo from "../img/prd_info.png";
import LogoPrdMrl from "../img/prd_mrl.png";
import LogoPrdStd from "../img/prd_std.png";
import LogoPrdAnalysis from "../img/prd_analysis.png";

import LogoVdInfo from "../img/vd_info.png";
import LogoVdMrl from "../img/vd_mrl.png";
import LogoVdStd from "../img/vd_std.png";
import LogoVdAnalysis from "../img/vd_analysis.png";

import Logo_RFDA1 from "../img/logo_RFDA1.gif";
import Logo_RFDA2 from "../img/logo_RFDA2.gif";
import Logo_RFDA3 from "../img/logo_RFDA3.gif";
import Logo_RFDA4 from "../img/logo_RFDA4.gif";

import { SearchModal as SearchModalPrdInfo } from "../pages/0_prd/0_info/info/searchModal";
import { SearchModal as SearchModalPrdMrl } from "./0_prd/1_mrl/old/mrl";
import { SearchModalFood as SearchModalFoodPrdMrl } from "./0_prd/1_mrl/old/mrl";

// import { SearchModal as SearchModalVdInfo } from "../pages/1_vd/0_info/info"
import { SearchModal as SearchModalVdMrl } from "../pages/1_vd/1_mrl/mrl";
import { SearchModalFood as SearchModalFoodVdMrl } from "../pages/1_vd/1_mrl/mrl";

import {
  setIsvisibleSchModal as setIsvisibleSchModalPrdInfo,
  setDatasourceSchModal as setDatasourceSchModalPrdInfo,
  setDatasourceSchModalMrl as setDatasourceSchModalMrlPrdInfo,
} from "../../src/reducers/prd/PrdInfoInfo";

import {
  setSelectedData as setSelectedDataPrdMrl,
  setIsvisibleSchModal as setIsvisibleSchModalPrdMrl,
  setIsvisibleSchModalFood as setIsvisibleSchModalFoodPrdMrl,
  setDatasourceModModal as setDatasourceModModalPrdMrl,
} from "../../src/reducers/prd/prdMrlMrl_modal";

import {
  setSelectedData as setSelectedDataVdMrl,
  setIsvisibleSchModal as setIsvisibleSchModalVdMrl,
  setIsvisibleSchModalFood as setIsvisibleSchModalFoodVdMrl,
  setDatasourceModModal as setDatasourceModModalVdMrl,
} from "../reducers/vd/VdMrlMrl_modal";

import { QuestionCircleOutlined } from "@ant-design/icons";

import { SearchOutlined, ExperimentOutlined } from "@ant-design/icons";

const { Search } = Input;

function Home() {
  const dispatch = useDispatch();

  const reducer_prdMrlMrl_modal = useSelector((state) => state.prdMrlMrl_modal);
  const reducer_vdMrlMrl_modal = useSelector((state) => state.VdMrlMrl_modal);
  const reducer_PrdInfoInfo = useSelector((state) => state.PrdInfoInfo);

  const { customSorter } = useSelector((state) => state.util);

  const [visitorDay, setVisitorDay] = useState(0);
  const [visitorTotal, setVisitorTotal] = useState(0);

  const [user_count, setuser_count] = useState([{ COUNT: 0 }]);
  const [search_count, setsearch_count] = useState([{ COUNT: 0 }]);
  const [insert_count, setinsert_count] = useState([{ COUNT: 0 }]);
  const [update_count, setupdate_count] = useState([{ COUNT: 0 }]);
  const [delete_count, setdelete_count] = useState([{ COUNT: 0 }]);

  const [buttonPrdInfoBorder, setButtonPrdInfoBorder] = useState(false);
  const [buttonPrdMrlBorder, setButtonPrdMrlBorder] = useState(false);
  const [buttonPrdStdBorder, setButtonPrdStdBorder] = useState(false);
  const [buttonPrdAnalysisBorder, setButtonPrdAnalysisBorder] = useState(false);

  const [buttonVdInfoBorder, setButtonVdInfoBorder] = useState(false);
  const [buttonVdMrlBorder, setButtonVdMrlBorder] = useState(false);
  const [buttonVdStdBorder, setButtonVdStdBorder] = useState(false);
  const [buttonVdAnalysisBorder, setButtonVdAnalysisBorder] = useState(false);

  const [recentKeyword, setRecentKeyword] = useState([]);
  const [popularKeyword, setPopularKeyword] = useState([]);

  const [recentOpen, setRecentOpen] = useState(false);
  const [popularOpen, setPopularOpen] = useState(false);

  const [timeIntervalRecent, setTimeIntervalRecent] = useState(1);
  const [timeIntervalPopular, setTimeIntervalPopular] = useState(1);

  const [dataTab, setDataTab] = useState("1");

  const [dataPrd, setDataPrd] = useState([]);
  const [dataVd, setDataVd] = useState([]);

  const [options, setOptions] = useState([]);

  const [searchDatasource, setSearchDatasource] = useState([]);

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    asyncFetch();
  }, []);

  useInterval(() => {
    const temp_popular = _.cloneDeep(timeIntervalPopular);
    setTimeIntervalPopular((temp_popular % 5) + 1);
  }, Math.round(getRandomArbitrary(40, 60)) * 100);

  useInterval(() => {
    const temp_recent = _.cloneDeep(timeIntervalRecent);
    setTimeIntervalRecent((temp_recent % 5) + 1);
  }, Math.round(getRandomArbitrary(40, 60)) * 100);

  const config = {
    data: search_count,
    height: 150,
    xField: "TIME",
    yField: "COUNT",
    point: {
      size: 3,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#2593fc",
        lineWidth: 2,
      },
    },
  };

  const asyncFetch = () => {
    fetch("/API/search?TYPE=71111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setVisitorTotal(parseInt(myJson[0].CNT, 10));
      });

    fetch("/API/search?TYPE=71112", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setVisitorDay(parseInt(myJson[0].CNT, 10));
      });

    fetch("/API/search?TYPE=95111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        myJson.forEach((data) => {
          data.VALUE = parseInt(data.VALUE, 10);
        });
        setRecentKeyword(myJson);
      });

    fetch("/API/search?TYPE=95112", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        myJson.forEach((data) => {
          data.VALUE = parseInt(data.VALUE, 10);
        });
        setPopularKeyword(myJson);
      });

    fetch("/API/search?TYPE=96111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        setDataPrd(myJson);
      });
    fetch("/API/search?TYPE=96112", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        // console.log(myJson)
        setDataVd(myJson);
      });

    fetch("/API/search?TYPE=97111", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        myJson.forEach((data, index) => {
          // console.log(data)
          switch (data.TYPE) {
            case "PRD":
              data.label = (
                <Row style={{ width: "100%" }} key={index}>
                  <Col xs={12} style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      농약 -{" "}
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      {data.NAME_KR
                        ? data.NAME_EN
                          ? data.NAME_KR + "(" + data.NAME_EN + ")"
                          : data.NAME_KR
                        : data.NAME_EN
                        ? data.NAME_EN
                        : ""}
                    </span>
                  </Col>
                  <Col xs={12} style={{ textAlign: "right" }}>
                    <Button
                      type="link"
                      onClick={() => {
                        const promise_datasource_search_modal = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=11112&PESTICIDE_CODE=" +
                                data.CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                console.log(myJson[0]);
                                dispatch(
                                  setDatasourceSchModalPrdInfo(myJson[0])
                                );
                                resolve(1);
                              });
                          }
                        );
                        const promise_datasource_search_modal_mrl = new Promise(
                          (resolve, reject) => {
                            fetch(
                              "/API/search?TYPE=11113&PESTICIDE_CODE=" +
                                data.CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(
                                  setDatasourceSchModalMrlPrdInfo(myJson)
                                );
                                resolve(1);
                              });
                          }
                        );
                        Promise.all([
                          promise_datasource_search_modal,
                          promise_datasource_search_modal_mrl,
                        ]).then((result) => {
                          // dispatch(setSelectedDataPrdMrl(data.NAME_KR||data.NAME_EN))
                          dispatch(setIsvisibleSchModalPrdInfo(true));
                        });
                      }}
                    >
                      <Tag color="blue">정보</Tag>
                    </Button>

                    <Button
                      type="link"
                      onClick={() => {
                        fetch(
                          "/API/search?TYPE=12112&PESTICIDE_CODE=" + data.CODE,
                          {
                            method: "GET",
                            credentials: "include",
                          }
                        )
                          .then(function (response) {
                            console.log(response);
                            return response.json();
                          })
                          .then((myJson) => {
                            dispatch(setDatasourceModModalPrdMrl(myJson));
                            dispatch(setIsvisibleSchModalPrdMrl(true));
                          });
                      }}
                    >
                      <Tag color="green">잔류허용기준</Tag>
                    </Button>
                    {/* <Button
                      type="link"
                      onClick={() => {
                        console.log("분석정보");
                      }}
                    >
                      <Tag color="yellow">분석정보</Tag>
                    </Button> */}
                  </Col>
                </Row>
              );
              // data.value = data.NAME_KR
              break;
            case "VD":
              data.label = (
                <Row style={{ width: "100%" }} key={index}>
                  <Col xs={12} style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      동물용의약품 -{" "}
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      {data.NAME_KR
                        ? data.NAME_EN
                          ? data.NAME_KR + "(" + data.NAME_EN + ")"
                          : data.NAME_KR
                        : data.NAME_EN
                        ? data.NAME_EN
                        : ""}
                    </span>
                  </Col>
                  <Col xs={12} style={{ textAlign: "right" }}>
                    <Button
                      type="link"
                      onClick={() => {
                        console.log("정보");
                      }}
                    >
                      <Tag color="blue">정보</Tag>
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        fetch(
                          "/API/search?TYPE=22112&VDRUG_CODE=" + data.CODE,
                          {
                            method: "GET",
                            credentials: "include",
                          }
                        )
                          .then(function (response) {
                            console.log(response);
                            return response.json();
                          })
                          .then((myJson) => {
                            dispatch(setDatasourceModModalVdMrl(myJson));
                            dispatch(setIsvisibleSchModalVdMrl(true));
                          });
                      }}
                    >
                      <Tag color="green">잔류허용기준</Tag>
                    </Button>
                  </Col>
                </Row>
              );
              // data.value = data.NAME_KR
              break;
            case "F_PRD":
              data.label = (
                <Row style={{ width: "100%" }} key={index}>
                  <Col xs={12} style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      식품 -{" "}
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      {data.NAME_KR
                        ? data.NAME_EN
                          ? data.NAME_KR + "(" + data.NAME_EN + ")"
                          : data.NAME_KR
                        : data.NAME_EN
                        ? data.NAME_EN
                        : ""}
                    </span>
                  </Col>
                  <Col xs={12} style={{ textAlign: "right" }}>
                    <Button
                      type="link"
                      onClick={() => {
                        fetch("/API/search?TYPE=12122&FOOD_CODE=" + data.CODE, {
                          method: "GET",
                          credentials: "include",
                        })
                          .then(function (response) {
                            console.log(response);
                            return response.json();
                          })
                          .then((myJson) => {
                            // dispatch(setSelectedData(row))
                            dispatch(setDatasourceModModalPrdMrl(myJson));
                            dispatch(setIsvisibleSchModalFoodPrdMrl(true));
                          });
                      }}
                    >
                      <Tag color="green">잔류허용기준</Tag>
                    </Button>
                  </Col>
                </Row>
              );
              // data.value = data.NAME_KR
              break;
            case "F_VD":
              data.label = (
                <Row style={{ width: "100%" }} key={index}>
                  <Col xs={12} style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      식품(동물용의약품) -{" "}
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      {data.NAME_KR
                        ? data.NAME_EN
                          ? data.NAME_KR + "(" + data.NAME_EN + ")"
                          : data.NAME_KR
                        : data.NAME_EN
                        ? data.NAME_EN
                        : ""}
                    </span>
                  </Col>
                  <Col xs={12} style={{ textAlign: "right" }}>
                    <Button
                      type="link"
                      onClick={() => {
                        fetch("/API/search?TYPE=22122&FOOD_CODE=" + data.CODE, {
                          method: "GET",
                          credentials: "include",
                        })
                          .then(function (response) {
                            console.log(response);
                            return response.json();
                          })
                          .then((myJson) => {
                            // dispatch(setSelectedData(row))
                            dispatch(setDatasourceModModalVdMrl(myJson));
                            dispatch(setIsvisibleSchModalFoodVdMrl(true));
                          });
                      }}
                    >
                      <Tag color="green">잔류허용기준</Tag>
                    </Button>
                  </Col>
                </Row>
              );
              // data.value = data.NAME_KR

              break;
          }
        });
        setSearchDatasource(myJson);
      });
  };
  const searchResult = (searchText) =>
    searchDatasource.filter((val) => {
      if (val.NAME_KR !== null) {
        var word_str = "";
        Hangul.disassemble(val.NAME_KR, true).forEach((word, index) => {
          word_str += word[0];
        });
        return (
          word_str.indexOf(searchText) !== -1 ||
          Hangul.disassemble(val.NAME_KR, true)[0][0].indexOf(searchText) >
            -1 ||
          val.NAME_KR.indexOf(searchText) >= 0 ||
          (val.NAME_EN !== "" && val.NAME_EN !== null
            ? val.NAME_EN.toLowerCase().indexOf(searchText.toLowerCase()) > -1
            : null)
        );
      } else {
        return val.NAME_EN.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
      }
    });

  return (
    <div
      className="App"
      style={{
        backgroundAttachment: "fixed",
        backgroundImage: `url(${SearchBackground})`,
        // backgroundImage:"",
        backgroundSize: "100% 52%",
        marginBottom: "100px !important",
        zIndex: 1,
        position: "relative",
      }}
    >
      {/* {isvisible_register_drawer_juso ? <RegisterDrawerJuso /> : <></>} */}
      <Row
        style={{
          background: "transparent",
          height: "250px",
          marginBottom: "100px !important",
          zIndex: -2,
          position: "relative",
        }}
      ></Row>

      {reducer_prdMrlMrl_modal.isvisible_search_modal ? (
        <SearchModalPrdMrl></SearchModalPrdMrl>
      ) : (
        <></>
      )}
      {reducer_prdMrlMrl_modal.isvisible_search_modal_food ? (
        <SearchModalFoodPrdMrl></SearchModalFoodPrdMrl>
      ) : (
        <></>
      )}
      {reducer_PrdInfoInfo.isvisible_search_modal ? (
        <SearchModalPrdInfo></SearchModalPrdInfo>
      ) : (
        <></>
      )}

      {reducer_vdMrlMrl_modal.isvisible_search_modal ? (
        <SearchModalVdMrl></SearchModalVdMrl>
      ) : (
        <></>
      )}
      {reducer_vdMrlMrl_modal.isvisible_search_modal_food ? (
        <SearchModalFoodVdMrl></SearchModalFoodVdMrl>
      ) : (
        <></>
      )}
      {/* {reducer_PrdInfoInfo.isvisible_search_modal ? <SearchModalPrdInfo></SearchModalPrdInfo> : <></>} */}

      <Row
        style={{
          top: "50px",
          background: "white",
          borderRadius: "12px !important",
        }}
        align="bottom"
      >
        <Col
          align="middle"
          xs={18}
          push={3}
          style={{
            background: "#ffffff",
            top: "-30px",
            height: "120px",
            boxShadow: "0px 1px 5px gray",
            borderRadius: "10px",
          }}
        >
          <Row justify="space-around" align="middle" style={{ height: "100%" }}>
            <Col xs={14} style={{ height: "100%" }}>
              <Row
                // justify="space-around"
                align="middle"
                style={{ height: "100%" }}
              >
                <Col xs={24}>　</Col>
                <Col xs={24}>
                  <AutoComplete
                    className="home_search"
                    size="large"
                    placeholder={
                      "농약명, 동물용의약품명, 식품명을 입력해주세요"
                    }
                    style={{
                      textAlign: "left",
                      // marginLeft: "30px",
                      // marginTop: "40px",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                    options={options}
                    onSearch={(value) => {
                      setOptions(value ? searchResult(value) : []);
                    }}
                  ></AutoComplete>
                </Col>
                <Col
                  class="home_search_guide"
                  xs={24}
                  style={{
                    marginTop: "0px",
                    paddingTop: "0px",
                    textAlign: "left",
                    paddingLeft: "30px",
                    color: "#8f8f8f",
                  }}
                >
                  <Tooltip
                    placement="bottomLeft"
                    className="custom_popover"
                    overlayInnerStyle={{
                      background: "rgb(102, 102, 102)",
                      width: "550px",
                      padding: "5px 5px 5px 5px",
                    }}
                    title={
                      <div>
                        {
                          "- 검색을 통해 농약, 동물용의약품, 식품의 정보를 조회할수 있습니다. "
                        }
                        <br />
                        {
                          "- 통합검색은 초성 검색을 지원합니다. ex)ㄱㅅㄱㅁㅇㅅ → 가스가마이신 "
                        }
                        <br />
                        {
                          "- 검색 후 오른쪽에 위치한 태그를 클릭하시면 해당 항목의 정보를 출력합니다."
                        }
                        <br />
                        <Tag color="green">정보</Tag>{" "}
                        {": 농약, 동물용의약품의 정보"}
                        <br />
                        <Tag color="blue">잔류허용기준</Tag>{" "}
                        {": 농약, 동물용의약품의 잔류허용기준"}
                      </div>
                    }
                    trigger="hover"
                  >
                    <QuestionCircleOutlined /> 검색 가이드
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={7}>
              <Row align="middle">
                <Col xs={6} style={{ textAlign: "left", top: "0px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                    최근검색어
                  </span>
                </Col>
                <Col xs={12} style={{ textAlign: "left", top: "0px" }}>
                  <Select
                    showArrow={false}
                    onMouseEnter={() => {
                      setRecentOpen(true);
                    }}
                    onMouseLeave={() => {
                      setRecentOpen(false);
                    }}
                    open={recentOpen}
                    value={timeIntervalRecent}
                    style={{
                      width: "100%",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderImage:
                        "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
                      borderImageWidth: "0 0 3px 0",
                      borderImageSlice: 1,
                    }}
                    bordered={false}
                  >
                    {recentKeyword.map((data) => {
                      return (
                        <Select.Option value={data.VALUE}>
                          <span
                            style={{
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: "15px",
                              color: "blue",
                            }}
                          >
                            {data.VALUE}
                          </span>
                          　
                          <span style={{ fontSize: "15px" }}>{data.NAME}</span>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
              <Row align="middle">
                <Col xs={6} style={{ textAlign: "left", top: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                    최다검색어
                  </span>
                </Col>
                <Col
                  xs={12}
                  style={{ textAlign: "left", top: "5px", width: "100%" }}
                >
                  <Select
                    showArrow={false}
                    width="100%"
                    onMouseEnter={() => {
                      setPopularOpen(true);
                    }}
                    onMouseLeave={() => {
                      setPopularOpen(false);
                    }}
                    open={popularOpen}
                    value={timeIntervalPopular}
                    style={{
                      width: "100%",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderImage:
                        "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
                      borderImageWidth: "0 0 3px 0",
                      borderImageSlice: 1,
                    }}
                    bordered={false}
                  >
                    {popularKeyword.map((data) => {
                      return (
                        <Select.Option value={data.VALUE}>
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "15px",
                              color: "blue",
                            }}
                          >
                            {data.VALUE}
                          </span>
                          　
                          <span style={{ fontSize: "15px" }}>{data.NAME}</span>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ background: "white" }}>
        <Col xs={1} push={3} style={{ textAlign: "left" }}>
          <Divider
            style={{
              width: "100%",
              borderWidth: "2px",
              borderStyle: "solid",
              borderImage:
                "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
              borderImageWidth: "0 0 3px 0",
              borderImageSlice: 1,
            }}
          />
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            자주 찾는 서비스
          </span>
        </Col>
        <Col
          xs={7}
          push={4}
          style={{
            top: "20px",
            textAlign: "left",
            height: "380px",
            boxShadow: "0px 1px 5px gray",
          }}
        >
          <Row>
            <Col
              xs={24}
              style={{
                top: "15px",
                background:
                  "linear-gradient(270deg, rgba(205,232,255,1) 0%, rgba(255,255,255,1) 25%)",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  paddingLeft: "25px",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                자주찾는 서비스
              </span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#666666",
                  fontSize: "15px",
                }}
              >
                를 안내합니다.
              </span>
            </Col>
          </Row>
          <Divider
            style={{ marginTop: "-10px !important", marginBottom: "10px" }}
          />
          <Row>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/prd/info";
                }}
                onMouseEnter={() => {
                  setButtonPrdInfoBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonPrdInfoBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  // background: "#f4f6f8",
                  height: "100px",
                  width: "100px",
                  // borderRadius: "12px",
                  // paddingTop: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoPrdInfo}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonPrdInfoBorder ? "1px  #6ab7ff" : "none",
                  color: buttonPrdInfoBorder ? "#6ab7ff" : "",
                }}
              >
                농약 정보
              </span>
            </Col>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/prd/mrl";
                }}
                onMouseEnter={() => {
                  setButtonPrdMrlBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonPrdMrlBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  // background: "#f4f6f8",
                  height: "100px",
                  width: "100px",
                  // borderRadius: "12px",
                  // paddingTop: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoPrdMrl}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonPrdMrlBorder ? "1px  #6ab7ff" : "none",
                  color: buttonPrdMrlBorder ? "#6ab7ff" : "",
                }}
              >
                농약 잔류허용기준
              </span>
            </Col>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/std/standard";
                }}
                onMouseEnter={() => {
                  setButtonPrdStdBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonPrdStdBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  // background: "#f4f6f8",
                  height: "100px",
                  width: "100px",
                  // borderRadius: "12px",
                  // paddingTop: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoPrdStd}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonPrdStdBorder ? "1px  #6ab7ff" : "none",
                  color: buttonPrdStdBorder ? "#6ab7ff" : "",
                }}
              >
                농약 표준품
              </span>
            </Col>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/prd/analysis";
                }}
                onMouseEnter={() => {
                  setButtonPrdAnalysisBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonPrdAnalysisBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  // background: "#f4f6f8",
                  height: "100px",
                  width: "100px",
                  // borderRadius: "12px",
                  // paddingTop: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoPrdAnalysis}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonPrdAnalysisBorder
                    ? "1px  #6ab7ff"
                    : "none",
                  color: buttonPrdAnalysisBorder ? "#6ab7ff" : "",
                }}
              >
                농축산물 시험법
              </span>
            </Col>
          </Row>
          <Divider
            style={{ marginTop: "0px !important", marginBottom: "10px" }}
          />
          <Row>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/vd/mrl";
                }}
                onMouseEnter={() => {
                  setButtonVdInfoBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonVdInfoBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  // background: "#f4f6f8",
                  height: "100px",
                  width: "100px",
                  // borderRadius: "12px",
                  // paddingTop: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoVdInfo}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonVdInfoBorder ? "1px  #6ab7ff" : "none",
                  color: buttonVdInfoBorder ? "#6ab7ff" : "",
                }}
              >
                동물용의약품
                <br />
                정보
              </span>
            </Col>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/vd/mrl";
                }}
                onMouseEnter={() => {
                  setButtonVdMrlBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonVdMrlBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  background: "transparent",
                  height: "100px",
                  width: "100px",
                  textAlign: "center",
                  // borderRadius: "12px",
                  // paddingTop: "20px",
                  // padding: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoVdMrl}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonVdMrlBorder ? "1px  " : "none",
                  color: buttonVdMrlBorder ? "#6ab7ff" : "",
                }}
              >
                동물용의약품
                <br />
                잔류허용기준
              </span>
            </Col>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/std/standard";
                }}
                onMouseEnter={() => {
                  setButtonVdStdBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonVdStdBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  // background: "#f4f6f8",
                  height: "100px",
                  width: "100px",
                  // borderRadius: "12px",
                  // paddingTop: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoVdStd}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonVdStdBorder ? " solid " : "none",
                  color: buttonVdStdBorder ? "#6ab7ff" : "",
                }}
              >
                동물용의약품
                <br />
                표준품
              </span>
            </Col>
            <Col xs={6} style={{ textAlign: "center", top: "10px" }}>
              <Button
                type="ghost"
                onClick={() => {
                  window.location.href = "/vd/analysis";
                }}
                onMouseEnter={() => {
                  setButtonVdAnalysisBorder(true);
                }}
                onMouseLeave={() => {
                  setButtonVdAnalysisBorder(false);
                }}
                style={{
                  fontSize: "40px",
                  color: "#888888",
                  border: "0",
                  // background: "#f4f6f8",
                  height: "100px",
                  width: "100px",
                  // borderRadius: "12px",
                  // paddingTop: "20px"
                }}
              >
                <Image
                  style={{ marginLeft: "-10px" }}
                  src={LogoVdAnalysis}
                  preview={false}
                  width={"90px"}
                  height={"90px"}
                ></Image>
              </Button>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderBottom: buttonVdAnalysisBorder
                    ? "1px  #6ab7ff"
                    : "none",
                  color: buttonVdAnalysisBorder ? "#6ab7ff" : "",
                }}
              >
                동물용의약품
                <br />
                시험법
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs={24}></Col>
          </Row>
        </Col>
        <Col xs={1} push={5} style={{ textAlign: "left" }}>
          <Divider
            style={{
              width: "100%",
              borderWidth: "2px",
              borderStyle: "solid",
              borderImage:
                "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
              borderImageWidth: "0 0 3px 0",
              borderImageSlice: 1,
            }}
          />
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>자료실</span>
        </Col>
        <Col
          xs={6}
          push={6}
          style={{
            top: "20px",
            textAlign: "left",
            height: "380px",
            boxShadow: "0px 1px 5px gray",
          }}
        >
          <Row>
            <Col xs={24}>
              <Tabs
                defaultActiveKey="1"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
                onChange={(e) => {
                  setDataTab(e);
                }}
              >
                <Tabs.TabPane
                  tab={
                    dataTab === "1" ? (
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          background:
                            "linear-gradient(to right, #01c9ca 0%, #3886FF 10%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        농약
                      </span>
                    ) : (
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#666666",
                          fontSize: "13px",
                        }}
                      >
                        농약
                      </span>
                    )
                  }
                  key="1"
                ></Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    dataTab === "2" ? (
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          background:
                            "linear-gradient(to right, #01c9ca 0%, #3886FF 10%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        동물용의약품
                      </span>
                    ) : (
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#666666",
                          fontSize: "13px",
                          width: "100%",
                        }}
                      >
                        동물용의약품
                      </span>
                    )
                  }
                  key="2"
                ></Tabs.TabPane>
              </Tabs>
              <Table
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  height: "100%",
                }}
                size="small"
                pagination={false}
                showHeader={false}
                sticky
                columns={[
                  {
                    title: "TITLE",
                    dataIndex: "TITLE",
                    width: "70%",
                    ellipsis: true,
                    render: (data, row) => (
                      <a href={(dataTab === "1" ? "prd" : "vd") + "/downloads"}>
                        {data}
                      </a>
                    ),
                  },
                  {
                    title: "SYS_RDATE",
                    dataIndex: "SYS_RDATE",
                    width: "30%",
                    render: (data, row) => data.split(" ")[0],
                  },
                ]}
                dataSource={dataTab === "1" ? dataPrd : dataVd}
              ></Table>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col
          xs={24}
          style={{ background: "white", height: "50px", zIndex: "-9999" }}
        ></Col>
      </Row>
      <Row style={{ background: "white" }}>
        <Col xs={1} push={3} style={{ textAlign: "left" }}>
          <Divider
            style={{
              width: "100%",
              borderWidth: "2px",
              borderStyle: "solid",
              borderImage:
                "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
              borderImageWidth: "0 0 3px 0",
              borderImageSlice: 1,
            }}
          />
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            관련
            <br />
            사이트
          </span>
        </Col>
        <Col
          xs={7}
          push={4}
          style={{
            top: "20px",
            textAlign: "left",
            height: "100px",
            boxShadow: "0px 1px 5px gray",
          }}
        >
          <Row>
            <Col xs={24} style={{ top: "30px" }}>
              <Carousel
                autoplay
                effect="fade"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                {[0, 1, 2, 3].map((loop, loop_idx) => {
                  return [
                    { href: "https://www.mfds.go.kr/", src: Logo_RFDA1 },
                    {
                      href: "https://www.nifds.go.kr/index.do",
                      src: Logo_RFDA2,
                    },
                    { href: "https://www.khidi.or.kr/kps", src: Logo_RFDA3 },
                    {
                      href: "https://www.foodsafetykorea.go.kr/",
                      src: Logo_RFDA4,
                    },
                  ].map((row, idx, data) => {
                    return (
                      <div>
                        <a
                          href={data[(loop_idx + idx + 0) % 4].href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Image
                            width="25%"
                            preview={false}
                            src={data[(loop_idx + idx + 0) % 4].src}
                          />
                        </a>
                        <a
                          href={data[(loop_idx + idx + 1) % 4].href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Image
                            width="25%"
                            preview={false}
                            src={data[(loop_idx + idx + 1) % 4].src}
                          />
                        </a>
                        <a
                          href={data[(loop_idx + idx + 2) % 4].href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Image
                            width="25%"
                            preview={false}
                            src={data[(loop_idx + idx + 2) % 4].src}
                          />
                        </a>
                        <a
                          href={data[(loop_idx + idx + 3) % 4].href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Image
                            width="25%"
                            preview={false}
                            src={data[(loop_idx + idx + 3) % 4].src}
                          />
                        </a>
                      </div>
                    );
                  });
                })}
              </Carousel>
            </Col>
          </Row>
        </Col>
        <Col xs={1} push={5} style={{ textAlign: "left" }}>
          {/* <Divider style={{
            width: "100%",
            borderWidth: "2px",
            borderStyle: "solid",
            borderImage: "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
            borderImageWidth: "0 0 3px 0",
            borderImageSlice: 1,
          }} />
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>자료실</span> */}
        </Col>
        <Col
          xs={6}
          push={6}
          style={{
            top: "20px",
            textAlign: "left",
            height: "100px",
            boxShadow: "0px 1px 5px gray",
          }}
        >
          <Row style={{ height: "50%" }} align="middle" justify="space-around">
            <Col
              xs={12}
              style={{
                textAlign: "center",
                color: "green",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              오늘 방문자 수
            </Col>
            <Col
              xs={12}
              style={{
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              전체 방문자 수
            </Col>
          </Row>
          {/* <Divider></Divider> */}
          <Row style={{ height: "20%" }} align="middle" justify="space-around">
            <Col xs={12} style={{ textAlign: "center", top: "" }}>
              <span style={{ fontSize: "18px" }}>{visitorDay}</span>
            </Col>
            <Col xs={12} style={{ textAlign: "center", top: "" }}>
              <span style={{ fontSize: "18px" }}>{visitorTotal}</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
