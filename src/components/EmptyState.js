import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 22px;
`;

export default function EmptyState({ title, subtitle }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Container>
  );
}