export const DATASOURCE = "VD/FOOD/DATASOURCE";

export const DATASOURCE_CLASS_L = "VD/FOOD/DATASOURCE_CLASS_L";
export const DATASOURCE_CLASS_M = "VD/FOOD/DATASOURCE_CLASS_M";
export const DATASOURCE_CLASS_S = "VD/FOOD/DATASOURCE_CLASS_S";

export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });

export const setDatasourceClassL = datasource_class_L => ({ type: DATASOURCE_CLASS_L, datasource_class_L });
export const setDatasourceClassM = datasource_class_M => ({ type: DATASOURCE_CLASS_M, datasource_class_M });
export const setDatasourceClassS = datasource_class_S => ({ type: DATASOURCE_CLASS_S, datasource_class_S });


const initalState = {
    dataSource: [],
    
    datasource_class_L:[],
    datasource_class_M:[],
    datasource_class_S:[],
};

const vdMrlFood = (state = initalState, action) => {
    // console.log(action)
    switch (action.type) {
        case DATASOURCE:
            return {
                ...state,
                dataSource: action.dataSource
            };
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

export default vdMrlFood;