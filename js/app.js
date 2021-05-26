const baseUrl = "https://api.github.com/graphql";
const GITHUB_API_KEY = config.key;

const getProfileBtn = document.querySelector("#gh-fetchbtn");
const errorDiv = document.querySelector(".user-form__error-msg");
let userName = document.querySelector("#gh-username");

const getData = async (query) => {
  let res = "";
  await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_API_KEY}`,
    },
    body: JSON.stringify(query),
  })
    .then((response) => response.json())
    .then((data) => {
      res = data.data.user;
    })
    .catch((error) => {
      if (error.message && error.message.indexOf("Network Error") !== -1) {
        errorDiv.textContent =
          "Network error, kindly check your internet connection";
      }
    });
  return res;
};

const fetchUserInfoQuery = (userName) => {
  return {
    query: `
    {
      user(login: "${userName}") {
                    avatarUrl(size: 400)
                    status {
                      message
                      emojiHTML
                    }
                    login
                    name
                    bio
                    starredRepositories {
                      totalCount
                    }
                    repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
                        nodes{
                            name
                            description
                            languages(orderBy: {direction: DESC, field: SIZE}, first: 1) {
                                nodes {
                                    color
                                    name
                                }
                            }
                            isFork
                            stargazerCount
                            forkCount
                            updatedAt
                            url
                            
                        }
                        totalCount
                    }
                }
            }`,
  };
};

getProfileBtn.addEventListener("click", async (e) => {
  await getProfile();
});

userName.onkeydown = async (e) => {
  if (e.code === "Enter") {
    await getProfile();
  }
};

const validateInput = () => {
  getProfileBtn.textContent = "View Profile";
  getProfileBtn.disabled = false;
  errorDiv.textContent = "kindly, enter a valid github username";
  errorDiv.style.visibility = "visible";
  errorDiv.style.opacity = "1";
};

/**
 *
 * @name getProfile
 * @description handles username submission
 *
 */
const getProfile = async () => {
  getProfileBtn.textContent = "Fetching profile...";
  getProfileBtn.disabled = true;
  let userData = "";
  if (userName.value) {
    userData = await getData(fetchUserInfoQuery(userName.value));
    if (userData) {
      getProfileBtn.textContent = "View Profile";
      getProfileBtn.disabled = false;
      localStorage.setItem("userData", JSON.stringify(userData));

      window.location.href = "/profile.html";
    } else {
      validateInput();
    }
  } else {
    validateInput();
  }
};
