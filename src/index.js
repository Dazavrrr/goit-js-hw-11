const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let lightbox;
let searchQuery = '';
let page = 1;

form.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMore);

async function handleFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value;
  page = 1;
  clearGallery();
  await searchImages();
  showLoadMoreButton();
}

async function handleLoadMore() {
  page++;
  await searchImages();
}

async function searchImages() {
  const apiKey = '38089990-183f5db39cd80ce116037a369';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.hits.length === 0) {
      if (page === 1) {
        displayMessage('Sorry, there are no images matching your search query. Please try again.');
      } else {
        displayMessage("We're sorry, but you've reached the end of search results.");
        hideLoadMoreButton();
      }
      return;
    }

    displayImages(data.hits);
    if (page === 1) {
      displayMessage(`Hooray! We found ${data.totalHits} images.`);
    }
  } catch (error) {
    console.error(error);
    displayMessage('An error occurred while fetching images. Please try again later.');
  }
}

function displayImages(images) {
  const html = images.map((image) => createImageCard(image)).join('');
  gallery.insertAdjacentHTML('beforeend', html);
}

function createImageCard(image) {
  return `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function displayMessage(message) {
  notiflix.Notify.info(message);
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

function initLightbox() {
  if (lightbox) {
    lightbox.destroy();
  }
  lightbox = new SimpleLightbox('.gallery a', { 
    captionsData: "alt",
    captionDelay: 250,
    showCounter: false,
    close: false,
  });
}
