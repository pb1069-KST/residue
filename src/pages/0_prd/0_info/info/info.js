import React, { useEffect, useState, useMemo, useCallback } from "react";
import Hangul from "hangul-js";
import { customEncrypt } from "../../../../components/util";

// Icons
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  HomeFilled,
} from "@ant-design/icons";

// Components
import Template from "../../../../components/template";

// Redux
import {
  setDataSource,
  setIsvisibleSchModal,
  setDatasourceSchModal,
  setDatasourceSchModalMrl,
  setIsvisibleRegModal,
  setIsvisibleModModal,
  setDatasourceModModal,
  setDatasourceModModalOrg,
  setUsingArray,
} from "../../../../reducers/prd/PrdInfoInfo";

// Ant Design
import "antd/dist/antd.css";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Popconfirm from "antd/es/popconfirm";
import message from "antd/es/message";
import Input from "antd/es/input";
import Select from "antd/es/select";

import { useSelector, useDispatch } from "react-redux";

const { Search } = Input;

// 농약명 필터링 함수 (분리)
const filterByPesticideName = (item, searchKey) => {
  if (!searchKey) return true;

  if (item.PESTICIDE_NAME_KR !== null) {
    let word_str = "";
    Hangul.disassemble(item.PESTICIDE_NAME_KR, true).forEach((word) => {
      word_str += word[0];
    });

    return (
      word_str.indexOf(searchKey) !== -1 ||
      Hangul.disassemble(item.PESTICIDE_NAME_KR, true)[0][0].indexOf(
        searchKey
      ) > -1 ||
      item.PESTICIDE_NAME_KR.indexOf(searchKey) >= 0 ||
      (item.PESTICIDE_NAME_EN !== "" && item.PESTICIDE_NAME_EN !== null
        ? item.PESTICIDE_NAME_EN.toLowerCase().indexOf(
            searchKey.toLowerCase()
          ) > -1
        : false)
    );
  } else {
    return (
      item.PESTICIDE_NAME_EN &&
      item.PESTICIDE_NAME_EN.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
    );
  }
};

export default function Info() {
  const dispatch = useDispatch();
  const { dataSource } = useSelector((state) => state.PrdInfoInfo);
  const { userinfo } = useSelector((state) => state.header);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");
  const [searchFlag, setSearchFlag] = useState(0);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/API/search?TYPE=11111", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(setDataSource(data));
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchData();
  }, [dispatch]);

  // 필터링된 데이터 (useMemo로 최적화)
  const filteredData = useMemo(() => {
    return dataSource.filter((item) => filterByPesticideName(item, searchKey));
  }, [dataSource, searchKey]);

  // 상세 보기 핸들러 (useCallback으로 최적화)
  const handleViewDetail = useCallback(
    async (pesticideCode) => {
      try {
        const [detailResponse, mrlResponse] = await Promise.all([
          fetch(`/API/search?TYPE=11112&PESTICIDE_CODE=${pesticideCode}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`/API/search?TYPE=11113&PESTICIDE_CODE=${pesticideCode}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!detailResponse.ok || !mrlResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [detailData, mrlData] = await Promise.all([
          detailResponse.json(),
          mrlResponse.json(),
        ]);

        dispatch(setDatasourceSchModal(detailData[0]));
        dispatch(setDatasourceSchModalMrl(mrlData));
        dispatch(setIsvisibleSchModal(true));
      } catch (error) {
        console.error("Error fetching detail:", error);
        message.error("상세 정보를 불러오는데 실패했습니다.");
      }
    },
    [dispatch]
  );

  // 수정 핸들러
  const handleEdit = useCallback(
    async (pesticideCode) => {
      try {
        const [detailResponse, usingResponse] = await Promise.all([
          fetch(`/API/search?TYPE=11112&PESTICIDE_CODE=${pesticideCode}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch("/API/search?TYPE=11114", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!detailResponse.ok || !usingResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [detailData, usingData] = await Promise.all([
          detailResponse.json(),
          usingResponse.json(),
        ]);

        dispatch(setDatasourceModModal(detailData[0]));
        dispatch(setDatasourceModModalOrg(detailData[0]));
        dispatch(setUsingArray(usingData));
        dispatch(setIsvisibleModModal(true));
      } catch (error) {
        console.error("Error fetching edit data:", error);
        message.error("수정 정보를 불러오는데 실패했습니다.");
      }
    },
    [dispatch]
  );

  // 삭제 핸들러
  const handleDelete = useCallback(
    async (pesticideCode, pesticideName) => {
      try {
        const response = await fetch("/API/update", {
          method: "POST",
          body: JSON.stringify({
            data: customEncrypt([
              {
                TABLE: "T_RESI_PESTICIDE",
                KEY: ["PESTICIDE_CODE"],
                NUMERIC_KEY: [""],
                PESTICIDE_CODE: pesticideCode,
                DELETE_FLAG: "Y",
              },
            ]),
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 200) {
          message.success(
            <>
              농약정보: {"<"}
              <span style={{ fontWeight: "bold", color: "blue" }}>
                {pesticideName}
              </span>
              {">"} 을 삭제하였습니다.
            </>
          );

          // 데이터 다시 로드
          const fetchResponse = await fetch("/API/search?TYPE=11111", {
            method: "GET",
            credentials: "include",
          });
          const data = await fetchResponse.json();
          dispatch(setDataSource(data));
        } else if (response.status === 401) {
          message.error("삭제 권한이 없습니다.");
        }
      } catch (error) {
        console.error("Error deleting:", error);
        message.error("삭제에 실패했습니다.");
      }
    },
    [dispatch]
  );

  // 테이블 컬럼 정의
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "농약 국문명",
        dataIndex: "PESTICIDE_NAME_KR",
        key: "PESTICIDE_CODE",
        width: "35%",
        sorter: {
          compare: (a, b, sortOrder) =>
            customSorter(a, b, sortOrder, "PESTICIDE_NAME_KR"),
        },
        showSorterTooltip: false,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (data, row) => (
          <a onClick={() => handleViewDetail(row.PESTICIDE_CODE)}>{data}</a>
        ),
      },
      {
        title: "농약 영문명",
        dataIndex: "PESTICIDE_NAME_EN",
        key: "PESTICIDE_CODE",
        width: "35%",
        sorter: {
          compare: (a, b, sortOrder) =>
            customSorter(a, b, sortOrder, "PESTICIDE_NAME_EN"),
        },
        showSorterTooltip: false,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (data, row) => (
          <a onClick={() => handleViewDetail(row.PESTICIDE_CODE)}>{data}</a>
        ),
      },
    ];

    // 권한이 있는 경우에만 액션 컬럼 추가
    if (userinfo.USERID && userinfo.PRD_INFO_MOD === "Y") {
      baseColumns.push({
        title: (
          <Button
            size="small"
            className="button_reg"
            onClick={() => dispatch(setIsvisibleRegModal(true))}
          >
            <PlusOutlined />
          </Button>
        ),
        align: "center",
        key: "actions",
        width: "7%",
        render: (_, row) => (
          <Row key={row.PESTICIDE_CODE}>
            <Col xs={24}>
              <Button
                size="small"
                className="button_mod"
                onClick={() => handleEdit(row.PESTICIDE_CODE)}
              >
                <EditOutlined />
              </Button>
              <Popconfirm
                title="정말 삭제하시겠습니까?"
                onConfirm={() =>
                  handleDelete(
                    row.PESTICIDE_CODE,
                    row.PESTICIDE_NAME_KR || row.PESTICIDE_NAME_EN
                  )
                }
                okText="예"
                cancelText="아니오"
              >
                <Button size="small" className="button_del">
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        ),
      });
    }

    return baseColumns;
  }, [userinfo, customSorter, handleViewDetail, handleEdit, handleDelete]);

  return (
    <Template
      userInfo={userinfo}
      Header_bottom={{
        title: "농약",
        subTitle: "농약정보",
        datasource_breadcrumb: [
          {
            href: "/",
            name: <HomeFilled />,
          },
          {
            href: "/prd/info",
            name: "농약",
          },
          {
            href: "/prd/info",
            name: "농약정보",
          },
          {
            href: "/prd/info",
            name: "농약정보",
          },
        ],
      }}
      sider={{
        type: 1,
        defaultActiveKey: 0,
      }}
      main_card={{
        title: "농약 검색",
      }}
      content_card={
        <Row>
          <Col xs={3}>
            <Select
              style={{ width: "100%" }}
              defaultValue={0}
              onChange={setSearchFlag}
            >
              <Select.Option value={0}>농약명</Select.Option>
            </Select>
          </Col>
          <Col xs={21}>
            <Search
              placeholder="농약명을 입력하세요"
              enterButton
              onSearch={setSearchKey}
            />
          </Col>
        </Row>
      }
      content={
        <Table
          size="small"
          sticky
          bordered
          rowKey={(item) => item.PESTICIDE_CODE}
          dataSource={filteredData}
          columns={columns}
          loading={!dataSource.length}
        />
      }
    />
  );
}
