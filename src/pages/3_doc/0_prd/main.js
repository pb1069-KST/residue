import { PrdDownload } from "./prdDownload";
import { SearchModal } from "../0_prd/searchModal";
import { RegisterModal } from "../0_prd/registerModal";
import { ModifyModal } from "../0_prd/modifyModal";
import { useSelector } from "react-redux";

function Main() {
  const {
    isvisible_register_modal,
    isvisible_search_modal,
    isvisible_modify_modal,
    usingArray,
  } = useSelector((state) => state.DocPrdArticle);

  return (
    <div>
      <PrdDownload></PrdDownload>
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
