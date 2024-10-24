document.addEventListener('DOMContentLoaded', () => {

    /*account deletion button naming scheme -> 

    1. confirmation buttons -> This will take you to the "provide password to delete your account" window.
    2. activation buttons -> This will delete the account provided the password for the account is correct.
    
    similar naming scheme with the cancellation buttons...
    */

    //acc deletion confirmation popup
    let confirmationPopup = document.querySelector('.deletion-confirmation-popup');

    //acc deletion activation popup
    let activationPopup = document.querySelector('.deletion-activation-popup');

    //acc deletion confirmation button
    let confirmAccountDeletionButton = document.querySelector('.delete-account-yes');

    //cancel acc deletion confirmation button
    let notConfirmAccountDeletionButton = document.querySelector('.delete-account-cancel');

    //acc deletion activation button
    let activateAccountDeletionButton = document.querySelector('.confirm-delete-account-button');

    //cancel acc deletion activation button
    let notActivateAccountDeletionButton = document.querySelector('.cancel-delete-account-button');

    //logout buttons
    let logoutButton = document.querySelector('.logout-button');
    let logoutPopup = document.querySelector('.logout-popup')
    let confirmLogoutButton = document.querySelector('.logout-yes');
    let notConfirmLogoutButton = document.querySelector('.logout-cancel');

    let deleteAccountButton = document.querySelector('.delete-account-button');

    // Overlay
    let overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
    document.body.appendChild(overlay);

    //functions for showing and hiding popups
    const showPopup = (popup) => {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    };

    const hidePopup = (popup) => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    };

    deleteAccountButton.addEventListener('click', () => {
        showPopup(confirmationPopup);
    });

    //are you sure you want to delete your account ? -> YES
    confirmAccountDeletionButton.addEventListener('click', () => {
        confirmationPopup.style.display = 'none';
        activationPopup.style.display = 'block';
    });

    //are you sure you want to delete your account ? -> CANCEL
    notConfirmAccountDeletionButton.addEventListener('click', () => {
        hidePopup(confirmationPopup);
    });

    //Confirm password for account deletion -> CANCEL
    notActivateAccountDeletionButton.addEventListener('click', () => {
        hidePopup(activationPopup);
    });

    logoutButton.addEventListener('click', () =>{
        showPopup(logoutPopup);
    })

    notConfirmLogoutButton.addEventListener('click', () =>{
        hidePopup(logoutPopup);
    })

    // Close popup when clicking outside
    overlay.addEventListener('click', () => {
        hidePopup(confirmationPopup);
        hidePopup(activationPopup);
        hidePopup(logoutPopup);
    });

    //dynamic input for password change
    let changePasswordSettings = document.querySelector('#change-password-send-request-form');

    let confirmOldPassword = document.createElement('input');
    let resetPassButton = document.createElement('button');

    resetPassButton.textContent = 'Change Password';
    resetPassButton.classList.add('reset-pass-button');

    confirmOldPassword.placeholder = 'Enter current Password';
    confirmOldPassword.required = true;
    confirmOldPassword.classList.add('confirm-old-password');

    document.querySelector('.change-password-button').addEventListener('click', function(){
        changePasswordSettings.append(confirmOldPassword);
        changePasswordSettings.append(resetPassButton);
        this.disabled = true;
        this.classList.add('disabled-buttons');
    })

    //change the info save function button to not disabled state if there is any change in the input fields
    let inputs = document.querySelectorAll('.name-input-field, .surname-input-field, .email-input-field');
    let saveButton = document.querySelector('.info-submit-button');
    
    inputs.forEach(input =>{
        input.addEventListener('input', () =>{
            let defaultValue = input.defaultValue;
            
            if(defaultValue !== input.value){
                saveButton.disabled = false;
                saveButton.classList.add('non-disabled-buttons');
                saveButton.classList.remove('disabled-buttons');
            }
            else{
                saveButton.disabled = true;
                saveButton.classList.add('disabled-buttons');
                saveButton.classList.remove('non-disabled-buttons');
            }
        })
    })
});
