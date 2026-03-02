import { supabase } from './supabase';
import { logLogin, logLogout } from './audit';

export async function signUp(email: string, password: string, name: string, role: string, group?: string) {
  try {
    // Регистрация в auth с метаданными
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          group: group || '', // Добавляем группу в метаданные
        },
      },
    });

    if (error) {
      console.error('Auth signup error:', error);
      await logLogin('', email, role, false);
      return { data, error };
    }

    if (!data.user) {
      await logLogin('', email, role, false);
      return { 
        data, 
        error: { 
          message: 'User creation failed',
          name: 'AuthError',
          status: 500
        } as any
      };
    }

    // Создать запись в таблице students или teachers
    try {
      if (role === 'student' && group) {
        await supabase
          .from('students')
          .insert({
            name,
            email,
            group_name: group,
            gpa: 0,
          });
      } else if (role === 'teacher') {
        await supabase
          .from('teachers')
          .insert({
            name,
            email,
            subject: '', // Можно будет заполнить позже
          });
      }
    } catch (dbError) {
      console.log('Database insert skipped or failed (this is OK):', dbError);
    }

    // Log successful signup
    await logLogin(data.user.id, email, role, true);

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signUp:', err);
    await logLogin('', email, role, false);
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
    await logLogin('', email, role, false);
    return { data, error };
  }

  // Log successful login
  await logLogin(data.user.id, email, role, true);

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

    // Log password reset request (no user ID available yet)
    await logLogin('', email, 'unknown', !error);

    return { error };
  } catch (err) {
    console.error('Unexpected error in requestPasswordReset:', err);
    await logLogin('', email, 'unknown', false);
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
    await logLogin(user.id, email, role, !error);

    return { error };
  } catch (err) {
    console.error('Unexpected error in updatePassword:', err);
    return { error: err as Error };
  }
}
