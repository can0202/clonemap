import {URL_API} from 'shared/constants/ConfigApp';

export const fetchDistricts = async (id) => {
  try {
    const res = await fetch(URL_API + `/vhb/address/provinces/${id}/districts`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
