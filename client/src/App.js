import "./App.css"

import React from "react";

import { API, email_valid, phone_valid } from "./helperFunc"

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			supervisors: [],
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			supervisor: ""
		};	
	}

	/**
	 * Once the component mounts fetch the list of supervisors to show in the dropdown and select the first one by default
	 * Show an error if the request returned any response other than 200
	 */
	componentDidMount() {
		API.getSupervisors().then((resp)=>{
			if(resp.status === 200) {
				const supervisors = resp.supervisors
				this.setState({supervisors: supervisors})
				const initSupervisor = supervisors[0]
				this.setState({supervisor: initSupervisor})
			} else {
				alert("An error occured fetching supervisor list - please try again later")
			}
		})
	}

	/**
	 * Handles the text change in 4 of the form elements
	 * @param {object} e event from input 
	 */
	handleTextChange = (e) => {
		var value = e.target.value;
		switch(e.target.name) {
			case "firstNameInput":
				value = value.replace(/[^A-Za-z]/ig, '');
				this.setState({firstName: value});
				break;
			case "lastNameInput":
				value = value.replace(/[^A-Za-z]/ig, '');
				this.setState({lastName: value});
				break;
			case "emailInput":
				this.setState({email: value});
				break;
			case "phoneInput":
				this.setState({phone: value});
				break;
			default:
				break;
		}
	}

	/**
	 * Handles the selection change in drop down element
	 * @param {object} e event from dropdown
	 */
	handleSelectChange = (e) => {
		this.setState({supervisor: e.target.value});
	}

	/**
	 * Checks if all the form inputs are valid and returns a list of messages of the invalid inputs
	 * @returns {array} Array of error message strings, is any
	 */
	formInputsValid = () => {
		const firstNameValid = this.state.firstName.length > 1;
		const lastNameValid = this.state.lastName.length > 1;
		const supervisorValid = this.state.supervisor.length >1;
		const useEmail = this.state.email.length > 1;
		const usePhone = this.state.phone.length > 1;
		const eValid = useEmail ? email_valid(this.state.phone) : false;
		const pValid = usePhone ? phone_valid(this.state.email) : false;
		let submitIssues = [];
		if(!firstNameValid) {
			submitIssues.push("First name blank");
		}
		if(!lastNameValid) {
			submitIssues.push("Last name blank");
		}
		// if(!useEmail && !usePhone) {
		// 	submitIssues.push("Enter info for contact");
		// }
		if(useEmail && !eValid) {
			submitIssues.push("Invalid email");
		}
		if(usePhone && !pValid) {
			submitIssues.push("Invalid phone number");
		}
		if(!supervisorValid) {
			submitIssues.push("Invalid supervisor")
		}
		return submitIssues;
	}

	/**
	 * Handles the form submission. Will show an error message to the user if an error is present in the form
	 * Will also show an error message if the submit endpoint returns an error
	 */
	handleSubmit = () => {
		var submitIssues = this.formInputsValid();
		//no need to use an API call if we can verify the information here really quick
		if(submitIssues.length !== 0) {
			let toAlert = "There were errors in your submission, please address:\n"
			toAlert += submitIssues.join('\n')
			alert(toAlert)
		} else {
			API.submitNotifications(this.state).then((resp)=>{
				if(resp.status === 200) {
					alert("Thank you for your subscription!");
				} else {
					alert(resp.errorMsg);
				}
			});
		}
	}

	render() {
		return (
			<div className="Top">

				<div className="Title">
					Notification Form
				</div>

				<div className="Body">

					<div className="Row">

						<div className="Column">
							<div className="InputTitle">
								First Name
							</div>
							<input className="Input"
								type="text"
								name="firstNameInput"
								onChange={this.handleTextChange}
								value={this.state.firstName}
							/>
						</div>
						<div className="Column">
							<div className="InputTitle">
								Last Name
							</div>
							<input className="Input"
								type="text"
								name="lastNameInput"
								onChange={this.handleTextChange}
								value={this.state.lastName}
							/>
						</div>

					</div>

					<div className="Row">

						<div className="Column">
							<div className="InputTitle">
								Email
							</div>
							<input className="Input"
								name="emailInput"
								type="email"
								placeholder="Blank if undesired"
								onChange={this.handleTextChange}
							/>
						</div>
						<div className="Column">
							<div className="InputTitle">
								Phone
							</div>
							<input className="Input"
								name="phoneInput"
								// type="tel"
								placeholder="Blank if undesired"
								onChange={this.handleTextChange}
							/>
						</div>

					</div>

					<div className="FullWidthRow">

						<div className="InputTitleFullWidthRow">
							Supervisor
						</div>
						<select className="Select"
							onChange={this.handleSelectChange}
						>
							{
								this.state.supervisors.map((item, i) => {
									return (
										<option key={i} className="DropDownOption">
											{item}
										</option>
									)
								})
							}
						</select>

					</div>

					<div className="FullWidthRow">
						<button className="SubmitButton"
						onClick={this.handleSubmit}
						>
							Submit
						</button>
					</div>
					
				</div>
			</div>
		)
	}

}