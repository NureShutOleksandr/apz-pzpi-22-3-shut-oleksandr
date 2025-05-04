import { Injectable } from '@nestjs/common'
import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class BackupService {
  private readonly rootDir = path.resolve(__dirname, '../../../')
  private readonly backupDir = path.join(this.rootDir, 'backups')
  private readonly mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.n6rx4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

  async createBackup(): Promise<{ success: boolean; message: string }> {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`)

    return new Promise(resolve => {
      const command = `mongodump --uri "${this.mongoUri}" --out ${backupPath}`
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, message: stderr })
        } else {
          resolve({ success: true, message: `Backup created at ${backupPath}` })
        }
      })
    })
  }

  async restoreBackup(filePath: string): Promise<{ success: boolean; message: string }> {
    if (!filePath || !fs.existsSync(filePath)) {
      return {
        success: false,
        message: `Invalid or missing filePath: ${filePath}`,
      }
    }

    return new Promise(resolve => {
      const command = `mongorestore --uri "${this.mongoUri}" --dir ${filePath} --drop`
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, message: stderr })
        } else {
          resolve({ success: true, message: 'Database restored successfully' })
        }
      })
    })
  }
}
