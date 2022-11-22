import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { createMarkupForImage } from './js/card';

let page = 1;
let searchImagesInput = null;
let beforeSearchImagesInput = null;
let lightbox = null;

const refs = {
    formEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
    additionalLoadingBtnEl: document.querySelector('.load-more'),
};

function formSubmit(event) {
    event.preventDefault();

    searchImagesInput = event.currentTarget['searchQuery'].value;
    if (beforeSearchImagesInput !== searchImagesInput) {
        refs.galleryEl.innerHTML = '';
        page = 1;
    }

    fetchImages(searchImagesInput, page)
        .then(res => {
            if (res.data.totalHits === 0) {
                refs.additionalLoadingBtnEl.classList.add('is-hidden');
                Notiflix.Notify.info(
                    'Sorry, there are no images matching your search query. Please try again.'
                );
                return;
            }
            const newObj = res.data.hits;
            newObj.forEach(function (img) {
                createMarkupForImage(img);
            });
            lightbox = new SimpleLightbox('.gallery a', {
                captionsData: 'alt',
                captionDelay: 100,
            });
            Notiflix.Notify.info(`Hooray! We found ${res.data.totalHits} images.`);

            if (newObj.length === 40) {
                refs.additionalLoadingBtnEl.classList.remove('is-hidden');
            }

            const { height: ForImageHeight } =
                refs.galleryEl.firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: ForImageHeight * 0.2,
                behavior: 'smooth',
            });
        })
        .catch(console.log);

    beforeSearchImagesInput = searchImagesInput;
    event.currentTarget.reset();
}

function additionalLoadingBtnElClick(event) {
    event.preventDefault();

    page++;
    fetchImages(searchImagesInput, page)
        .then(res => {
            const newObj = res.data.hits;

            newObj.forEach(function (img) {
                createMarkupForImage(img);
            });
            lightbox.refresh();
            if (newObj.length < 40) {
                refs.additionalLoadingBtnEl.classList.add('is-hidden');
                Notiflix.Notify.info(
                    `We're sorry, but you've reached the end of search results.`
                );
            }

            const { height: ForImageHeight } =
                refs.galleryEl.firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: ForImageHeight * 2,
                behavior: 'smooth',
            });
        })
        .catch(console.log);
}

refs.formEl.addEventListener('submit', formSubmit);
refs.additionalLoadingBtnEl.addEventListener(
    'click',
    additionalLoadingBtnElClick
);