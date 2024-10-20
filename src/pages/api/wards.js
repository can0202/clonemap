import {URL_API} from 'shared/constants/ConfigApp';

export const fetchWards = async (id_ity, id_dis) => {
  try {
    const res = await fetch(
      URL_API + `/vhb/address/provinces/${id_ity}/districts/${id_dis}/wards`,
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
