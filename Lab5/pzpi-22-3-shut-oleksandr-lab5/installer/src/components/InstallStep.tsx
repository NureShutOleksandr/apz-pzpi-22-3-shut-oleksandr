import { useState, useEffect } from 'react'
import { Card, Title, Text, Button } from '../styled'

const InstallStep: React.FC = () => {
  const [isInstalling, setIsInstalling] = useState<boolean>(true)
  const [isComplete, setIsComplete] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInstalling(false)
      setIsComplete(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <Title>Встановлення системи</Title>
      {isInstalling && <Text>Зачекайте, запускаю скрипти для сервера та клієнта...</Text>}
      {isComplete && (
        <>
          <Text>Сервер успішно запущено на http://localhost:5000/api</Text>
          <Text>Ви можете почати користуватися системою!</Text>
          <Button as="a" href="http://localhost:5000/api" target="_blank">
            Перейти до системи
          </Button>
        </>
      )}
    </Card>
  )
}

export default InstallStep
