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
export const download = async (path) => {
  try {
    const response = await axiosConfig.get(path, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const contentDisposition = response.headers['content-disposition'];
    console.log(response.headers)
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : '';
    // Create a link element and click it to trigger the file download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download',filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    // Handle any errors that occur during the file download
    console.error('An error occurred:', error)
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
