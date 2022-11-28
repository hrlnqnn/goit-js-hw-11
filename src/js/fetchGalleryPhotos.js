import axios from 'axios';

export default async function fetchGalleryPhotos(searchValue, currentPage = 1, perPage = 40) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '30819476-f9247b8148545f328aa332668';

  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: perPage,
  })

  return await axios.get(`${BASE_URL}?${searchParams}`)
    .then(res => res.data)
    .catch(e => console.log(e.name))
}