import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import styled from 'styled-components/native';
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

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MapWrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.border};
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const LoadingText = styled.Text`
  margin-top: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Panel = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 18px 20px 24px 20px;
  border-top-left-radius: ${({ theme }) => theme.radius.xl}px;
  border-top-right-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const HeaderRow = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 22px;
  margin-top: 6px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 14px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 12px;
`;

const PrimaryButton = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: 15px;
  border-radius: 12px;
  align-items: center;
  background-color: ${({ theme, tracking }) =>
    tracking ? theme.colors.danger : theme.colors.success};
`;

const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surfaceSoft};
  padding-vertical: 14px;
  border-radius: 12px;
  align-items: center;
  border-width: 1px;
  border-color: #bfdbfe;
`;

const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

const SecondaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 15px;
  font-weight: 600;
`;

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
    <Container>
      <MapWrapper>
        {loadingLocation ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#2563EB" />
            <LoadingText>Loading map and location...</LoadingText>
          </LoadingContainer>
        ) : (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            region={region}
            showsUserLocation
            showsMyLocationButton
          >
            <MapTileLayer />

            {routeCoordinates.length > 1 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={5}
                strokeColor="#2563EB"
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
      </MapWrapper>

      <Panel>
        <HeaderRow>
          <Title>PathFinder</Title>
          <Subtitle>Track your movement in real time.</Subtitle>
        </HeaderRow>

        <StatsGrid>
          <StatCard label="Distance" value={formatDistance(distanceKm)} />
          <StatCard label="Duration" value={formatDuration(elapsedSeconds)} />
        </StatsGrid>

        <ButtonRow>
          <PrimaryButton tracking={isTracking ? 1 : 0} onPress={handleTrackingToggle}>
            <PrimaryButtonText>
              {isTracking ? 'Stop & Save' : 'Start Tracking'}
            </PrimaryButtonText>
          </PrimaryButton>
        </ButtonRow>

        <ButtonRow>
          <SecondaryButton onPress={loadUserLocation}>
            <SecondaryButtonText>Refresh Location</SecondaryButtonText>
          </SecondaryButton>

          <SecondaryButton onPress={() => navigation.navigate('History')}>
            <SecondaryButtonText>History</SecondaryButtonText>
          </SecondaryButton>
        </ButtonRow>
      </Panel>
    </Container>
  );
}