import axios from "axios"

export const novaServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOVA_API_URL,
});

novaServer.interceptors.request.use((response) => {
  return response;
}, function (error) {
  if (401 === error.response.status) {
    // Redirect to login page
    window.location.href = "/login";
    return Promise.reject(error);
  } else {
    return Promise.reject(error);
  }
})

