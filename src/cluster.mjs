import cluster from 'cluster';
import { cpus } from 'os';
import { pid } from 'process';

(async () => {
  if (cluster.isPrimary) {
    const numCpus = cpus().length;

    console.log(`Master pid: ${pid}`);
    console.log(`Starting ${numCpus} forks`);

    for (let i = 0; i < numCpus; i++) {
      cluster.fork();
    }
  } else {
    const id = cluster.worker?.id;
    await import('../dist/bundle.cjs');
    console.log(`Worker: ${id}, pid: ${pid}`);
  }
})();
