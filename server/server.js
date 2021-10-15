const express = require("express");
const bodyParser = require("body-parser");
//per https://github.com/node-fetch/node-fetch/blob/HEAD/docs/v3-UPGRADE-GUIDE.md
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/**
 * Get the supervisor data
 * @returns {lsit[object]} the lsit of supervisor objects
 */
getSupervisorData = async () => {
	const url = "https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers";
	opts = {
		method: "GET",
		headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
	}
	const supervisorData = await fetch(url, opts)
	.then((response) => response.json())
	.then((json) => {return json;});
	return supervisorData;
}

/**
 * Sorts by: Jurisdiction, Last name, then First name
 * Removes the numeric supervisor jurisdictions
 * @param {list[object]} supervisorData the list of supervisor data
 */
sortCleanSupervisorData = (supervisorData) => {
	supervisorData.sort(function(a,b) {
		return a.jurisdiction.localeCompare(b.jurisdiction) || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
	});
	//remove the jurisditions with numbers in them
	for(let i = 0; i < supervisorData.length; i++) {
		// use \d to remove all numeric (d6), ^\d+$ for whole number (66)
		if(/\d/.test(supervisorData[i].jurisdiction)) {
			supervisorData.splice(i, 1);
			i--;
		} else {
			supervisorData[i] = `${supervisorData[i].jurisdiction} - ${supervisorData[i].lastName}, ${supervisorData[i].firstName}`;
		}
	}
}

/*
	two end-points:
	1. Get supervisors
	2. Submit notification request
*/

/**
 * 
 */
app.post("/submit", (req, res) => {
	var statusCode = 200;
	var err = "";
	try {
		var data = req.body.data;
		console.log(data);
		if(data.supervisor.length < 1) {
			err += `Invalid Supervisor: (${data.supervisor}).\n`;
			statusCode = 400;
		}
		if(data.firstName.length < 1) {
			err += `Invalid First Name: (${data.supervisor}).\n`;
			statusCode = 400;
		}
		if(data.lastName.length < 1) {
			err += `Invalid Last Name: (${data.supervisor}).\n`;
			statusCode = 400;
		}
	} catch(e) {
		console.log(e);
	}
	res.json({ status: statusCode, errorMsg: err });
});

/**
 * 
 */
app.post("/supervisors", async (req, res) => {
	var statusCode = 200;
	var err = "";

	try {
		var supervisorData = await getSupervisorData();
		try {
			sortCleanSupervisorData(supervisorData);
		} catch (e) {
			statusCode = 400;
			err += "Problem in the supervisor data. ";
		}
	} catch(e) {
		console.log(e);
		statusCode = 400;
		err += "Problem fetching supervisor data. ";
	}
	
	res.json({ status: statusCode, errorMsg: err, supervisors: supervisorData });
});

/**
 * Start listening for requests on the chosen port
 */
app.listen(PORT, () => {
	console.log("\033c"); //reset the terminal, I dislike seeing old text on there 🤷‍
    console.log(`Server listening on ${PORT}`);
});