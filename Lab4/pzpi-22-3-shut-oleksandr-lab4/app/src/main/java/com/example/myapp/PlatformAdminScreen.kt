package com.example.myapp

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ArrowDropUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.myapp.api.RetrofitClient
import com.example.myapp.data.Role
import com.example.myapp.data.UserResponse
import kotlinx.coroutines.launch

@Composable
fun PlatformAdminScreen(navController: NavController) {
  val coroutineScope = rememberCoroutineScope()
  var roles by remember { mutableStateOf<List<Role>?>(null) }
  var users by remember { mutableStateOf<List<UserResponse>?>(null) }
  var selectedUserId by remember { mutableStateOf<String?>(null) }
  var selectedRole by remember { mutableStateOf<String?>(null) }
  var searchTerm by remember { mutableStateOf("") }
  var isLoadingRoles by remember { mutableStateOf(false) }
  var isUpdatingRole by remember { mutableStateOf(false) }

  // Завантаження ролей і користувачів
  LaunchedEffect(Unit) {
    isLoadingRoles = true
    try {
      val rolesResponse = RetrofitClient.apiService.getRoles()
      if (rolesResponse.isSuccessful) {
        roles = rolesResponse.body()
        Log.d("PlatformAdmin", "Roles loaded: ${roles?.size}")
      } else {
        Log.e("PlatformAdmin", "Failed to load roles: ${rolesResponse.code()} - ${rolesResponse.message()}")
      }
    } catch (e: Exception) {
      Log.e("PlatformAdmin", "Error loading roles: ${e.message}", e)
    } finally {
      isLoadingRoles = false
    }

    try {
      val usersResponse = RetrofitClient.apiService.getUsers()
      if (usersResponse.isSuccessful) {
        users = usersResponse.body()
        Log.d("PlatformAdmin", "Users loaded: ${users?.size}")
      } else {
        Log.e("PlatformAdmin", "Failed to load users: ${usersResponse.code()} - ${usersResponse.message()}")
      }
    } catch (e: Exception) {
      Log.e("PlatformAdmin", "Error loading users: ${e.message}", e)
    }
  }

  // Функція для оновлення ролі користувача
  val updateUserRole: () -> Unit = {
    if (selectedUserId == null || selectedRole == null) {
      Log.w("PlatformAdmin", "User ID or role not selected")
    } else {
      coroutineScope.launch {
        isUpdatingRole = true
        try {
          val response = RetrofitClient.apiService.updateUserRole(selectedUserId!!, selectedRole!!)
          if (response.isSuccessful) {
            val updatedUser = response.body()
            if (updatedUser != null) {
              users = users?.map { if (it._id == updatedUser._id) updatedUser else it }
              Log.d("PlatformAdmin", "User role updated: ${updatedUser.username}")
            } else {
              Log.e("PlatformAdmin", "Failed to update user role: response body is null")
            }
          } else {
            Log.e("PlatformAdmin", "Failed to update user role: ${response.code()} - ${response.message()}")
          }
        } catch (e: Exception) {
          Log.e("PlatformAdmin", "Error updating user role: ${e.message}", e)
        } finally {
          isUpdatingRole = false
          selectedUserId = null
          selectedRole = null
        }
      }
    }
  }

  // Фільтруємо користувачів за пошуковим терміном
  val filteredUsers = users?.filter { user ->
    user.username.lowercase().contains(searchTerm.lowercase())
  } ?: emptyList()

  Column(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFFf5f5f5))
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
    horizontalAlignment = Alignment.CenterHorizontally
  ) {
    Text(
      text = stringResource(R.string.platformAdminDashboard_title),
      fontSize = 28.sp,
      fontWeight = FontWeight.Bold,
      color = Color(0xFF2c3e50),
      textAlign = TextAlign.Center
    )

    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .wrapContentHeight(),
      shape = RoundedCornerShape(12.dp),
      shadowElevation = 6.dp,
      color = Color.White
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Text(
          text = stringResource(R.string.platformAdminDashboard_updateUserRole),
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color(0xFF2c3e50)
        )
        Spacer(modifier = Modifier.height(8.dp))

        if (isLoadingRoles) {
          Text(
            text = stringResource(R.string.platformAdminDashboard_loadingRoles),
            fontSize = 16.sp,
            color = Color(0xFF7f8c8d)
          )
        } else {
          var expanded by remember { mutableStateOf(false) }
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text(
              text = if (selectedUserId != null) {
                stringResource(
                  R.string.platformAdminDashboard_selectedUser,
                  users?.find { it._id == selectedUserId }?.username ?: "Unknown"
                )
              } else {
                stringResource(R.string.platformAdminDashboard_noUserSelected)
              },
              fontSize = 16.sp,
              color = Color(0xFF2c3e50),
              modifier = Modifier.weight(1f)
            )

            Box(modifier = Modifier.weight(1f)) {
              OutlinedTextField(
                value = selectedRole ?: "",
                onValueChange = { selectedRole = it },
                label = { Text(stringResource(R.string.platformAdminDashboard_selectRole)) },
                modifier = Modifier
                  .fillMaxWidth()
                  .clickable { expanded = true },
                enabled = !isUpdatingRole,
                readOnly = true,
                trailingIcon = {
                  Icon(
                    imageVector = if (expanded) Icons.Filled.ArrowDropUp else Icons.Filled.ArrowDropDown,
                    contentDescription = null
                  )
                }
              )

              DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier
                  .background(Color.White)
                  .fillMaxWidth()
              ) {
                roles?.forEach { role ->
                  DropdownMenuItem(
                    text = { Text("${role.value} (${role.description})") },
                    onClick = {
                      selectedRole = role.value
                      expanded = false
                    },
                    modifier = Modifier.background(if (!isUpdatingRole) Color.White else Color(0xFFf5f5f5))
                  )
                }
              }
            }
          }

          Spacer(modifier = Modifier.height(8.dp))

          Button(
            onClick = updateUserRole,
            enabled = !isUpdatingRole,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(
              containerColor = Color(0xFF4a90e2),
              contentColor = Color.White
            )
          ) {
            Text(
              text = if (isUpdatingRole) stringResource(R.string.platformAdminDashboard_updating)
              else stringResource(R.string.platformAdminDashboard_updateRoleButton),
              fontSize = 16.sp
            )
          }
        }
      }
    }

    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .wrapContentHeight(),
      shape = RoundedCornerShape(12.dp),
      shadowElevation = 6.dp,
      color = Color.White
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Text(
          text = stringResource(R.string.platformAdminDashboard_userList),
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color(0xFF2c3e50)
        )
        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
          value = searchTerm,
          onValueChange = { searchTerm = it },
          label = { Text(stringResource(R.string.platformAdminDashboard_searchUsers)) },
          modifier = Modifier.fillMaxWidth(),
          keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text)
        )

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
          modifier = Modifier
            .fillMaxWidth()
            .heightIn(max = 200.dp),
          verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
          items(filteredUsers) { user ->
            Surface(
              modifier = Modifier
                .fillMaxWidth()
                .clickable { selectedUserId = user._id },
              color = if (selectedUserId == user._id) Color(0xFFe6f0fa) else Color.White,
              shape = RoundedCornerShape(8.dp)
            ) {
              Row(
                modifier = Modifier
                  .padding(8.dp)
                  .fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  text = "${user.username} - ${user.roles.joinToString(", ") { it.value }}",
                  fontSize = 14.sp,
                  color = Color(0xFF2c3e50)
                )
              }
            }
          }
        }
      }
    }
  }
}