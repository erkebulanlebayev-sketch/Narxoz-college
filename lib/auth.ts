import { supabase } from './supabase';

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
      return { data, error };
    }

    if (!data.user) {
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

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signUp:', err);
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
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
