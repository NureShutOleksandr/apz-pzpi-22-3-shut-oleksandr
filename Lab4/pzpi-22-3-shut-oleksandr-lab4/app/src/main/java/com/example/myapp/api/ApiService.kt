package com.example.myapp.api

import UserResponse
import com.example.myapp.data.CreateRoomDto
import com.example.myapp.data.CreateUserDto
import com.example.myapp.data.LoginResponse
import com.example.myapp.data.Room
import com.example.myapp.data.RoomAnalysis
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
  @POST("auth/login")
  suspend fun login(@Body userDto: CreateUserDto): Response<LoginResponse>

  @POST("auth/registration")
  suspend fun register(@Body userDto: CreateUserDto): Response<LoginResponse>

  @GET("rooms/all-rooms-by-user/{userId}")
  suspend fun getRooms(@Path("userId") userId: String): Response<List<Room>>

  @GET("rooms/{roomId}/analyze")
  suspend fun analyzeRoom(@Path("roomId") roomId: String): Response<RoomAnalysis>

  @GET("users/find-by-username/{username}")
  suspend fun findUserByUsername(@Path("username") username: String): Response<UserResponse>

  @POST("rooms")
  suspend fun createRoom(@Body roomData: CreateRoomDto): Response<Room>

  @DELETE("rooms/{roomId}")
  suspend fun deleteRoom(@Path("roomId") roomId: String): Response<Void>
}