export const CUSTOMSORT = "UTIL/CUSTOMSORT";

const initalState = {
    customSorter : (a, b, sortOrder, string) => {
        if (a[string] === null && b[string] === null) {
          return 0;
        }
        else if (a[string] === null) {
          return sortOrder === 'ascend' ? 1 : -1;
        }
        else if (b[string] === null) {
          return sortOrder === 'ascend' ? -1 : 1;
        }
        else if (sortOrder === "ascend") {
          return a[string] < b[string] ? -1 : 1;
        }
        else {
          return a[string] > b[string] ? 1 : -1;
        }
      }
};

const util = (state = initalState, action) => {    
    
    switch (action.type) {
        case CUSTOMSORT:
            return {
                ...state,
                customSorter: action.customSorter
        };

        default:
            return state;
    }
};

export default util;