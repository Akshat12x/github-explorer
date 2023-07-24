const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

searchButton.addEventListener('click', searchGitHub);

function searchGitHub() {
    const username = searchInput.value.trim();
    if (!username) return;

    fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
            showUserData(data);
        })
        .catch((error) => {
            showError(error.message);
        });
}

function showUserData(user) {
    resultsContainer.innerHTML = `
        <h2>${user.name}</h2>
        <p><strong>Username:</strong> ${user.login}</p>
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Following:</strong> ${user.following}</p>
        <p><strong>Public Repositories:</strong> ${user.public_repos}</p>
        <img src="${user.avatar_url}" alt="${user.name}" style="max-width: 100px; border-radius: 50%;">
    `;
}

function showError(message) {
    resultsContainer.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
}

const searchRepoButton = document.getElementById('searchRepoButton');
const searchRepoInput = document.getElementById('searchRepoInput');
const repoResultsContainer = document.getElementById('repoResults');
const userRepositoriesContainer = document.getElementById('userRepositories');

searchRepoButton.addEventListener('click', searchRepositories);

function searchRepositories() {
    const repoName = searchRepoInput.value.trim();
    if (!repoName) return;

    const username = searchInput.value.trim();
    if (!username) return;

    fetch(`https://api.github.com/search/repositories?q=${repoName}+user:${username}`)
        .then((response) => response.json())
        .then((data) => {
            showRepositories(data.items);
        })
        .catch((error) => {
            showError(error.message);
        });
}

function showRepositories(repositories) {
    repoResultsContainer.innerHTML = '';
    repositories.forEach((repo) => {
        const repoItem = document.createElement('div');
        repoItem.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p><strong>Description:</strong> ${repo.description || 'N/A'}</p>
            <p><strong>Language:</strong> ${repo.language || 'N/A'}</p>
            <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
            <p><strong>Watchers:</strong> ${repo.watchers_count}</p>
        `;
        repoResultsContainer.appendChild(repoItem);
    });
}

function showUserRepositories(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then((response) => response.json())
        .then((data) => {
            showRepositories(data);
        })
        .catch((error) => {
            showError(error.message);
        });
}

// Call this function after showing user data to display their repositories
function showUserData(user) {
    // ... (previous code to display user data)
    showUserRepositories(user.login);
}

function showUserRepositories(username, page = 1) {
    const perPage = 10; // Number of repositories per page
    fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`)
        .then((response) => response.json())
        .then((data) => {
            showRepositories(data);
            // Check if there are more repositories
            if (data.length === perPage) {
                const nextPageButton = document.createElement('button');
                nextPageButton.innerText = 'Load More Repositories';
                nextPageButton.addEventListener('click', () => {
                    showUserRepositories(username, page + 1);
                    nextPageButton.remove();
                });
                userRepositoriesContainer.appendChild(nextPageButton);
            }
        })
        .catch((error) => {
            showError(error.message);
        });
}

// Modify showUserData function to only show the first batch of repositories
function showUserData(user) {
    // ... (previous code to display user data)
    showUserRepositories(user.login);
}
