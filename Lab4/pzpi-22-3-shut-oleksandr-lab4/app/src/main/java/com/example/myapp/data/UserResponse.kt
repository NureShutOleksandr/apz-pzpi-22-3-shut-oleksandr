package com.example.myapp.data

data class UserResponse(
  val _id: String,
  val username: String,
  val roles: List<Role>,
  val notifications: List<String>? = null,
  val __v: Int
)

data class Role(
  val _id: String,
  val value: String,
  val description: String,
  val __v: Int
)