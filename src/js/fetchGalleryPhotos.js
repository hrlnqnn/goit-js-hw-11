import axios from 'axios';

const BASE_URL = 'https://pixabay.com';

export async function fetchGalleryPhotos(name, page, perPage) {
  const params = new URLSearchParams({
    key: '31530032-bcbc50fc25a9a5255ae59ed3d',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  });

  try {
    const response = await axios.get(`${BASE_URL}/api/?${params}`);
    return response;
  } catch (error) {
    return error;
  }
}