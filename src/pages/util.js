import CryptoJS from "crypto-js";
import _ from "lodash";

export const customEncrypt = (obj) => {
  var temp = _.cloneDeep(obj);
  temp = JSON.stringify(temp);
  temp = CryptoJS.AES.encrypt(temp, "residue").toString();
  return temp;
};
