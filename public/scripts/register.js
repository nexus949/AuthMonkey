import * as utils from '/scripts/userUtils.js'

document.addEventListener('DOMContentLoaded', () => {
    let passwordField = document.querySelector('.password');
    let passwordFieldLabel = document.querySelector('.password-label');
    let submitButton = document.querySelector('.register-button');

    let containsPasswordValidationMessage = false;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    let confirmPasswordField = document.querySelector('.confirm-password');
    let confirmPasswordFieldLabel = document.querySelector('.confirm-password-label');

    let containsConfirmPasswordValidationMessage = false;

    passwordField.addEventListener('input', () => {
        let isValid = regex.test(passwordField.value);

        if (!isValid) {
            addPasswordValidationMessage();

        }
        else {
            removePasswordValidationMessage();
        }

        validatePasswords();
        checkPasswords();
    })

    function addPasswordValidationMessage() {

        //if the validation message is already there return immidiately. (nothing to add)
        if (containsPasswordValidationMessage) return;

        let passwordValidationMessage = document.createElement('p');

        //by adding a class to it i can add the styles and access it again when i need to remove the message.
        passwordValidationMessage.classList.add('password-validation-message');

        passwordValidationMessage.innerText = "Password must contain at least 6 characters with letters and digits.";
        passwordFieldLabel.append(passwordValidationMessage);

        containsPasswordValidationMessage = true;

    }

    function removePasswordValidationMessage() {

        //if validation message is not present return immediately. (nothing to remove)
        if (!containsPasswordValidationMessage) return;

        let passwordValidationMessage = document.querySelector('.password-validation-message');
        passwordValidationMessage.remove();

        containsPasswordValidationMessage = false;
    }

    confirmPasswordField.addEventListener('input', () => {
        validatePasswords();
        checkPasswords();
    })

    function addConfirmPasswordValidationMessage() {

        //if the confirm password validation message is present return immidiately. (nothing to add)
        if (containsConfirmPasswordValidationMessage) return;

        let confirmPasswordValidationMessage = document.createElement('p');

        confirmPasswordValidationMessage.classList.add('confirm-password-validation-message');

        confirmPasswordValidationMessage.innerText = "Passwords Do not match !";
        confirmPasswordFieldLabel.append(confirmPasswordValidationMessage);

        containsConfirmPasswordValidationMessage = true;

    }

    function removeConfirmPasswordValidationMessage() {

        //if the confirm password validation message is not present return immidiately. (nothing to remove)
        if (!containsConfirmPasswordValidationMessage) return;

        let confirmPasswordValidationMessage = document.querySelector('.confirm-password-validation-message');
        confirmPasswordValidationMessage.remove();

        containsConfirmPasswordValidationMessage = false;
    }

    function validatePasswords() {
        if (passwordField.value !== confirmPasswordField.value) {
            addConfirmPasswordValidationMessage();
        }
        else {
            removeConfirmPasswordValidationMessage();
        }
    }

    //this function dynamically enables the submit button provided both the password and the confirm password are the same
    function checkPasswords() {
        if (passwordField.value === confirmPasswordField.value) {
            submitButton.disabled = false;
        }
        else {
            submitButton.disabled = true;
        }
    }
    
    // function appendResponseErrorMsg(element, message){
    //     //check if a message is already existing, if yes remove it immediately !
    //     let existingMsg = element.querySelector('div');
    //     if(existingMsg) existingMsg.remove();

    //     let responseMsg = utils.createMessageDiv(message);
    //     element.append(responseMsg);
    //     setTimeout( () => { responseMsg.remove() }, 10000);
    // }

    document.querySelector('#register-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {};

        formData.forEach((value, key) => data[key] = value);

        try {
            const response = await fetch('/user/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = '/user/dashboard';
            }
            else {
                const errorData = await response.json();
                if(response.status === 409){
                    utils.showErrorMsg(document.querySelector('.email-label'), errorData.message);
                }
                else if(response.status === 400){
                    utils.showErrorMsg(document.querySelector('.email-label'), errorData.message);
                }
                else{
                    alert(errorData.message);
                }
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    })
})