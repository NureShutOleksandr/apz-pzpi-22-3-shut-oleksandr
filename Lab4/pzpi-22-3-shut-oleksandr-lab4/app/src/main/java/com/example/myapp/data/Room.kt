package com.example.myapp.data

data class Room(
  val _id: String,
  val roomName: String,
  val temperature: Double,
  val moisture: Double,
  val carbonDioxide: Double,
  val illumination: Double,
  val userId: String
)