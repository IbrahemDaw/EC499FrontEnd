import axiosConfig from './apiRequset'
import { useRoute } from 'vue-router'
const route = useRoute()
export const get = async (path, param) => {
  let params = null
  if (param != null) {
    params = '?'
    Object.entries(param).forEach(([key, value]) => {
      if (value !== null) {
        params = params + key + '=' + value + '&'
      }
    })
    path += params
  }
  try {
    const response = await axiosConfig.get(path)
    return response
  } catch (e) {
    if (e.request.status === 401) {
      localStorage.removeItem('user-token')
      router.push('/login')
    }
    throw e
  }
}

export const post = async (path, body) => {
  try {
    const response = await axiosConfig.post(path, body)
    return response
  } catch (e) {
    if (e.status == 401) localStorage.removeItem('user-token')
    throw e
  }
}
export const postFile = async (path, body) => {
  try {
    const response = await axiosConfig.post(path, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (e) {
    if (e.status == 401) localStorage.removeItem('user-token')
    throw e
  }
}

export const put = async (path, body, listOfIds) => {
  if (listOfIds != null) {
    path += '?'
    listOfIds.forEach((value) => {
      path += 'Ids=' + value + '&'
    })
  }
  try {
    const response = await axiosConfig.put(path, body)
    return response
  } catch (e) {
    if (e.status == 401) localStorage.removeItem('user-token')
    throw e
  }
}
export const del = async (path, listOfIds) => {
  if (listOfIds !== null) {
    path += '?'
    listOfIds.forEach((value) => {
      path += 'ids=' + value + '&'
    })
  }
  try {
    const response = await axiosConfig.delete(path)
    return response
  } catch (e) {
    if (e.status == 401) localStorage.removeItem('user-token')
    throw e
  }
}
