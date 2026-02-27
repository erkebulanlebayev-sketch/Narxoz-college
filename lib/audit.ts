import { supabase } from './supabase';

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'access_denied';

export interface AuditLogEntry {
  id?: number;
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
  created_at?: string;
}

/**
 * Log an authentication attempt (successful or failed)
 */
export async function logAuthenticationAttempt(
  email: string,
  role: string,
  success: boolean,
  userId?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from('audit_log').insert({
      user_id: userId || null,
      user_email: email,
      user_role: role || 'unknown',
      action: success ? 'login' : 'access_denied',
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Failed to log authentication attempt:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error logging authentication:', err);
    return { error: err as Error };
  }
}

/**
 * Log a logout event
 */
export async function logLogout(
  userId: string,
  email: string,
  role: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from('audit_log').insert({
      user_id: userId,
      user_email: email,
      user_role: role,
      action: 'logout',
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Failed to log logout:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error logging logout:', err);
    return { error: err as Error };
  }
}

/**
 * Log a data modification (create, update, delete)
 */
export async function logDataModification(
  userId: string,
  email: string,
  role: string,
  action: 'create' | 'update' | 'delete',
  tableName: string,
  recordId?: number,
  oldData?: any,
  newData?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from('audit_log').insert({
      user_id: userId,
      user_email: email,
      user_role: role,
      action,
      table_name: tableName,
      record_id: recordId,
      old_data: oldData,
      new_data: newData,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Failed to log data modification:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error logging data modification:', err);
    return { error: err as Error };
  }
}

/**
 * Log an unauthorized access attempt
 */
export async function logUnauthorizedAccess(
  userId: string | null,
  email: string,
  role: string,
  resource: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from('audit_log').insert({
      user_id: userId,
      user_email: email,
      user_role: role,
      action: 'access_denied',
      table_name: resource,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Failed to log unauthorized access:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error logging unauthorized access:', err);
    return { error: err as Error };
  }
}

/**
 * Get audit logs with optional filtering
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  userEmail?: string;
  action?: AuditAction;
  tableName?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: AuditLogEntry[] | null; error: Error | null; count?: number }> {
  try {
    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.userEmail) {
      query = query.ilike('user_email', `%${filters.userEmail}%`);
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

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return { data: null, error };
    }

    return { data, error: null, count: count || 0 };
  } catch (err) {
    console.error('Unexpected error fetching audit logs:', err);
    return { data: null, error: err as Error };
  }
}
