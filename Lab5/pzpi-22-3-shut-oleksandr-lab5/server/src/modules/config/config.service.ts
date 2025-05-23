import { Injectable, OnModuleInit } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class ConfigService implements OnModuleInit {
  private readonly configPath = path.join(process.cwd(), 'config/climate-config.json')
  private trendRules: { parameter: string; condition: string; value: number; message: string }[]

  // Initializes the service by creating or loading the config file
  async onModuleInit() {
    try {
      const configDir = path.dirname(this.configPath)
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true })
      }

      if (!fs.existsSync(this.configPath)) {
        const defaultRules = [
          { parameter: 'temperature_mean', condition: '>', value: 25, message: 'Temperature is higher than normal' },
          { parameter: 'temperature_mean', condition: '<', value: 18, message: 'Temperature is lower than normal' },
          { parameter: 'moisture_mean', condition: '<', value: 30, message: 'Moisture level is critically low' },
          { parameter: 'moisture_mean', condition: '>', value: 60, message: 'Moisture level is too high' },
          {
            parameter: 'carbonDioxide_mean',
            condition: '>',
            value: 1000,
            message: 'CO2 concentration is dangerously high',
          },
          {
            parameter: 'carbonDioxide_mean',
            condition: '<',
            value: 400,
            message: 'CO2 concentration is unusually low',
          },
          { parameter: 'illumination_mean', condition: '<', value: 200, message: 'Room is poorly illuminated' },
          { parameter: 'illumination_mean', condition: '>', value: 800, message: 'Room is over-illuminated' },
        ]
        fs.writeFileSync(this.configPath, JSON.stringify(defaultRules, null, 2))
        console.log('Default config file created')
      }

      this.trendRules = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'))
    } catch (error) {
      throw error
    }
  }

  // Returns the current configuration rules
  exportConfig() {
    return this.trendRules
  }

  // Imports and validates new configuration, saving it to the config file
  importConfig(config: any[]) {
    const validParameters = ['temperature_mean', 'moisture_mean', 'carbonDioxide_mean', 'illumination_mean']
    const validConditions = ['>', '<']

    for (const rule of config) {
      if (
        !rule.parameter ||
        !validParameters.includes(rule.parameter) ||
        !rule.condition ||
        !validConditions.includes(rule.condition) ||
        typeof rule.value !== 'number' ||
        !rule.message ||
        typeof rule.message !== 'string'
      ) {
        throw new Error('Invalid config format')
      }
    }

    this.trendRules = config
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2))
    console.log('Config imported and saved')
    return { message: 'Config imported successfully' }
  }
}
