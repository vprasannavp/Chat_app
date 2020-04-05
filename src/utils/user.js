const users = []

const addUser = ({id , username , room}) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error:"username & Room Required"
        }
    }
const exsistingUser = users.find((user) => {
    return user.room === room && user.username ===  username
})

if(exsistingUser) {
    return{
        error:"username in use"
    }
}

const user = {id,username,room}
users.push(user)
return{
    user
}


}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    } )

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUserById = (id) => {
    let data = []
users.filter((user) => {
if(user.id === id){
  data.push(user)
}
    } )
if( data.length !== 0 ){
return data
}else{
    return {
        error : "No Data Found"
    }
}
}

const getUsersByRoom = (room) => {
   room = room.trim().toLowerCase()
  let  dispUsers = []
    users.filter((user)=>{
if(user.room === room){
    dispUsers.push(user)
}
    })

    if(dispUsers.length !==0 ){
        return dispUsers
    }else{
        return {
            error : "No Users Found"
        }
    }
}

module.exports = {
    addUser,
    removeUser,
    getUserById,
    getUsersByRoom

}