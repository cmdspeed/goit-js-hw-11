import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const API_KEY = '34526750-6567dd272390bb315b269666f';
const API_URL = 'https://pixabay.com/api/';
let numberPage = 0;
let URLSearch, q, noMorePhotos;

const form = document.querySelector('.search-form');
const input = document.querySelector('input[name="searchQuery"]');
const search = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const simplelightbox = new SimpleLightbox('.gallery a', {
  captionDelay: '250',
});

search.addEventListener('click', event => {
  event.preventDefault();
  resetList();
  q = input.value;
  numberPage = 0;
  URLSearch = `${API_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${numberPage}`;
  new ScrollWatch({
    watch: 'a',
    infiniteScroll: true,
    infiniteOffset: 200,
    onInfiniteYInView: loadMore,
  });
});

const fetchPhoto = async () => {
  try {
    if (noMorePhotos) {
      return;
    }
    const firstResponse = await fetch(`${URLSearch}`);
    const array = await firstResponse.json();
    const totalHits = array.totalHits;
    if (array.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (numberPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    noMorePhoto(numberPage, totalHits);
    createGallery(array);

    simplelightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
  }
};

const resetList = () => {
  gallery.innerHTML = '';
  noMorePhotos = false;
};

const createGallery = array => {
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
};

const loadMore = () => {
  numberPage++;
  URLSearch = `${API_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${numberPage}`;
  fetchPhoto();
};

const noMorePhoto = (numberPage, totalHits) => {
  if (numberPage > totalHits / 40) {
    loadBtn.classList.add('hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    noMorePhotos = true;
  }
};
