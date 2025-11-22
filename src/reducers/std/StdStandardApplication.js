export const DATASOURCE = "STD/APPLICATION/DATASOURCE";

export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });

const initalState = {
    dataSource: [],
};

const StdStandardApplication = (state = initalState, action) => {
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

export default StdStandardApplication;