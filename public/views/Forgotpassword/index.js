async function forgotpassword(e) {
    try{
    e.preventDefault();
    const userDetails={
        email:e.target.email.value
    }

  
    console.log(userDetails)
    axios.post('/password/forgotpassword',userDetails).then(response => {
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
        console.log(response)
    })
    .catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
} catch(err){
    document.body.innerHTML+=`<div style="color:red;">${err}</div>`
}
}