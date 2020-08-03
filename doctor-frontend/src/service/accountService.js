import axios from "../axios";

const accountService = {};

accountService.sendMailReset = (data) =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/mail-reset-password`;
        axios
            .post(api, data.data)
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

accountService.sendPasswordReset = (token, data) =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/doctor/account/reset-password/${token}`;
        axios
            .put(api, data)
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

accountService.checkEmailExpired = (token) =>
    new Promise((resolve, reject) => {
        const api = `/api/auth/check-mail-token`;
        axios
            .get(api, {
                params: {
                    token: token
                }
            })
            .then(result => {
                resolve(result.data);
            })
            .catch(err => reject(err));
    });

export default accountService;
