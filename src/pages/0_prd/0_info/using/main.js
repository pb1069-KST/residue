import { Using } from "../using/using";
import { RegisterModal } from "../using/registerModal";
import { ModifyModal } from "../using/modifyModal";
import { useSelector } from "react-redux";

function Main() {
  const { isvisible_register_modal, isvisible_modify_modal, usingArray } =
    useSelector((state) => state.PrdInfoUsing_modal);

  return (
    <div>
      <Using></Using>
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
