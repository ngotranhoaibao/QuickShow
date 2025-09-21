const thumbs = document.querySelectorAll(".thumb");
const iframe = document.querySelector(".trailers__iframe");
const player = document.querySelector(".trailers__player");

thumbs.forEach(thumb => {
  thumb.addEventListener("click", e => {
    e.preventDefault(); 
    const id = thumb.dataset.videoId;
    iframe.src = "https://www.youtube.com/embed/" + id ;
    player.classList.add("active");
  }); 
});

player.addEventListener("click", () => {
  iframe.src = "";
  player.classList.remove("active");
});


// Lấy dữ liệu từ API
async function getData() {
  try {
    const response = await fetch(
      "https://quickshow-server.vercel.app/api/show/all"
    ); // Gửi yêu cầu GET
    if (!response.ok) throw new Error("Lỗi mạng hoặc API"); // Kiểm tra lỗi
    const data = await response.json(); // Chuyển phản hồi thành JSON
    console.log(data); // Xử lý dữ liệu
  } catch (error) {
    console.error("Lỗi:", error.message); // Xử lý lỗi
  }
}

getData();
