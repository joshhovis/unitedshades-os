export type Me = {
  id: string;
  name: string;
  email: string;
  phoneRaw: string | null;
  timezone: string;
};

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchMe(): Promise<Me> {
  const res = await fetch(`${API}/auth/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
