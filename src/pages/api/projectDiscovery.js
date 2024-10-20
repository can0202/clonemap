import {URL_API} from 'shared/constants/ConfigApp';

export const fetchProjectDiscovery = async () => {
  try {
    const res = await fetch(URL_API + `/vland/posts/projects/discovery`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
