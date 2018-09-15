import axios from 'axios';
import { SERVER } from '../constants';
import catchMiddlewareHttp from './catchMiddlewareHttp'

const TOKEN_TYPE = "Bearer "

const myApiConfig = (authorizarion = null)=> ({
    baseURL: `${SERVER.server}:${SERVER.port}/api/`,
    timeout: 15000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : authorizarion ? TOKEN_TYPE+authorizarion : ''
    },
    // onUploadProgress: progressEvent => {
    //     let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
    //     console.log(percentCompleted)
    //   }
})

export function httpGet(endpoint,parameter = null,authorizarion = null){
    let param = parameter ? parameter : '';
    let route = endpoint+param;
    return axios.get(route,myApiConfig(authorizarion)).then(response => {
        return response
     }).catch(error=>{
        catchMiddlewareHttp(error.response)
     })
}

export function httpDelete(endpoint,parameter = null,authorizarion = null){
    let param = parameter ? parameter : '';
    let route = endpoint+param;
    return axios.delete(route,myApiConfig(authorizarion)).then(response => {
        return response
     }).catch(error=>{
        catchMiddlewareHttp(error.response)
     })
}

export function httpGetExternalApi(endpoint,parameter = null,authorizarion = null){
    let param = parameter ? parameter : '';
    let route = endpoint+param;
    return axios.get(route).then(response => {
        return response
     }).catch(error=>{
        catchMiddlewareHttp(error.response)
     })
}
export function httpPost(endpoint,payload,authorizarion = null){
    return axios.post(endpoint,payload,myApiConfig(authorizarion)).then(response => {
         return response
     }).catch(error=>{
        catchMiddlewareHttp(error.response)
        return error.response;
     })
}
export function httpUpdateFile(endpoint,payload,authorizarion = null){
    return axios.post(endpoint,payload,{
        baseURL: `${SERVER.server}:${SERVER.port}/api/`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          "Authorization" : authorizarion ? TOKEN_TYPE+authorizarion : ''
        }
    }).then(response => {
         return response
     }).catch(error=>{
        catchMiddlewareHttp(error.response)
     })
}
export function httpPut(endpoint,payload,authorizarion = null){
    return axios.put(endpoint,payload,myApiConfig(authorizarion)).then(response => {
         return response
     }).catch(error=>{
        catchMiddlewareHttp(error.response)
     })
}

