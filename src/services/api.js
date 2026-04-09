import axios from "axios"

// Update the API URL to match your backend
const API_URL = "http://127.0.0.1:8000"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Get all rooms
export const getRooms = async () => {
  try {
    console.log("Fetching rooms from:", API_URL + "/rooms")
    const response = await api.get("/rooms")
    console.log("Rooms data received:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching rooms:", error)
    throw error
  }
}

// Get shortest path between two rooms
export const getShortestPath = async (source, destination) => {
  try {
    console.log(`Finding path from ${source} to ${destination}`)
    const response = await api.post("/shortest-path", {
      source,
      destination,
    })
    console.log("Path data received:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching path:", error)
    throw error
  }
}

