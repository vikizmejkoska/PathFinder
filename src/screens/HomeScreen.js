import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import colors from '../constants/colors';
import { MAP_CONFIG } from '../constants/map';
import MapTileLayer from '../components/MapTileLayer';
import StatCard from '../components/StatCard';
import {
  getCurrentPosition,
  requestLocationPermission,
} from '../services/locationService';
import { formatDistance, formatDuration } from '../utils/formatters';
import { useTrackingContext } from '../context/TrackingContext';
import useTracking from '../hooks/useTracking';

export default function HomeScreen({ navigation }) {
  const mapRef = useRef(null);

  const [region, setRegion] = useState(MAP_CONFIG.initialRegion);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const { setCurrentLocation } = useTrackingContext();

  const {
    isTracking,
    routeCoordinates,
    elapsedSeconds,
    distanceKm,
    currentLocation,
    startTracking,
    stopTracking,
  } = useTracking();

  const loadUserLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);

      const granted = await requestLocationPermission();

      if (!granted) {
        Alert.alert(
          'Location permission required',
          'Please allow location access to use PathFinder.'
        );
        return;
      }

      const position = await getCurrentPosition();
      setCurrentLocation(position);
      setRegion(position);

      if (mapRef.current) {
        mapRef.current.animateToRegion(position, 800);
      }
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    } finally {
      setLoadingLocation(false);
    }
  }, [setCurrentLocation]);

  useEffect(() => {
    loadUserLocation();
  }, [loadUserLocation]);

  const handleTrackingToggle = async () => {
    if (!currentLocation) {
      Alert.alert('Location missing', 'Please refresh your location first.');
      return;
    }

    if (isTracking) {
      const savedActivity = await stopTracking();

      if (savedActivity) {
        Alert.alert('Activity saved', 'Your activity was saved successfully.');
      }

      return;
    }

    await startTracking();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        {loadingLocation ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading map and location...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            showsUserLocation
            showsMyLocationButton
          >
            <MapTileLayer />

            {routeCoordinates.length > 1 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={5}
                strokeColor={colors.mapRoute}
              />
            )}

            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="You are here"
                description="Current location"
              />
            )}
          </MapView>
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.title}>PathFinder</Text>
        <Text style={styles.subtitle}>
          Track your movement in real time.
        </Text>

        <View style={styles.statsGrid}>
          <StatCard label="Distance" value={formatDistance(distanceKm)} />
          <StatCard label="Duration" value={formatDuration(elapsedSeconds)} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isTracking ? styles.stopButton : styles.startButton,
            ]}
            onPress={handleTrackingToggle}
          >
            <Text style={styles.primaryButtonText}>
              {isTracking ? 'Stop & Save' : 'Start Tracking'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={loadUserLocation}>
            <Text style={styles.secondaryButtonText}>Refresh Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.secondaryButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrapper: {
    flex: 1,
    backgroundColor: colors.border,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  panel: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.success,
  },
  stopButton: {
    backgroundColor: colors.danger,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '600',
  },
});