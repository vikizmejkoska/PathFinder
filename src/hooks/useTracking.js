import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { watchUserPosition } from '../services/locationService';
import { calculateTotalDistanceInKm } from '../utils/distance';
import { useTrackingContext } from '../context/TrackingContext';
import {
  loadActivities,
  saveActivities,
  clearActivities,
} from '../services/storageService';

export default function useTracking() {
  const {
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
  } = useTrackingContext();

  const watchSubscriptionRef = useRef(null);
  const timerRef = useRef(null);

  const hydrateActivities = async () => {
    const stored = await loadActivities();
    setActivities(stored);
  };

  const startTracking = async () => {
    try {
      setRouteCoordinates(currentLocation ? [currentLocation] : []);
      setElapsedSeconds(0);
      setDistanceKm(0);
      setIsTracking(true);

      const subscription = await watchUserPosition((nextLocation) => {
        setCurrentLocation(nextLocation);

        setRouteCoordinates((prev) => {
          const updated = [...prev, nextLocation];
          setDistanceKm(calculateTotalDistanceInKm(updated));
          return updated;
        });
      });

      watchSubscriptionRef.current = subscription;
    } catch (error) {
      console.log('Start tracking error:', error);
      setIsTracking(false);
      Alert.alert('Error', 'Unable to start tracking.');
    }
  };

  const stopTracking = async () => {
    if (watchSubscriptionRef.current) {
      watchSubscriptionRef.current.remove();
      watchSubscriptionRef.current = null;
    }

    const hasEnoughData = routeCoordinates.length >= 2;

    if (!hasEnoughData) {
      resetTrackingSession();
      Alert.alert(
        'Activity not saved',
        'Move a little more before stopping so the route can be recorded.'
      );
      return null;
    }

    const finishedActivity = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      elapsedSeconds,
      distanceKm,
      routeCoordinates,
    };

    const updatedActivities = [finishedActivity, ...activities];
    setActivities(updatedActivities);
    await saveActivities(updatedActivities);

    resetTrackingSession();
    return finishedActivity;
  };

  const removeAllActivities = async () => {
    const success = await clearActivities();

    if (success) {
      setActivities([]);
      return true;
    }

    return false;
  };

  useEffect(() => {
    hydrateActivities();
  }, []);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTracking, setElapsedSeconds]);

  useEffect(() => {
    return () => {
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
        watchSubscriptionRef.current = null;
      }
    };
  }, []);

  return {
    isTracking,
    routeCoordinates,
    elapsedSeconds,
    distanceKm,
    currentLocation,
    activities,
    hydrateActivities,
    startTracking,
    stopTracking,
    removeAllActivities,
  };
}