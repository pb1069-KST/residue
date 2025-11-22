import { ISVISIBLE_REG_DRAWER } from "../doc/DocPrdArticle";

export const DATASOURCE = "PRD/PROP/DATASOURCE";

export const ISVISIBLE_SCH_MODAL = "PRD/PROP/ISVISIBLE_SCH_MODAL";
export const ISVISIBLE_REG_MODAL = "PRD/PROP/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "PRD/PROP/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "PRD/PROP/SELECTED_MOD_MODAL";

export const DATASOURCE_SCH_MODAL = "PRD/PROP/DATASOURCE_SCH_MODAL";
export const DATASOURCE_REG_MODAL = "PRD/PROP/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "PRD/PROP/DATASOURCE_MOD_MODAL";

export const DATASOURCE_REG_MODAL_MRL = "PRD/PROP/DATASOURCE_REG_MODAL_MRL";

export const DATASOURCE_REG_MODAL_MRL_NATION = "PRD/PROP/DATASOURCE_REG_MODAL_MRL_NATION";
export const DATASOURCE_REG_MODAL_MRL_STEP = "PRD/PROP/DATASOURCE_REG_MODAL_MRL_STEP";

export const DATASOURCE_SCH_MODAL_MRL = "PRD/PROP/DATASOURCE_SCH_MODAL_MRL";
export const DATASOURCE_SCH_MODAL_MRL_CURRENT = "PRD/PROP/DATASOURCE_SCH_MODAL_MRL_CURRENT";
export const DATASOURCE_SCH_MODAL_TEST = "PRD/PROP/DATASOURCE_SCH_MODAL_TEST";

export const ISVISIBLE_REG_DRAWER_PESTICIDE_NAME = "PRD/PROP/ISVISIBLE_REG_DRAWER_PESTICIDE_NAME";
export const ISVISIBLE_REG_DRAWER_FOOD_NAME = "PRD/PROP/ISVISIBLE_REG_DRAWER_FOOD_NAME";
export const ISVISIBLE_REG_DRAWER_ADI = "PRD/PROP/ISVISIBLE_REG_DRAWER_ADI";

export const ISVISIBLE_REG_DRAWER_MRL_NATION = "PRD/PROP/ISVISIBLE_REG_DRAWER_MRL_NATION";
export const ISVISIBLE_REG_DRAWER_MRL_STEP = "PRD/PROP/ISVISIBLE_REG_DRAWER_MRL_STEP";

export const SELECTED_MRL_NATION_IDX = "PRD/PROP/SELECTED_MRL_NATION_IDX";
export const SELECTED_MRL_STEP_IDX = "PRD/PROP/SELECTED_MRL_STEP_IDX";


export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });

export const setIsvisibleSchModal = isvisible_search_modal => ({ type: ISVISIBLE_SCH_MODAL, isvisible_search_modal });
export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceSchModal = datasource_sch_modal => ({ type: DATASOURCE_SCH_MODAL, datasource_sch_modal });
export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });

export const setDatasourceRegModalMrl = datasource_reg_modal_mrl => ({ type: DATASOURCE_REG_MODAL_MRL, datasource_reg_modal_mrl });

export const setDatasourceRegModalMrlNation = datasource_reg_modal_mrl_nation => ({ type: DATASOURCE_REG_MODAL_MRL_NATION, datasource_reg_modal_mrl_nation });
export const setDatasourceRegModalMrlStep = datasource_reg_modal_mrl_step => ({ type: DATASOURCE_REG_MODAL_MRL_STEP, datasource_reg_modal_mrl_step });

export const setDatasourceSchModalMRL = datasource_sch_modal_mrl => ({ type: DATASOURCE_SCH_MODAL_MRL, datasource_sch_modal_mrl });
export const setDatasourceSchModalMRLCurrent = datasource_sch_modal_mrl_current => ({ type: DATASOURCE_SCH_MODAL_MRL_CURRENT, datasource_sch_modal_mrl_current });
export const setDatasourceSchModalTest = datasource_sch_modal_test => ({ type: DATASOURCE_SCH_MODAL_TEST, datasource_sch_modal_test });

export const setIsvisibleRegDrawerPesticideName = isvisible_register_drawer_pesticide_name => ({ type: ISVISIBLE_REG_DRAWER_PESTICIDE_NAME, isvisible_register_drawer_pesticide_name });
export const setIsvisibleRegDrawerFoodName = isvisible_register_drawer_food_name => ({ type: ISVISIBLE_REG_DRAWER_FOOD_NAME, isvisible_register_drawer_food_name });
export const setIsvisibleRegDrawerADI = isvisible_register_drawer_ADI => ({ type: ISVISIBLE_REG_DRAWER_ADI, isvisible_register_drawer_ADI });

export const setIsvisibleRegDrawerMrlNation = isvisible_register_drawer_mrl_nation => ({ type: ISVISIBLE_REG_DRAWER_MRL_NATION, isvisible_register_drawer_mrl_nation });
export const setIsvisibleRegDrawerMrlStep = isvisible_register_drawer_mrl_step => ({ type: ISVISIBLE_REG_DRAWER_MRL_STEP, isvisible_register_drawer_mrl_step });

export const setSelectedMrlNationIdx = selected_mrl_nation_idx => ({ type: SELECTED_MRL_NATION_IDX, selected_mrl_nation_idx });
export const setSelectedMrlStepIdx = selected_mrl_step_idx => ({ type: SELECTED_MRL_STEP_IDX, selected_mrl_step_idx });


const initalState = {
    dataSource: [],
    isvisible_search_modal: false,
    isvisible_register_modal: false,
    isvisible_modify_modal: false,

    selected_using_num_modify_modal: "",

    datasource_sch_modal: {},    
    datasource_mod_modal: {},

    datasource_sch_modal_mrl: [],
    datasource_sch_modal_mrl_current: [],
    datasource_sch_modal_test: [],

    datasource_reg_modal: {},
    datasource_reg_modal_mrl: [],    
    datasource_reg_modal_mrl_nation: [],
    datasource_reg_modal_mrl_step: [],
    
    isvisible_register_drawer_pesticide_name: false,
    isvisible_register_drawer_food_name: false,
    isvisible_register_drawer_ADI: false,
    isvisible_register_drawer_mrl_nation: false,
    isvisible_register_drawer_mrl_step: false,

    selected_mrl_nation_idx: 0,
    selected_mrl_step_idx: 0,
};

const prdPropProp = (state = initalState, action) => {
    // console.log(action)
    switch (action.type) {
        case DATASOURCE:
            return {
                ...state,
                dataSource: action.dataSource
            };
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

        // 



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

        // 

        case DATASOURCE_REG_MODAL_MRL:
            return {
                ...state,
                datasource_reg_modal_mrl: action.datasource_reg_modal_mrl
            }
        case DATASOURCE_REG_MODAL_MRL_NATION:
            return {
                ...state,
                datasource_reg_modal_mrl_nation: action.datasource_reg_modal_mrl_nation
            }
        case DATASOURCE_REG_MODAL_MRL_STEP:
            return {
                ...state,
                datasource_reg_modal_mrl_step: action.datasource_reg_modal_mrl_step
            }

        case DATASOURCE_SCH_MODAL_MRL:
            return {
                ...state,
                datasource_sch_modal_mrl: action.datasource_sch_modal_mrl
            }
        case DATASOURCE_SCH_MODAL_MRL_CURRENT:
            return {
                ...state,
                datasource_sch_modal_mrl_current: action.datasource_sch_modal_mrl_current
            }
        case DATASOURCE_SCH_MODAL_TEST:
            return {
                ...state,
                datasource_sch_modal_test: action.datasource_sch_modal_test
            }


        //

        case ISVISIBLE_REG_DRAWER_PESTICIDE_NAME:
            return {
                ...state,
                isvisible_register_drawer_pesticide_name: action.isvisible_register_drawer_pesticide_name
            };
        case ISVISIBLE_REG_DRAWER_FOOD_NAME:
            return {
                ...state,
                isvisible_register_drawer_food_name: action.isvisible_register_drawer_food_name
            };
        case ISVISIBLE_REG_DRAWER_ADI:
            return {
                ...state,
                isvisible_register_drawer_adi: action.isvisible_register_drawer_adi
            };
        case ISVISIBLE_REG_DRAWER_MRL_NATION:
            return {
                ...state,
                isvisible_register_drawer_mrl_nation: action.isvisible_register_drawer_mrl_nation
            };
        case ISVISIBLE_REG_DRAWER_MRL_STEP:
            return {
                ...state,
                isvisible_register_drawer_mrl_step: action.isvisible_register_drawer_mrl_step
            };

        case SELECTED_MRL_NATION_IDX:
            return {
                ...state,
                selected_mrl_nation_idx: action.selected_mrl_nation_idx
            };
        case SELECTED_MRL_STEP_IDX:
            return {
                ...state,
                selected_mrl_step_idx: action.selected_mrl_step_idx
            };

        default:
            return state;
    }
};

export default prdPropProp;