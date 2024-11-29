/*This file contains a set of utility functions for retrieving and setting data from the server and session storage. 
When the user is redirected to the dashboard, user data is fetched from the server and is stored in the sessionStorage so that it persists
across dashboard and settings pages and can be accessed without redundant server requests. */

//set data in the session storage 
export function initializeUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

//get data from sessionStorage
export function getUserData() {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
        return JSON.parse(userData);
    }
    else {
        return null;
    }
}

//get user data from the server if needed (everytime the tab is opened)
export async function fetchUserData() {
    try {
        const response = await fetch('/user/getUserData', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        initializeUserData(data); // Save to sessionStorage
        return data;
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

//create message divs that display error messages recieved from the server
export function createMessageDiv(message) {
    let responseMessage = document.createElement('div');
    responseMessage.innerHTML = message;
    responseMessage.classList.add('response-messages');
    return responseMessage;
}

export function showErrorMsg(element, message){
    //check if a message is already existing, if yes remove it immediately !
    let existingMsg = element.querySelector('div');
    if(existingMsg) existingMsg.remove();

    let responseMsg = createMessageDiv(message);
    element.append(responseMsg);
    setTimeout( () => { responseMsg.remove() }, 8000);
}