import React, { useState } from "react";
import _ from "lodash";
import CryptoJS from "crypto-js";
import axios from "axios";
import * as XLSX from "xlsx";

import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
// #antd lib
import "antd/dist/antd.css";
import Button from "antd/es/button";
import Input from "antd/es/input";

// import Switch from "antd/es/switch";
import Tag from "antd/es/tag";

import { useSelector, useDispatch } from "react-redux";

const { Search, TextArea } = Input;

export const CheckNullBlank = (str) => {
  return str === null || str === undefined || str === "" ? false : true;
};

export const FileDownloader = ({ fileUrl, customFileName }) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = customFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  return (
    <Button type="link" style={{ paddingLeft: "0px" }} onClick={handleDownload}>
      {customFileName}
    </Button>
  );
};

export const CustomSearchPromise = (type_num) => {
  return new Promise((resolve) => {
    try {
      fetch("/API/search?TYPE=" + type_num, {
        method: "GET",
        credentials: "include",
      })
        .then(function (response) {
          return response.json();
        })
        .then((myJson) => {
          resolve(myJson);
        });
    } catch (error) {
      console.error("Error in CustomSearch:", error);
      resolve(0);
      throw error;
    }
  });
};

export const CustomInput = (func, datasource, target, prefix) => {
  const dispatch = useDispatch();
  return (
    <>
      <Input
        size="small"
        placeholder="내용을 입력하세요."
        prefix={prefix ? <span style={{ color: "red" }}>*</span> : <></>}
        defaultValue={datasource[target]}
        onBlur={(e) => {
          dispatch(
            func({
              ...datasource,
              [target]: e.target.value,
            })
          );
        }}
      />
      {prefix && (datasource[target] === null || datasource[target] === "") ? (
        <span style={{ color: "red" }}>※ 필수값입니다.</span>
      ) : (
        <></>
      )}
    </>
  );
};

export const CustomTextArea = (func, datasource, target, prefix) => {
  const dispatch = useDispatch();
  return (
    <TextArea
      placeholder="내용을 입력하세요."
      size="small"
      autoSize={{ minRows: 1, maxRows: 10 }}
      prefix={prefix ? <span style={{ color: "red" }}>*</span> : <></>}
      defaultValue={datasource[target]}
      onBlur={(e) => {
        dispatch(
          func({
            ...datasource,
            [target]: e.target.value,
          })
        );
      }}
    />
  );
};

export const CustomTextAreaTags = (func, datasource, target, prefix) => {
  const dispatch = useDispatch();
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTarget, setTempTarget] = useState("");
  const handleInputChange = (e) => {
    setTempTarget(e.target.value);
  };

  const handleInputBlur = (func, idx, target) => {
    const newTarget = datasource[target]
      .split(",")
      .map((data, data_idx) =>
        data_idx === idx ? (tempTarget === "" ? data : tempTarget) : data
      )
      .join(",");

    dispatch(
      func({
        ...datasource,
        [target]: newTarget,
      })
    );
    setEditingIndex(null);
  };
  const handleTagClick = (idx) => {
    setEditingIndex(idx);
  };
  const handleRemoveTag = (e, func, data_idx, target) => {
    e.preventDefault();
    const newTarget = datasource[target]
      .split(",")
      .filter((data, idx) => idx != data_idx)
      .join(",");
    dispatch(
      func({
        ...datasource,
        [target]: newTarget,
      })
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      {datasource[target] !== null && datasource[target] !== "" ? (
        datasource[target].split(",").map((data, data_idx) => {
          return (
            <Tag
              key={data_idx}
              closable
              style={{
                fontWeight: "normal",
                flexBasis: "20%",
              }}
              color="geekblue"
              onClick={() => {
                handleTagClick(data_idx);
              }}
              closeIcon={<CloseOutlined style={{ color: "black" }} />}
              onClose={(e) => handleRemoveTag(e, func, data_idx, target)}
            >
              {editingIndex === data_idx ? (
                <Input
                  size="small"
                  defaultValue={data}
                  onChange={(e) => handleInputChange(e)}
                  onBlur={() => handleInputBlur(func, data_idx, target)}
                  onPressEnter={() => handleInputBlur(func, data_idx, target)}
                  autoFocus
                />
              ) : (
                data
              )}
            </Tag>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export const getCurrentKoreanDateTime = () => {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");
  const hours = String(koreaTime.getHours()).padStart(2, "0");
  const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
  const seconds = String(koreaTime.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

export const getCurrentKoreanDateTimeYMD = () => {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");
  const hours = String(koreaTime.getHours()).padStart(2, "0");
  const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
  const seconds = String(koreaTime.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

export const customEncrypt = (obj) => {
  var temp = _.cloneDeep(obj);
  temp = JSON.stringify(temp);
  temp = CryptoJS.AES.encrypt(temp, "residue").toString();
  return temp;
};

export const ExcelExportButton = ({ data, name }) => {
  const exportToExcel = () => {
    const headers = [
      { header: "식품명(국문)", key: "FOOD_NAME_KR" },
      { header: "식품명(영문)", key: "FOOD_NAME_EN" },
      { header: "MRL", key: "MRL_VALUE" },
      { header: "비고", key: "BIGO" },
    ];

    const filteredData = data.map((item) => ({
      FOOD_NAME_KR: item.FOOD_NAME_KR,
      FOOD_NAME_EN: item.FOOD_NAME_EN,
      MRL_VALUE: item.MRL_VALUE,
      BIGO: item.BIGO,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    XLSX.utils.sheet_add_aoa(worksheet, [headers.map((h) => h.header)], {
      origin: "A1",
    });

    // 열 너비 자동 조정
    const getStringWidth = (str) => {
      let width = 0;
      for (let i = 0; i < str.length; i++) {
        width += str.charCodeAt(i) > 255 ? 2 : 1;
      }
      return width;
    };

    const maxColumnWidths = {};

    // 헤더 길이 계산
    headers.forEach((header, index) => {
      maxColumnWidths[index] = getStringWidth(header.header);
    });

    // 데이터 길이 계산
    filteredData.forEach((row) => {
      headers.forEach((header, index) => {
        const cellWidth = getStringWidth(String(row[header.key]));
        if (cellWidth > maxColumnWidths[index]) {
          maxColumnWidths[index] = cellWidth;
        }
      });
    });

    // 열 너비 설정
    worksheet["!cols"] = headers.map((_, index) => ({
      wch: maxColumnWidths[index] + 2, // 여유 공간을 위해 2를 더함
    }));

    // 헤더 스타일 적용
    const headerStyle = {
      fill: { fgColor: { rgb: "87CEEB" } }, // 하늘색 배경
      font: { bold: true }, // 굵은 글씨체
      border: {
        // 하단 두 줄
        bottom: { style: "double", color: { auto: 1 } },
      },
    };

    // 헤더에 스타일 적용
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = headerStyle;
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "잔류허용기준_" + name + ".xlsx");
  };

  return (
    <Button type="text" onClick={exportToExcel}>
      <FileExcelOutlined style={{ color: "green" }} /> 엑셀
    </Button>
  );
};
