import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "notiflix/dist/notiflix-3.2.5.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import fetchGalleryPhotos from './js/fetchGalleryPhotos';
import renderGalleryItems from './js/renderGalleryItems';

const galleryWrapperEl = document.querySelector('.gallery');
const searchFormEl = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let lightbox;
let searchValue;
let currentPage;
let perPage;
let maxPage;
let totalHits;

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSearchFormSubmit(e) {
  e.preventDefault()
  searchValue = e.target.searchQuery.value;
  currentPage = 1;
  perPage = 40;

  loadMoreBtn.classList.add('is-hidden');

  const galleryPhotos = await fetchGalleryPhotos(searchValue);

  if (galleryPhotos.total === 0) submitFailure()
  else {
    submitSuccess(galleryPhotos)

    totalHits = galleryPhotos.totalHits;
    maxPage = Math.ceil(totalHits / perPage);

    loadMoreBtn.classList.remove('is-hidden')
    lightbox = new SimpleLightbox('.gallery a');
  }
}

function onLoadMoreClick() {
  if (currentPage === Math.floor(totalHits / perPage)) perPage = totalHits - currentPage * perPage
  if (currentPage === maxPage) loadMoreFailure()
  else loadMoreSuccess()
}

function submitFailure() {
  Notify.failure("Sorry, there are no images matching your search query. Please try again.");

  galleryWrapperEl.innerHTML = '';
}

function submitSuccess(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`)

  galleryWrapperEl.innerHTML = renderGalleryItems(data)
}

async function loadMoreSuccess() {
  currentPage++
  const galleryPhotos = await fetchGalleryPhotos(searchValue, currentPage, perPage);

  galleryWrapperEl.insertAdjacentHTML('beforeend', renderGalleryItems(galleryPhotos))

  smoothScroll()
  lightbox.refresh()
}

function loadMoreFailure() {
  Notify.failure("We're sorry, but you've reached the end of search results.");

  loadMoreBtn.classList.add('is-hidden')
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: "smooth",
  });
}