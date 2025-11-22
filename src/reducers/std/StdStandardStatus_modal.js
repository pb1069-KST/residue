export const ISVISIBLE_SCH_MODAL = "STD/STANDARD/ISVISIBLE_SCH_MODAL";
export const ISVISIBLE_REG_MODAL = "STD/STANDARD/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "STD/STANDARD/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "STD/STANDARD/SELECTED_MOD_MODAL";

export const DATASOURCE_SCH_MODAL = "STD/STANDARD/DATASOURCE_SCH_MODAL";
export const DATASOURCE_SCH_MODAL_DIV_REQ = "STD/APPLICATION/DATASOURCE_SCH_MODAL_DIV_REQ";

export const DATASOURCE_REG_MODAL = "STD/STANDARD/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "STD/STANDARD/DATASOURCE_MOD_MODAL";

export const ISVISIBLE_REG_DRAWER_STD_NAME = "STD/STANDARD/ISVISIBLE_REG_DRAWER_STD_NAME";
export const ISVISIBLE_REG_DRAWER_COMPANY_NAME = "STD/STANDARD/ISVISIBLE_REG_DRAWER_COMPANY_NAME";

export const ISVISIBLE_MOD_DRAWER_STD_NAME = "STD/STANDARD/ISVISIBLE_MOD_DRAWER_STD_NAME";
export const ISVISIBLE_MOD_DRAWER_COMPANY_NAME = "STD/STANDARD/ISVISIBLE_MOD_DRAWER_COMPANY_NAME";


export const setIsvisibleSchModal = isvisible_search_modal => ({ type: ISVISIBLE_SCH_MODAL, isvisible_search_modal });
export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceSchModal = datasource_sch_modal => ({ type: DATASOURCE_SCH_MODAL, datasource_sch_modal });
export const setDatasourceSchModalDivReq = datasource_sch_modal_div_req => ({ type: DATASOURCE_SCH_MODAL_DIV_REQ, datasource_sch_modal_div_req });

export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });

export const setIsvisibleRegDrawerStdName = isvisible_register_drawer_std_name => ({ type: ISVISIBLE_REG_DRAWER_STD_NAME, isvisible_register_drawer_std_name });
export const setIsvisibleRegDrawerCompanyName = isvisible_register_drawer_company_name => ({ type: ISVISIBLE_REG_DRAWER_COMPANY_NAME, isvisible_register_drawer_company_name });

export const setIsvisibleModDrawerStdName = isvisible_modify_drawer_std_name => ({ type: ISVISIBLE_MOD_DRAWER_STD_NAME, isvisible_modify_drawer_std_name });
export const setIsvisibleModDrawerCompanyName = isvisible_modify_drawer_company_name => ({ type: ISVISIBLE_MOD_DRAWER_COMPANY_NAME, isvisible_modify_drawer_company_name });


const initalState = {
    isvisible_search_modal:false,
    isvisible_register_modal: false,
    isvisible_modify_modal: false,
    selected_using_num_modify_modal: "",

    datasource_sch_modal:{},
    datasource_sch_modal_div_req:[],

    datasource_reg_modal:{},
    datasource_mod_modal:{},
    
    isvisible_register_drawer_company_name:false,
    isvisible_register_drawer_std_name:false,

    isvisible_modify_drawer_company_name:false,
    isvisible_modify_drawer_std_name:false,
};

const StdStandardStatus_modal = (state = initalState, action) => {
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
        case DATASOURCE_SCH_MODAL_DIV_REQ:
            return {
                ...state,
                datasource_sch_modal_div_req: action.datasource_sch_modal_div_req
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
        
        case ISVISIBLE_REG_DRAWER_STD_NAME:
            return {
                ...state,
                isvisible_register_drawer_std_name: action.isvisible_register_drawer_std_name
            }
        case ISVISIBLE_REG_DRAWER_COMPANY_NAME:
            return {
                ...state,
                isvisible_register_drawer_company_name: action.isvisible_register_drawer_company_name
            }    

        case ISVISIBLE_MOD_DRAWER_STD_NAME:
            return {
                ...state,
                isvisible_modify_drawer_std_name: action.isvisible_modify_drawer_std_name
            }
        case ISVISIBLE_MOD_DRAWER_COMPANY_NAME:
            return {
                ...state,
                isvisible_modify_drawer_company_name: action.isvisible_modify_drawer_company_name
            }

        default:
            return state;
    }
};

export default StdStandardStatus_modal;