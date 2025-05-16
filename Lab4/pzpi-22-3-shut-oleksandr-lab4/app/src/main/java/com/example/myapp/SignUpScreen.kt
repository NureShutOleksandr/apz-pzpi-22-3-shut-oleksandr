package com.example.myapp

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun SignUpScreen(
  onSignUp: (String, String, String) -> Boolean,
  onNavigateBack: () -> Unit
) {
  var username by remember { mutableStateOf("") }
  var password by remember { mutableStateOf("") }
  var confirmPassword by remember { mutableStateOf("") }
  var showToast by remember { mutableStateOf(false) }
  var toastMessage by remember { mutableStateOf("") }

  // Отримуємо рядки у @Composable контексті
  val signUpSuccessMessage = stringResource(R.string.signup_success)
  val signUpErrorMessage = stringResource(R.string.signup_error)

  Scaffold { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .background(Color(0xFFf5f5f5))
        .padding(innerPadding),
      contentAlignment = Alignment.Center
    ) {
      Surface(
        modifier = Modifier
          .width(400.dp)
          .wrapContentHeight()
          .padding(32.dp),
        shape = RoundedCornerShape(8.dp),
        shadowElevation = 4.dp,
        color = Color.White
      ) {
        Column(
          modifier = Modifier
            .padding(32.dp)
            .fillMaxWidth(),
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
          Text(
            text = stringResource(R.string.signup_title),
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1e1e1e)
          )
          OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text(stringResource(R.string.login_username)) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            colors = TextFieldDefaults.colors(
              focusedContainerColor = Color.Transparent,
              unfocusedContainerColor = Color.Transparent,
              focusedIndicatorColor = Color(0xFF3a3a3a),
              unfocusedIndicatorColor = Color(0xFFcccccc)
            )
          )
          OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text(stringResource(R.string.login_password)) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            colors = TextFieldDefaults.colors(
              focusedContainerColor = Color.Transparent,
              unfocusedContainerColor = Color.Transparent,
              focusedIndicatorColor = Color(0xFF3a3a3a),
              unfocusedIndicatorColor = Color(0xFFcccccc)
            )
          )
          OutlinedTextField(
            value = confirmPassword,
            onValueChange = { confirmPassword = it },
            label = { Text(stringResource(R.string.signup_password_confirm)) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            colors = TextFieldDefaults.colors(
              focusedContainerColor = Color.Transparent,
              unfocusedContainerColor = Color.Transparent,
              focusedIndicatorColor = Color(0xFF3a3a3a),
              unfocusedIndicatorColor = Color(0xFFcccccc)
            )
          )
          Button(
            onClick = {
              val success = onSignUp(username, password, confirmPassword)
              toastMessage = if (success) {
                signUpSuccessMessage
              } else {
                signUpErrorMessage
              }
              showToast = true
              if (success) onNavigateBack()
            },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(4.dp),
            colors = ButtonDefaults.buttonColors(
              containerColor = Color(0xFF3a3a3a),
              contentColor = Color.White
            )
          ) {
            Text(
              text = stringResource(R.string.signup_button),
              fontSize = 16.sp,
              fontWeight = FontWeight.Medium
            )
          }
        }
      }
    }

    if (showToast) {
      LaunchedEffect(showToast) {
        delay(2000)
        showToast = false
      }
      Box(
        modifier = Modifier
          .fillMaxSize()
          .padding(16.dp),
        contentAlignment = Alignment.BottomEnd
      ) {
        Snackbar(
          containerColor = if (toastMessage == signUpSuccessMessage) {
            Color(0xFF4CAF50)
          } else {
            Color(0xFFF44336)
          }
        ) {
          Text(
            text = toastMessage,
            color = Color.White
          )
        }
      }
    }
  }
}