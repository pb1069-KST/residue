export const DATASOURCE = "PRD/ADI/DATASOURCE";


export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });


const initalState = {
    dataSource: [],
};

const PrdInfoAdi = (state = initalState, action) => {
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

export default PrdInfoAdi;