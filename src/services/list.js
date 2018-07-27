import request from '../utils/request'

export function getList() {
  console.log('A')
  return request.post('https://yygj.by-health.com/receiver/list')
}

export function getListB() {
  console.log('B')
  return request.post('https://yygj.by-health.com/receiver/listB')
}

export default {}
