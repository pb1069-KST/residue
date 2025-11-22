export const USERINFO = "HEADER/USERINFO";
export const LOGIN = "HEADER/ISVISIBLE_LOGIN_MODAL";
export const USERID = "HEADER/USERID";
export const USERPWD = "HEADER/USERPWD";
export const SYSTEM_CHECK = "HEADER/SYSTEM_CHECK";

export const RATE_COMMENT = "HEADER/RATE_COMMENT";
export const RATE = "HEADER/RATE";

export const setUserinfo = userinfo => ({ type: USERINFO, userinfo });
export const setIsvisibleLoginModal = isvisible_login_modal => ({ type: LOGIN, isvisible_login_modal });
export const setUserID_LoginModal = userid => ({ type: USERID, userid });
export const setUserPWD_LoginModal = userpwd => ({ type: USERPWD, userpwd });
export const setSystemCheck = system_check => ({ type: SYSTEM_CHECK, system_check });

export const setRateComment = rate_comment => ({ type: RATE_COMMENT, rate_comment });
export const setRate = rate => ({ type: RATE, rate });

const initalState = {
    userinfo: 0,
    isvisible_login_modal: false,
    userid: "",
    userpwd: "",
    system_check: false,

    rate: 5,
    rate_comment: "",
};

const header = (state = initalState, action) => {
    switch (action.type) {
        case USERINFO:
            return {
                ...state,
                userinfo: action.userinfo
            };
        case LOGIN:
            return {
                ...state,
                isvisible_login_modal: action.isvisible_login_modal
            }
        case USERID:
            return {
                ...state,
                userid: action.userid
            };
        case USERPWD:
            return {
                ...state,
                userpwd: action.userpwd
            }
        case SYSTEM_CHECK:
            return {
                ...state,
                system_check: action.system_check
            }
        case RATE_COMMENT:
            return {
                ...state,
                rate: action.rate
            }
        case RATE:
            return {
                ...state,
                rate: action.rate
            }

        default:
            return state;
    }
};

export default header;