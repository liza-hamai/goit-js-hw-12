import axios from 'axios';

const baseUrl = 'https://pixabay.com/api/';
const perPage = 15;

const apiKey = '53055755-295da906459d55ec9ae018533';

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: apiKey,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page,
  };

  const response = await axios.get(baseUrl, { params });
  return response.data;
}
