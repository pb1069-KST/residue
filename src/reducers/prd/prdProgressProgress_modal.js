export const ISVISIBLE_REG_MODAL = "PRD/PROGRESS/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "PRD/PROGRESS/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "PRD/PROGRESS/SELECTED_MOD_MODAL";

export const DATASOURCE_REG_MODAL = "PRD/PROGRESS/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "PRD/PROGRESS/DATASOURCE_MOD_MODAL";

export const DATASOURCE_REG_DRAWER = "PRD/PROGRESS/DATASOURCE_REG_DRAWER";
export const ISVISIBLE_REG_DRAWER = "PRD/PROGRESS/ISVISIBLE_REG_DRAWER";


export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });

export const setDatasourceRegDrawer = datasource_reg_drawer => ({ type: DATASOURCE_REG_DRAWER, datasource_reg_drawer });
export const setIsvisibleRegDrawer = isvisible_register_drawer => ({ type: ISVISIBLE_REG_DRAWER, isvisible_register_drawer });


const initalState = {
    isvisible_register_modal: false,
    isvisible_modify_modal: false,
    selected_using_num_modify_modal: "",

    isvisible_register_drawer:false,

    datasource_reg_modal:{},
    datasource_mod_modal:{},
    
    datasource_reg_drawer:[],    
};

const prdProgressProgress_modal = (state = initalState, action) => {
    // console.log(action)
    switch (action.type) {
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

        default:
            return state;
    }
};

export default prdProgressProgress_modal;