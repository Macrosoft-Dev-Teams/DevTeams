const { Router } = require('express');

const configRouter = Router();

configRouter.get('/config.json', (_, res) => {
	res.status(200).json({
		STATUS: 'config loaded',
	});
});

module.exports = {
	configRouter,
};
