import { Info } from "../info/info";
import { SearchModal } from "../info/searchModal";
import { RegisterModal } from "../info/registerModal";
import { ModifyModal } from "../info/modifyModal";
import { useSelector, useDispatch } from "react-redux";

function Main() {
  const {
    isvisible_search_modal,
    isvisible_register_modal,
    isvisible_modify_modal,
    usingArray,
  } = useSelector((state) => state.VdInfoInfo);

  return (
    <div>
      <Info></Info>
      {isvisible_search_modal ? <SearchModal></SearchModal> : <></>}
      {isvisible_register_modal ? <RegisterModal></RegisterModal> : <></>}
      {isvisible_modify_modal ? (
        <ModifyModal usingArray={usingArray}></ModifyModal>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Main;
