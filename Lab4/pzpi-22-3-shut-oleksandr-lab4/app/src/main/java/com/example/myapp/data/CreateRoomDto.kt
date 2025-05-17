package com.example.myapp.data

data class CreateRoomDto(
  val user: String,
  val roomName: String,
  val temperature: Double,
  val moisture: Double,
  val carbonDioxide: Double,
  val illumination: Double
)