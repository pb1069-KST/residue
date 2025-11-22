export const ISVISIBLE_REG_MODAL = "VD/ADI/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "VD/ADI/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "VD/ADI/SELECTED_MOD_MODAL";

export const DATASOURCE_REG_MODAL = "VD/ADI/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "VD/ADI/DATASOURCE_MOD_MODAL";

export const SELECTED_DATA = "VD/ADI/SELECTED_DATA";


export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });

export const setSelectedData = selected_data => ({ type: SELECTED_DATA, selected_data });


const initalState = {
    isvisible_register_modal: false,
    isvisible_modify_modal: false,
    selected_using_num_modify_modal: "",

    datasource_reg_modal:{},
    datasource_mod_modal:{},

    selected_data:"",
};

const VdInfoAdi_modal = (state = initalState, action) => {
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
        case SELECTED_DATA:
            return {
                ...state,
                selected_data: action.selected_data
            }

        default:
            return state;
    }
};

export default VdInfoAdi_modal;