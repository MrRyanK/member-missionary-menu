"use strict";

const DATA_URL = "./data/activities.json";
const FILTERS = [
  { key: "action", label: "Action" },
  { key: "difficulty", label: "Effort" },
  { key: "timeframe", label: "When" }
];

const state = {
  data: null,
  selections: { action: [], difficulty: [], timeframe: [] },
  currentActivityId: null,
  remainingIds: [],
  filterKey: ""
};

const filterGroups = document.querySelector("#filter-groups");
const matchCount = document.querySelector("#match-count");
const title = document.querySelector("#activity-title");
const description = document.querySelector("#activity-description");
const tags = document.querySelector("#activity-tags");
const statusMessage = document.querySelector("#status-message");
const nextButton = document.querySelector("#next-button");

function getCategoryLabel(category, id) {
  return state.data.categories[category].find((item) => item.id === id)?.label ?? id;
}

function buildFilterControls() {
  filterGroups.replaceChildren();

  for (const filter of FILTERS) {
    const group = document.createElement("div");
    group.className = "filter-group";

    const label = document.createElement("span");
    label.className = "filter-label";
    label.id = `filter-label-${filter.key}`;
    label.textContent = filter.label;

    const options = document.createElement("div");
    options.className = "option-list";
    options.setAttribute("role", "group");
    options.setAttribute("aria-labelledby", label.id);

    for (const choice of state.data.categories[filter.key]) {
      const button = document.createElement("button");
      button.className = "option-button";
      button.type = "button";
      button.textContent = choice.label;
      button.dataset.filter = filter.key;
      button.dataset.value = choice.id;
      button.setAttribute("aria-pressed", String(state.selections[filter.key].includes(choice.id)));
      button.addEventListener("click", handleFilterChange);
      options.append(button);
    }

    group.append(label, options);
    filterGroups.append(group);
  }
}

function matchingActivities() {
  return state.data.activities.filter((activity) =>
    FILTERS.every(({ key }) =>
      state.selections[key].includes(activity[key])
    )
  );
}

function selectionKey() {
  return FILTERS.map(({ key }) => state.selections[key].join(",")).join("|");
}

function updateFilterButtons() {
  for (const button of filterGroups.querySelectorAll(".option-button")) {
    button.setAttribute(
      "aria-pressed",
      String(state.selections[button.dataset.filter].includes(button.dataset.value))
    );
  }
}

function setActivity(activity) {
  state.currentActivityId = activity.id;
  title.textContent = activity.title;
  description.textContent = activity.description;
  description.hidden = !activity.description;
  tags.replaceChildren();

  const activityTags = [
    getCategoryLabel("action", activity.action),
    getCategoryLabel("difficulty", activity.difficulty),
    getCategoryLabel("timeframe", activity.timeframe)
  ];
  for (const text of activityTags) {
    const tag = document.createElement("span");
    tag.className = "activity-tag";
    tag.textContent = text;
    tags.append(tag);
  }
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function drawNextActivity(matches) {
  if (state.remainingIds.length === 0) {
    state.remainingIds = matches
      .filter((activity) => activity.id !== state.currentActivityId)
      .map((activity) => activity.id);

    if (state.remainingIds.length === 0) {
      state.remainingIds = matches.map((activity) => activity.id);
    }

    shuffle(state.remainingIds);
  }

  const nextId = state.remainingIds.shift();
  return matches.find((activity) => activity.id === nextId);
}

function updateResults() {
  const matches = matchingActivities();
  const key = selectionKey();

  if (key !== state.filterKey) {
    state.filterKey = key;
    state.remainingIds = [];
  }

  matchCount.textContent = `${matches.length} ${matches.length === 1 ? "idea" : "ideas"}`;
  statusMessage.textContent = "";
  nextButton.disabled = matches.length === 0;

  if (matches.length === 0) {
    state.currentActivityId = null;
    title.textContent = "No ideas match those filters";
    description.textContent = "Select at least one option in each filter group to find matching ideas.";
    description.hidden = false;
    tags.replaceChildren();
    return;
  }

  setActivity(drawNextActivity(matches));
}

function handleFilterChange(event) {
  const { filter, value } = event.currentTarget.dataset;
  if (state.selections[filter].includes(value)) {
    state.selections[filter] = state.selections[filter].filter((item) => item !== value);
  } else {
    state.selections[filter].push(value);
  }
  state.currentActivityId = null;
  updateFilterButtons();
  updateResults();
}

async function start() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Could not load activities (${response.status}).`);
    }
    state.data = await response.json();
    buildFilterControls();
    updateResults();
  } catch (error) {
    console.error("Unable to start the activity menu:", error);
    filterGroups.textContent = "The activity menu could not be loaded.";
    matchCount.textContent = "";
    title.textContent = "We couldn't load the activity menu";
    description.textContent = "Please check your connection and reload the page.";
    description.hidden = false;
    statusMessage.textContent = error.message;
  }
}

nextButton.addEventListener("click", () => {
  updateResults();
});

start();
