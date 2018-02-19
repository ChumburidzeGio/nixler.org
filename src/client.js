import axios from 'axios'

export default axios.create({
    baseURL: 'http://lumen.komparu.localhost:8001/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
})