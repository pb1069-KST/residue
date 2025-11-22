export const DATASOURCE = "PRD/TEST/DATASOURCE";

export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });


const initalState = {
    dataSource: [],
};

const prdTestReport = (state = initalState, action) => {
    // console.log(action)
    switch (action.type) {
        case DATASOURCE:
            return {
                ...state,
                dataSource: action.dataSource
            };

        default:
            return state;
    }
};

export default prdTestReport;