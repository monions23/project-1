document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");

    const modal = document.getElementById("produceModal");
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const closeBtn = document.querySelector(".modal-close");

    const cardWidth = document.querySelector(".card").offsetWidth + 16; // Include margin

    nextBtn.addEventListener("click", () => {
        slider.scrollBy({left: cardWidth, behavior: "smooth"});
    });

    prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title;
      modalImage.src = card.dataset.image;
      modal.showModal();
    });
  });

  closeBtn.addEventListener("click", () => modal.close());

  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!inside) modal.close();
  });
});

