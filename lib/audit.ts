import { supabase } from './supabase';

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'access_denied';

export interface AuditLogEntry {
  user_id?: string;
  user_email: string;
  user_role: string;
  action: AuditAction;
  table_name?: string;
  record_id?: number;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Log an audit event to the database
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const { error } = await supabase
      .from('audit_log')
      .insert({
        user_id: entry.user_id,
        user_email: entry.user_email,
        user_role: entry.user_role,
        action: entry.action,
        table_name: entry.table_name,
        record_id: entry.record_id,
        old_data: entry.old_data,
        new_data: entry.new_data,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent
      });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

/**
 * Log authentication attempt (login)
 */
export async function logLogin(
  userId: string,
  email: string,
  role: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    user_id: success ? userId : undefined,
    user_email: email,
    user_role: role,
    action: 'login',
    new_data: { success },
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

/**
 * Log logout event
 */
export async function logLogout(
  userId: string,
  email: string,
  role: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    user_email: email,
    user_role: role,
    action: 'logout',
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

/**
 * Log data creation
 */
export async function logCreate(
  userId: string,
  email: string,
  role: string,
  tableName: string,
  recordId: number,
  data: any
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    user_email: email,
    user_role: role,
    action: 'create',
    table_name: tableName,
    record_id: recordId,
    new_data: data
  });
}

/**
 * Log data update
 */
export async function logUpdate(
  userId: string,
  email: string,
  role: string,
  tableName: string,
  recordId: number,
  oldData: any,
  newData: any
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    user_email: email,
    user_role: role,
    action: 'update',
    table_name: tableName,
    record_id: recordId,
    old_data: oldData,
    new_data: newData
  });
}

/**
 * Log data deletion
 */
export async function logDelete(
  userId: string,
  email: string,
  role: string,
  tableName: string,
  recordId: number,
  data: any
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    user_email: email,
    user_role: role,
    action: 'delete',
    table_name: tableName,
    record_id: recordId,
    old_data: data
  });
}

/**
 * Log unauthorized access attempt
 */
export async function logAccessDenied(
  userId: string | undefined,
  email: string,
  role: string,
  resource: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    user_email: email,
    user_role: role,
    action: 'access_denied',
    new_data: { resource },
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  action?: AuditAction;
  tableName?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters?.action) {
    query = query.eq('action', filters.action);
  }

  if (filters?.tableName) {
    query = query.eq('table_name', filters.tableName);
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
  }

  return query;
}
