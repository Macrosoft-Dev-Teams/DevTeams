const AWS = require('aws-sdk');

AWS.config.update({
	region: process.env.region,
	credentials: {
		accessKeyId: process.env.accessKeyId,
		secretAccessKey: process.env.secretAccessKey,
		sessionToken: process.env.sessionToken,
	},
});

const cognitoISP = new AWS.CognitoIdentityServiceProvider({
	apiVersion: '2016-04-18',
});

const getUsers = async () => {
	const params = {
		UserPoolId: process.env.userPoolId,
	};

	try {
		const response = await cognitoISP.listUsers(params).promise();

		return {
			ok: true,
			data: response,
		};
	} catch (error) {
		return {
			ok: false,
			error: error,
		};
	}
};

module.exports = {
	getUsers,
};
