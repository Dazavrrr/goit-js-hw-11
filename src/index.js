import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import axios from 'axios';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '38089990-183f5db39cd80ce116037a369';
const ITEMS_PER_PAGE = 20;
let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  currentQuery = form.searchQuery.value.trim();

  if (currentQuery === '') {
    return Notiflix.Notify.info('You pressed enter without entering anything, great!!!');
  }

  try {
    const images = await searchImages(currentQuery, currentPage);
    handleImagesResponse(images);
  } catch (error) {
    console.log('Error:', error);
  }
}

async function handleLoadMore() {
  try {
    currentPage++;
    const images = await searchImages(currentQuery, currentPage);
    handleImagesResponse(images);
  } catch (error) {
    console.log('Error:', error);
  }
}

async function searchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${ITEMS_PER_PAGE}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.hits;
}

function handleImagesResponse(images) {
  if (images.length === 0) {
    if (currentPage === 1) {
      return Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } else {
      return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
  }

  const cards = images.map((image) => createImageCard(image));
  gallery.append(...cards);

  if (currentPage === 1) {
    showLoadMoreButton();
  }

  if (images.length < ITEMS_PER_PAGE) {
    hideLoadMoreButton();
  }

  showTotalHitsMessage(images.totalHits);
  refreshLightbox();
  scrollToNextGroup();
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.append(likes, views, comments, downloads);
  card.append(img, info);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}:</b> ${value}`;
  return item;
}

function showTotalHitsMessage(totalHits) {
  return Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function refreshLightbox() {
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function scrollToNextGroup() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}