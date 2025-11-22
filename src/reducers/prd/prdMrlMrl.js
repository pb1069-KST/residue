export const DATASOURCE = "PRD/MRL/DATASOURCE";
export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });

export const DATASOURCE_FOOD = "PRD/MRL/DATASOURCE_FOOD";
export const setDataSourceFood = dataSourceFood => ({ type: DATASOURCE_FOOD, dataSourceFood });

const initalState = {
    dataSource: [],
    dataSourceFood:[],
};

const prdMrlMrl = (state = initalState, action) => {
    // console.log(action)
    switch (action.type) {
        case DATASOURCE:
            return {
                ...state,
                dataSource: action.dataSource
            };
        case DATASOURCE_FOOD:
            return {
                ...state,
                dataSourceFood: action.dataSourceFood
            };

        default:
            return state;
    }
};

export default prdMrlMrl;
