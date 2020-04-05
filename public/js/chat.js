const socket =  io()
const messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoscroll = () => {
const newmessage = messages.lastElementChild
const newMessageStyles = getComputedStyle(newmessage)
const newMessageMargin = parseInt(newMessageStyles.marginBottom)
const newMessageHeight = newmessage.offsetHeight+newMessageMargin
const visibleheight =  messages.offsetHeight
console.log(newMessageMargin)
const containerHeight = messages.scrollHeight
const scrollOffset = messages.scrollTop+visibleheight
if(containerHeight - newMessageHeight <= scrollOffset){
    messages.scrollTop = messages.scrollHeight
}

}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const username = getParameterByName('username');
const room = getParameterByName('room');

socket.on('welcome',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{ message : message.text ,username:message.username, time : moment (message.createdAt).format('h:mm : a') })
    messages.insertAdjacentHTML('beforeend',html )

})
function getchat(){
event.preventDefault()
var msgtxt = document.querySelector("#chatTxt").value
document.querySelector("#chatTxt").setAttribute('disabled','disabled')
socket.emit('message',msgtxt,(error)=>{
    document.querySelector("#chatTxt").removeAttribute('disabled')
    if(error){
        return console.log(error)
    }
    console.log("Message Delivered")
    document.querySelector("#chatTxt").value=""
    document.querySelector("#chatTxt").focus()
})
}
socket.on('message',(message) => {
  
    console.log(message)

    const html = Mustache.render(messageTemplate,{ message : message.text , username:message.username, time : moment (message.createdAt).format('h:mm : a') })
    messages.insertAdjacentHTML('beforeend',html )
    autoscroll()

    })
    function getLocation(){
        if(!navigator.geolocation){
            return alert('Geolocation not supported')
        }
        document.querySelector("#location_btn").setAttribute('disabled','disabled')
        navigator.geolocation.getCurrentPosition((position)=>{
console.log(position)
socket.emit('sendLocation',position.coords.latitude,position.coords.longitude,()=>{
    console.log("Location Delivered")
    document.querySelector("#location_btn").removeAttribute('disabled')
})
        })
    }
socket.on('roomdata',({room,users}) => {
    console.log(room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate,{ room,users })
document.querySelector('#sidebar').innerHTML = html

})

socket.on('sendLocation',(data) => {
console.log(data)
    console.log('The user has loged in' , "https://www.google.co.in/maps/@"+data.lat+","+data.log+",15z")
        let location = "https://www.google.co.in/maps/@"+data.lat+","+data.log+",15z"
        const html = Mustache.render(locationTemplate,{location ,username:data.username , time : moment (data.createdAt).format('h:mm a') })
        messages.insertAdjacentHTML('beforeend',html )
        autoscroll()
    })

    socket.emit('join',{username,room},(error) => {
        if(error){
            alert(error)
            location.href="/"
        }
    })