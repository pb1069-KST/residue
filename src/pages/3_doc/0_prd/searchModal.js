import React, { useState, useEffect, useRef } from "react";
import Hangul from "hangul-js";
import _ from "lodash";
import { FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";

import {
  setIsvisibleSchModal,
  setDatasourceModModal,
} from "../../../reducers/doc/DocPrdArticle";

import "antd/dist/antd.css";
import Table from "antd/es/table";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Card from "antd/es/card";

import {
  customEncrypt,
  getCurrentKoreanDateTime,
  CheckNullBlank,
  FileDownloader,
} from "../../../components/util";

import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";

const { Search, TextArea } = Input;

export const SearchModal = () => {
  const dispatch = useDispatch();
  const { isvisible_search_modal, datasource_sch_modal, selected_data } =
    useSelector((state) => state.DocPrdArticle);
  const { customSorter } = useSelector((state) => state.util);

  const [searchKey, setSearchKey] = useState("");

  if (!isvisible_search_modal) {
    return <></>;
  } else {
    return (
      <div>
        <Modal
          visible={isvisible_search_modal}
          footer={<></>}
          onCancel={() => {
            dispatch(setIsvisibleSchModal(false));
            dispatch(setDatasourceModModal([]));
          }}
          width="50vw"
          title={<div>게시물 (농약)</div>}
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
            <Table
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
                  className: "table-title",
                },
                {
                  dataIndex: "data_1",
                  render: (text, row, index) => {
                    if (row.wide === 0) {
                      return {
                        children: <>{text}</>,
                      };
                    }
                    if (row.wide === 1) {
                      return {
                        children: <>{text}</>,
                        props: {
                          colSpan: 3,
                        },
                      };
                    }
                  },
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
                        },
                      };
                    } else {
                      return <>{text}</>;
                    }
                  },
                },
                {
                  dataIndex: "data_2",
                  render: (text, row, index) => {
                    if (row.wide === 1) {
                      return {
                        children: <>{text}</>,
                        props: {
                          colSpan: 0,
                        },
                      };
                    } else {
                      return <>{text}</>;
                    }
                  },
                },
              ]}
              dataSource={[
                {
                  title_1: "제목",
                  data_1: datasource_sch_modal.TITLE,
                  wide: 1,
                },
                {
                  title_1: "등록일",
                  data_1: datasource_sch_modal.SYS_RDATE,
                  title_2: "수정일",
                  data_2: datasource_sch_modal.SYS_UDATE,
                  wide: 0,
                },
                {
                  title_1: "작성자",
                  data_1: (
                    <>
                      {datasource_sch_modal.WRITER} (
                      {datasource_sch_modal.REGISTER_IP})
                    </>
                  ),
                  wide: 1,
                },
                {
                  title_1: "내용",
                  data_1: (
                    <div style={{ minHeight: "300px", whiteSpace: "pre-wrap" }}>
                      {datasource_sch_modal.CONTENT}
                    </div>
                  ),
                  wide: 1,
                },
                {
                  title_1: "첨부자료",
                  data_1: CheckNullBlank(datasource_sch_modal.FILE_LINK) ? (
                    <FileDownloader
                      fileUrl={
                        "/API/downloadArticleFile?ARTICLE_KEY=" +
                        datasource_sch_modal.ARTICLE_KEY
                      }
                      customFileName={
                        datasource_sch_modal.FILE_LINK.split(
                          datasource_sch_modal.ARTICLE_KEY
                        )[0]
                      }
                    />
                  ) : (
                    <></>
                  ),
                  wide: 1,
                },
              ]}
            />
          </Card>
        </Modal>
      </div>
    );
  }
};
