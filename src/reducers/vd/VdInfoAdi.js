export const DATASOURCE = "VD/ADI/DATASOURCE";


export const setDataSource = dataSource => ({ type: DATASOURCE, dataSource });


const initalState = {
    dataSource: [],
};

const VdInfoAdi = (state = initalState, action) => {
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

export default VdInfoAdi;