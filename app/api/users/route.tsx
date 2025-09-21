import { NextResponse } from 'next/server';
import { User } from '../../../types/user';

let users: User[] = [];
let nextId = 1;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (id) {
    const user = users.find((u) => u.id === parseInt(id));
    return NextResponse.json(user || null);
  }

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name, lineStatus }: { name: string; lineStatus: 'online' | 'offline' } = await request.json();

  if (!name || !lineStatus) {
    return new NextResponse('Missing fields', { status: 400 });
  }

  const newUser: User = {
    id: nextId++,
    name,
    lineStatus,
  };

  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (id) {
    const userId = parseInt(id);
    const initialLength = users.length;

    users = users.filter((user) => user.id !== userId);

    if (users.length === initialLength) {
      return new NextResponse('User not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  }

  // No ID provided — delete all users
  users = [];
  return new NextResponse('All users deleted', { status: 200 });
}
