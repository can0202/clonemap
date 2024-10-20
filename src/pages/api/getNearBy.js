import {URL_API} from 'shared/constants/ConfigApp';

export const getNearBy = async (lat, lng, categories) => {
  try {
    const res = await fetch(
      URL_API +
        `/vmap/places/getNearBy?lat=${lat}&lng=${lng}&categories=${categories}`,
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
