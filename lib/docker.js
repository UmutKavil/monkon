import { spawn } from 'child_process';

/**
 * Run a docker-compose command in the given project root directory.
 * @param {string[]} args - Arguments to pass to docker-compose
 * @param {string} cwd - Project root directory
 * @returns {Promise<string>} - Resolved with stdout on success
 */
export function runDockerCompose(args, cwd) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const proc = spawn('docker-compose', args, { cwd });

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `docker-compose exited with code ${code}`));
      }
    });
  });
}
