import axios from "../axios";
import { message } from "antd";

const formService = {};

formService.getForm = (name, token) => new Promise((resolve, reject) => {
    const api = '/api/form';

    axios.get(api, {
        params: {
            name: name
        }
        ,
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            
            resolve(result.data);
        })
        .catch(err => {
            reject(err);
        })
})

export default formService
