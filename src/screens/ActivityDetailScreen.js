import React, { useMemo } from 'react';
import MapView, { Polyline, Marker } from 'react-native-maps';
import styled from 'styled-components/native';
import { formatDate, formatDistance, formatDuration } from '../utils/formatters';
import { getRegionForCoordinates } from '../utils/mapRegion';
import MapTileLayer from '../components/MapTileLayer';
import useTracking from '../hooks/useTracking';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MapWrapper = styled.View`
  flex: 1;
`;

const InfoPanel = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-top-left-radius: ${({ theme }) => theme.radius.xl}px;
  border-top-right-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
`;

const InfoText = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

export default function ActivityDetailScreen({ route }) {
  const { activityId } = route.params || {};
  const { activities } = useTracking();

  const activity = useMemo(
    () => activities.find((item) => item.id === activityId),
    [activities, activityId]
  );

  if (!activity) {
    return (
      <Centered>
        <Title>Activity not found</Title>
      </Centered>
    );
  }

  const region = getRegionForCoordinates(activity.routeCoordinates);
  const startPoint = activity.routeCoordinates[0];
  const endPoint = activity.routeCoordinates[activity.routeCoordinates.length - 1];

  return (
    <Container>
      <MapWrapper>
        <MapView style={{ flex: 1 }} initialRegion={region}>
          <MapTileLayer />

          {activity.routeCoordinates.length > 1 && (
            <Polyline
              coordinates={activity.routeCoordinates}
              strokeWidth={5}
              strokeColor="#2563EB"
            />
          )}

          {startPoint && (
            <Marker
              coordinate={startPoint}
              title="Start"
              description="Activity started here"
              pinColor="green"
            />
          )}

          {endPoint && (
            <Marker
              coordinate={endPoint}
              title="End"
              description="Activity ended here"
              pinColor="red"
            />
          )}
        </MapView>
      </MapWrapper>

      <InfoPanel>
        <Title>{formatDate(activity.createdAt)}</Title>
        <InfoText>Distance: {formatDistance(activity.distanceKm)}</InfoText>
        <InfoText>Duration: {formatDuration(activity.elapsedSeconds)}</InfoText>
        <InfoText>Points recorded: {activity.routeCoordinates.length}</InfoText>
      </InfoPanel>
    </Container>
  );
}