export const ISVISIBLE_SCH_MODAL = "PRD/TEST/ISVISIBLE_SCH_MODAL";
export const ISVISIBLE_REG_MODAL = "PRD/TEST/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "PRD/TEST/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "PRD/TEST/SELECTED_MOD_MODAL";

export const DATASOURCE_SCH_MODAL = "PRD/TEST/DATASOURCE_SCH_MODAL";
export const DATASOURCE_SCH_MODAL_MRL = "PRD/TEST/DATASOURCE_SCH_MODAL_MRL";

export const DATASOURCE_REG_MODAL = "PRD/TEST/DATASOURCE_REG_MODAL";
export const DATASOURCE_REG_MODAL_MRL = "PRD/TEST/DATASOURCE_REG_MODAL_MRL";

export const DATASOURCE_MOD_MODAL = "PRD/TEST/DATASOURCE_MOD_MODAL";
export const DATASOURCE_MOD_MODAL_MRL = "PRD/TEST/DATASOURCE_MOD_MODAL_MRL";

export const DATASOURCE_REG_DRAWER = "PRD/TEST/DATASOURCE_REG_DRAWER";
export const ISVISIBLE_REG_DRAWER = "PRD/TEST/ISVISIBLE_REG_DRAWER";

export const DATASOURCE_MOD_DRAWER = "PRD/TEST/DATASOURCE_MOD_DRAWER";
export const ISVISIBLE_MOD_DRAWER = "PRD/TEST/ISVISIBLE_MOD_DRAWER";

export const setIsvisibleSchModal = isvisible_search_modal => ({ type: ISVISIBLE_SCH_MODAL, isvisible_search_modal });
export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceSchModal = datasource_sch_modal => ({ type: DATASOURCE_SCH_MODAL, datasource_sch_modal });
export const setDatasourceSchModalMrl = datasource_sch_modal_mrl => ({ type: DATASOURCE_SCH_MODAL_MRL, datasource_sch_modal_mrl });

export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceRegModalMrl = datasource_reg_modal_mrl => ({ type: DATASOURCE_REG_MODAL_MRL, datasource_reg_modal_mrl });

export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });
export const setDatasourceModModalMrl = datasource_mod_modal_mrl => ({ type: DATASOURCE_MOD_MODAL_MRL, datasource_mod_modal_mrl });

export const setDatasourceRegDrawer = datasource_reg_drawer => ({ type: DATASOURCE_REG_DRAWER, datasource_reg_drawer });
export const setIsvisibleRegDrawer = isvisible_register_drawer => ({ type: ISVISIBLE_REG_DRAWER, isvisible_register_drawer });

export const setDatasourceModDrawer = datasource_mod_drawer => ({ type: DATASOURCE_MOD_DRAWER, datasource_mod_drawer });
export const setIsvisibleModDrawer = isvisible_modify_drawer => ({ type: ISVISIBLE_MOD_DRAWER, isvisible_modify_drawer });


const initalState = {
    isvisible_search_modal: false,
    isvisible_register_modal: false,
    isvisible_modify_modal: false,
    selected_using_num_modify_modal: "",

    isvisible_register_drawer: false,
    isvisible_modify_drawer: false,

    datasource_sch_modal: {},
    datasource_sch_modal_mrl: [],

    datasource_reg_modal: {},
    datasource_reg_modal_mrl: [],
    datasource_mod_modal: {},
    datasource_mod_modal_mrl: [],
    
    datasource_reg_drawer: [],
    datasource_mod_drawer: [],
};

const prdTestReport = (state = initalState, action) => {
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
        case DATASOURCE_SCH_MODAL_MRL:
            return {
                ...state,
                datasource_sch_modal_mrl: action.datasource_sch_modal_mrl
            }

        case DATASOURCE_REG_MODAL:
            return {
                ...state,
                datasource_reg_modal: action.datasource_reg_modal
            }
        case DATASOURCE_REG_MODAL_MRL:
            return {
                ...state,
                datasource_reg_modal_mrl: action.datasource_reg_modal_mrl
            }
        case DATASOURCE_MOD_MODAL:
            return {
                ...state,
                datasource_mod_modal: action.datasource_mod_modal
            }
        case DATASOURCE_MOD_MODAL_MRL:
            return {
                ...state,
                datasource_mod_modal_mrl: action.datasource_mod_modal_mrl
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
            case ISVISIBLE_MOD_DRAWER:
                return {
                    ...state,
                    isvisible_modify_drawer: action.isvisible_modify_drawer
                }

        default:
            return state;
    }
};

export default prdTestReport;