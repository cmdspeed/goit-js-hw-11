import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const API_KEY = '34526750-6567dd272390bb315b269666f';
const API_URL = 'https://pixabay.com/api/';
let numberPage = 0;
let URLSearch, q;

const form = document.querySelector('.search-form');
const input = document.querySelector('input[name="searchQuery"]');
const search = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

search.addEventListener('click', event => {
  event.preventDefault();
  q = input.value;
  numberPage = 1;
  URLSearch = `${API_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${numberPage}`;

  resetList();
  fetchPhoto();
  loadMore();
});

const fetchPhoto = async () => {
  try {
    const firstResponse = await fetch(`${URLSearch}`);
    const array = await firstResponse.json();
    const totalHits = array.totalHits;
    if (array.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    const photos = array.hits
      .map(
        ({
          largeImageURL,
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `    <a class="gallery__link" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b>Views: </b> ${views}
    </p>
    <p class="info-item">
      <b>Comments: </b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</div>
</a>
            `
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', photos);

    new SimpleLightbox('.gallery a', {
      captionDelay: '250',
    });

    if (numberPage > totalHits / 40) {
      loadBtn.classList.add('hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const resetList = () => {
  gallery.innerHTML = '';
};

const loadMore = () => {
  loadBtn.classList.remove('hidden');
};
loadBtn.addEventListener('click', () => {
  numberPage++;
  URLSearch = `${API_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${numberPage}`;
  fetchPhoto();
});
