function delUser(){
    let userid = event.target.id;
    var table = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    table.parentNode.removeChild(table)
    let form = document.createElement('form')
    form.action="/delUser";
    form.method='post';
    let input = document.createElement('input')
    input.type='hidden'
    input.name='delete';
    input.value=userid;
    form.appendChild(input)
    document.getElementById("users").appendChild(form)
    form.submit()
}