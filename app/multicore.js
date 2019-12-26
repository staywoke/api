import cluster from 'cluster'
import os from 'os'

const numCPUs = os.cpus().length

if (cluster.isMaster) {
  cluster.setupMaster({
    exec: 'app/server'
  })

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('listening', (worker, address) => {
    console.log(`Worker id: ${worker.id} listening at: ${JSON.stringify(address)}`)
  })

  Object.keys(cluster.workers).forEach((id) => {
    console.log(`Worker id: ${id} with pid: ${cluster.workers[id].process.pid}`)
  })

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died: Respawning...`)
    cluster.fork()
  })
}
