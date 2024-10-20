import {URL_API} from 'shared/constants/ConfigApp';

export const getFavoritePost = async (idPost, dataFavorite, token) => {
  try {
    const response = await fetch(
      URL_API + `/vland/posts/me/favorite/${idPost}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({isFavorite: dataFavorite}),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
