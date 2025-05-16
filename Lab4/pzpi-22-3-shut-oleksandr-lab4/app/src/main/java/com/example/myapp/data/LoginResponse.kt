package com.example.myapp.data

data class LoginResponse(
  val message: String,
  val token: Token
)

data class Token(
  val accessToken: String
)