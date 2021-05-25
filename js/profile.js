const userData = JSON.parse(localStorage.getItem("userData"));
if (!userData) {
  window.location.href = "/";
}

// DEFINE VARIABLES

const userAvatarImg = document.querySelector(".gh-user__avatar");
const userContentAvatar = document.querySelector(".content-nav-profile-img");
const userMainAvatar = document.querySelector("#user-profile-avatar");
const createActionsBtn = document.querySelector("#create-actions-btn");
const createActionsDiv = document.querySelector("#create-actions");
const viewOptionsBtn = document.querySelector("#view-options-btn");
const viewOptionsDiv = document.querySelector("#view-options");
const userStatusDiv = document.querySelector(".gh-user-status");
const userProfileContentDiv = document.querySelector(".content-nav-profile");
const userSignedInDiv = document.querySelectorAll(".gh-current-username");
const userFullName = document.querySelector(".gh-user-fullname");
const userBio = document.querySelector(".user-profile-bio");
const userRepoCount = document.querySelector("#numofrepo");
const userRepoDiv = document.querySelector(".user-repo-list");
const htmlBody = document.querySelector(".profile-body");
const contentNavDiv = document.querySelector(".section-content-nav");
const mobileSectionNav = document.querySelector(".mobile-section-nav");

// set document title to username and fullname as in https://github.com/ghost
document.title = `${userData.login} (${userData.name})`;

// set user avatar
userAvatarImg.src = userData.avatarUrl;
userContentAvatar.src = userData.avatarUrl;
userMainAvatar.src = userData.avatarUrl;

// set user repo count
userRepoCount.textContent = userData.repositories.totalCount;
// set users status
userStatusDiv.innerHTML = `${
  userData?.status?.emojiHTML
    ? `${userData.status.emojiHTML} <span class="gh-status-message">${
        userData.status?.message ? userData.status?.message : "Edit Status"
      }</span>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"></path></svg><span class="gh-status-message"> Set status </span>`
}`;

// set current signed in user
// console.log(userSignedInDiv);
for (user of userSignedInDiv) {
  user.textContent = `${userData.login}`;
}
userFullName.textContent = userData.name;
userBio.textContent = userData.bio;

// handle dropdowns
viewOptionsBtn.addEventListener("click", () => {
  viewOptionsDiv.classList.toggle("d-flex-show");
  createActionsDiv.classList.remove("d-flex-show");
});

createActionsBtn.addEventListener("click", () => {
  createActionsDiv.classList.toggle("d-flex-show");
  viewOptionsDiv.classList.remove("d-flex-show");
});

// show user avatar and username on sticky nav
window.addEventListener("scroll", () => {
  window.scrollY > 400
    ? userProfileContentDiv.classList.add("gh-visible")
    : userProfileContentDiv.classList.remove("gh-visible");
});

// move section-content-nav div after profile info in devices < 765px
const moveContentNav = () => {
  window.innerWidth < 765
    ? (mobileSectionNav.innerHTML = contentNavDiv.innerHTML)
    : (mobileSectionNav.innerHTML = "");

  window.innerWidth < 765
    ? (contentNavDiv.style.display = "none")
    : (contentNavDiv.style.display = "flex");
};
window.addEventListener("resize", () => {
  moveContentNav();
});

// function to format date

function formatDate(date) {
  let updateMonth = new Date(date).getMonth();
  let currentMonth = new Date().getMonth();

  if (updateMonth === currentMonth) {
    let dateOfUpdate = new Date(date).getDate();
    let currentDate = new Date().getDate();
    return `${currentDate - dateOfUpdate} days ago`;
  } else {
    date = new Date(date).toDateString().split(" ");
    date.shift(), date.pop();
    return `on ${date.join(" ")}`;
  }
}

// load user repos
let userRepoData = userData?.repositories?.nodes;
userRepoData &&
  userRepoData.forEach((repo) => {
    userRepoDiv.innerHTML += `<div class="user-repo-list__box">
    <div class="repo-details">
      <h3>
        <a href="${repo.url}" class="repo-name">${repo?.name}</a>
      </h3>
      <div class="repo-desc">
        ${repo?.description ? repo.description : ""}
      </div>

      <div class="repo-info-box">
     ${
       repo?.languages?.nodes[0]?.name
         ? `
         <span class="repo-box__item repo-box__lang"
        > ${
          repo?.languages?.nodes[0]?.color
            ? `<div class="gh-lang-indicator" style=" background-color: ${repo?.languages?.nodes[0]?.color}"></div>`
            : ""
        }
      
          ${repo?.languages?.nodes[0]?.name}</span
        >`
         : ""
     }
       
        <span class="repo-box__item repo-box__stars"
          ><svg
            class="gh-icon--grey"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <path
              fill-rule="evenodd"
              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
            ></path></svg
          >${repo?.stargazerCount}</span
        >
          ${
            repo.isFork
              ? `<span class="repo-box__item repo-box__forks">
              <svg
                class="gh-icon--grey"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                ></path>
              </svg>
              ${repo?.forkCount}
            </span>
            `
              : ""
          }
        
        <span class="repo-box__item repo-box__timestamp"
          >Updated ${formatDate(repo?.updatedAt)}</span
        >
      </div>
    </div>
    <div class="repo-actions">
      <button class="btn btn--white">
        <svg
          class="gh-icon--grey"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="16"
          height="16"
        >
          <path
            fill-rule="evenodd"
            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
          ></path>
        </svg>
        Star
      </button>
    </div>
  </div>
  `;
  });
