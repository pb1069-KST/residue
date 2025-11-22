export const DATASOURCE = "STD/ETC/DATASOURCE";
export const DATASOURCE2 = "STD/ETC/DATASOURCE2";
export const DATASOURCE3 = "STD/ETC/DATASOURCE3";
export const DATASOURCE4 = "STD/ETC/DATASOURCE4";

export const ISVISIBLE_SCH_MODAL = "STD/ETC/ISVISIBLE_SCH_MODAL";
export const ISVISIBLE_REG_MODAL = "STD/ETC/ISVISIBLE_REG_MODAL";
export const ISVISIBLE_MOD_MODAL = "STD/ETC/ISVISIBLE_MOD_MODAL";

export const ISVISIBLE_REG_MODAL2 = "STD/ETC/ISVISIBLE_REG_MODAL2";
export const ISVISIBLE_MOD_MODAL2 = "STD/ETC/ISVISIBLE_MOD_MODAL2";

export const ISVISIBLE_REG_MODAL3 = "STD/ETC/ISVISIBLE_REG_MODAL3";
export const ISVISIBLE_MOD_MODAL3 = "STD/ETC/ISVISIBLE_MOD_MODAL3";

export const ISVISIBLE_REG_MODAL4 = "STD/ETC/ISVISIBLE_REG_MODAL3";
export const ISVISIBLE_MOD_MODAL4 = "STD/ETC/ISVISIBLE_MOD_MODAL3";

export const SELECTED_MOD_MODAL = "STD/ETC/SELECTED_MOD_MODAL";

export const DATASOURCE_SCH_MODAL = "STD/ETC/DATASOURCE_SCH_MODAL";
export const DATASOURCE_REG_MODAL = "STD/ETC/DATASOURCE_REG_MODAL";
export const DATASOURCE_MOD_MODAL = "STD/ETC/DATASOURCE_MOD_MODAL";

export const DATASOURCE_SCH_MODAL2 = "STD/ETC/DATASOURCE_SCH_MODAL2";
export const DATASOURCE_REG_MODAL2 = "STD/ETC/DATASOURCE_REG_MODAL2";
export const DATASOURCE_MOD_MODAL2 = "STD/ETC/DATASOURCE_MOD_MODAL2";

export const DATASOURCE_SCH_MODAL3 = "STD/ETC/DATASOURCE_SCH_MODAL3";
export const DATASOURCE_REG_MODAL3 = "STD/ETC/DATASOURCE_REG_MODAL3";
export const DATASOURCE_MOD_MODAL3 = "STD/ETC/DATASOURCE_MOD_MODAL3";

export const DATASOURCE_SCH_MODAL4 = "STD/ETC/DATASOURCE_SCH_MODAL3";
export const DATASOURCE_REG_MODAL4 = "STD/ETC/DATASOURCE_REG_MODAL3";
export const DATASOURCE_MOD_MODAL4 = "STD/ETC/DATASOURCE_MOD_MODAL3";

export const DATASOURCE_REG_DRAWER = "STD/ETC/DATASOURCE_REG_DRAWER";
export const ISVISIBLE_REG_DRAWER = "STD/ETC/ISVISIBLE_REG_DRAWER";

export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });
export const setDataSource2 = dataSource2 => ({ type: DATASOURCE2, dataSource2 });
export const setDataSource3 = dataSource3 => ({ type: DATASOURCE3, dataSource3 });
export const setDataSource4 = dataSource4 => ({ type: DATASOURCE4, dataSource4 });

export const setIsvisibleSchModal = isvisible_search_modal => ({ type: ISVISIBLE_SCH_MODAL, isvisible_search_modal });
//제조회사
export const setIsvisibleRegModal = isvisible_register_modal => ({ type: ISVISIBLE_REG_MODAL, isvisible_register_modal });
export const setIsvisibleModModal = isvisible_modify_modal => ({ type: ISVISIBLE_MOD_MODAL, isvisible_modify_modal });
//상태
export const setIsvisibleRegModal2 = isvisible_register_modal2 => ({ type: ISVISIBLE_REG_MODAL2, isvisible_register_modal2 });
export const setIsvisibleModModal2 = isvisible_modify_modal2 => ({ type: ISVISIBLE_MOD_MODAL2, isvisible_modify_modal2 });
//단위
export const setIsvisibleRegModal3 = isvisible_register_modal3 => ({ type: ISVISIBLE_REG_MODAL3, isvisible_register_modal3 });
export const setIsvisibleModModal3 = isvisible_modify_modal3 => ({ type: ISVISIBLE_MOD_MODAL3, isvisible_modify_modal3 });
//소속
export const setIsvisibleRegModal4 = isvisible_register_modal4 => ({ type: ISVISIBLE_REG_MODAL4, isvisible_register_modal4 });
export const setIsvisibleModModal4 = isvisible_modify_modal4 => ({ type: ISVISIBLE_MOD_MODAL4, isvisible_modify_modal4 });

export const setDatasourceSchModal = datasource_sch_modal => ({ type: DATASOURCE_SCH_MODAL, datasource_sch_modal });
export const setDatasourceRegModal = datasource_reg_modal => ({ type: DATASOURCE_REG_MODAL, datasource_reg_modal });
export const setDatasourceModModal = datasource_mod_modal => ({ type: DATASOURCE_MOD_MODAL, datasource_mod_modal });

export const setDatasourceSchModal2 = datasource_sch_modal2 => ({ type: DATASOURCE_SCH_MODAL2, datasource_sch_modal2 });
export const setDatasourceRegModal2 = datasource_reg_modal2 => ({ type: DATASOURCE_REG_MODAL2, datasource_reg_modal2 });
export const setDatasourceModModal2 = datasource_mod_modal2 => ({ type: DATASOURCE_MOD_MODAL2, datasource_mod_modal2 });

export const setDatasourceSchModal3 = datasource_sch_modal3 => ({ type: DATASOURCE_SCH_MODAL3, datasource_sch_modal3 });
export const setDatasourceRegModal3 = datasource_reg_modal3 => ({ type: DATASOURCE_REG_MODAL3, datasource_reg_modal3 });
export const setDatasourceModModal3 = datasource_mod_modal3 => ({ type: DATASOURCE_MOD_MODAL3, datasource_mod_modal3 });

export const setDatasourceSchModal4 = datasource_sch_modal4 => ({ type: DATASOURCE_SCH_MODAL4, datasource_sch_modal4 });
export const setDatasourceRegModal4 = datasource_reg_modal4 => ({ type: DATASOURCE_REG_MODAL4, datasource_reg_modal4 });
export const setDatasourceModModal4 = datasource_mod_modal4 => ({ type: DATASOURCE_MOD_MODAL4, datasource_mod_modal4 });

export const setDatasourceRegDrawer = datasource_reg_drawer => ({ type: DATASOURCE_REG_DRAWER, datasource_reg_drawer });
export const setIsvisibleRegDrawer = isvisible_register_drawer => ({ type: ISVISIBLE_REG_DRAWER, isvisible_register_drawer });


const initalState = {
    dataSource: [],
    dataSource2: [],
    dataSource3: [],
    isvisible_search_modal: false,
    isvisible_register_modal: false,

    isvisible_modify_modal: false,
    isvisible_register_modal2: false,

    isvisible_modify_modal2: false,
    isvisible_register_modal3: false,

    isvisible_modify_modal3: false,
    isvisible_register_modal3: false,

    isvisible_modify_modal4: false,
    isvisible_register_modal4: false,

    selected_using_num_modify_modal: "",

    isvisible_register_drawer: false,

    datasource_sch_modal: {},
    datasource_reg_modal: {},
    datasource_mod_modal: {},

    datasource_sch_modal2: {},
    datasource_reg_modal2: {},
    datasource_mod_modal2: {},

    datasource_sch_modal3: {},
    datasource_reg_modal3: {},
    datasource_mod_modal3: {},

    datasource_sch_modal4: {},
    datasource_reg_modal4: {},
    datasource_mod_modal4: {},

    datasource_reg_drawer: [],
};

const StdStandardEtc = (state = initalState, action) => {
    // console.log(action)
    switch (action.type) {
        case DATASOURCE:
            return {
                ...state,
                dataSource: action.dataSource
            };
        case DATASOURCE2:
            return {
                ...state,
                dataSource2: action.dataSource2
            };
        case DATASOURCE3:
            return {
                ...state,
                dataSource3: action.dataSource3
            };
        case DATASOURCE4:
            return {
                ...state,
                dataSource3: action.dataSource3
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


        case ISVISIBLE_REG_MODAL2:
            return {
                ...state,
                isvisible_register_modal2: action.isvisible_register_modal2
            };
        case ISVISIBLE_MOD_MODAL2:
            return {
                ...state,
                isvisible_modify_modal2: action.isvisible_modify_modal2
            };

        case ISVISIBLE_REG_MODAL3:
            return {
                ...state,
                isvisible_register_modal3: action.isvisible_register_modal3
            };
        case ISVISIBLE_MOD_MODAL3:
            return {
                ...state,
                isvisible_modify_modal3: action.isvisible_modify_modal3
            };
            case ISVISIBLE_REG_MODAL4:
                return {
                    ...state,
                    isvisible_register_modal4: action.isvisible_register_modal4
                };
            case ISVISIBLE_MOD_MODAL4:
                return {
                    ...state,
                    isvisible_modify_modal4: action.isvisible_modify_modal4
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

        case DATASOURCE_SCH_MODAL2:
            return {
                ...state,
                datasource_sch_modal2: action.datasource_sch_modal2
            }
        case DATASOURCE_REG_MODAL2:
            return {
                ...state,
                datasource_reg_modal2: action.datasource_reg_modal2
            }
        case DATASOURCE_MOD_MODAL2:
            return {
                ...state,
                datasource_mod_modal2: action.datasource_mod_modal2
            }

        case DATASOURCE_SCH_MODAL3:
            return {
                ...state,
                datasource_sch_modal3: action.datasource_sch_modal3
            }
        case DATASOURCE_REG_MODAL3:
            return {
                ...state,
                datasource_reg_modal3: action.datasource_reg_modal3
            }
        case DATASOURCE_MOD_MODAL3:
            return {
                ...state,
                datasource_mod_modal3: action.datasource_mod_modal3
            }

            case DATASOURCE_SCH_MODAL4:
                return {
                    ...state,
                    datasource_sch_modal4: action.datasource_sch_modal4
                }
            case DATASOURCE_REG_MODAL4:
                return {
                    ...state,
                    datasource_reg_modal4: action.datasource_reg_modal4
                }
            case DATASOURCE_MOD_MODAL4:
                return {
                    ...state,
                    datasource_mod_modal4: action.datasource_mod_modal4
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

export default StdStandardEtc;