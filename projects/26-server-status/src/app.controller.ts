import * as os from 'os'
import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('status')
  status() {
    // return os.cpus()
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
}
