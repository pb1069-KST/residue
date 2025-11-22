import { VdDownload } from "./vdDownload";
import { SearchModal } from "../1_vd/searchModal";
import { RegisterModal } from "../1_vd/registerModal";
import { ModifyModal } from "../1_vd/modifyModal";
import { useSelector } from "react-redux";

function Main() {
  const {
    isvisible_register_modal,
    isvisible_search_modal,
    isvisible_modify_modal,
    usingArray,
  } = useSelector((state) => state.DocVdArticle);

  return (
    <div>
      <VdDownload></VdDownload>
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
