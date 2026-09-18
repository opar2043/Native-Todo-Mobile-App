import api from "./useAxios"

const getTask = async() => {
    const res = await api.get("/tasks")
    return res.data
}
const addTask = async(payload) => {
    const res = await api.post("/tasks" , payload)
    return res.data
}
const updateTask = async(id, payload) => {
    const res = await api.patch(`/tasks/${id}` , payload)
    return res.data
}
const deleteTask = async(id) => {
    const res = await api.delete(`/tasks/${id}`)
    return res.data
}


export  const taskService  = {
    getTask,
    addTask,
    updateTask,
    deleteTask
}