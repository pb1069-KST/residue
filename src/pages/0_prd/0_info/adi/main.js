import { Adi } from "../adi/adi";
import { ModifyModal } from "../adi/modifyModal";
import { useSelector } from "react-redux";

function Main() {
  const { isvisible_modify_modal } = useSelector(
    (state) => state.PrdInfoAdi_modal
  );

  return (
    <div>
      <Adi></Adi>
      {isvisible_modify_modal ? <ModifyModal></ModifyModal> : <></>}
    </div>
  );
}

export default Main;
