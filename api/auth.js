import * as FileSystem from 'expo-file-system';

export const Login =  (authData) => {
    fetch('http://192.168.43.216:8080/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: authData.username,
          password: authData.password,
        }),
    }).then(data=>{
        return(data.status);
    }).catch(err=>{
        return("Error"+err);
    });    
}

export const Register = (registerData) => {
    console.log(registerData)
}