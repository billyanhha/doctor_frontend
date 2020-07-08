import axios from "../axios";
import { message } from "antd";


const authService = {};


authService.doctorLogin = (values) => new Promise((resolve, reject) => {
    const api = '/api/auth/doctor/signin';
    const params = new URLSearchParams();    
    params.append("email", values.email);
    params.append("password", values.password);

    axios.post(api, params)
        .then(result => {
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        })
}) 



export default authService;