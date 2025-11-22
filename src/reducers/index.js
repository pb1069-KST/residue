import { combineReducers } from "redux";
import header from "./header/header";
import util from "./util/util";

import PrdInfoInfo from "./prd/PrdInfoInfo";
import PrdInfoUsing from "./prd/PrdInfoUsing";
import PrdInfoAdi from "./prd/PrdInfoAdi";

import PrdInfoUsing_modal from "./prd/PrdInfoUsing_modal";
import PrdInfoAdi_modal from "./prd/PrdInfoAdi_modal";

import prdMrlMrl from "./prd/prdMrlMrl";
import prdMrlMrl_modal from "./prd/prdMrlMrl_modal";
import prdMrlFood from "./prd/prdMrlFood";

import prdMrlFood_modal from "./prd/prdMrlFood_modal";

import prdPropProp from "./prd/prdPropProp";

import prdTestReport from "./prd/prdTestReport";
import prdTestReport_modal from "./prd/prdTestReport_modal";

import prdAnalysisAnalysis from "./prd/prdAnalysisAnalysis";
import prdAnalysisAnalysis_modal from "./prd/prdAnalysisAnalysis_modal";

import prdProgressProgress from "./prd/prdProgressProgress";
import prdProgressProgress_modal from "./prd/prdProgressProgress_modal";
// ///////////////////////////////////
import VdInfoInfo from "./vd/VdInfoInfo";
import VdInfoUsing from "./vd/VdInfoUsing";
import VdInfoUsing_modal from "./vd/VdInfoUsing_modal";

import VdInfoAdi from "./vd/VdInfoAdi";
import VdInfoAdi_modal from "./vd/VdInfoAdi_modal";

import VdMrlMrl from "./vd/VdMrlMrl";
import VdMrlMrl_modal from "./vd/VdMrlMrl_modal";
import VdMrlFood from "./vd/VdMrlFood";

import VdMrlFood_modal from "./vd/VdMrlFood_modal";

import VdAnalysisAnalysis from "./vd/VdAnalysisAnalysis";
import VdAnalysisAnalysis_modal from "./vd/VdAnalysisAnalysis_modal";
// ///////////////////////////////////

import StdStandardStatus from "./std/StdStandardStatus";
import StdStandardApplication from "./std/StdStandardApplication";
import StdStandardApplication_modal from "./std/StdStandardApplication_modal";
import StdStandardInput from "./std/StdStandardInput";
import StdStandardEtc from "./std/StdStandardEtc";
// ///////////////////////////////////
import StdStandardStatus_modal from "./std/StdStandardStatus_modal";
// ///////////////////////////////////

import DocPrdArticle from "./doc/DocPrdArticle";
import DocVdArticle from "./doc/DocVdArticle";
import DocPrdRelated from "./doc/DocPrdRelated";
import DocVdRelated from "./doc/DocVdRelated";
// ///////////////////////////////////

import AdminAdminUser from "./admin/AdminAdminUser";
import AdminAdminAuth from "./admin/AdminAdminAuth";

const rootReducer = combineReducers({
  header,
  //
  PrdInfoInfo,
  PrdInfoUsing,
  PrdInfoAdi,

  PrdInfoUsing_modal,
  PrdInfoAdi_modal,

  prdMrlMrl,
  prdMrlMrl_modal,
  prdMrlFood,

  prdMrlFood_modal,

  prdPropProp,

  prdTestReport,
  prdTestReport_modal,

  prdAnalysisAnalysis,

  prdAnalysisAnalysis_modal,

  prdProgressProgress,
  prdProgressProgress_modal,

  //
  VdInfoInfo,
  VdInfoUsing,
  VdInfoAdi,
  VdMrlFood,
  VdAnalysisAnalysis,
  VdAnalysisAnalysis_modal,
  //
  VdInfoUsing_modal,
  VdInfoAdi_modal,
  VdMrlFood_modal,
  VdMrlMrl,
  VdMrlMrl_modal,
  //
  StdStandardStatus,
  StdStandardApplication,
  StdStandardApplication_modal,
  StdStandardInput,
  StdStandardEtc,
  //
  StdStandardStatus_modal,
  //
  DocPrdArticle,
  DocVdArticle,
  DocPrdRelated,
  DocVdRelated,
  //
  AdminAdminUser,
  AdminAdminAuth,

  util,
});

export default rootReducer;
