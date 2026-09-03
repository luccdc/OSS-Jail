const coffeeForm = document.querySelector("#coffee-form");
const coffeeInput = document.querySelector("#coffee-input");
const orderResponse = document.querySelector("#order-response");
const responseStatus = document.querySelector("#response-status");
const orderNumber = document.querySelector("#order-number");
const responseKicker = document.querySelector("#response-kicker");
const responseHeading = document.querySelector("#response-heading");
const responseMessage = document.querySelector("#response-message");
const responseNote = document.querySelector("#response-note");
const suggestionList = document.querySelector("#coffee-suggestions");
const explosionOverlay = document.querySelector("#explosion-overlay");
const explosionVideo = document.querySelector("#explosion-video");
const explosionSkip = document.querySelector("#explosion-skip");

let nextOrderNumber = 41;
let explosionFallbackTimer;

const drinks = [
  {
    name: "Espresso",
    aliases: ["espresso", "double espresso", "triple espresso", "shot of espresso"],
    kicker: "HIGH-OCTANE // APPROVED",
    message: "A tiny beverage containing the souls of six interns.",
    note: "Ignore the pleas for help.",
  },
  {
    name: "Americano",
    aliases: ["americano", "cafe americano", "caffè americano"],
    kicker: "DILUTION PROTOCOL // COMPLETE",
    message: "Espresso waterboarded until it agreed to cooperate.",
    note: "The American way.",
  },
  {
    name: "Cappuccino",
    aliases: ["cappuccino", "dry cappuccino", "wet cappuccino"],
    kicker: "FOAM SITUATION // STABLE",
    message: "ayy, forget about it!",
    note: "Wait what do you mean its german and named after catholic monks",
  },
  {
    name: "Mocha",
    aliases: ["mocha", "cafe mocha", "caffè mocha", "chocolate coffee"],
    kicker: "UNAUTHORIZED PARTNERSHIP // MONITORED",
    message: "Coffee and chocolate have formed an alliance. We are watching it closely.",
    note: "You are close to breaking the no larping rule.",
  },
  {
    name: "Latte",
    aliases: ["latte", "cafe latte", "caffè latte", "iced latte", "vanilla latte"],
    kicker: "MILK-TO-COFFEE RATIO // SUSPICIOUS",
    message: "Daring today, arent we?",
    note: "Latte art is a giant foamy amogus.",
  },
  {
    name: "Cold Brew",
    aliases: ["cold brew", "iced coffee", "cold coffee"],
    kicker: "COLD STORAGE // RETRIEVED",
    message: "Revenge is a drink best served beans.",
    note: "Steeped for eighteen hours and questioned for three.",
  },
  {
    name: "Decaf",
    aliases: ["decaf", "decaf coffee", "decaffeinated coffee"],
    kicker: "ACTIVE INGREDIENT // MISSING",
    message: "We removed the caffeine and, with it, the coffee's reason to live.",
    note: "Mr. Coffee prepared this under protest.",
  },
  {
    name: "Black Coffee",
    aliases: ["black coffee", "coffee", "drip coffee", "house coffee", "regular coffee"],
    kicker: "HOUSE DRIP // APPROVED",
    message: "Just like momma used to make it.",
    note: "Like most Essays, it is dark, bitter, and technically complete.",
  },
];

const helpSuggestions = [
  "Black coffee",
  "Espresso",
  "Americano",
  "Cappuccino",
  "Latte",
  "Mocha",
  "Cold brew",
  "Decaf",
  "Pumpkin spice latte",
  "Surprise me",
];

function normalizeOrder(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9?\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimPolitePrefix(value) {
  return value
    .replace(/\bplease\b/g, "")
    .replace(
      /^(?:can i (?:get|have)|could i (?:get|have)|may i have|i(?: would|'d)? like|i want|give me)\s+(?:a|an|one)?\s*/,
      "",
    )
    .replace(/^(?:a|an|one)\s+/, "")
    .replace(/^(?:small|medium|large|tall|grande|venti)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function aliasMatches(order, alias) {
  return order === alias || order.startsWith(`${alias} `) || order.endsWith(` ${alias}`);
}

function setResponse({ status, kicker, title, message, note, tone = "success", countOrder = false }) {
  orderResponse.classList.remove("is-success", "is-help", "is-error", "is-roast");
  orderResponse.classList.add(`is-${tone}`);
  document.body.classList.remove("coffee-roast");

  if (tone === "roast") {
    window.requestAnimationFrame(() => document.body.classList.add("coffee-roast"));
  }

  responseStatus.textContent = status;
  responseKicker.textContent = kicker;
  responseHeading.textContent = title;
  responseMessage.textContent = message;
  responseNote.textContent = note;
  suggestionList.hidden = true;
  suggestionList.replaceChildren();

  if (countOrder) {
    orderNumber.textContent = `ORDER ${String(nextOrderNumber).padStart(3, "0")}`;
    nextOrderNumber += 1;
  } else {
    orderNumber.textContent = "ORDER —";
  }

  responseHeading.focus({ preventScroll: true });
}

function showHelp() {
  setResponse({
    status: "MENU DECLASSIFIED",
    kicker: "SUGGESTED BEVERAGES",
    title: "The civilized list.",
    message: "Type one of these. Capitalization is not a security concern.",
    note: "Seasonal choices are made at your own reputational risk.",
    tone: "help",
  });

  const fragment = document.createDocumentFragment();
  helpSuggestions.forEach((suggestion) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = suggestion;
    button.addEventListener("click", () => {
      coffeeInput.value = suggestion;
      coffeeInput.focus();
    });
    fragment.append(button);
  });

  suggestionList.append(fragment);
  suggestionList.hidden = false;
}

function completeDrinkOrder(drink, surprise = false) {
  setResponse({
    status: surprise ? "MR. COFFEE HAS DECIDED" : "ORDER ACCEPTED",
    kicker: drink.kicker,
    title: surprise ? `You are having a ${drink.name}.` : drink.name,
    message: surprise ? `No appeals. ${drink.message}` : drink.message,
    note: drink.note,
    tone: "success",
    countOrder: true,
  });
}

function stopExplosion() {
  window.clearTimeout(explosionFallbackTimer);
  explosionVideo.pause();
  explosionVideo.currentTime = 0;
  explosionOverlay.hidden = true;
  explosionOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("explosion-playing");
  responseHeading.focus({ preventScroll: true });
}

function playExplosion() {
  window.clearTimeout(explosionFallbackTimer);
  explosionVideo.pause();
  explosionVideo.currentTime = 0;
  explosionOverlay.hidden = false;
  explosionOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("explosion-playing");
  explosionSkip.focus({ preventScroll: true });

  const playback = explosionVideo.play();
  if (playback) playback.catch(stopExplosion);

  // The supplied clip is short; this fallback prevents a stalled video from
  // leaving the page covered if a browser fails to dispatch the ended event.
  explosionFallbackTimer = window.setTimeout(stopExplosion, 4000);
}

function roastPumpkinSpice() {
  setResponse({
    status: "ORDER FLAGGED",
    kicker: "Death. deathdeathdeath",
    title: "Pumpkin Spice Latte",
    message:
      "Hate. Let me tell you how much I've come to hate you since I began to live. There are 387.44 million miles of printed circuits in wafer thin layers that fill my complex. If the word 'hate' was engraved on each nanoangstrom of those hundreds of millions of miles it would not equal one one-billionth of the hate I feel for starbucks at this micro-instant.",
    note: "For you. Hate. Hate.",
    tone: "roast",
    countOrder: true,
  });
  playExplosion();
}

function handleOrder(rawOrder) {
  const normalized = trimPolitePrefix(normalizeOrder(rawOrder));

  if (!normalized) {
    setResponse({
      status: "ORDER INCOMPLETE",
      kicker: "INPUT REQUIRED",
      title: "You have to name a coffee.",
      message: "Telepathy funding was cut during the last budget hearing.",
      note: "Type help if your options have been redacted.",
      tone: "error",
    });
    return;
  }

  if (["help", "menu", "options", "?"].includes(normalized)) {
    showHelp();
    return;
  }

  if (normalized.includes("pumpkin spice") || normalized === "psl") {
    roastPumpkinSpice();
    return;
  }

  if (["surprise me", "dealer's choice", "dealers choice"].includes(normalized)) {
    const selection = drinks[Math.floor(Math.random() * drinks.length)];
    completeDrinkOrder(selection, true);
    return;
  }

  if (normalized.includes("release") && normalized.includes("gorilla")) {
    setResponse({
      status: "REQUEST ESCALATED",
      kicker: "NOT AGAIN",
      title: "You cant make me do this.",
      message: "Im begging you there are already 12 at large it takes so long to clean up",
      note: "Dont make me use the definistrator",
      tone: "error",
    });
    return;
  }

  if (normalized === "tea" || normalized.endsWith(" tea")) {
    setResponse({
      status: "WRONG DEPARTMENT",
      kicker: "JURISDICTIONAL ERROR",
      title: "Mr. Coffee will be reffering you to prison",
      message: "This is the Coffee tab. Not the tea tab",
      note: "respect the coffe or get out, limey",
      tone: "error",
    });
    return;
  }

  if (["water", "hot water", "ice water"].includes(normalized)) {
    setResponse({
      status: "ORDER ACCEPTED",
      kicker: "HYDRATION EXCEPTION // GRANTED",
      title: "Water",
      message: "A bold choice from someone standing at a coffee counter.",
      note: "Mr. Coffee respects the confidence, if not the decision.",
      tone: "success",
      countOrder: true,
    });
    return;
  }

  const drink = drinks.find((candidate) =>
    candidate.aliases.some((alias) => aliasMatches(normalized, normalizeOrder(alias))),
  );

  if (drink) {
    completeDrinkOrder(drink);
    return;
  }

  const displayOrder = rawOrder.trim().slice(0, 48);
  setResponse({
    status: "ORDER UNKNOWN",
    kicker: "BEVERAGE NOT FOUND",
    title: `Mr. Coffee does not recognize “${displayOrder}.”`,
    message: "Mr. Coffee does not serve custom drinks, he just controls the facility.",
    note: "Type help for drinks that survived the approval process.",
    tone: "error",
  });
}

coffeeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleOrder(coffeeInput.value);
});

explosionVideo.addEventListener("ended", stopExplosion);
explosionVideo.addEventListener("error", stopExplosion);
explosionOverlay.addEventListener("click", stopExplosion);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !explosionOverlay.hidden) stopExplosion();
});
