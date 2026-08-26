// Fullscreen viewer for every screenshot gallery on the page — click any image to open it,
// arrows/Escape/click-outside to navigate/close. Each `.gallery` container is its own
// navigation group, so Prev/Next stays within the section the image came from.
(function () {
  var galleries = Array.prototype.slice.call(document.querySelectorAll(".gallery"));
  var groups = galleries.map(function (gallery) {
    return Array.prototype.slice.call(gallery.querySelectorAll("img"));
  });

  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var closeBtn = document.getElementById("lightboxClose");
  var prevBtn = document.getElementById("lightboxPrev");
  var nextBtn = document.getElementById("lightboxNext");

  var currentGroup = [];
  var currentIndex = -1;

  function captionFor(img) {
    var figure = img.closest("figure");
    var figcaption = figure ? figure.querySelector("figcaption") : null;
    return figcaption ? figcaption.innerHTML : "";
  }

  function show(index) {
    if (!currentGroup.length) return;
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    var img = currentGroup[currentIndex];
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    lightboxCaption.innerHTML = captionFor(img);
    var multiple = currentGroup.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;
  }

  function open(group, index) {
    currentGroup = group;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  groups.forEach(function (group) {
    group.forEach(function (img, index) {
      img.addEventListener("click", function () {
        open(group, index);
      });
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () {
    show(currentIndex - 1);
  });
  nextBtn.addEventListener("click", function () {
    show(currentIndex + 1);
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") show(currentIndex - 1);
    else if (event.key === "ArrowRight") show(currentIndex + 1);
  });
})();
