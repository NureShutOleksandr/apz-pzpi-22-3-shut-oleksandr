package com.example.myapp.api

import com.example.myapp.data.CreateUserDto
import com.example.myapp.data.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
  @POST("auth/login")
  suspend fun login(@Body userDto: CreateUserDto): Response<LoginResponse>

  @POST("auth/registration")
  suspend fun register(@Body userDto: CreateUserDto): Response<LoginResponse>
}