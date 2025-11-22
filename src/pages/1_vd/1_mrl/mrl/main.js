import { Mrl } from "../mrl/mrl";
import { SearchModal } from "../mrl/searchModal";
import { SearchModalFood } from "../mrl/searchModalFood";
import { ModifyModalAddInfo } from "../mrl/modifyModalAddInfo";
import { ModifyModalAddInfo2 } from "../mrl/modifyModalAddInfo2";

// import { RegisterModal } from "../info/registerModal";
import { ModifyModal } from "../mrl/modifyModal";
import { useSelector, useDispatch } from "react-redux";

function Main() {
  const {
    isvisible_search_modal,
    isvisible_search_modal_food,
    isvisible_register_modal,
    isvisible_modify_modal,
    isvisible_modify_modal_add_info,
    isvisible_modify_modal_add_info2,
    usingArray,
  } = useSelector((state) => state.VdMrlMrl_modal);

  return (
    <div>
      <Mrl></Mrl>
      {isvisible_search_modal ? <SearchModal></SearchModal> : <></>}
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
      {isvisible_search_modal_food ? (
        <SearchModalFood></SearchModalFood>
      ) : (
        <></>
      )}
      {isvisible_modify_modal_add_info ? (
        <ModifyModalAddInfo></ModifyModalAddInfo>
      ) : (
        <></>
      )}
      {isvisible_modify_modal_add_info2 ? (
        <ModifyModalAddInfo2></ModifyModalAddInfo2>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Main;
