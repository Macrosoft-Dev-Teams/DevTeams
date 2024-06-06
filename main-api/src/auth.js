const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { getUserIdByEmail } = require('./users/users.db');

const verifier = CognitoJwtVerifier.create({
	tokenUse: 'id',
	userPoolId: process.env.userPoolId,
	clientId: process.env.userPoolClientId,
});

const auth = async (req, res, next) => {
	if (!req.headers['authorization']) {
		res.status(401).json({ message: req.headers['authorization'] });
	} else {
		const idToken = req.headers['authorization'].replace('Bearer ', '');

		try {
			const payload = await verifier.verify(idToken);

			res.locals.email = payload.email;
			res.locals.displayName = payload.name;

			res.locals.userId = await getUserIdByEmail(undefined, payload.email);

			next();
		} catch (error) {
			res.status(401).json({ message: error });
		}
	}
};

module.exports = {
	auth,
};
