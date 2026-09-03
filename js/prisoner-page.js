const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id");
const prisoner = window.PRISONERS?.find((entry) => entry.id === requestedId);

const loading = document.querySelector("#record-loading");
const record = document.querySelector("#prisoner-record");
const missing = document.querySelector("#missing-record");

if (!prisoner) {
  loading.hidden = true;
  missing.hidden = false;
} else {
  const setText = (selector, value) => {
    document.querySelector(selector).textContent = value;
  };

  document.title = `${prisoner.name} — OSS Spy Jail`;
  document.querySelector('meta[name="description"]').content = `OSS prisoner file for ${prisoner.name}, also known as ${prisoner.alias}.`;

  setText("#record-number", `FILE ${prisoner.fileNumber}`);
  setText("#prisoner-classification", prisoner.classification);
  setText("#prisoner-status", prisoner.status);
  setText("#prisoner-name", prisoner.name);
  setText("#prisoner-alias", prisoner.alias);
  setText("#threat-label", `${prisoner.threatLabel} — ${prisoner.threat}/5`);
  setText("#prisoner-detained", prisoner.detained);
  setText("#prisoner-offense", prisoner.offense);
  setText("#prisoner-summary", prisoner.summary);

  const image = document.querySelector("#prisoner-image");
  image.src = prisoner.image;
  image.alt = `Prisoner file image for ${prisoner.name}`;

  document.querySelectorAll(".threat-meter span").forEach((segment, index) => {
    segment.classList.toggle("active", index < prisoner.threat);
  });

  const traitList = document.querySelector("#prisoner-traits");
  prisoner.traits.forEach((trait) => {
    const item = document.createElement("li");
    item.textContent = trait;
    traitList.append(item);
  });

  loading.hidden = true;
  record.hidden = false;
}
