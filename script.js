
// Trailers
const thumbs = document.querySelectorAll(".thumb");
const iframe = document.querySelector(".trailers__iframe");
const player = document.querySelector(".trailers__player");
// kick vào thumb hiện lên trailer
thumbs.forEach((thumb) => {
  thumb.addEventListener("click", (e) => {
    e.preventDefault();
    const id = thumb.dataset.videoId;
    iframe.src = "https://www.youtube.com/embed/" + id + "?playsinline=1&rel=0";
    player.classList.add("active");
  });
});

player.addEventListener("click", () => {
  iframe.src = "";
  player.classList.remove("active");
});
//tạo toggle hiển thị
function toggleShowAll() {
  showAll = !showAll;
  renderData(shows);
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
//tạo hàm renderdata vào showinglist
function renderData(list) {
//lấy 4 cái thôi giúp tôi
  const subset = showAll ? list : list.slice(0, 4);
  showingList.innerHTML = subset
    .map((m) => {
      const year =
        m.release_date ? new Date(m.release_date).getFullYear() : "—";
      const genres = Array.isArray(m.genres)
        ? m.genres.slice(0, 2).map((g) => g.name).join(" | ")
        : "—";
      const runtime =
        Number.isFinite(m.runtime)
          ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`
          : "—";
      const rating = Number(m.vote_average) ? Number(m.vote_average).toFixed(1) : "—";
      const poster = m.poster_path
        ? `https://image.tmdb.org/t/p/original/${m.poster_path}`
        : "./Images/placeholder.jpg";
      const title = m.title ?? "Untitled";

      return `
        <div class="card">
          <img src="${poster}" alt="${title}" class="card__image">
          <h3 class="card__title">${title}</h3>
          <p class="card__meta">${year} <i class="fa-solid fa-circle"></i> ${genres} <i class="fa-solid fa-circle"></i> ${runtime}</p>
          <div class="card__footer">
            <button class="card__button">Buy Tickets</button>
            <p class="card__rating"><i class="fa-solid fa-star"></i> ${rating}</p>
          </div>
        </div>
      `;
    })
    .join("");
}



// Khởi động
getData();
