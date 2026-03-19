import React, { createContext, useContext, useMemo, useState } from 'react';

const TrackingContext = createContext(null);

export function TrackingProvider({ children }) {
  const [isTracking, setIsTracking] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activities, setActivities] = useState([]);

  const resetTrackingSession = () => {
    setIsTracking(false);
    setRouteCoordinates([]);
    setElapsedSeconds(0);
    setDistanceKm(0);
  };

  const value = useMemo(
    () => ({
      isTracking,
      setIsTracking,
      routeCoordinates,
      setRouteCoordinates,
      elapsedSeconds,
      setElapsedSeconds,
      distanceKm,
      setDistanceKm,
      currentLocation,
      setCurrentLocation,
      activities,
      setActivities,
      resetTrackingSession,
    }),
    [
      isTracking,
      routeCoordinates,
      elapsedSeconds,
      distanceKm,
      currentLocation,
      activities,
    ]
  );

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTrackingContext() {
  const context = useContext(TrackingContext);

  if (!context) {
    throw new Error('useTrackingContext must be used within TrackingProvider');
  }

  return context;
}