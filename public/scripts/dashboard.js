import * as utils from '/scripts/userUtils.js'

document.addEventListener('DOMContentLoaded', () => {
    async function getDataFromServer() {

        //get the data from the server
        const data = await utils.fetchUserData();

        //set values as per data
        document.querySelector('.greetings h1').innerHTML = `Hi ${data.firstName},`;
    }
    getDataFromServer();
})