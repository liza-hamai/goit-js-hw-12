import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.getElementById('search-form');
const input = form.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let page = 1;
let totalHits = 0;
const perPage = 15;

form.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  if (query !== currentQuery) {
    currentQuery = query;
    page = 1;
    totalHits = 0;
    clearGallery();
    hideLoadMoreButton();
  }

  try {
    showLoader();

    const data = await getImagesByQuery(currentQuery, page);
    const { hits, totalHits: receivedTotalHits } = data;
    totalHits = receivedTotalHits;

    if (!hits || hits.length === 0) {
      iziToast.info({
        title: 'No results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    createGallery(hits);

    if (page === 1) {
      iziToast.success({
        title: 'Success',
        message: `Hooray! We found ${totalHits} images.`,
        position: 'topRight',
      });
    }

    const loadedSoFar = (page) * perPage;
    if (loadedSoFar < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    form.reset();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  if (!currentQuery) return;

  page += 1;

  try {
    hideLoadMoreButton();
    showLoader();

    const data = await getImagesByQuery(currentQuery, page);
    const { hits } = data;

    if (!hits || hits.length === 0) {
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);

    const firstCard = document.querySelector('.gallery .gallery-item');
    if (firstCard) {
      const { height } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }

    const loadedSoFar = page * perPage;
    if (loadedSoFar >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while loading more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
