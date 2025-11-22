import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import "../App.css";
import "antd/dist/antd.css";

import page_home from "../pages/home";
import Header from "./Header";
import Footer from "./Footer";

//////////////////////////////////////////////////////// PRD
import PrdInfoInfo from "../pages/0_prd/0_info/info/main";
import PrdInfoUsing from "../pages/0_prd/0_info/using/main";
import PrdAdiUsing from "../pages/0_prd/0_info/adi/main";

import PrdMrlMrl from "../pages/0_prd/1_mrl/mrl/main";
import PrdMrlFood from "../pages/0_prd/1_mrl/food";

import PrdProposalProposal from "../pages/0_prd/2_proposal/proposal";

import PrdTestReport from "../pages/0_prd/3_test/report";

import PrdAnalysisAnalysis from "../pages/0_prd/4_analysis/analysis";
import PrdAnalysisAnalysisL from "../pages/0_prd/4_analysis/analysis_l";

import PrdProgressProgress from "../pages/0_prd/5_progress/progress";

//////////////////////////////////////////////////////// VD
import VdInfoInfo from "../pages/1_vd/0_info/info/main";
import VdInfoUsing from "../pages/1_vd/0_info/using";
import VdInfoAdi from "../pages/1_vd/0_info/adi";

import VdMrlMrl from "../pages/1_vd/1_mrl/mrl/main";
import VdMrlFood from "../pages/1_vd/1_mrl/food";

import VdAnalysisAnalysis from "../pages/1_vd/3_analysis/analysis";
//////////////////////////////////////////////////////// STD
import StdStandardStatus from "../pages/2_std/0_standard/standard";
import StdStandardApplication from "../pages/2_std/0_standard/application";
import StdStandardInput from "../pages/2_std/0_standard/input";
import StdStandardEtc from "../pages/2_std/0_standard/etc";
////////////////////////////////////////////////////////
import DocPrdArticle from "../pages/3_doc/0_prd/main";
import DocVdArticle from "../pages/3_doc/1_vd/main";
import DocPrdRelated from "../pages/3_doc/1_related/prdrelated";
import DocVdRelated from "../pages/3_doc/1_related/vdrelated";
////////////////////////////////////////////////////////
import AdminAdminUser from "../pages/4_admin/0_admin/user/main";
import AdminAdminAuth from "../pages/4_admin/0_admin/auth";
////////////////////////////////////////////////////////
import ChangePassword from "../pages/chpwd";
////////////////////////////////////////////////////////

import FileUP from "../pages/FileUP";
////////////////////////////////////////////////////////
import page404 from "../components/page404";
////////////////////////////////////////////////////////
import { useSelector, useDispatch } from "react-redux";
import { setUserinfo, setSystemCheck } from "../reducers/header/header";

function Router() {
  const dispatch = useDispatch();
  const { userinfo, system_check } = useSelector((state) => state.header);

  const [renderFlag, setRenderFlag] = useState(false);

  const [loginFlag, setLoginFlag] = useState(false);

  // const [userinfo,setUserinfo] = useState({})

  useEffect(() => {
    fetch("/AUTH/get_userinfo", {
      method: "GET",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        dispatch(setUserinfo(myJson));
        setRenderFlag(true);
      });
  }, [dispatch]);

  if (!renderFlag) return <></>;
  else {
    return (
      <div>
        <Header />
        <div style={{ minHeight: "80vh" }}>
          <BrowserRouter style={{ height: "100%" }}>
            <Switch>
              <Route exact path="/" component={page_home} />
              <Route exact path="/chpwd/:id" component={ChangePassword} />
              {!system_check
                ? [
                    // 농약정보
                    {
                      path: "/prd/info",
                      component: () => <PrdInfoInfo />,
                      auth: "a",
                    },
                    {
                      path: "/prd/using",
                      component: () => <PrdInfoUsing />,
                      auth: "PRD_USING_SCH",
                    },
                    {
                      path: "/prd/adi",
                      component: () => <PrdAdiUsing />,
                      auth: "PRD_ADI_SCH",
                    },
                    // 잔류허용기준정보
                    {
                      path: "/prd/mrl",
                      component: () => <PrdMrlMrl />,
                      auth: "a",
                    },
                    {
                      path: "/prd/food",
                      component: () => <PrdMrlFood />,
                      auth: "PRD_FOOD_SCH",
                    },
                    // 제안서 정보
                    {
                      path: "/prd/proposal",
                      component: () => <PrdProposalProposal />,
                      auth: "PRD_PROPOSAL_SCH",
                    },
                    {
                      path: "/prd/exam",
                      component: () => <PrdTestReport />,
                      auth: "PRD_EXAM_SCH",
                    },
                    // 분석정보
                    {
                      path: "/prd/analysis",
                      component: () => <PrdAnalysisAnalysis />,
                      auth: "a",
                    },
                    {
                      path: "/prd/analysis_l",
                      component: () => <PrdAnalysisAnalysisL />,
                      auth: "a",
                    },

                    // 설정진행상황
                    {
                      path: "/prd/progress",
                      component: () => <PrdProgressProgress />,
                      auth: "a",
                    },
                    // {
                    //     path: "/prd/food",
                    //     component: () => <PrdMrlFood />,
                    //     auth: "PRD_USING_SCH"
                    // },
                    //////////////////////////////////////////
                    {
                      path: "/vd/info",
                      component: () => <VdInfoInfo />,
                      auth: "VD_USING_SCH",
                    },
                    {
                      path: "/vd/using",
                      component: () => <VdInfoUsing />,
                      auth: "VD_USING_SCH",
                    },
                    {
                      path: "/vd/adi",
                      component: () => <VdInfoAdi />,
                      auth: "VD_ADI_SCH",
                    },
                    {
                      path: "/vd/mrl",
                      component: () => <VdMrlMrl />,
                      auth: "a",
                    },
                    {
                      path: "/vd/food",
                      component: () => <VdMrlFood />,
                      auth: "VD_FOOD_SCH",
                    },
                    {
                      path: "/vd/analysis",
                      component: () => <VdAnalysisAnalysis />,
                      auth: "a",
                    },
                    //////////////////////////////////////////
                    {
                      path: "/std/standard",
                      component: () => <StdStandardStatus />,
                      auth: "a",
                    },
                    {
                      path: "/std/std_req",
                      component: () => <StdStandardApplication />,
                      auth: "STD_APPLICATION_SCH",
                    },
                    {
                      path: "/std/std_input",
                      component: () => <StdStandardInput />,
                      auth: "STD_REQUEST_SCH",
                    },
                    {
                      path: "/std/std_etc",
                      component: () => <StdStandardEtc />,
                      auth: "STD_ETC_SCH",
                    },
                    //////////////////////////////////////////
                    {
                      path: "/prd/downloads",
                      component: () => <DocPrdArticle />,
                      auth: "a",
                    },
                    {
                      path: "/vd/downloads",
                      component: () => <DocVdArticle />,
                      auth: "a",
                    },
                    // {
                    //     path:"/prd/rel_site",
                    //     component:()=> <DocPrdRelated/>,
                    //     auth: "a"
                    // },
                    // {
                    //     path:"/vd/rel_site",
                    //     component:()=> <DocVdRelated/>,
                    //     auth: "a"
                    // },
                    //////////////////////////////////////////
                    {
                      path: "/admin/user",
                      component: () => <AdminAdminUser />,
                      auth: "USER_SCH",
                    },
                    {
                      path: "/admin/template",
                      component: () => <AdminAdminAuth />,
                      auth: "USER_SCH",
                    },
                    //////////////////////////////////////////
                    {
                      path: "/fileUP",
                      component: () => <FileUP />,
                      auth: "a",
                    },
                  ].map((route, index) => {
                    if (userinfo[route.auth] === "Y" || route.auth === "a")
                      return (
                        <Route
                          path={route.path}
                          component={route.component}
                          key={index}
                        />
                      );
                    else return null;
                  })
                : null}
              <Route exact path="*" component={page404} />
            </Switch>
          </BrowserRouter>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Router;
