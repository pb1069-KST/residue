export const DATASOURCE = "PRD/INFO/DATASOURCE";
export const SELECTED_DATA = "PRD/INFO/SELECTED_DATA";

export const ISVISIBLE_SCH_MODAL = "PRD/INFO/ISVISIBLE_SCH_MODAL";
export const ISVISIBLE_REG_MODAL = "PRD/INFO/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "PRD/INFO/ISVISIBLE_MOD_MODAL";

export const DATASOURCE_SCH_MODAL = "PRD/INFO/DATASOURCE_SCH_MODAL";
export const DATASOURCE_SCH_MODAL_MRL = "PRD/INFO/DATASOURCE_SCH_MODAL_MRL";
export const DATASOURCE_REG_MODAL = "PRD/INFO/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "PRD/INFO/DATASOURCE_MOD_MODAL";
export const DATASOURCE_MOD_MODAL_ORG = "PRD/INFO/DATASOURCE_MOD_MODAL_ORG";

export const USING_ARRAY = "PRD/INFO/USING_ARRAY";

export const setUsingArray = (usingArray) => ({
  type: USING_ARRAY,
  usingArray,
});

export const setDataSource = (dataSource) => ({ type: DATASOURCE, dataSource });

export const setSelectedData = (selectedData) => ({
  type: SELECTED_DATA,
  selectedData,
});

export const setIsvisibleSchModal = (isvisible_search_modal) => ({
  type: ISVISIBLE_SCH_MODAL,
  isvisible_search_modal,
});
export const setIsvisibleRegModal = (isvisible_register_modal) => ({
  type: ISVISIBLE_REG_MODAL,
  isvisible_register_modal,
});
export const setIsvisibleModModal = (isvisible_modify_modal) => ({
  type: ISVISIBLE_MOD_MODAL,
  isvisible_modify_modal,
});

export const setDatasourceSchModal = (datasource_sch_modal) => ({
  type: DATASOURCE_SCH_MODAL,
  datasource_sch_modal,
});
export const setDatasourceSchModalMrl = (datasource_sch_modal_mrl) => ({
  type: DATASOURCE_SCH_MODAL_MRL,
  datasource_sch_modal_mrl,
});
export const setDatasourceRegModal = (datasource_reg_modal) => ({
  type: DATASOURCE_REG_MODAL,
  datasource_reg_modal,
});
export const setDatasourceModModal = (datasource_mod_modal) => ({
  type: DATASOURCE_MOD_MODAL,
  datasource_mod_modal,
});

export const setDatasourceModModalOrg = (datasource_mod_modal_org) => ({
  type: DATASOURCE_MOD_MODAL_ORG,
  datasource_mod_modal_org,
});

const initalState = {
  dataSource: [],
  usingArray: [],

  selectedData: {},

  isvisible_search_modal: false,
  isvisible_register_modal: false,
  isvisible_modify_modal: false,

  datasource_sch_modal: {},
  datasource_sch_modal_mrl: {},
  datasource_reg_modal: {},
  datasource_mod_modal: {},

  datasource_mod_modal_org: {},
};

const PrdInfoInfo = (state = initalState, action) => {
  // console.log(action)
  switch (action.type) {
    case DATASOURCE:
      return {
        ...state,
        dataSource: action.dataSource,
      };
    case USING_ARRAY:
      return {
        ...state,
        usingArray: action.usingArray,
      };

    case SELECTED_DATA:
      return {
        ...state,
        selectedData: action.selectedData,
      };

    case ISVISIBLE_SCH_MODAL:
      return {
        ...state,
        isvisible_search_modal: action.isvisible_search_modal,
      };
    case ISVISIBLE_REG_MODAL:
      return {
        ...state,
        isvisible_register_modal: action.isvisible_register_modal,
      };
    case ISVISIBLE_MOD_MODAL:
      return {
        ...state,
        isvisible_modify_modal: action.isvisible_modify_modal,
      };

    case DATASOURCE_SCH_MODAL:
      return {
        ...state,
        datasource_sch_modal: action.datasource_sch_modal,
      };
    case DATASOURCE_SCH_MODAL_MRL:
      return {
        ...state,
        datasource_sch_modal_mrl: action.datasource_sch_modal_mrl,
      };
    case DATASOURCE_REG_MODAL:
      return {
        ...state,
        datasource_reg_modal: action.datasource_reg_modal,
      };
    case DATASOURCE_MOD_MODAL:
      return {
        ...state,
        datasource_mod_modal: action.datasource_mod_modal,
      };
    case DATASOURCE_MOD_MODAL_ORG:
      return {
        ...state,
        datasource_mod_modal_org: action.datasource_mod_modal_org,
      };

    default:
      return state;
  }
};

export default PrdInfoInfo;
