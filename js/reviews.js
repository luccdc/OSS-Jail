const STORAGE_KEY = "oss-spy-jail-reviews";

const form = document.querySelector("#feedback-form");
const comment = document.querySelector("#review-comment");
const characterCount = document.querySelector("#character-count");
const attachment = document.querySelector("#attachment");
const uploadTitle = document.querySelector("#upload-title");
const uploadNote = document.querySelector("#upload-note");
const formError = document.querySelector("#form-error");
const reviewList = document.querySelector("#review-list");
const clearButton = document.querySelector("#clear-reviews");
const toast = document.querySelector("#success-toast");

const starterReviews = [
  {
    id: "starter-1",
    name: "Small Child",
    visitType: "Official mission",
    rating: 2,
    comment: "Was attacked by gorillas. Coffee was good",
    date: "August 27, 2026",
    attachmentName: "",
  },
  {
    id: "starter-2",
    name: "Agent J.",
    visitType: "Prisoner transfer",
    rating: 4,
    comment: "Secure, dramatic.",
    date: "August 22, 2026",
    attachmentName: "",
  },
];

function getReviews() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : starterReviews;
  } catch {
    return starterReviews;
  }
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function createReviewCard(review) {
  const article = document.createElement("article");
  article.className = "review-card";

  const header = document.createElement("div");
  header.className = "review-card-header";

  const identity = document.createElement("div");
  const name = document.createElement("h3");
  name.textContent = review.name;
  const visit = document.createElement("p");
  visit.textContent = review.visitType;
  identity.append(name, visit);

  const stars = document.createElement("span");
  stars.className = "review-stars";
  stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
  stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  header.append(identity, stars);

  const body = document.createElement("p");
  body.className = "review-comment";
  body.textContent = review.comment;

  const footer = document.createElement("div");
  footer.className = "review-footer";
  const date = document.createElement("span");
  date.textContent = review.date;
  footer.append(date);

  if (review.attachmentName) {
    const file = document.createElement("span");
    file.className = "attachment-chip";
    file.textContent = `⌁ ${review.attachmentName}`;
    footer.append(file);
  }

  article.append(header, body, footer);
  return article;
}

function renderReviews() {
  const reviews = getReviews();
  if (!reviews.length) {
    const empty = document.createElement("div");
    empty.className = "review-empty";
    empty.innerHTML = "<strong>No local transmissions.</strong><p>Your report can be the first.</p>";
    reviewList.replaceChildren(empty);
    clearButton.hidden = true;
    return;
  }

  clearButton.hidden = false;
  reviewList.replaceChildren(...reviews.map(createReviewCard));
}

comment.addEventListener("input", () => {
  characterCount.textContent = comment.value.length;
});

attachment.addEventListener("change", () => {
  const file = attachment.files[0];
  formError.hidden = true;

  if (!file) {
    uploadTitle.textContent = "Attach evidence";
    uploadNote.textContent = "Image, PDF, or text file • 5 MB maximum";
    return;
  }

  uploadTitle.textContent = file.name;
  uploadNote.textContent = `${(file.size / 1024).toFixed(1)} KB • ready locally`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.hidden = true;

  if (!form.checkValidity()) {
    formError.textContent = "Complete the required fields and choose a rating before transmitting.";
    formError.hidden = false;
    form.reportValidity();
    return;
  }

  const selectedFile = attachment.files[0];
  if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
    formError.textContent = "That evidence file is larger than the 5 MB limit.";
    formError.hidden = false;
    return;
  }

  const data = new FormData(form);
  const newReview = {
    id: String(Date.now()),
    name: data.get("name").trim(),
    visitType: data.get("visitType"),
    rating: Number(data.get("rating")),
    comment: data.get("comment").trim(),
    date: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date()),
    attachmentName: selectedFile?.name || "",
  };

  const reviews = getReviews();
  saveReviews([newReview, ...reviews]);
  renderReviews();

  form.reset();
  characterCount.textContent = "0";
  uploadTitle.textContent = "Attach evidence";
  uploadNote.textContent = "Image, PDF, or text file • 5 MB maximum";

  toast.hidden = false;
  window.setTimeout(() => {
    toast.hidden = true;
  }, 4000);
});

clearButton.addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY, "[]");
  renderReviews();
});

renderReviews();
