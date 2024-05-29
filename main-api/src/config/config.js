const { Router } = require("express");

const configRouter = Router();

configRouter.get('/config.json', (_, res) => {
	res.status(200).json({
		IT_WORKS: 'Just testing that config works',
	});
});

module.exports = {
	configRouter,
};
