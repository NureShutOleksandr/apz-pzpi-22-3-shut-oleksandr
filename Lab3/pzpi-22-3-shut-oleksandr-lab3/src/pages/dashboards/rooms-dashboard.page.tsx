import React, { useEffect, useState } from 'react'
import MainLayout from '@shared/layouts/main.layout'
import styled from 'styled-components'
import { useRoomStore } from '@store/rooms.store'
import { useAuthStore } from '@store/store'
import type { CreateRoomDto } from '~types/room.type'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { temperatureToDisplay } from '@utils/parsers'

export const RoomsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation()
  const rooms = useRoomStore(state => state.rooms)
  const createRoom = useRoomStore(state => state.createRoom)
  const getRooms = useRoomStore(state => state.getRooms)
  const deleteRoom = useRoomStore(state => state.deleteRoom)
  const user = useAuthStore(state => state.user)

  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<CreateRoomDto>({
    user: user?._id || '',
    roomName: '',
    temperature: 0,
    moisture: 0,
    carbonDioxide: 0,
    illumination: 0,
  })

  useEffect(() => {
    getRooms(user?._id)
  }, [user?._id, getRooms])

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomName' ? value : Number(value),
    }))
  }

  const handleSubmitRoomCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (i18n.language === 'en') formData.temperature = ((formData.temperature - 32) * 5) / 9

    await createRoom(formData)
    handleCloseModal()
    setFormData({
      user: user?._id || '',
      roomName: '',
      temperature: 0,
      moisture: 0,
      carbonDioxide: 0,
      illumination: 0,
    })
  }

  const handleNavigateToRoom = (roomId: string) => {
    navigate(`/room/${roomId}`)
  }

  const handleDeleteRoom = async (roomId: string) => {
    await deleteRoom(roomId)
  }

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 0' }}>
      <RoomsContainer>
        <Header>
          <Title>{t('roomsDashboard.title')}</Title>
          <CreateRoomButton onClick={handleOpenModal}>{t('roomsDashboard.createRoom')}</CreateRoomButton>
        </Header>
        <RoomsList>
          {rooms &&
            rooms.map(room => (
              <RoomItem key={room._id}>
                <RoomName>{room.roomName}</RoomName>
                <RoomDetails>
                  <Detail>
                    {t('room.temperature', { value: temperatureToDisplay(i18n.language, room.temperature) })}
                  </Detail>
                  <Detail>{t('room.moisture', { value: room.moisture })}</Detail>
                  <Detail>{t('room.co2', { value: room.carbonDioxide })}</Detail>
                  <Detail>{t('room.illumination', { value: room.illumination })}</Detail>
                </RoomDetails>
                <RoomActionsCOntainer>
                  <GoToButton onClick={() => handleNavigateToRoom(room._id.toString())}>
                    {t('roomsDashboard.goTo')}
                  </GoToButton>
                  <DeleteRoomButton onClick={() => handleDeleteRoom(room._id.toString())}>
                    {t('roomsDashboard.delete')}
                  </DeleteRoomButton>
                </RoomActionsCOntainer>
              </RoomItem>
            ))}
        </RoomsList>
      </RoomsContainer>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t('roomsDashboard.createNewRoom')}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleSubmitRoomCreate}>
              <InputGroup>
                <Label htmlFor="roomName">{t('roomsDashboard.roomName')}</Label>
                <Input
                  type="text"
                  id="roomName"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleInputChange}
                  placeholder={t('roomsDashboard.enterRoomName')}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="temperature">{t('roomsDashboard.temperature')}</Label>
                <Input
                  type="number"
                  id="temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  placeholder={t('roomsDashboard.enterTemperature')}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="moisture">{t('roomsDashboard.moisture')}</Label>
                <Input
                  type="number"
                  id="moisture"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  placeholder={t('roomsDashboard.enterMoisture')}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="carbonDioxide">{t('roomsDashboard.co2')}</Label>
                <Input
                  type="number"
                  id="carbonDioxide"
                  name="carbonDioxide"
                  value={formData.carbonDioxide}
                  onChange={handleInputChange}
                  placeholder={t('roomsDashboard.enterCo2')}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="illumination">{t('roomsDashboard.illumination')}</Label>
                <Input
                  type="number"
                  id="illumination"
                  name="illumination"
                  value={formData.illumination}
                  onChange={handleInputChange}
                  placeholder={t('roomsDashboard.enterIllumination')}
                  required
                />
              </InputGroup>
              <SubmitButton type="submit">{t('roomsDashboard.create')}</SubmitButton>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </MainLayout>
  )
}

const RoomsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`

const CreateRoomButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
  }
`

const RoomsList = styled.ul`
  list-style: none;
  padding: 0;
`

const RoomItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  &:last-child {
    border-bottom: none;
  }
`

const RoomName = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`

const RoomDetails = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const Detail = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #7f8c8d;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999;
  }
`

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }
`

const RoomActionsCOntainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const GoToButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;

  &:hover {
    background-color: #27ae60;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.3);
  }
`

const DeleteRoomButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;

  &:hover {
    background-color: #c0392b;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
  }
`
