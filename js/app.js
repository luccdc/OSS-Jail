const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("open", !isOpen);
  });
}

const prisonerGrid = document.querySelector("#prisoner-grid");

if (prisonerGrid && window.PRISONERS) {
  const searchInput = document.querySelector("#prisoner-search");
  const countOutput = document.querySelector("#visible-count");
  const emptyState = document.querySelector("#empty-state");

  function createPrisonerCard(prisoner) {
    const link = document.createElement("a");
    link.className = "prisoner-card";
    link.href = `prisoner.html?id=${encodeURIComponent(prisoner.id)}`;

    const imageWrap = document.createElement("div");
    imageWrap.className = "card-image";

    const image = document.createElement("img");
    image.src = prisoner.image;
    image.alt = `Prisoner file image for ${prisoner.name}`;
    imageWrap.append(image);

    const badge = document.createElement("span");
    badge.className = "card-file-number";
    badge.textContent = `#${prisoner.fileNumber}`;
    imageWrap.append(badge);

    const body = document.createElement("div");
    body.className = "card-body";

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.innerHTML = `<span>${prisoner.status}</span><span>Threat ${prisoner.threat}/5</span>`;

    const name = document.createElement("h2");
    name.textContent = prisoner.name;

    const alias = document.createElement("p");
    alias.className = "card-alias";
    alias.textContent = prisoner.alias;

    const offense = document.createElement("p");
    offense.className = "card-offense";
    offense.textContent = prisoner.offense;

    const action = document.createElement("span");
    action.className = "card-action";
    action.innerHTML = `Open case file <span aria-hidden="true">↗</span>`;

    body.append(meta, name, alias, offense, action);
    link.append(imageWrap, body);
    return link;
  }

  function renderPrisoners(query = "") {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = window.PRISONERS.filter((prisoner) => {
      const searchable = [prisoner.name, prisoner.alias, prisoner.offense, prisoner.status]
        .join(" ")
        .toLowerCase();
      return searchable.includes(normalizedQuery);
    });

    prisonerGrid.replaceChildren(...matches.map(createPrisonerCard));
    countOutput.textContent = matches.length;
    emptyState.hidden = matches.length !== 0;
  }

  searchInput.addEventListener("input", (event) => renderPrisoners(event.target.value));
  renderPrisoners();
}
