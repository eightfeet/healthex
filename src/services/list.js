import request from '../utils/request'

export function getList() {
  return request.post('receiver/list')
}

export default {}
