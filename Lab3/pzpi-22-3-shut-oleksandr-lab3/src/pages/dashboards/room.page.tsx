import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '@shared/layouts/main.layout'
import styled from 'styled-components'
import { useRoomStore } from '@store/rooms.store'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '@store/store'
import { useTranslation } from 'react-i18next'
import { temperatureToDisplay } from '@utils/parsers'

export const RoomPage: React.FC = () => {
  const { t, i18n } = useTranslation()

  const { roomId } = useParams<{ roomId: string }>()
  const rooms = useRoomStore(state => state.rooms)
  const analyzeRoom = useRoomStore(state => state.analyzeRoom)
  const roomAnalysis = useRoomStore(state => state.roomStatistic)
  const userId = useAuthStore(state => state.user)

  const [isAnalysisVisible, setIsAnalysisVisible] = useState(false)

  const room = rooms?.find(r => r._id.toString() === roomId)

  const handleAnalyzeData = async () => {
    if (roomId) {
      await analyzeRoom(roomId, userId?._id)
      setIsAnalysisVisible(true)
    }
  }

  if (!room) {
    return <MainLayout>No room found</MainLayout>
  }

  const statsData = roomAnalysis?.analysis.statistics
  const parametersStats = [
    {
      name: t('roomsDashboard.temperature'),
      Mean: temperatureToDisplay(i18n.language, statsData?.temperature_mean),
      Median: temperatureToDisplay(i18n.language, statsData?.temperature_median),
      Min: temperatureToDisplay(i18n.language, statsData?.temperature_min),
      Max: temperatureToDisplay(i18n.language, statsData?.temperature_max),
    },
    {
      name: t('roomsDashboard.moisture'),
      Mean: statsData?.moisture_mean,
      Median: statsData?.moisture_median,
      Min: statsData?.moisture_min,
      Max: statsData?.moisture_max,
    },
    {
      name: t('roomsDashboard.co2'),
      Mean: statsData?.carbonDioxide_mean,
      Median: statsData?.carbonDioxide_median,
      Min: statsData?.carbonDioxide_min,
      Max: statsData?.carbonDioxide_max,
    },
    {
      name: t('roomsDashboard.illumination'),
      Mean: statsData?.illumination_mean,
      Median: statsData?.illumination_median,
      Min: statsData?.illumination_min,
      Max: statsData?.illumination_max,
    },
  ]

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 0' }}>
      <RoomContainer>
        <RoomHeader>
          <RoomTitle>{room.roomName}</RoomTitle>
        </RoomHeader>
        <RoomDetails>
          <Detail>{t('room.temperature', { value: temperatureToDisplay(i18n.language, room.temperature) })}</Detail>
          <Detail>{t('room.moisture', { value: room.moisture })}</Detail>
          <Detail>{t('room.co2', { value: room.carbonDioxide })}</Detail>
          <Detail>{t('room.illumination', { value: room.illumination })}</Detail>
        </RoomDetails>
        <AnalyzeButton onClick={handleAnalyzeData}>{t('room.analyzeButton')}</AnalyzeButton>

        {isAnalysisVisible && roomAnalysis?.analysis && (
          <AnalysisSection>
            <SectionTitle>{t('room.analyticsSection')}</SectionTitle>

            <ChartContainer>
              <SectionSubtitle>{t('room.parameterStats')}</SectionSubtitle>
              {parametersStats.map(param => (
                <ChartWrapper key={param.name}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[param]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Mean" fill="#4a90e2" name={t('room.mean')} />
                      <Bar dataKey="Median" fill="#82ca9d" name={t('room.median')} />
                      <Bar dataKey="Min" fill="#ff6f61" name={t('room.min')} />
                      <Bar dataKey="Max" fill="#f1c40f" name={t('room.max')} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              ))}
            </ChartContainer>

            <CorrelationSection>
              <SectionSubtitle>{t('room.correlationsSection')}</SectionSubtitle>
              <CorrelationTable>
                <thead>
                  <tr>
                    <TableHeader>{t('room.parameterPair')}</TableHeader>
                    <TableHeader>{t('room.correlationCoefficient')}</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(roomAnalysis.analysis.correlation).map(([pair, value]) => (
                    <TableRow key={pair}>
                      <TableCell>{pair.replace('-', ' and ')}</TableCell>
                      <TableCell>{value !== null ? value.toFixed(2) : t('room.noData')}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </CorrelationTable>
            </CorrelationSection>

            <TrendsSection>
              <SectionSubtitle>{t('room.trendsSection')}</SectionSubtitle>
              <TrendsList>
                {roomAnalysis.analysis.trends.map((trend, index) => (
                  <TrendItem key={index}>{trend}</TrendItem>
                ))}
              </TrendsList>
            </TrendsSection>

            <RecommendationsSection>
              <SectionSubtitle>{t('room.recommendationsSection')}</SectionSubtitle>
              <RecommendationsList>
                {roomAnalysis.analysis.recommendations.map((recommendation, index) => (
                  <RecommendationItem key={index}>{recommendation}</RecommendationItem>
                ))}
              </RecommendationsList>
            </RecommendationsSection>

            <RegressionSection>
              <SectionSubtitle>{t('room.regressionSection')}</SectionSubtitle>
              <RegressionText>{roomAnalysis.analysis.regression}</RegressionText>
            </RegressionSection>
          </AnalysisSection>
        )}
      </RoomContainer>
    </MainLayout>
  )
}

const RoomContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`

const RoomHeader = styled.div`
  margin-bottom: 1.5rem;
`

const RoomTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`

const RoomDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const Detail = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #7f8c8d;
`

const AnalyzeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background-color: #c0392b;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
  }
`

const AnalysisSection = styled.div`
  margin-top: 2rem;
`

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`

const SectionSubtitle = styled.h4`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`

const ChartContainer = styled.div`
  margin-bottom: 2rem;
`

const ChartWrapper = styled.div`
  margin-bottom: 2rem;
`

const CorrelationSection = styled.div`
  margin-bottom: 2rem;
`

const CorrelationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  padding: 0.75rem;
  background-color: #f5f5f5;
  color: #333;
  text-align: left;
  border-bottom: 1px solid #ddd;
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  color: #7f8c8d;
`

const TrendsSection = styled.div`
  margin-bottom: 2rem;
`

const TrendsList = styled.ul`
  list-style: none;
  padding: 0;
`

const TrendItem = styled.li`
  padding: 0.5rem 0;
  color: #2c3e50;
  &:before {
    content: '• ';
    color: #4a90e2;
  }
`

const RecommendationsSection = styled.div`
  margin-bottom: 2rem;
`

const RecommendationsList = styled.ul`
  list-style: none;
  padding: 0;
`

const RecommendationItem = styled.li`
  padding: 0.5rem 0;
  color: #2c3e50;
  &:before {
    content: '✔ ';
    color: #27ae60;
  }
`

const RegressionSection = styled.div`
  margin-bottom: 2rem;
`

const RegressionText = styled.p`
  color: #7f8c8d;
  font-style: italic;
`
