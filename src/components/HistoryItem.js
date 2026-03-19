import React from 'react';
import styled from 'styled-components/native';

const Card = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Dot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const TextWrap = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function HistoryItem({ item, onPress }) {
  return (
    <Card onPress={onPress}>
      <Row>
        <Dot />
        <TextWrap>
          <Title>{item.title}</Title>
          <Subtitle>{item.subtitle}</Subtitle>
        </TextWrap>
      </Row>
    </Card>
  );
}