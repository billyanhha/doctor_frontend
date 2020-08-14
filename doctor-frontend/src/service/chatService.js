import axios from "../axios";

const chatService = {}

const itemsPage = 10

chatService.getChat = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/group/doctor/${payload.id}`;
    axios.get(api,  {
        params: {
            page : 1,
            itemsPage: itemsPage
        },
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

chatService.getMoreChat = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/group/doctor/${payload.id}`;
    axios.get(api,  {
        params: {
            page : payload?.page,
            itemsPage: itemsPage
        },
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

chatService.getThreadChat = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/thread/${payload.cusId}/${payload.doctor_id}`;    
    axios.get(api,  {
        params: {
            page : 1,
            itemsPage: itemsPage

        },
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


chatService.getMoreThreadChat = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/thread/${payload.cusId}/${payload.doctor_id}`;    
    axios.get(api,  {
        params: {
            page : payload?.page,
            itemsPage: itemsPage
        },
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


chatService.getUserRelateDoctor = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/doctor/${payload.doctor_id}/current-customer`;    
    axios.get(api,  {
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

chatService.getUnreadGroup = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/group/doctor/${payload.id}/unread`;    
    axios.get(api,  {
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

chatService.sendMessage = (payload, doctor_id , token) => new Promise((reslove, reject) => {
    const api = `/api/doctor/${doctor_id}/chat`;    
    axios.post(api, payload, {
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

chatService.updateIsRead = (payload , token) => new Promise((reslove, reject) => {
    const api = `/api/chat/thread/${payload.cusId}/${payload.doctor_id}`;    
    axios.put(api, {
        is_doctor_read:true,
        socketId: payload?.socketId
    }, {
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


export default chatService