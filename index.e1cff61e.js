const e=document.getElementById("search-form"),t=document.querySelector(".gallery"),n=document.querySelector(".load-more");let a="",o=1;async function i(){const e=`https://pixabay.com/api/?key=38089990-183f5db39cd80ce116037a369&q=${a}&image_type=photo&orientation=horizontal&safesearch=true&page=${o}&per_page=40`;try{const a=(await axios.get(e)).data;if(0===a.hits.length)return void(1===o?s("Sorry, there are no images matching your search query. Please try again."):(s("We're sorry, but you've reached the end of search results."),n.style.display="none"));!function(e){const n=e.map((e=>function(e){return`\n    <div class="photo-card">\n      <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy">\n      <div class="info">\n        <p class="info-item"><b>Likes:</b> ${e.likes}</p>\n        <p class="info-item"><b>Views:</b> ${e.views}</p>\n        <p class="info-item"><b>Comments:</b> ${e.comments}</p>\n        <p class="info-item"><b>Downloads:</b> ${e.downloads}</p>\n      </div>\n    </div>\n  `}(e))).join("");t.insertAdjacentHTML("beforeend",n)}(a.hits),1===o&&s(`Hooray! We found ${a.totalHits} images.`)}catch(e){console.error(e),s("An error occurred while fetching images. Please try again later.")}}function s(e){notiflix.Notify.info(e)}e.addEventListener("submit",(async function(e){e.preventDefault(),a=e.target.elements.searchQuery.value,o=1,t.innerHTML="",await i(),n.style.display="block"})),n.addEventListener("click",(async function(){o++,await i()}));
//# sourceMappingURL=index.e1cff61e.js.map
