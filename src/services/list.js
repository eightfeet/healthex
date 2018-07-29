import request from '../utils/request'

export function getList() {
  return request.post('https://yygj.by-health.com/receiver/list')
}

export default {}
