export const ISVISIBLE_REG_MODAL = "PRD/FOOD/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "PRD/FOOD/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "PRD/FOOD/SELECTED_MOD_MODAL";

export const DATASOURCE_REG_MODAL = "PRD/FOOD/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "PRD/FOOD/DATASOURCE_MOD_MODAL";

export const DATASOURCE_CLASS_L = "PRD/FOOD/DATASOURCE_CLASS_L";
export const DATASOURCE_CLASS_M = "PRD/FOOD/DATASOURCE_CLASS_M";
export const DATASOURCE_CLASS_S = "PRD/FOOD/DATASOURCE_CLASS_S";

export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });

export const setDatasourceClassL = datasource_class_L => ({ type: DATASOURCE_CLASS_L, datasource_class_L });
export const setDatasourceClassM = datasource_class_M => ({ type: DATASOURCE_CLASS_M, datasource_class_M });
export const setDatasourceClassS = datasource_class_S => ({ type: DATASOURCE_CLASS_S, datasource_class_S });


const initalState = {
    isvisible_register_modal: false,
    isvisible_modify_modal: false,
    selected_using_num_modify_modal: "",

    datasource_reg_modal:{
        FOOD_CODE:"",
        CLASS_L_CODE:"",
        CLASS_M_CODE:"",
        CLASS_S_CODE:"",

        FOOD_NAME_KR:"",
        FOOD_NAME_EN:"",

        DELETE_FLAG:"N",
        APPLY_FLAG:"N",
        HEADER_FLAG:"N",
        FOOTER_FLAG:"N",
        
        FOOD_INTAKE:"",
        FOOD_NAME_CH_DATE:"",
    },
    datasource_mod_modal:{},

    datasource_class_L:[],
    datasource_class_M:[],
    datasource_class_S:[],
};

const prdMrlFood_modal = (state = initalState, action) => {
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
        case DATASOURCE_CLASS_L:
            return {
                ...state,
                datasource_class_L: action.datasource_class_L
            }
        case DATASOURCE_CLASS_M:
            return {
                ...state,
                datasource_class_M: action.datasource_class_M
            }
        case DATASOURCE_CLASS_S:
            return {
                ...state,
                datasource_class_S: action.datasource_class_S
            }

        default:
            return state;
    }
};

export default prdMrlFood_modal;