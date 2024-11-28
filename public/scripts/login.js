document.addEventListener('DOMContentLoaded', () =>{
    //clear sessionStorage if any
    sessionStorage.clear();

    document.querySelector('#login-form').addEventListener('submit', async function(e){
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const data = {};
    
        formData.forEach((value, key) => data[key] = value);
        
        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                window.location.href = '/user/dashboard';
            }
            else{
                const errorData = await response.json();
                console.log(errorData);
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    })
})