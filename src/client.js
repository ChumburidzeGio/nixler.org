import axios from 'axios'

export default axios.create({
    baseURL: 'http://lumen.komparu.localhost:8001/v1/',
    headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': '$2y$10$RDKvEAfySWXR.nkEesWhyeLRQsfrAPZ1Ilo8tNp.Lx/VcWZDrG/E6',
        'X-Auth-Domain': 'partner.komparu.com',
    },
})