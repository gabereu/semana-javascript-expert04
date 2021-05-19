export default class View{
    static updateUserImage({ img, username }){
        const imageUser = document.getElementById('imgUser');
        imageUser.src = img;
        imageUser.alt = username;
    }
}