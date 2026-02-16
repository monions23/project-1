document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");

    let cardWidth = document.querySelector(".card").offsetWidth + 16; // Include margin

    nextBtn.addEventListener("click", () => {
        slider.scrollBy({left: cardWidth, behavior: "smooth"});
    });

    prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });
})