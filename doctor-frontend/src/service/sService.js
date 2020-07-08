import axios from "../axios";
const sService = {};

// item perpage : 6

sService.getServiceForHome = () => new Promise((reslove , reject) => {
    axios.get('/api/service' , {
        params : {
            itemsPage: 3,
            page: 1
        }
    })
    .then(result => reslove(result.data))
    .catch(err => reject(err))
})

sService.getServiceQuery = (query) => new Promise((reslove , reject) => {
    axios.get('/api/service' , {
        params : {
            query: query?.query,
            sort:query?.sortBy,
            itemsPage: 6,
            page: query?.page,
            active: true,
        }
    })
    .then(result => reslove(result.data))
    .catch(err => reject(err))
})


export default sService;