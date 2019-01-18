function editProfile() {

    var des = document.getElementById('des')
    var original = des.innerText
    des.innerHTML = "<form method='post' action='/update' autocomplete='off'>" +
        "<textarea name='newdes' id='newdes' >" + original + "</textarea>"
        + "<input type='submit' name='submit' onclick='editall()'></form>"
    input_ = document.getElementById('newdes')
    let telephone = document.getElementById("telephone");
    telephone.readOnly = false;
    telephone.style.background = 'white'
    let profilepiclink = document.getElementById("profilepiclink");
    profilepiclink.readOnly = false;
    profilepiclink.style.background = 'white'    
    // let button = document.getElementById('edit')
    console.log(document.getElementById('email').innerText)
}


function editall() {
    var des = document.getElementById('des').children[0]
    let tel = document.createElement('input')
    tel.type = 'hidden'
    tel.name = "telephone"
    tel.value = document.getElementById('telephone').value
    des.appendChild(tel)
    let email = document.createElement('input')
    email.type = 'hidden'
    email.name = "email"
    email.value = document.getElementById('email').innerText
    let profilepiclink = document.createElement('input')
    profilepiclink.type = 'hidden'
    profilepiclink.name = "profilepiclink"
    profilepiclink.value = document.getElementById('profilepiclink').value
    
    des.appendChild(email)
    des.appendChild(profilepiclink)
}