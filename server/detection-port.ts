// 判断要启动的端口号是否被占用, 占用的话先关闭占用的进程再开启node服务
import { exec } from 'child_process';
import Application from 'koa';

const cmd: string = process.platform === 'win32' ? 'netstat -ano' : 'ps aux';

export default function (app: Application, port: number | string) {
  // 开启服务
  const startServer = () => {
    if (port) {
      app.listen(port, () => {
        if (process.env.NODE_ENV !== 'development') {
          console.log('server start at http://localhost:' + port);
        }
      });
    } else {
      throw new Error('port is not defined' + port);
    }
  };

  exec(cmd, (err, stdout) => {
    if (err) {
      console.log('>>> err', err);
      return;
    }
    let isOccupy = false; // 用来标识端口号是否被占用了
    let pid = ''; // 占用端口号的进程pid
    const listLine = stdout.split('\n');
    // 检测端口号是否有被占用
    for (const line of listLine) {
      const lines = line.trim().split(/\s+/);
      const address = lines[1];
      if (address) {
        const addressPort = address.split(':')[1];
        if (addressPort && Number(addressPort) === port) {
          isOccupy = true;
          pid = lines[4];
          break;
        }
      }
    }
    // 端口被占用时
    if (isOccupy) {
      exec('taskkill /F /pid ' + pid, error => {
        if (error) {
          console.log('>>> 释放指定端口失败', error);
          return;
        }
        startServer();
      });
    } else {
      startServer();
    }
  });
}