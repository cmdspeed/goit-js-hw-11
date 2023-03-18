import Notiflix from 'notiflix';

const API_KEY = '34526750-6567dd272390bb315b269666f';
const API_URL = 'https://pixabay.com/api/';
let q = 'dog';
const URLSearch = `${API_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true`;

const form = document.querySelector('.search-form');
const input = document.querySelector('[name="searchQuery"]');
const search = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');

const fetchPhoto = async () => {
  try {
    const firstResponse = await fetch(`${URLSearch}`);
    const array = await firstResponse.json();

    if (array.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    const photos = array.hits
      .map(
        ({
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>
            `
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', photos);
  } catch (error) {
    console.log(error);
  }
};

fetchPhoto();
