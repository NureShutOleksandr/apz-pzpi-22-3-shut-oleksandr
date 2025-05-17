package com.example.myapp.api

import com.example.myapp.data.BackupCreateRes
import com.example.myapp.data.BackupRestoreRes
import com.example.myapp.data.ConfigRule
import com.example.myapp.data.CreateRoomDto
import com.example.myapp.data.CreateUserDto
import com.example.myapp.data.ImportConfigRes
import com.example.myapp.data.LoginResponse
import com.example.myapp.data.Room
import com.example.myapp.data.RoomAnalysis
import com.example.myapp.data.Role
import com.example.myapp.data.UserResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

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

  @POST("backup/create")
  suspend fun createBackup(): Response<BackupCreateRes>

  @POST("backup/restore")
  suspend fun restoreBackup(@Body body: Map<String, String>): Response<BackupRestoreRes>

  @GET("config/export")
  suspend fun exportConfig(): Response<List<ConfigRule>>

  @POST("config/import")
  suspend fun importConfig(@Body config: List<ConfigRule>): Response<ImportConfigRes>

  @GET("roles")
  suspend fun getRoles(): Response<List<Role>>

  @GET("users")
  suspend fun getUsers(): Response<List<UserResponse>>

  @PATCH("roles/update-user-role")
  suspend fun updateUserRole(
    @Query("user_id") userId: String,
    @Query("role_name") roleName: String
  ): Response<UserResponse>
}