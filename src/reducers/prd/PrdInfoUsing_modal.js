export const ISVISIBLE_REG_MODAL = "PRD/USING/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "PRD/USING/ISVISIBLE_MOD_MODAL";

export const SELECTED_MOD_MODAL = "PRD/USING/SELECTED_MOD_MODAL";

export const DATASOURCE_REG_MODAL = "PRD/USING/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "PRD/USING/DATASOURCE_MOD_MODAL";

export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });

export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });


const initalState = {
    isvisible_register_modal: false,
    isvisible_modify_modal: false,
    selected_using_num_modify_modal: "",

    datasource_reg_modal:{},
    datasource_mod_modal:{},
};

const PrdInfoUsing_modal = (state = initalState, action) => {
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

        default:
            return state;
    }
};

export default PrdInfoUsing_modal;