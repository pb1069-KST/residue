import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
// #antd icon
import { EditOutlined, HomeFilled } from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../../components/template";
//components

//redux
import { setDataSource } from "../../../../reducers/prd/PrdInfoAdi";
import {
  setIsvisibleModModal,
  setDatasourceModModal,
  setSelectedData,
} from "../../../../reducers/prd/PrdInfoAdi_modal";
//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Input from "antd/es/input";
import Select from "antd/es/select";
// #antd lib

import { useSelector, useDispatch } from "react-redux";

const { Search } = Input;

export const Adi = () => {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.PrdInfoAdi);

  //////////////////////////////////////////////////////////////////////
  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  //////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetch("/API/search?TYPE=11311", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        dispatch(setDataSource(myJson));
      });
  }, [dispatch]);

  return (
    <div>
      <Template
        userInfo={userinfo}
        //헤더 하단부 구성
        Header_bottom={{
          title: "농약",
          subTitle: "농약 ADI",
          datasource_breadcrumb: [
            {
              href: "/",
              name: <HomeFilled></HomeFilled>,
            },
            {
              href: "/prd/adi",
              name: "농약",
            },
            {
              href: "/prd/adi",
              name: "농약정보",
            },
            {
              href: "/prd/adi",
              name: "농약 ADI",
            },
          ],
        }}
        //사이더 종류
        sider={{
          type: 1,
          defaultActiveKey: 0,
        }}
        //카드
        main_card={{
          title: "ADI 검색",
        }}
        content_card={
          <div>
            <Search
              placeholder="농약명을 입력하세요"
              enterButton
              onSearch={(e) => {
                setSearchKey(e);
              }}
            />
          </div>
        }
        content={
          <div>
            <Table
              size="small"
              sticky
              bordered
              rowKey={(item) => {
                return item.PESTICIDE_CODE;
              }}
              dataSource={dataSource.filter((val) => {
                if (val.PESTICIDE_NAME_KR !== null) {
                  var word_str = "";
                  Hangul.disassemble(val.PESTICIDE_NAME_KR, true).forEach(
                    (word, index) => {
                      word_str += word[0];
                    }
                  );
                  return (
                    word_str.indexOf(searchKey) !== -1 ||
                    Hangul.disassemble(
                      val.PESTICIDE_NAME_KR,
                      true
                    )[0][0].indexOf(searchKey) > -1 ||
                    val.PESTICIDE_NAME_KR.indexOf(searchKey) >= 0 ||
                    (val.PESTICIDE_NAME_EN !== "" &&
                    val.PESTICIDE_NAME_EN !== null
                      ? val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
                          searchKey.toLowerCase()
                        ) > -1
                      : null)
                  );
                } else {
                  return (
                    val.PESTICIDE_NAME_EN.toLowerCase().indexOf(
                      searchKey.toLowerCase()
                    ) > -1
                  );
                }
              })}
              columns={[
                {
                  title: "농약 국문명",
                  dataIndex: "PESTICIDE_NAME_KR",
                  key: "PESTICIDE_CODE",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                  defaultSortOrder: "ascend",
                },
                {
                  title: "농약 영문명",
                  dataIndex: "PESTICIDE_NAME_EN",
                  key: "PESTICIDE_CODE",
                  width: "15%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "한국",
                  dataIndex: "ADI_KR",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_KR"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "코덱스",
                  dataIndex: "ADI_CD",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_CD"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "미국",
                  dataIndex: "ADI_US",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_US"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "유럽",
                  dataIndex: "ADI_EU",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_EU"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "중국",
                  dataIndex: "ADI_CN",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_CN"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "일본",
                  dataIndex: "ADI_JP",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_JP"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "대만",
                  dataIndex: "ADI_TW",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_TW"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "호주",
                  dataIndex: "ADI_AU",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_AU"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "메뉴얼",
                  dataIndex: "ADI_PM",
                  key: "PESTICIDE_CODE",
                  width: "7%",
                  sorter: {
                    compare: (a, b, sortOrder) =>
                      customSorter(a, b, sortOrder, "ADI_PM"),
                  },
                  showSorterTooltip: false,
                  sortDirections: ["ascend", "descend", "ascend"],
                },
                {
                  title: "",
                  align: "center",
                  dataIndex: "",
                  key: "PESTICIDE_CODE",
                  flag: "등록",
                  width: "8%",
                  render: (data, row, index) => (
                    <Row key={row.PESTICIDE_CODE}>
                      <Col xs={24}>
                        <Button
                          size="small"
                          className="button_mod"
                          onClick={() => {
                            fetch(
                              "/API/search?TYPE=11312&PESTICIDE_CODE=" +
                                row.PESTICIDE_CODE,
                              {
                                method: "GET",
                                credentials: "include",
                              }
                            )
                              .then(function (response) {
                                return response.json();
                              })
                              .then((myJson) => {
                                dispatch(setDatasourceModModal(myJson));
                                dispatch(setIsvisibleModModal(true));
                                dispatch(setSelectedData(data));
                              });
                          }}
                        >
                          <EditOutlined />
                        </Button>
                      </Col>
                    </Row>
                  ),
                },
              ].filter((data) => {
                if (
                  data.flag === "등록" &&
                  (userinfo.USERID === undefined ||
                    (userinfo.PRD_USING_REG === "N" &&
                      userinfo.PRD_USING_MOD === "N"))
                ) {
                  return false;
                } else {
                  return true;
                }
              })}
            ></Table>
          </div>
        }
      ></Template>
    </div>
  );
};
