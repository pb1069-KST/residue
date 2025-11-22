export const ISVISIBLE_MOD_MODAL = "PRD/MRL/ISVISIBLE_MOD_MODAL";
export const setIsvisibleModModal = (isvisible_modify_modal) => ({
  type: ISVISIBLE_MOD_MODAL,
  isvisible_modify_modal,
});

export const ISVISIBLE_SCH_MODAL = "PRD/MRL/ISVISIBLE_SCH_MODAL";
export const setIsvisibleSchModal = (isvisible_search_modal) => ({
  type: ISVISIBLE_SCH_MODAL,
  isvisible_search_modal,
});
export const ISVISIBLE_SCH_MODAL_FOOD = "PRD/MRL/ISVISIBLE_SCH_MODAL_FOOD";
export const setIsvisibleSchModalFood = (isvisible_search_modal_food) => ({
  type: ISVISIBLE_SCH_MODAL_FOOD,
  isvisible_search_modal_food,
});

export const ISVISIBLE_MOD_MODAL_ADD_INFO =
  "PRD/MRL/ISVISIBLE_MOD_MODAL_ADD_INFO";
export const setIsvisibleModModalAddInfo = (
  isvisible_modify_modal_add_info
) => ({ type: ISVISIBLE_MOD_MODAL_ADD_INFO, isvisible_modify_modal_add_info });

export const ISVISIBLE_MOD_MODAL_ADD_INFO2 =
  "PRD/MRL/ISVISIBLE_MOD_MODAL_ADD_INFO2";
export const setIsvisibleModModalAddInfo2 = (
  isvisible_modify_modal_add_info2
) => ({
  type: ISVISIBLE_MOD_MODAL_ADD_INFO2,
  isvisible_modify_modal_add_info2,
});

export const ISVISIBLE_MOD_DRAWER = "PRD/MRL/ISVISIBLE_MOD_DRAWER";
export const setIsvisibleModDrawer = (isvisible_modify_drawer) => ({
  type: ISVISIBLE_MOD_DRAWER,
  isvisible_modify_drawer,
});

export const DATASOURCE_MOD_MODAL = "PRD/MRL/DATASOURCE_MOD_MODAL";
export const setDatasourceModModal = (datasource_mod_modal) => ({
  type: DATASOURCE_MOD_MODAL,
  datasource_mod_modal,
});

export const SELECTED_DATA = "PRD/MRL/SELECTED_DATA";
export const setSelectedData = (selected_data) => ({
  type: SELECTED_DATA,
  selected_data,
});

export const ISVISIBLE_MOD_DRAWER_REG = "PRD/MRL/ISVISIBLE_MOD_DRAWER_REG";
export const setIsvisibleModDrawerReg = (isvisible_modify_drawer_reg) => ({
  type: ISVISIBLE_MOD_DRAWER_REG,
  isvisible_modify_drawer_reg,
});

export const ISVISIBLE_MOD_DRAWER_MOD = "PRD/MRL/ISVISIBLE_MOD_DRAWER_MOD";
export const setIsvisibleModDrawerMod = (isvisible_modify_drawer_mod) => ({
  type: ISVISIBLE_MOD_DRAWER_MOD,
  isvisible_modify_drawer_mod,
});

export const SELECTED_MODAL_DATA = "PRD/MRL/SELECTED_MODAL_DATA";
export const setSelectedModalData = (selected_modal_data) => ({
  type: SELECTED_MODAL_DATA,
  selected_modal_data,
});

const initalState = {
  selected_data: "",

  isvisible_modify_modal_add_info: false,
  isvisible_modify_modal_add_info2: false,

  isvisible_search_modal: false,
  isvisible_modify_modal: false,
  isvisible_modify_drawer: false,

  isvisible_search_modal_food: false,

  datasource_mod_modal: [],

  isvisible_modify_drawer_reg: false,
  isvisible_modify_drawer_mod: false,

  selected_modal_data: {},
};

const prdMrlMrl = (state = initalState, action) => {
  // console.log(action)
  switch (action.type) {
    case ISVISIBLE_MOD_MODAL:
      return {
        ...state,
        isvisible_modify_modal: action.isvisible_modify_modal,
      };
    case ISVISIBLE_SCH_MODAL:
      return {
        ...state,
        isvisible_search_modal: action.isvisible_search_modal,
      };
    case ISVISIBLE_SCH_MODAL_FOOD:
      return {
        ...state,
        isvisible_search_modal_food: action.isvisible_search_modal_food,
      };
    case DATASOURCE_MOD_MODAL:
      return {
        ...state,
        datasource_mod_modal: action.datasource_mod_modal,
      };
    case ISVISIBLE_MOD_MODAL_ADD_INFO:
      return {
        ...state,
        isvisible_modify_modal_add_info: action.isvisible_modify_modal_add_info,
      };
    case ISVISIBLE_MOD_MODAL_ADD_INFO2:
      return {
        ...state,
        isvisible_modify_modal_add_info2:
          action.isvisible_modify_modal_add_info2,
      };

    case SELECTED_DATA:
      return {
        ...state,
        selected_data: action.selected_data,
      };

    case ISVISIBLE_MOD_DRAWER:
      return {
        ...state,
        isvisible_modify_drawer: action.isvisible_modify_drawer,
      };
    case ISVISIBLE_MOD_DRAWER_REG:
      return {
        ...state,
        isvisible_modify_drawer_reg: action.isvisible_modify_drawer_reg,
      };
    case ISVISIBLE_MOD_DRAWER_MOD:
      return {
        ...state,
        isvisible_modify_drawer_mod: action.isvisible_modify_drawer_mod,
      };
    case SELECTED_MODAL_DATA:
      return {
        ...state,
        selected_modal_data: action.selected_modal_data,
      };

    default:
      return state;
  }
};

export default prdMrlMrl;
