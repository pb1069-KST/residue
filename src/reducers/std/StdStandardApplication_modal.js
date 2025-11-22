import { DATASOURCE_SCH_MODAL_DIV_REQ } from "./StdStandardStatus_modal";

export const ISVISIBLE_SCH_MODAL = "STD/APPLICATION/ISVISIBLE_SCH_MODAL";
export const ISVISIBLE_REG_MODAL = "STD/APPLICATION/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "STD/APPLICATION/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "STD/APPLICATION/SELECTED_MOD_MODAL";

export const DATASOURCE_SCH_MODAL = "STD/APPLICATION/DATASOURCE_SCH_MODAL";

export const DATASOURCE_REG_MODAL = "STD/APPLICATION/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "STD/APPLICATION/DATASOURCE_MOD_MODAL";

export const DATASOURCE_REG_DRAWER = "STD/APPLICATION/DATASOURCE_REG_DRAWER";
export const ISVISIBLE_REG_DRAWER = "STD/APPLICATION/ISVISIBLE_REG_DRAWER";

export const DATASOURCE_STD_VALUE = "STD/APPLICATION/DATASOURCE_STD_VALUE";

export const SELECTED_STD_VALUE_IDX = "STD/APPLICATION/SELECTED_STD_VALUE_IDX";

export const ISVISIBLE_REG_DRAWER_JUSO = "STD/APPLICATION/ISVISIBLE_REG_DRAWER_JUSO";
export const ISVISIBLE_MOD_DRAWER_JUSO = "STD/APPLICATION/ISVISIBLE_MOD_DRAWER_JUSO";

export const setIsvisibleSchModal = isvisible_search_modal => ({ type: ISVISIBLE_SCH_MODAL, isvisible_search_modal });
export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceSchModal = datasource_sch_modal => ({ type: DATASOURCE_SCH_MODAL, datasource_sch_modal });

export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });

export const setDatasourceRegDrawer = datasource_reg_drawer => ({ type: DATASOURCE_REG_DRAWER, datasource_reg_drawer });
export const setIsvisibleRegDrawer = isvisible_register_drawer => ({ type: ISVISIBLE_REG_DRAWER, isvisible_register_drawer });

export const setDatasourceStdValue = datasource_std_value => ({ type: DATASOURCE_STD_VALUE, datasource_std_value });

export const setSelectedStdValueIdx = selected_std_value_idx => ({ type: SELECTED_STD_VALUE_IDX, selected_std_value_idx });

export const setIsvisibleRegDrawerJuso = isvisible_register_drawer_juso => ({ type: ISVISIBLE_REG_DRAWER_JUSO, isvisible_register_drawer_juso });
export const setIsvisibleModDrawerJuso = isvisible_modify_drawer_juso => ({ type: ISVISIBLE_MOD_DRAWER_JUSO, isvisible_modify_drawer_juso });

const initalState = {
    isvisible_search_modal:false,
    isvisible_register_modal: false,
    isvisible_modify_modal: false,
    selected_using_num_modify_modal: "",

    isvisible_register_drawer:false,

    datasource_sch_modal:{},    

    datasource_reg_modal:{},
    datasource_mod_modal:{},
    
    datasource_reg_drawer:[],

    datasource_std_value:[
        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},

        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},
        {STD_NUM:null,STD_NAME:null,FLAG:false},
    ],

    selected_std_value_idx:null,

    isvisible_register_drawer_juso:false,
    isvisible_modify_drawer_juso:false,
};

const StdStandardApplication = (state = initalState, action) => {
    // console.log(action)
    switch (action.type) {
        case ISVISIBLE_SCH_MODAL:
            return {
                ...state,
                isvisible_search_modal: action.isvisible_search_modal
            };    
        case ISVISIBLE_REG_MODAL:
            return {
                ...state,
                isvisible_register_modal: action.isvisible_register_modal
            };
        case ISVISIBLE_MOD_MODAL:
            return {
                ...state,
                isvisible_modify_modal: action.isvisible_modify_modal
            };

        case DATASOURCE_SCH_MODAL:
            return {
                ...state,
                datasource_sch_modal: action.datasource_sch_modal
            }
        
        case DATASOURCE_REG_MODAL:
            return {
                ...state,
                datasource_reg_modal: action.datasource_reg_modal
            }
        case DATASOURCE_MOD_MODAL:
            return {
                ...state,
                datasource_mod_modal: action.datasource_mod_modal
            }

        case DATASOURCE_REG_DRAWER:
            return {
                ...state,
                datasource_reg_drawer: action.datasource_reg_drawer
            }
        case ISVISIBLE_REG_DRAWER:
            return {
                ...state,
                isvisible_register_drawer: action.isvisible_register_drawer
            }
        case DATASOURCE_STD_VALUE:
            return {
                ...state,
                datasource_std_value: action.datasource_std_value
            }
        case SELECTED_STD_VALUE_IDX:
            return {
                ...state,
                selected_std_value_idx: action.selected_std_value_idx
            }
        case ISVISIBLE_REG_DRAWER_JUSO:
            return {
                ...state,
                isvisible_register_drawer_juso: action.isvisible_register_drawer_juso
            }
        case ISVISIBLE_MOD_DRAWER_JUSO:
            return {
                ...state,
                isvisible_modify_drawer_juso: action.isvisible_modify_drawer_juso
            }

        default:
            return state;
    }
};

export default StdStandardApplication;