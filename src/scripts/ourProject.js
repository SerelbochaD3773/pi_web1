const video = document.getElementById("promoVideo");

video.addEventListener("click", e => e.preventDefault());
video.addEventListener("mouseenter", () => {
    video.style.transition = "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
    video.style.transform = "scale(1.05)";
    video.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.6)";
});

video.addEventListener("mouseleave", () => {
    video.style.transform = "scale(1)";
    video.style.boxShadow = "none";
});


document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const fadeBottom = document.createElement("div");
    fadeBottom.classList.add("fade-bottom");
    container.appendChild(fadeBottom);
    function updateFadeHeight() {
        const fadeHeight = window.innerHeight * 0.1;
        fadeBottom.style.height = fadeHeight + "px";
    }
    updateFadeHeight();
    window.addEventListener("resize", updateFadeHeight);
});
