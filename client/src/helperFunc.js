/**
* Contains base URL for API, endpoint(s), and function that returns json response
* from post request
*/
export const API = {
    url: "http://localhost:3001",
    submit: "/submit",
    supervisors: "/supervisors",
    /**
    * Get the concatenated string of the submit API endpoint
    * @returns {string} string url of the submit API endpoint
    */
    endpointSubmit: ()=> {
        return API.url+API.submit;
    },
    /**
     * Get the concatenated string of the Supervisors API endpoint
     * @returns {string} the url to the endpoint that returns the list of supervisors
     */
    endpointSupervisors: () => {
        return API.url+API.supervisors;
    },
    /**
    * API.post creates a post request to the specified API with the provided string data.\n
    * **DOES NOT have any error handling**
    * @param {string} endpoint 
    * @param {string} text 
    * @returns {object} json object of response
    */
    post: async (endpoint, data) => {
        return await fetch(endpoint, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data
            })
        })
        .then((response) => response.json())
        .then((json) => {
            // console.log(json);
            return json;
        })
    },
    /**
     * Gets a list of supervisors to be shown in the drop down
     * @returns {array[string]} List of supervisors
     */
    getSupervisors: async () => {
        return await API.post(API.endpointSupervisors(), null);
    },
    /**
     * Submit the form information to the back end and get a sucess or error message
     * @param {object} data Onject containing relevant info for notifaction signup
     * @returns {object} status code, error message (if error)
     */
    submitNotifications: async (data) => {
        return await API.post(API.endpointSubmit(), {
            firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			supervisor: data.supervisor,
        })
    },
}

/**
 * 
 * @param {string} email 
 * @returns true if email address is valid, false otherwise
 */
export const email_valid = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    
}

/**
 * 
 * @param {string} phone 
 * @returns true if phone is valid, false otherwise
 */
export const phone_valid = (phone) => {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(phone);
}