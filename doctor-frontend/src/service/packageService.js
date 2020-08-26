import axios from "../axios";
import status from '../configs/appointment_status';
import _ from "lodash";
const packageService = {};

packageService.getDoctorPackage = (doctorId, params, token) => new Promise((reslove, reject) => {
    const api = `/api/doctor/${doctorId}/packages`;

    axios.get(api, {
        params: params,
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    }
    )
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.getPackageInfo = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}`;

    axios.get(api, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.changePackageStatus = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${data.packageId}/status/${data.statusId}`;

    axios.post(api, data, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.editPackage = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/doctor/${data.doctor_id}/packages/${data.package_id}`;

    data[data?.editfor] = data?.content
    delete data?.editfor
    delete data?.content

    axios.put(api, data, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            // if (!_.isEmpty(result?.data)) {
            //     console.log(result?.data);
            // }
            reslove(result.data)
        })
        .catch(err => reject(err))
})


packageService.addAppointmentPackage = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${data?.packageId}/appointments`;
    axios.post(api, data, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {
            if (!_.isEmpty(result?.data?.appointmentCreated?.appointment)) {
                const { id } = result?.data?.appointmentCreated?.appointment;
                packageService.addServiceAppointment(id, data.services, token)
            }
            reslove(result.data)
        })
        .catch(err => reject(err))
})

packageService.updateAppointmentPackage = (doctorId, appointmentId, data, token) => new Promise((reslove, reject) => {
    const api = `/api/doctor/${doctorId}/appointments/${appointmentId}`;
    axios.put(api, data, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(async result => {

            if (!_.isEmpty(result?.data) ) {
                const resultAdd = await packageService.addServiceAppointment(appointmentId, data?.services, data?.token)
                reslove(resultAdd || result?.data)
            }
        })
        .catch(err => reject(err))
})


packageService.addServiceAppointment = (id, services, token) => new Promise((reslove, reject) => {
    const api = `/api/appointment/${id}/services `;

    axios.post(api, {
        services: services,
    }, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(result => {
            reslove(result.data)
        })
        .catch(err => reject(err))
})



packageService.addServicePackage = (data, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${data?.packageId}/services/${data?.serviceId}`;

    axios.post(api, data, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.editServicePackage = (data, token) => new Promise((reslove, reject) => {

    const api = `/api/package/${data?.packageId}/services/${data?.package_service_id}`;

    axios.put(api, data, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.deleteServicePackage = (id, token) => new Promise((reslove, reject) => {

    const api = `/api/package-service/${id}`;

    axios.delete(api, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})




packageService.getPackageServices = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}/services`;

    axios.get(api,
        {
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.getPackageAppointments = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}/appointments`;

    axios.get(api, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.getPackageStatus = (id, token) => new Promise((reslove, reject) => {
    const api = `/api/package/${id}/status`;

    axios.get(api, {
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        },
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.doctorAcceptPackage = (doctorId, packageId, token) => new Promise((reslove, reject) => {
    axios.post(`/api/doctor/${doctorId}/packages/${packageId}/accept`,
        {},
        {
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})


packageService.doctorRejectPackage = (doctorId, packageId, note, token) => new Promise((reslove, reject) => {
    console.log(note)
    axios.post(`/api/doctor/${doctorId}/packages/${packageId}/reject`,
        { note }
        , {
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            },
        })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

packageService.getNotAssignPackageQuery = (doctorId, query, token) => new Promise((reslove, reject) => {
    let order = 'asc'
    if (query.sortBy === 'created_at') {
        order = 'desc'
    } else {
        order = 'asc'
    }
    if (query?.searchBy === "name") {
        axios.get(`/api/doctor/${doctorId}/packages/not-assign`, {
            params: {
                itemsPage: 3,
                page: query?.page,
                sort: query?.sortBy,
                order: order,
                patient_name: query?.query,
                duplicated: false
            },
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            }
        })
            .then(result => reslove(result.data))
            .catch(err => reject(err))
    } else {
        axios.get(`/api/doctor/${doctorId}/packages/not-assign`, {
            params: {
                itemsPage: 3,
                page: query?.page,
                sort: query?.sortBy,
                order: order,
                address: query?.query,
                duplicated: false
            },
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            }
        })
            .then(result => reslove(result.data))
            .catch(err => reject(err))
    }
});

packageService.getAssignPackageQuery = (doctorId, query, token) => new Promise((reslove, reject) => {
    let order = 'asc'
    if (query.sortBy === 'created_at') {
        order = 'desc'
    } else {
        order = 'asc'
    }

    if (query?.searchBy === "name") {
        axios.get(`/api/doctor/${doctorId}/packages/request-doctor`, {
            params: {
                itemsPage: 3,
                page: query?.page,
                sort: query?.sortBy,
                order: order,
                patient_name: query?.query,
                duplicated: 'both'
            },
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            }
        })
            .then(result => reslove(result.data))
            .catch(err => reject(err))
    } else {
        axios.get(`/api/doctor/${doctorId}/packages/request-doctor`, {
            params: {
                itemsPage: 3,
                page: query?.page,
                sort: query?.sortBy,
                order: order,
                address: query?.query,
                duplicated: 'both'
            },
            headers: {
                authorization: "Bearer " + token,
                Accept: '*/*'
            }
        })
            .then(result => reslove(result.data))
            .catch(err => reject(err))
    }
});


packageService.getAllAppointmentByPackageID = (packageId,token) => new Promise((reslove, reject) => {
    axios.get(`/api/package/${packageId}/appointments/status/${status.done}`, {
        params: {

        },
        headers: {
            authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
});



export default packageService;