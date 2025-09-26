// Trailers
const thumbs = document.querySelectorAll(".thumb");
const iframe = document.querySelector(".trailers__iframe");
const player = document.querySelector(".trailers__player");
const btnShow = document.querySelector(".showing__button");
const params = new URLSearchParams(window.location.search);
const movieDetail = document.querySelector("#mv-inner");
const favouriteCast = document.querySelector("#cast-row");
const castItem = document.querySelector("#cast-item");
const dateBar = document.querySelector(".datebar__dates");
// const castId=params.get("id");
const movieId = params.get("id");
// kick vào thumb hiện lên trailer
thumbs.forEach((thumb) => {
  thumb.addEventListener("click", (e) => {
    e.preventDefault();
    const id = thumb.dataset.videoId;
    iframe.src = "https://www.youtube.com/embed/" + id + "?playsinline=1&rel=0";
    player.classList.add("active");
  });
});
if (player) {
  player.addEventListener("click", () => {
    player.classList.remove("active");
  });
}

const showingList = document.querySelector(".showing__list");
let shows = [];
let showAll = false;
//tạo hàm getdata
async function getData() {
  try {
    const res = await fetch("https://quickshow-server.vercel.app/api/show/all");
    if (!res.ok) throw new Error("Lỗi mạng hoặc API");
    const data = await res.json();
    shows = Array.isArray(data?.shows) ? data.shows : [];
    renderData(shows);
  } catch (err) {
    console.error("Lỗi:", err.message);
    showingList.innerHTML = `<p style="padding:16px">Không tải được dữ liệu.</p>`;
  }
}

async function getData() {
  try {
    const response = await fetch(
      "https://quickshow-server.vercel.app/api/show/all"
    ); // Gửi yêu cầu GET
    if (!response.ok) throw new Error("Lỗi mạng hoặc API"); // Kiểm tra lỗi
    const data = await response.json(); // Chuyển phản hồi thành JSON
    renderData(data.shows);
  } catch (error) {
    console.error("Lỗi:", error.message); // Xử lý lỗi
  }
}
//tạo hàm renderdata vào showinglist
function renderData(list) {
  //lấy 4 cái thôi giúp tôi
  const subset = showAll ? list : list.slice(0, 4);
  showingList.innerHTML = subset
    .map((m) => {
      const year = m.release_date
        ? new Date(m.release_date).getFullYear()
        : "—";
      const genres = Array.isArray(m.genres)
        ? m.genres
            .slice(0, 2)
            .map((g) => g.name)
            .join(" | ")
        : "—";
      const runtime = Number.isFinite(m.runtime)
        ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`
        : "—";
      const rating = Number(m.vote_average)
        ? Number(m.vote_average).toFixed(1)
        : "—";
      const poster = m.poster_path
        ? `https://image.tmdb.org/t/p/original/${m.poster_path}`
        : "./Images/placeholder.jpg";
      const title = m.title ?? "Untitled";

      return `
        <div class="card">
        <a href="/detail.html?id=${m._id}"> <img src="${poster}" alt="${title}" class="card__image" ></a>
          <h3 class="card__title">${title}</h3>
          <p class="card__meta">${year} •  </i> ${genres} </i>  • ${runtime}</p>
          <div class="card__footer">
            <button class="card__button">Buy Tickets</button>
            <p class="card__rating"><i class="fa-solid fa-star"></i> ${rating}</p>
          </div>
        </div>
      `;
    })
    .join("");
}
//nếu nhấn nút showmore thì showAll = true getData() và khi nhấn lại thì showAll = false
btnShow.addEventListener("click", () => {
  showAll = !showAll;
  getData();
});
//check showingList có data
console.log(movieId);

//tạo function fetch movieDetail
function fetchMovieDetail() {
  fetch(`https://quickshow-server.vercel.app/api/show/${movieId}`)
    .then((res) => res.json())
    .then((data) => {
      const movie = data.movie;
      console.log("movie thao:", movie);
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
        : "./Images/placeholder.jpg";
      const title = movie.title ?? "Untitled";
      const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "—";
      const genres = Array.isArray(movie.genres)
        ? movie.genres
            .slice(0, 2)
            .map((g) => g.name)
            .join(" | ")
        : "—";
      const runtime = Number.isFinite(movie.runtime)
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : "—";
      const rating = Number(movie.vote_average)
        ? Number(movie.vote_average).toFixed(1)
        : "—";
      const overview = movie.overview ?? "No overview available";
      const trailer = movie.trailer ?? "No trailer available";

      movieDetail.innerHTML = `
           <img class="mv-poster" src="${poster}"
        alt="STRAW poster" />

      <div class="mv-info">
        <p class="mv-lang">ENGLISH</p>
        <h1 class="mv-title">${title}</h1>

        <div class="mv-rating">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
            class="icon-star" aria-hidden="true">
            <path
              d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
          8.3 User Rating
        </div>

        <p class="mv-overview">
          ${overview}
        </p>

        <p ${genres}</p>

        <div class="mv-actions">
          <button class="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
            Watch Trailer
          </button>
          <div class="mv-actions__right">
            <button href="#dateSelect" class="btn btn-primary">Buy Tickets</button>

            <button class="btn-icon" aria-label="Add to favorites">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                </path>
              </svg>
            </button>
          </div>

        </div>
      </div>
      `;
    });
}
//tạo hàm fetch ra favourite cast
async function fetchFavouriteCast() {
  fetch(`https://quickshow-server.vercel.app/api/show/${movieId}`)
    .then((res) => res.json())
    .then((data) => {
      const movie = data.movie.casts;
      const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      console.log("movie", movie);
      //tạo tên biến object key từ data.dateTime
      const dataDate = Object.keys(data.dateTime);
      console.log("dataDate", dataDate);
      //tạo tên biến object value từ data.dateTime
      const time = Object.values(dataDate);
      console.log("time", time);
      dataDate.forEach((date) => {
        const dateItem = document.createElement("div");
        dateItem.classList.add("date-item");
        dateItem.innerHTML = `
          <button class="date-btn"><span>${date.split("-")[2]}</span><span>${
          month[date.split("-")[1] - 1]
        }</span></button>

        `;
        dateBar.appendChild(dateItem);
      });

      movie.forEach((cast) => {
        const castItem = document.createElement("div");
        castItem.classList.add("cast-item");
        castItem.innerHTML = `
          <img class="cast-avatar" src="https://image.tmdb.org/t/p/original/${cast.profile_path}"
            alt="${cast.name}" />
          <p class="cast-name">${cast.name}</p>
        `;
        favouriteCast.appendChild(castItem);
      });
    });
}
fetchFavouriteCast();
fetchMovieDetail(movieId);
getData();
