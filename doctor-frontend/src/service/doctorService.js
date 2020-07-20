import axios from "../axios";
import status from '../configs/appointment_status'

const doctorService = {};

doctorService.getDoctorByJwt = (token) => new Promise((reslove, reject) => {
    const api = "/api/doctor/jwt/one";
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            reslove(result.data)
        })
        .catch(err => reject(err))
});

doctorService.getAppointmentsTimeTable = (data, token) => new Promise((resolve, reject) => {
    const api = `/api/doctor/${data.docID}/appointments/status/${status.dueDate}?from=${data.dateFrom}&to=${data.dateTo}`;
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            // console.log(result.data)
            resolve(result.data)
        })
        .catch(err => reject(err))
});

doctorService.getAppointmentsDetail = (data, token) => new Promise((resolve, reject) => {
    const api = `/api/appointment/${data}`;
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            resolve(result.data.appointment[0])
        })
        .catch(err => reject(err))
});

doctorService.getPatientDetail = (data, token) => new Promise((resolve, reject) => {
    const api = `/api/patient/${data}`;
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            resolve(result.data.patient)
        })
        .catch(err => reject(err))
});


doctorService.getDoctorDetail = async (id) => {
    try {
        const result = await doctorService.getDoctorNormalDetail(id);;        
        const languages = await doctorService.getDoctorLanguage(id);
        const degrees = await doctorService.getDoctorDegree(id);
        const experiences = await doctorService.getDoctorExperience(id);

        const data = {...result , ...languages , ...degrees, ...experiences};
        return data;
    } catch (err) {
        throw err;
    }

}

doctorService.getDoctorExperience = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id + '/experiences'
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getDoctorNormalDetail = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id +'?rating=true'
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getDoctorLanguage = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id + '/languages'
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getAllRating = (data) => new Promise((resolve, reject) => {
    const query = `/api/doctor/${data?.data?.doctorId}/ratings`
    axios.get(query, {
        params: {
            itemsPage: 3,
            page: data?.data?.pageRatingNum
        }
    })
        .then(result => resolve(result.data))
        .catch(err => reject(err))
})

doctorService.getDoctorDegree = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id + '/degrees'
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.changePassword = (doctorId, curPass, newPass, confirmPass, token) => new Promise((reslove, reject) => {
    const query = `/api/auth/doctor/${doctorId}/change-password`
    axios.put(query,{
        password: curPass,
        new_password: newPass,
        confirm_password: confirmPass
    },{
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


doctorService.requestNewService = (doctorId, data, token) => new Promise((reslove, reject) => {
    console.log(doctorId,' ',data);
    console.log(data.data.name);
    axios.post(`/api/doctor/${doctorId}/service-request`,
        {
            name: data?.data?.name,
            description: data?.data?.description,
            reason: data?.data?.reason,
            price: data?.data?.price
        },
        {
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*',
                
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getAllServiceRequest = (doctorId,token) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + doctorId + '/service-request'
    axios.get(query,{
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

export default doctorService;