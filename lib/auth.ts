import { supabase } from './supabase';
import { logAuthenticationAttempt, logLogout } from './audit';

export async function signUp(email: string, password: string, name: string, role: string) {
  try {
    // Регистрация в auth с метаданными
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      console.error('Auth signup error:', error);
      // Log failed signup attempt
      await logAuthenticationAttempt(email, role, false, undefined);
      return { data, error };
    }

    if (!data.user) {
      await logAuthenticationAttempt(email, role, false, undefined);
      return { 
        data, 
        error: { 
          message: 'User creation failed',
          name: 'AuthError',
          status: 500
        } as any
      };
    }

    // Пытаемся создать запись в таблице users (если таблица существует)
    try {
      await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name,
          email,
          role,
        });
    } catch (dbError) {
      // Игнорируем ошибки БД - пользователь все равно создан в auth
      console.log('Database insert skipped or failed (this is OK):', dbError);
    }

    // Log successful signup
    await logAuthenticationAttempt(email, role, true, data.user.id);

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signUp:', err);
    await logAuthenticationAttempt(email, role, false, undefined);
    return { 
      data: null, 
      error: { 
        message: 'Unexpected error during registration',
        name: 'UnknownError',
        status: 500
      } as any
    };
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Get user role from metadata
  const role = data?.user?.user_metadata?.role || 'unknown';

  if (error || !data.user) {
    // Log failed login attempt
    await logAuthenticationAttempt(email, role, false, undefined);
    return { data, error };
  }

  // Log successful login
  await logAuthenticationAttempt(email, role, true, data.user.id);

  return { data, error };
}

export async function signOut() {
  // Get current user before signing out
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const email = user.email || 'unknown';
    const role = user.user_metadata?.role || 'unknown';
    
    // Log logout
    await logLogout(user.id, email, role);
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requestPasswordReset(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
    });

    // Log password reset request
    await logAuthenticationAttempt(email, 'unknown', !error, undefined);

    return { error };
  } catch (err) {
    console.error('Unexpected error in requestPasswordReset:', err);
    await logAuthenticationAttempt(email, 'unknown', false, undefined);
    return { error: err as Error };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: new Error('No authenticated user') };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    const email = user.email || 'unknown';
    const role = user.user_metadata?.role || 'unknown';

    // Log password update
    await logAuthenticationAttempt(email, role, !error, user.id);

    return { error };
  } catch (err) {
    console.error('Unexpected error in updatePassword:', err);
    return { error: err as Error };
  }
}
