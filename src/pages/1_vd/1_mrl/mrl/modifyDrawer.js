import React, { useState, useEffect } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
import moment from "moment";
import CrytoJS from "crypto-js";
// #antd icon
import { EditOutlined, HomeFilled } from "@ant-design/icons";
// #antd icon

//components
import Template from "../../../../components/template";
//components

//redux
import {
  setDataSource,
  setDataSourceFood,
} from "../../../../reducers/vd/VdMrlMrl";
import {
  setSelectedData,
  setIsvisibleModModal,
  setIsvisibleSchModal,
  setIsvisibleSchModalFood,
  setDatasourceModModal,

  // setIsvisibleModDrawerReg,
  setIsvisibleModDrawerMod,
  setSelectedModalData,
  setIsvisibleModModalAddInfo,
} from "../../../../reducers/vd/VdMrlMrl_modal";

//

// #antd lib
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Popconfirm from "antd/es/popconfirm";
import Drawer from "antd/es/drawer";
import message from "antd/es/message";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
// import Select from "antd/es/select"
import Switch from "antd/es/switch";
import DatePicker from "antd/es/date-picker";
import Tabs from "antd/es/tabs";
// #antd lib

import { useSelector, useDispatch } from "react-redux";
import { Divider } from "antd";
import {
  customEncrypt,
  CustomInput,
  getCurrentKoreanDateTime,
  getCurrentKoreanDateTimeYMD,
} from "../../../../components/util";
// import { setIsvisibleModDrawerStdName } from "../../../reducers/std/StdStandardStatus_modal";

const { Search, TextArea } = Input;
// const { Option } = Select;
export const ModifyDrawer = () => {
  const dispatch = useDispatch();
  const {
    datasource_mod_modal,
    isvisible_modify_drawer_mod,
    selected_modal_data,
    selected_data,
  } = useSelector((state) => state.VdMrlMrl_modal);
  const { customSorter } = useSelector((state) => state.util);

  const [modify_drawer_data, setModify_drawer_data] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [existFoodcode, setExistFoodCode] = useState([]);

  useEffect(() => {
    fetch("/API/search?TYPE=22113", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        setModify_drawer_data(myJson);
      });
    // console.log(modify_drawer_data);
    // //   {
    // //     "FOOD_NAME_KR": "농산물",
    // //     "FOOD_NAME_EN": "Agricultural products",
    // //     "FOOD_CODE": "ap100000002"
    // // }
    setExistFoodCode(datasource_mod_modal.map((obj) => obj.FOOD_CODE));
    // console.log(datasource_mod_modal.map((obj) => obj.FOOD_CODE));
  }, []);

  if (!isvisible_modify_drawer_mod) {
    return <></>;
  } else {
    return (
      <Drawer
        title="식품명 조회"
        placement="right"
        onClose={() => {
          dispatch(setIsvisibleModDrawerMod(false));
        }}
        visible={isvisible_modify_drawer_mod}
        width="30vw"
      >
        <Search
          placeholder="식품명을 입력하세요"
          onSearch={(e) => {
            setSearchKey(e);
          }}
          style={{ marginBottom: "10px" }}
        />
        <Table
          size="small"
          sticky
          bordered
          columns={[
            {
              title: "식품 국문명",
              dataIndex: "FOOD_NAME_KR",
              key: "FOOD_CODE",
              width: "40%",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "FOOD_NAME_KR"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "식품 영문명",
              dataIndex: "FOOD_NAME_EN",
              key: "FOOD_CODE",
              width: "40%",
              sorter: {
                compare: (a, b, sortOrder) =>
                  customSorter(a, b, sortOrder, "FOOD_NAME_EN"),
              },
              showSorterTooltip: false,
              sortDirections: ["ascend", "descend", "ascend"],
            },
            {
              title: "",
              dataIndex: "",
              key: "FOOD_CODE",
              align: "center",
              render: (data, row) => (
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => {
                    console.log(datasource_mod_modal);

                    dispatch(setIsvisibleModDrawerMod(false));
                    const temp = _.cloneDeep(datasource_mod_modal);
                    dispatch(
                      setDatasourceModModal([
                        ...temp,
                        {
                          BIGO: "",
                          COUNTRY_CODE: "KR",
                          DISCARD_FLAG: "N",
                          ETC_FLAG: "N",
                          IS_DELETE: "N",
                          FOOD_CODE: data.FOOD_CODE,
                          FOOD_NAME_EN: data.FOOD_NAME_EN,
                          FOOD_NAME_KR: data.FOOD_NAME_KR,
                          FOOTNOTE_REF: null,
                          LAUNCH_POINT: getCurrentKoreanDateTimeYMD(),
                          REG_DATE: getCurrentKoreanDateTime(),
                          MRL_VALUE: "",
                          NO: datasource_mod_modal.length,
                          VDRUG_CODE: selected_data.VDRUG_CODE,
                          QUALIFICATION: null,
                          IS_NEW: "Y",
                          STEP: "",
                        },
                      ])
                    );
                  }}
                >
                  선택
                </Button>
              ),
            },
          ]}
          dataSource={modify_drawer_data
            .filter((obj) => !existFoodcode.includes(obj.FOOD_CODE))
            .filter((val) => {
              if (val.FOOD_NAME_KR !== null) {
                var word_str = "";
                Hangul.disassemble(val.FOOD_NAME_KR, true).forEach(
                  (word, index) => {
                    word_str += word[0];
                  }
                );
                return (
                  word_str.indexOf(searchKey) !== -1 ||
                  Hangul.disassemble(val.FOOD_NAME_KR, true)[0][0].indexOf(
                    searchKey
                  ) > -1 ||
                  val.FOOD_NAME_KR.indexOf(searchKey) >= 0 ||
                  (val.FOOD_NAME_EN !== "" && val.FOOD_NAME_EN !== null
                    ? val.FOOD_NAME_EN.toLowerCase().indexOf(
                        searchKey.toLowerCase()
                      ) > -1
                    : null)
                );
              } else {
                return (
                  val.FOOD_NAME_EN.toLowerCase().indexOf(
                    searchKey.toLowerCase()
                  ) > -1
                );
              }
            })}
        ></Table>
      </Drawer>
    );
  }
};
