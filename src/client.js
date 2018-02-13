import axios from 'axios'

export default axios.create({
    baseURL: 'https://api.komparu.dev/v1/resource2',
    headers: {
        'X-Auth-Token': 'foi3d04mG2354irfV5wSGxlr',
        'X-Auth-Domain': 'partner.komparu.com',
        'Content-Type': 'application/json',
    }
})