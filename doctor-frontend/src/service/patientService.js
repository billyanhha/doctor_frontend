import axios from "../axios";
import _ from "lodash";

const patientService = {};
patientService.getPatientInfo = (patientId,token) => new Promise((reslove, reject) => {
    axios.get(`/api/patient/${patientId}`,{
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


export default patientService;