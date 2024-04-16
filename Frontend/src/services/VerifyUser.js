import emailjs from '@emailjs/browser';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const length = 5;
const serviceID = "user_verification"; //Emailjs account service ID
const templateID = "template_verification"; //ID of template email in Emailjs account
const publicKey = "vnBhtE5c_E6py2X3I"; //Public Key of Emailjs account

// Referenced from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript 
// Generate a random code using above defined characters with a certain length (defined as 5 above)
function generateCode() {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

// Send code using Emailjs
function sendCode(userName, code){
    emailjs.send(serviceID,templateID,{
        to_name: userName,
        message: code,
    }, publicKey).then((result) => {
        console.log(result.text);
    }, (error) => {
        console.log(error.text);
    });
}

export { generateCode, sendCode }