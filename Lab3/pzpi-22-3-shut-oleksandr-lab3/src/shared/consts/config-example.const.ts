export const configExample = [
  {
    parameter: 'temperature_mean',
    condition: '>',
    value: 31,
    message: 'Temperature is higher than normal',
  },
  {
    parameter: 'temperature_mean',
    condition: '<',
    value: 18,
    message: 'Temperature is lower than normal',
  },
  {
    parameter: 'moisture_mean',
    condition: '<',
    value: 25,
    message: 'Moisture level is critically low',
  },
  {
    parameter: 'moisture_mean',
    condition: '>',
    value: 65,
    message: 'Moisture level is too high',
  },
  {
    parameter: 'carbonDioxide_mean',
    condition: '>',
    value: 1200,
    message: 'CO2 concentration is dangerously high',
  },
  {
    parameter: 'carbonDioxide_mean',
    condition: '<',
    value: 350,
    message: 'CO2 concentration is unusually low',
  },
  {
    parameter: 'illumination_mean',
    condition: '<',
    value: 150,
    message: 'Room is poorly illuminated',
  },
  {
    parameter: 'illumination_mean',
    condition: '>',
    value: 900,
    message: 'Room is over-illuminated',
  },
]
