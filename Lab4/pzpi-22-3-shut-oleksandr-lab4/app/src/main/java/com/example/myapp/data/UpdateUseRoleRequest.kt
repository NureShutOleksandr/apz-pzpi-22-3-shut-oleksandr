package com.example.myapp.data

data class UpdateUserRoleRequest(
  val user_id: String,
  val role_name: String
)