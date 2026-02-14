import { supabase } from './supabase';

export async function signUp(email: string, password: string, name: string, role: string) {
  try {
    // Регистрация в auth
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

    // Ждем немного, чтобы триггер успел сработать
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Проверяем, создался ли пользователь в таблице users
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking user:', selectError);
      // Таблица может не существовать - это нормально на первом запуске
      return { data, error: null };
    }

    // Если пользователя нет, создаем вручную
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name,
          email,
          role,
        });

      if (insertError) {
        console.error('Error creating user in table:', insertError);
        // Возвращаем детальную ошибку
        return { 
          data, 
          error: { 
            message: `Database error: ${insertError.message}. Please run supabase-setup.sql first!`,
            name: 'DatabaseError',
            status: 500
          } as any
        };
      }
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
