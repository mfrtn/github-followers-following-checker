const axios = require("axios");

const GITHUB_USERNAME = "your-github-username";

const getGithubData = async (url) => {
	const results = [];
	let page = 1;
	while (true) {
		const response = await axios.get(`${url}?per_page=100&page=${page}`);
		console.log(response.data.length);
		results.push(...response.data);
		page += 1;
	}
	return results;
};

const getFollowers = async (username) => {
	const url = `https://api.github.com/users/${username}/followers`;
	const data = await getGithubData(url);
	return data.map((user) => user.login);
};

const getFollowing = async (username) => {
	const url = `https://api.github.com/users/${username}/following`;
	const data = await getGithubData(url);
	return data.map((user) => user.login);
};

const main = async () => {
	try {
		const followers = new Set(await getFollowers(GITHUB_USERNAME));
		const following = new Set(await getFollowing(GITHUB_USERNAME));

		const notFollowingBack = [...following].filter(
			(user) => !followers.has(user)
		);
		const notFollowedBack = [...followers].filter(
			(user) => !following.has(user)
		);

		console.log(
			"Users you follow but don't follow you back:",
			notFollowingBack
		);
		console.log(
			"Users who follow you but you don't follow back:",
			notFollowedBack
		);
	} catch (error) {
		console.error("Error fetching data from GitHub:", error);
	}
};

main();
