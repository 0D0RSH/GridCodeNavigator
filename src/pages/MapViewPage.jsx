"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/MapViewPage.css"
import Select from "react-select"
import mapSVG1 from "../assets/gfloor.svg"
import mapSVG2 from "../assets/ffloor.svg"
import { FaExchangeAlt, FaArrowLeft, FaMapMarkedAlt, FaSignOutAlt, FaTimes, FaLocationArrow, FaFlag, FaInfoCircle, FaRoute, FaSearchPlus, FaSearchMinus } from "react-icons/fa"
import { useGesture } from "react-use-gesture"
import { animated, useSpring } from "react-spring"
import { useAuth } from "../context/AuthContext"
import { getRooms, getShortestPath } from "../services/api"

const MapViewPage = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [source, setSource] = useState(null)
  const [destination, setDestination] = useState(null)
  const [currentMap, setCurrentMap] = useState(1)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const mapRef = useRef(null)

  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Spring animation for smooth zoom/pan
  const [style, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    config: { mass: 1, tension: 200, friction: 30 }
  }))

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const response = await getRooms()

        let roomsData = []
        if (Array.isArray(response)) {
          roomsData = response
        }
        else if (response.data && Array.isArray(response.data)) {
          roomsData = response.data
        }
        else if (response.rooms && Array.isArray(response.rooms)) {
          roomsData = response.rooms
        }
        else if (response.data && response.data.rooms && Array.isArray(response.data.rooms)) {
          roomsData = response.data.rooms
        }

        if (Array.isArray(roomsData)) {
          setRooms(roomsData)
        } else {
          throw new Error("Invalid rooms data format")
        }
      } catch (err) {
        setError("Failed to load rooms. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  // Reset zoom and position when switching maps
  useEffect(() => {
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
    api.start({ scale: 1, x: 0, y: 0 })
  }, [currentMap, api])

  // Setup gestures for zooming and panning
  useGesture(
    {
      onDrag: ({ offset: [x, y] }) => {
        setPosition({ x, y })
        api.start({ x, y })
      },
      onPinch: ({ offset: [scale] }) => {
        setZoomLevel(scale)
        api.start({ scale })
      },
      onWheel: ({ event }) => {
        event.preventDefault()
        const newZoom = zoomLevel + (event.deltaY > 0 ? -0.1 : 0.1)
        const clampedZoom = Math.min(Math.max(newZoom, 0.5), 3)
        setZoomLevel(clampedZoom)
        api.start({ scale: clampedZoom })
      },
      onDoubleClick: ({ event }) => {
        event.preventDefault()
        setZoomLevel(1)
        setPosition({ x: 0, y: 0 })
        api.start({ scale: 1, x: 0, y: 0 })
      }
    },
    {
      target: mapRef,
      drag: { from: () => [position.x, position.y] },
      pinch: { distanceBounds: { min: 0.5, max: 3 } },
      eventOptions: { passive: false }
    }
  )

  const roomOptions = rooms.map(room => ({
    value: room.room_id,
    label: room.label || room.name || `Room ${room.room_id}`
  }))

  // Zoom functions
  const zoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.2, 3)
    setZoomLevel(newZoom)
    api.start({ scale: newZoom })
  }

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.2, 0.5)
    setZoomLevel(newZoom)
    api.start({ scale: newZoom })
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
    api.start({ scale: 1, x: 0, y: 0 })
  }

  return (
    <div className="mapview-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1>Interactive Map</h1>
        <div className="user-info">
          <span>{currentUser?.email}</span>
          <button className="logout-button" onClick={logout}>
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-container">
          <FaLocationArrow className="input-icon source-icon" />
          <Select
            className="search-input react-select"
            options={roomOptions}
            value={roomOptions.find(option => option.value === source)}
            onChange={(selected) => setSource(selected?.value || null)}
            placeholder={loading ? "Loading rooms..." : "Select Source"}
            isLoading={loading}
            isClearable
            isSearchable
            noOptionsMessage={() => "No rooms available"}
            styles={{
              menu: base => ({ ...base, zIndex: 1000 })
            }}
          />
        </div>

        <button className="swap-button" onClick={() => {
          const temp = source
          setSource(destination)
          setDestination(temp)
        }}>
          <FaExchangeAlt />
        </button>

        <div className="search-input-container">
          <FaFlag className="input-icon destination-icon" />
          <Select
            className="search-input react-select"
            options={roomOptions}
            value={roomOptions.find(option => option.value === destination)}
            onChange={(selected) => setDestination(selected?.value || null)}
            placeholder={loading ? "Loading rooms..." : "Select Destination"}
            isLoading={loading}
            isClearable
            isSearchable
            noOptionsMessage={() => "No rooms available"}
            styles={{
              menu: base => ({ ...base, zIndex: 1000 })
            }}
          />
        </div>
      </div>

      <div className="map-container">
        <div className="map-controls">
          <button className="map-toggle" onClick={() => setCurrentMap(prev => prev === 1 ? 2 : 1)}>
            <FaMapMarkedAlt />
            <span>Switch to Floor {currentMap === 1 ? 2 : 1}</span>
          </button>

          <div className="zoom-controls">
            <button onClick={zoomIn} title="Zoom In">
              <FaSearchPlus />
            </button>
            <button onClick={resetZoom} title="Reset Zoom">
              {Math.round(zoomLevel * 100)}%
            </button>
            <button onClick={zoomOut} title="Zoom Out">
              <FaSearchMinus />
            </button>
          </div>
        </div>

        <div
          className="map-wrapper"
          ref={mapRef}
          style={{ touchAction: 'none' }}
        >
          <animated.div
            style={{
              transform: style.scale.to(s => `scale(${s})`),
              transformOrigin: '0 0',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              x: style.x,
              y: style.y
            }}
          >
            {currentMap === 1 ? (
              <img
                src={mapSVG1}
                alt="Ground Floor"
                className="map-image"
                draggable="false"
              />
            ) : (
              <img
                src={mapSVG2}
                alt="First Floor"
                className="map-image"
                draggable="false"
              />
            )}
          </animated.div>
        </div>
      </div>

      <div className="navigation-controls">
        <button className="find-path-button">
          <FaRoute />
          <span>Find Path</span>
        </button>
      </div>

      {error && (
        <div className="error-message">
          <FaTimes className="close-error" onClick={() => setError("")} />
          {error}
        </div>
      )}
    </div>
  )
}

export default MapViewPage