const { Router } = require("express");

const configRouter = Router();

configRouter.use('/config.json', (_, res) => {
	res.status(200).json({
		IT_WORKS: 'Just testing that config works',
	});
});

module.exports = {
	configRouter,
};
