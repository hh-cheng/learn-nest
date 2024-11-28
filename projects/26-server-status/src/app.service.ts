import * as os from 'os'
import * as nodeDiskInfo from 'node-disk-info'

export class AppService {
  bytesToGB(bytes: number) {
    const gb = bytes / 1024 ** 3
    return gb.toFixed(2)
  }

  getCpuInfo() {
    const cpus = os.cpus()
    const cpuInfo = cpus.reduce(
      (info, cpu) => {
        info.cpuNum++
        info.user += cpu.times.user
        info.sys += cpu.times.sys
        info.idle += cpu.times.idle
        info.total += cpu.times.user + cpu.times.sys + cpu.times.idle
        return info
      },
      {
        user: 0,
        sys: 0,
        idle: 0,
        total: 0,
        cpuNum: 0,
      },
    )
    const cpu = {
      cpuNum: cpuInfo.cpuNum,
      sys: ((cpuInfo.sys / cpuInfo.total) * 100).toFixed(2),
      used: ((cpuInfo.user / cpuInfo.total) * 100).toFixed(2),
      free: ((cpuInfo.idle / cpuInfo.total) * 100).toFixed(2),
    }
    return cpu
  }

  getMemInfo() {
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    const memoryUsagePercentage = (
      ((totalMemory - freeMemory) / totalMemory) *
      100
    ).toFixed(2)
    const mem = {
      total: `${this.bytesToGB(totalMemory)}G`,
      used: `${this.bytesToGB(usedMemory)}G`,
      free: `${this.bytesToGB(freeMemory)}G`,
      usage: `${memoryUsagePercentage}%`,
    }
    return mem
  }

  async getDiskInfo() {
    const disks = await nodeDiskInfo.getDiskInfo()
    const sysFiles = disks.map((disk: any) => {
      return {
        dirName: disk._mounted,
        typeName: disk._filesystem,
        total: `${this.bytesToGB(disk._blocks)}G`,
        used: `${this.bytesToGB(disk._used)}G`,
        free: `${this.bytesToGB(disk._available)}G`,
        usage: ((disk._used / disk._blocks || 0) * 100).toFixed(2),
      }
    })
    return sysFiles
  }
}
