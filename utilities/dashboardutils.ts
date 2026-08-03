import os from 'os';
import { EXECUTION_CONFIG } from '../config/executionConfig';

export function printExecutionDashboard(): void {
  const now = new Date();

  const startedAt = now.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  const environment = (process.env.TEST_ENV ?? 'UAT').toUpperCase();
  const baseUrl = process.env.BASE_URL ?? 'Not Configured';
  const workers = process.env.PW_WORKERS ?? 'Default';

  console.log(`
══════════════════════════════════════════════════════════════════════

🚀 ${EXECUTION_CONFIG.frameworkName}

══════════════════════════════════════════════════════════════════════

Framework Version : ${EXECUTION_CONFIG.frameworkVersion}

Environment       : ${environment}

Base URL          : ${baseUrl}

Browser           : ${EXECUTION_CONFIG.browser}

Execution Mode    : ${EXECUTION_CONFIG.executionType}

Workers           : ${workers}

Platform          : ${os.platform()}

Operating System  : ${os.type()} ${os.release()}

Node Version      : ${process.version}

Started At        : ${startedAt}

══════════════════════════════════════════════════════════════════════
`);
}